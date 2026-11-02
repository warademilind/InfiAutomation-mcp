import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { startFixture } from '../examples/unified-e2e/server.mjs';
import { initE2eDemo } from '../dist/demo.js';
import { Workspace } from '../dist/workspace.js';
import { WebDriver } from '../dist/drivers/web.js';
import { targetSchema, uxStepSchema } from '../dist/schema.js';
import { executeUx } from '../dist/ux-testing.js';

await mkdir('.infiautomation',{recursive:true});
const directory=await mkdtemp(resolve('.infiautomation/unified-demo-')),workspace=new Workspace(directory);
await initE2eDemo(workspace);
const fixture=await startFixture(directory,0);
const replaceBase=value=>JSON.parse(JSON.stringify(value).replaceAll('http://127.0.0.1:47831',fixture.url));
const suite=replaceBase(JSON.parse(await workspace.read('e2e-demo/suite.json'))),plan=replaceBase(JSON.parse(await workspace.read('e2e-demo/plan.json')));
await workspace.write('e2e-demo/plan.json',JSON.stringify(plan,null,2));await workspace.write('e2e-demo/suite.json',JSON.stringify(suite,null,2));
const transport=new StdioClientTransport({command:process.execPath,args:[resolve('dist/cli.js'),'--workspace',directory],cwd:directory,env:{...process.env},stderr:'pipe'});
const client=new Client({name:'unified-demo-verifier',version:'1.0.0'});
let browser;
async function call(name,args={}){const result=await client.callTool({name,arguments:args});assert.ok(!result.isError,JSON.stringify(result));return result.structuredContent||JSON.parse(result.content.find(c=>c.type==='text').text);}
try{
  await client.connect(transport);const tools=await client.listTools();assert.ok(tools.tools.some(t=>t.name==='api_request'));assert.ok(tools.tools.some(t=>t.name==='ui_ux_check'));
  await call('test_generate',{suite,path:'e2e-demo/suite.json'});
  const {jobId}=await call('test_run',{path:'e2e-demo/suite.json'});let job;const deadline=Date.now()+60000;
  do{job=await call('test_status',{jobId});if(!['queued','running'].includes(job.status))break;await new Promise(r=>setTimeout(r,100));}while(Date.now()<deadline);
  assert.equal(job.status,'passed',JSON.stringify(job));assert.equal(job.summary.total,3);
  console.log('Unified MCP execution: 3/3 cases passed');
  const report=await call('report_get'),coverage=await call('traceability_get');assert.equal(coverage.summary.passed,6);
  const run=JSON.parse(await readFile(report.resultsJson,'utf8'));assert.equal(run.layers.length,4);assert.ok(run.tests[0].steps[0].timings.requestMs>0);assert.ok(run.tests[0].steps[5].timings.queryMs>=0);
  const api=await call('api_request',{target:{kind:'api',baseUrl:fixture.url},step:{kind:'api',target:'service',name:'Negative REST probe',path:'/api/orders/unknown',expect:{status:404}}});assert.equal(api.result.actual.status,404);
  const db=await call('database_query',{target:{kind:'database',driver:'sqlite',file:'orders.sqlite'},step:{kind:'database',target:'records',name:'Count',sql:'SELECT COUNT(*) AS total FROM orders',expect:{rowCount:1,checks:[{path:'rows.0.total',equals:1}]}}});assert.equal(db.result.actual.rows[0].total,1);
  const {sessionId}=await call('session_start',{target:{kind:'web',url:fixture.url}});
  try{await call('ui_ux_check',{sessionId,step:{kind:'ux',target:'portal',name:'Interactive layout',check:'layout',viewport:{width:390,height:844}}});}finally{await call('session_close',{sessionId});}
  console.log('Standalone API/database/UX tools passed; checking report navigation');
  browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1512,height:1100}}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(report.summaryHtml).href);await page.locator('.nav [data-view="layers"]').click();await page.getByRole('heading',{name:'Layers & timings',exact:true}).waitFor();assert.ok(await page.locator('#timing-rows tr').count()>5);
  const boxes=[];for(const name of ['overview','tests','layers','policy','healing','environment','overview']){await page.locator('.nav [data-view="'+name+'"]').click();assert.equal(await page.locator('.nav [aria-current="page"]').getAttribute('data-view'),name);boxes.push(await page.locator('.hero').boundingBox());}
  assert.ok(Math.max(...boxes.map(b=>b.y))-Math.min(...boxes.map(b=>b.y))<1);
  await page.locator('.nav [data-view="tests"]').click();await page.selectOption('#layer-filter','database');assert.equal(await page.locator('#rows tr').count(),1);
  await page.locator('#rows [data-case="order-e2e"]').first().click();await page.locator('#actual-toggle').click();assert.ok(await page.locator('#drawer a[href$="-evidence.json"]').count()>5);await page.locator('#close').click();
  await page.locator('.nav [data-view="layers"]').click();await page.screenshot({path:join(job.directory,'report-preview.png')});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.deepEqual(errors,[]);
  // Known synthetic fixture baseline for regression verification, never an application approval flow.
  const driver=new WebDriver(targetSchema.parse({kind:'web',url:fixture.url}));await driver.start();
  try{await driver.screenshot(await workspace.safe('approved-fixture.png'));const visual=uxStepSchema.parse({kind:'ux',target:'portal',name:'Synthetic visual regression',check:'visual',baseline:'approved-fixture.png'});await executeUx(driver,visual,workspace,'.infiautomation/visual-pass');await driver.page.locator('h1').evaluate(el=>{el.textContent='Intentional visual change';});await assert.rejects(()=>executeUx(driver,visual,workspace,'.infiautomation/visual-fail'),/Visual difference ratio/);}finally{await driver.close();}
  await mkdir('integration/output',{recursive:true});await writeFile('integration/output/unified-report-path.txt',job.directory);
  console.log(JSON.stringify({status:'passed',cases:job.summary,requirements:coverage.summary.passed,layers:run.layers,report:report.summaryHtml,checks:['actual MCP v2 generation/execution','REST/SOAP/SQLite/browser chain','axe accessibility','390px layout','navigation/paint metrics','interactive tools','report menus and evidence links','visual baseline pass and deliberate failure','existing schema 1 compatibility retained']},null,2));
}finally{await browser?.close();await client.close();await transport.close();await fixture.close();}

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

// Exercise the public npx contract from a folder with no package.json or source checkout.
const root = resolve(import.meta.dirname, '..');
const version = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).version;
const specArg = process.argv.slice(2).find(arg => !arg.startsWith('--')) || join(root, 'infiautomation-mcp-' + version + '.tgz');
const spec = /^https?:\/\//.test(specArg) ? specArg : 'file:' + resolve(specArg);
await mkdir(join(root, '.infiautomation'), { recursive: true });
const consumer = await mkdtemp(join(root, '.infiautomation', 'npx-consumer-'));
const env = Object.fromEntries(Object.entries(process.env).filter(([, value]) => typeof value === 'string'));
delete env.INFIAUTOMATION_WORKSPACE;
delete env.INFIAUTOMATION_NATIVE_WORKER;
const transport = new StdioClientTransport({ command: 'npx', args: ['--yes', spec], cwd: consumer, env, stderr: 'pipe' });
let stderr = '';
transport.stderr?.on('data', chunk => { stderr = (stderr + chunk).slice(-6000); });
const client = new Client({ name: 'infiautomation-npx-verifier', version: '1.0.0' });
const checked = [];
const protocolErrors = [];
client.onerror = error => protocolErrors.push(String(error));
async function call(name, args = {}) {
  const response = await client.callTool({ name, arguments: args });
  assert.ok(!response.isError, JSON.stringify(response));
  return response.structuredContent || JSON.parse(response.content.find(c => c.type === 'text').text);
}
try {
  await client.connect(transport, { timeout: 180000 });
  assert.equal(client.getServerVersion().version, version);
  assert.equal(client.getServerVersion().name, 'infiautomation-mcp');
  const tools = await client.listTools();
  assert.ok(tools.tools.some(t => t.name === 'test_run'));
  const doctor = await call('doctor');
  assert.equal(resolve(doctor.workspace), consumer);
  assert.equal(doctor.version, version);
  checked.push('npx launch', 'MCP handshake', 'tools', 'consumer workspace');
  const generated = { schemaVersion: 1, name: 'Portable package', target: { kind: 'web' }, tests: [{ id: 'title', name: 'Title', steps: [{ name: 'Assert title', action: 'assertTitle', value: 'Portable fixture' }] }] };
  await call('test_generate', { suite: generated, path: 'tests/portable.suite.json' });
  assert.equal(JSON.parse(await readFile(join(consumer, 'tests/portable.suite.json'), 'utf8')).name, generated.name);
  checked.push('suite generation');
  // Exercise the new cross-layer worker from the installed tarball, outside the checkout.
  const db=new DatabaseSync(join(consumer,'portable.sqlite'));
  db.exec('CREATE TABLE records (id INTEGER, status TEXT); INSERT INTO records VALUES (7,\'ready\')');db.close();
  const api=createServer((_,response)=>{response.setHeader('content-type','application/json');response.end('{"id":7,"status":"ready"}');});
  await new Promise((done,reject)=>{api.once('error',reject);api.listen(0,'127.0.0.1',done);});
  try{
    const suite={schemaVersion:2,name:'Portable API and database',targets:{service:{kind:'api',baseUrl:'http://127.0.0.1:'+api.address().port},records:{kind:'database',driver:'sqlite',file:'portable.sqlite'}},tests:[{id:'chain',name:'API to SQLite',steps:[{kind:'api',target:'service',name:'Read API',path:'/',expect:{status:200,checks:[{path:'body.status',equals:'ready'}]},capture:{recordId:'body.id'}},{kind:'database',target:'records',name:'Read captured ID',sql:'SELECT status FROM records WHERE id = ?',params:['${vars.recordId}'],expect:{rowCount:1,checks:[{path:'rows.0.status',equals:'ready'}]}}]}]};
    await call('test_generate',{suite,path:'tests/portable-v2.json'});
    const {jobId}=await call('test_run',{path:'tests/portable-v2.json'});let job;const deadline=Date.now()+30000;
    do{job=await call('test_status',{jobId});if(!['queued','running'].includes(job.status))break;await new Promise(done=>setTimeout(done,100));}while(Date.now()<deadline);
    assert.equal(job.status,'passed',JSON.stringify(job));const report=await call('report_get');const result=JSON.parse(await readFile(report.resultsJson,'utf8'));assert.equal(result.layers.length,2);assert.ok(result.tests[0].steps[1].timings.queryMs>=0);
    checked.push('packed version 2 API/SQLite worker','typed captures and measured query evidence');
  }finally{await new Promise((done,reject)=>api.close(error=>error?reject(error):done()));}
  if (process.argv.includes('--web')) {
    await writeFile(join(consumer, 'fixture.html'), '<!doctype html><title>Portable fixture</title><button onclick="this.textContent=\'Saved\'">Save project</button>');
    await writeFile(join(consumer,'requirements.md'),'REQ-SAVE: Save must change button text to Saved.\nREQ-LATER: A future feature needs a separate test.');
    const imported=await call('requirements_import',{path:'requirements.md'});
    await call('requirements_read',{documentId:imported.documentId});
    await call('plan_create',{name:'Portable requirement plan',goal:'Verify save feedback',documents:[imported.documentId],target:{kind:'web'},requirements:[{id:'REQ-SAVE',text:'Save changes the button text to Saved'},{id:'REQ-LATER',text:'Future feature'}],questions:['What is the acceptance rule for the future feature?'],scenarios:[{name:'Save',requirementIds:['REQ-SAVE'],steps:['Save'],expected:'Saved'}],path:'plans/portable.md'});
    const suite = { ...generated, target: { kind: 'web', url: './fixture.html' }, tests: [{ id: 'save', name: 'Save project', requirements:['REQ-SAVE'], steps: [
      { name: 'Save', action: 'click', locator: { role: 'button', name: 'Save project' } },
      { name: 'Verify', action: 'assertText', locator: { role: 'button', name: 'Saved' }, value: 'Saved' }
    ] }] };
    await call('test_generate',{suite,path:'tests/requirement.suite.json',planPath:'plans/portable.json'});
    const { jobId } = await call('test_run', { path:'tests/requirement.suite.json' });
    let job;
    const deadline = Date.now() + 60000;
    do {
      job = await call('test_status', { jobId });
      if (!['queued', 'running'].includes(job.status)) break;
      await new Promise(done => setTimeout(done, 200));
    } while (Date.now() < deadline);
    assert.equal(job.status, 'passed', JSON.stringify(job));
    const report = await call('report_get');
    assert.ok((await readFile(report.summaryHtml, 'utf8')).includes('Portable package'));
    assert.ok((await readFile(report.detailedHtml, 'utf8')).includes('Test explorer'));
    const coverage=await call('traceability_get');assert.equal(coverage.summary.unmapped,1);assert.equal(coverage.requirements[0].status,'passed');assert.equal(coverage.requirements[1].status,'unmapped');
    assert.ok((await readFile(report.traceabilityHtml,'utf8')).includes('Requirement traceability'));
    checked.push('requirement import and plan', 'requirement-linked generation and execution', 'truthful coverage gaps');
    checked.push('real Chromium actions/assertions', 'background execution', 'summary and detailed HTML');
  }
  if (process.argv.includes('--desktop')) {
    assert.equal(doctor.desktopAvailable, true, JSON.stringify(doctor));
    assert.ok(doctor.nativeWorkerPath.includes(version));
    const { sessionId } = await call('session_start', { target: { kind: 'desktop', executable: join(root, 'integration/fixtures/native/bin/Release/net8.0-windows/Fixture.exe') } });
    try {
      await call('ui_action', { sessionId, step: { name: 'Name', action: 'fill', locator: { automationId: 'ProjectName' }, value: 'GitHub package' } });
      await call('ui_action', { sessionId, step: { name: 'Save', action: 'click', locator: { automationId: 'SaveProject' } } });
      await call('ui_action', { sessionId, step: { name: 'Verify', action: 'assertText', locator: { automationId: 'Status' }, value: 'Saved GitHub package' } });
      const menus = await call('ui_menus', { sessionId, depth: 10 });
      assert.match(JSON.stringify(menus), /Export JSON/);
    } finally { await call('session_close', { sessionId }); }
    checked.push('cached Windows worker', 'real desktop actions/assertions', 'nested native menus');
  }
  assert.deepEqual(protocolErrors, [], 'npx must keep stdout valid MCP JSON-RPC');
  console.log(JSON.stringify({ package: spec, version, consumer, checked }, null, 2));
} catch (error) {
  if (stderr) console.error(stderr);
  throw error;
} finally {
  await client.close();
}

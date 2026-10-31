import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { runSuite } from '../dist/runner.js';
import { createDriver } from '../dist/drivers/index.js';
import { targetSchema } from '../dist/schema.js';
import { Workspace } from '../dist/workspace.js';
const require=createRequire(import.meta.url);
test('real Chromium: form assertions, live menu capture, healing and a failing case',async()=>{
  const html=await readFile('integration/fixtures/web.html');
  const server=createServer((_,res)=>{res.setHeader('content-type','text/html');res.end(html)}).listen(0,'127.0.0.1');
  await new Promise<void>(r=>server.once('listening',r));const address=server.address() as any;
  try {
    const target={kind:'web',url:'http://127.0.0.1:'+address.port,timeoutMs:3000,headless:true};
    const suite={schemaVersion:1,name:'Web adapter verification',target,healing:'semantic',tests:[
      {id:'web-form',name:'Save project with form controls',tags:['web','smoke'],steps:[
        {name:'Enter project',action:'fill',locator:{label:'Project name'},value:'Launch'},
        {name:'Enable notifications',action:'check',locator:{role:'checkbox',name:'Enable notifications'}},
        {name:'Verify checked',action:'assertChecked',locator:{role:'checkbox',name:'Enable notifications'}},
        {name:'Choose priority',action:'select',locator:{label:'Priority'},value:'high'},
        {name:'Save',action:'click',locator:{role:'button',name:'Save project'}},
        {name:'Verify saved',action:'assertText',locator:{testId:'status'},value:'Saved Launch'}]},
      {id:'web-healed',name:'Recover renamed CSS ID with exact accessible identity',tags:['healing'],steps:[
        {name:'Use stale selector',action:'click',locator:{css:'#save-old',role:'button',name:'Save project'}},
        {name:'Verify result',action:'assertText',locator:{testId:'status'},value:'Saved',contains:true}]},
      {id:'web-negative',name:'Intentional wrong assertion demonstrates failure evidence',tags:['negative-control'],steps:[
        {name:'Wrong expected text',action:'assertText',locator:{testId:'status'},value:'Never expected'},
        {name:'Must skip',action:'click',locator:{role:'button',name:'Save project'}}]}
    ]};
    const out=await runSuite(suite,new Workspace());
    assert.deepEqual(out.result.summary,{total:3,passed:1,failed:1,healed:1,skipped:0});
    assert.ok(out.result.tests[2].steps[0].screenshot);assert.equal(out.result.tests[2].steps[1].status,'skipped');
    const driver=createDriver(targetSchema.parse(target));await driver.start();
    try{await driver.act({name:'File menu',action:'menu',menuPath:['File'],contains:false});const menus=await driver.menus();assert.match(JSON.stringify(menus),/Export/);}finally{await driver.close()}
    await mkdir('integration/output',{recursive:true});await import('node:fs/promises').then(fs=>fs.writeFile('integration/output/web-report-path.txt',out.directory));
  } finally {server.close()}
});
test('real Electron: packaged runtime, form automation and native nested menus',async()=>{
  const electronPath=createRequire(resolve('integration/fixtures/electron/package.json'))('electron') as string;
  const target=targetSchema.parse({kind:'electron',executable:electronPath,args:[resolve('integration/fixtures/electron/main.cjs')],timeoutMs:30000});
  const driver=createDriver(target);
  try{
    await driver.start();
    const menus=JSON.stringify(await driver.menus());assert.match(menus,/Export JSON/);assert.match(menus,/Diagnostics/);
    await driver.act({name:'Name',action:'fill',locator:{label:'Project name'},value:'Electron',contains:false});
    await driver.act({name:'Save',action:'click',locator:{role:'button',name:'Save project'},contains:false});
    await driver.act({name:'Verify',action:'assertText',locator:{testId:'status'},value:'Saved Electron',contains:false});
  }finally{await driver.close()}
});
test('real Windows UIA: form controls, assertions, ranges and nested menus',{skip:process.platform!=='win32'},async()=>{
  const target=targetSchema.parse({kind:'desktop',executable:resolve('integration/fixtures/native/bin/Release/net8.0-windows/Fixture.exe'),timeoutMs:6000});
  const driver=createDriver(target);
  try {
    await driver.start();const snap=await driver.snapshot(12,1000);assert.ok(snap.nodes.some(n=>n.automationId==='ProjectName'));
    await driver.act({name:'Enter name',action:'fill',locator:{automationId:'ProjectName'},value:'Desktop',contains:false});
    await driver.act({name:'Enable',action:'check',locator:{automationId:'Notifications'},contains:false});
    await driver.act({name:'Verify checked',action:'assertChecked',locator:{automationId:'Notifications'},contains:false});
    await driver.act({name:'Save',action:'click',locator:{automationId:'SaveProject'},contains:false});
    await driver.act({name:'Verify saved status',action:'assertText',locator:{automationId:'Status'},value:'Saved Desktop',contains:false});
    await driver.act({name:'Verify input value',action:'assertValue',locator:{automationId:'ProjectName'},value:'Desktop',contains:false});
    await driver.act({name:'Volume',action:'setRange',locator:{automationId:'Volume'},value:72,contains:false});
    await driver.act({name:'Verify volume',action:'assertValue',locator:{automationId:'Volume'},value:'72',contains:false});
    const menus=await driver.menus(10);assert.match(JSON.stringify(menus),/Export JSON/);
    await mkdir('integration/output',{recursive:true});await driver.screenshot(resolve('integration/output/native.png'));
  } finally {await driver.close().catch(()=>{})}
});

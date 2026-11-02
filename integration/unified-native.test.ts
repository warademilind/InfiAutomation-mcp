import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { runSuite } from '../dist/runner.js';
import { Workspace } from '../dist/workspace.js';

test('real Windows mixed case: web and native desktop in the same execution',{skip:process.platform!=='win32'||process.env.INFIAUTOMATION_NATIVE_TEST!=='1'},async()=>{
  const out=await runSuite({schemaVersion:2,name:'Real web + native desktop',targets:{portal:{kind:'web',url:'data:text/html,<title>Mixed fixture</title><main><h1>Ready</h1></main>'},native:{kind:'desktop',executable:resolve('integration/fixtures/native/bin/Release/net8.0-windows/Fixture.exe'),timeoutMs:15000}},tests:[{id:'mixed-native',name:'Cross two real UI drivers',steps:[
    {kind:'ui',target:'portal',name:'Verify browser',step:{name:'Title',action:'assertTitle',value:'Mixed fixture'}},
    {kind:'ui',target:'native',name:'Enter native project',step:{name:'Name',action:'fill',locator:{automationId:'ProjectName'},value:'Mixed E2E'}},
    {kind:'ui',target:'native',name:'Save in desktop',step:{name:'Save',action:'click',locator:{automationId:'SaveProject'}}},
    {kind:'ui',target:'native',name:'Verify native result',step:{name:'Status',action:'assertText',locator:{automationId:'Status'},value:'Saved Mixed E2E'}},
    {kind:'ui',target:'portal',name:'Return to browser',step:{name:'Title',action:'assertTitle',value:'Mixed fixture'}}
  ]}]},new Workspace());
  assert.equal(out.result.status,'passed',JSON.stringify(out.result.tests));assert.deepEqual(out.result.layers.map(layer=>layer.layer),['web','desktop']);assert.equal(out.result.tests[0].steps.filter(step=>step.screenshot).length,5);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { WebDriver } from '../dist/drivers/web.js';
import { targetSchema, stepSchema } from '../dist/schema.js';
import { runSuite } from '../dist/runner.js';
import { Workspace } from '../dist/workspace.js';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const executable = process.env.INFIAUTOMATION_TEST_ELECTRON || createRequire(resolve('integration/fixtures/electron/package.json'))('electron') as string;
const fixture = resolve('integration/fixtures/electron/main.cjs');
const target = {kind:'electron',executable,args:[fixture,'--multi-window'],windowTitle:'InfiAutomation Lab',windowUrlContains:'web.html',timeoutMs:30000};
const act = (input:unknown) => stepSchema.parse(input);

test('real Electron: multiwindow selection, native menu invocation, capabilities and report evidence',async()=>{
  const driver=new WebDriver(targetSchema.parse(target));
  try {
    await driver.start();
    const info=await driver.info();
    assert.equal(info.transport,'electron-launch');assert.equal(info.ownership,'owned');
    assert.ok(info.runtime.electron);assert.ok(info.runtime.chromium);assert.ok(info.runtime.node);
    assert.equal(info.capabilities.nativeElectronMenus,true);
    await driver.act(act({name:'Native command',action:'menu',menuSource:'native',menuPath:['File','Export','Export JSON']}));
    await driver.act(act({name:'Observe native command result',action:'assertText',locator:{testId:'status'},value:'Export ready'}));
    await assert.rejects(driver.act(act({name:'Disabled command',action:'menu',menuPath:['Tools','Diagnostics']})),/disabled or hidden/);
    await driver.act(act({name:'Toggle real checkbox',action:'menu',menuPath:['Tools','Flag']}));
    await driver.act(act({name:'Check native checkbox result',action:'assertText',locator:{testId:'status'},value:'Flag true'}));
    // Use DOM menus even when the native menu uses the same root label.
    await driver.act(act({name:'DOM File',action:'menu',menuSource:'dom',menuPath:['File','Export']}));
    await driver.act(act({name:'Observe DOM command',action:'assertText',locator:{testId:'status'},value:'Export ready'}));
    await driver.act(act({name:'Wait for late settings window',action:'selectWindow',value:'Fixture settings'}));
    const windows=await driver.windows();assert.equal(windows.windows.length,3);
    const main=windows.windows.find(window=>window.title==='InfiAutomation Lab')!;
    const splash=windows.windows.find(window=>window.title==='Fixture splash')!;
    await driver.selectWindow(splash.windowId);assert.equal(await driver.page.title(),'Fixture splash');
    await driver.selectWindow(main.windowId);assert.equal(await driver.page.title(),'InfiAutomation Lab');
    await assert.rejects(driver.selectWindow('not-observed'),/unknown or closed/);
    await assert.rejects(driver.act(act({name:'Ambiguous',action:'selectWindow',value:'Fixture'})),/ambiguous/);
    console.log('Electron runtime verified: '+JSON.stringify(info.runtime));
  } finally { await driver.close(); }
  const output=await runSuite({schemaVersion:2,name:'Electron runtime evidence',targets:{app:target},healing:'off',tests:[{id:'native-menu',name:'Menu command updates renderer',steps:[
    {kind:'ui',target:'app',name:'Invoke export',step:{name:'Export',action:'menu',menuSource:'native',menuPath:['File','Export','Export JSON']}},
    {kind:'ui',target:'app',name:'Verify export',step:{name:'Status',action:'assertText',locator:{testId:'status'},value:'Export ready'}}
  ]}]},new Workspace());
  assert.equal(output.result.status,'passed',JSON.stringify(output.result));
  assert.equal((output.result.tests[0].sessions![0].info as any).transport,'electron-launch');
});

test('real Electron: CDP attaches through MCP, switches windows and detaches without closing the app',async()=>{
  const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
  // The synthetic Linux CI fixture needs the same sandbox option as Playwright's fixture launch.
  const fixtureFlags=process.platform==='linux'&&process.env.CI?['--no-sandbox']:[];
  const child=spawn(executable,[...fixtureFlags,'--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',fixture,'--multi-window'],{env,stdio:['ignore','pipe','pipe'],windowsHide:true});
  let diagnostics='';
  const endpointPromise=new Promise<string>((done,reject)=>{
    const timer=setTimeout(()=>reject(new Error('CDP fixture timed out: '+diagnostics)),30000);
    child.once('error',error=>{clearTimeout(timer);reject(error)});
    child.once('exit',code=>{clearTimeout(timer);reject(new Error('CDP fixture exited '+code+': '+diagnostics))});
    child.stderr!.on('data',chunk=>{diagnostics=(diagnostics+String(chunk)).slice(-8000);const match=/DevTools listening on (ws:\/\/[^\s]+)/.exec(diagnostics);if(match){clearTimeout(timer);done(match[1])}});
  });
  const transport=new StdioClientTransport({command:process.execPath,args:['dist/cli.js'],cwd:process.cwd(),stderr:'pipe',env:env as Record<string,string>});
  const client=new Client({name:'electron-attachment-verifier',version:'1.0.0'});
  let endpoint='';
  const call=async(name:string,args:Record<string,unknown>)=>{const result=await client.callTool({name,arguments:args});assert.ok(!result.isError,JSON.stringify(result));return result.structuredContent as any;};
  try {
    endpoint=await endpointPromise;
    await client.connect(transport);
    const started=await call('session_start',{target:{kind:'electron',cdpUrl:endpoint,windowTitle:'InfiAutomation Lab',timeoutMs:30000}});
    const {sessionId}=started;
    const info=await call('session_info',{sessionId});assert.equal(info.transport,'cdp');assert.equal(info.ownership,'attached');assert.equal(info.capabilities.mainProcess,false);
    await call('ui_action',{sessionId,step:{name:'Save via CDP',action:'fill',locator:{label:'Project name'},value:'Attached'}});
    await call('ui_action',{sessionId,step:{name:'Click',action:'click',locator:{role:'button',name:'Save project'}}});
    await call('ui_action',{sessionId,step:{name:'Assert',action:'assertText',locator:{testId:'status'},value:'Saved Attached'}});
    await call('ui_action',{sessionId,step:{name:'Settings',action:'selectWindow',value:'Fixture settings'}});
    const listed=await call('ui_windows',{sessionId});assert.equal(listed.windows.length,3);
    await call('ui_window_select',{sessionId,windowId:listed.windows.find((w:any)=>w.title==='InfiAutomation Lab').windowId});
    const unavailable=await client.callTool({name:'ui_action',arguments:{sessionId,step:{name:'Unavailable native API',action:'menu',menuSource:'native',menuPath:['File','Export','Export JSON']}}});assert.equal(unavailable.isError,true);
    await call('session_close',{sessionId});
    assert.equal(child.exitCode,null,'Attached app must remain running after session_close');
    // Reconnect to prove the renderer and saved state survived detachment.
    const verifier=new WebDriver(targetSchema.parse({kind:'electron',cdpUrl:endpoint,windowTitle:'InfiAutomation Lab',timeoutMs:10000}));
    try{await verifier.start();assert.equal((await verifier.windows()).windows.length,3);await verifier.act(act({name:'State survives detach',action:'assertText',locator:{testId:'status'},value:'Saved Attached'}));}finally{await verifier.close();}
    const ambiguous=new WebDriver(targetSchema.parse({kind:'electron',cdpUrl:endpoint,windowTitle:'Fixture',timeoutMs:1000}));
    try{await assert.rejects(ambiguous.start(),/ambiguous/);}finally{await ambiguous.close();}
    const missing=new WebDriver(targetSchema.parse({kind:'electron',cdpUrl:endpoint,windowTitle:'Does not exist',timeoutMs:300}));
    try{await assert.rejects(missing.start(),/No matching renderer/);}finally{await missing.close();}
    assert.equal(child.exitCode,null,'Failed attachment must leave the app running');
  } finally {await client.close().catch(()=>{});child.kill();}
});

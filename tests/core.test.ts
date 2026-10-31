import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { suiteSchema, targetSchema, stepSchema } from '../src/schema.js';
import { Workspace } from '../src/workspace.js';
import { suggestHealing } from '../src/healing.js';
import { renderReport } from '../src/report.js';
import { runSuite } from '../src/runner.js';
import type { Driver } from '../src/drivers/types.js';
import type { RunResult } from '../src/schema.js';
const suite = { schemaVersion:1, name:'Unit suite', target:{kind:'web'},tests:[{id:'case-1',name:'Case',steps:[{name:'Verify',action:'assertTitle',value:'Fixture'}]}] };
async function workspace() { await mkdir('.testweave/unit',{recursive:true}); return new Workspace(await mkdtemp(resolve('.testweave/unit/run-'))); }
test('schemas reject missing fields, unknown actions, duplicate IDs and malformed target', () => {
  assert.throws(()=>stepSchema.parse({name:'Click',action:'click'}));
  assert.throws(()=>stepSchema.parse({name:'Oops',action:'eval',value:'process.exit()'}));
  assert.throws(()=>targetSchema.parse({kind:'electron'}));
  assert.throws(()=>suiteSchema.parse({...suite,tests:[suite.tests[0],suite.tests[0]]}));
  assert.throws(()=>suiteSchema.parse({...suite,tests:[{id:'no-assertion',name:'Unsafe pass',steps:[{name:'Click',action:'click',locator:{role:'button'}}]}]}));
  assert.equal(suiteSchema.parse(suite).healing,'off');
});
test('workspace blocks traversal, absolute escapes and junction escapes', async () => {
  const ws=await workspace();await ws.write('nested/file.txt','hello');assert.equal(await ws.read('nested/file.txt'),'hello');
  assert.throws(()=>ws.path('../escape'));
  assert.throws(()=>ws.path(resolve(ws.root,'../escape')));
  const other=await workspace();await symlink(other.root,resolve(ws.root,'escape'),process.platform==='win32'?'junction':'dir');
  await assert.rejects(()=>ws.write('escape/secret.txt','x'),/Symlink escapes/);
});
test('healing preserves exact identity, rejects mismatched roles and frame scope', () => {
  const snapshot={title:'Fixture',nodes:[{name:'Save',role:'button',testId:'save-v2'}],truncated:false};
  assert.equal(suggestHealing({css:'#old',role:'button',name:'Save'},snapshot)[0].proposed.testId,'save-v2');
  assert.equal(suggestHealing({role:'link',name:'Save'},snapshot).length,0);
  assert.equal(suggestHealing({css:'#old',name:'Save!',role:'button'},snapshot).length,0);
  assert.equal(suggestHealing({name:'Save',frame:'#frame'},snapshot).length,0);
});
function fake(overrides: Partial<Driver> = {}): Driver {
  return {kind:'web',start:async()=>{},snapshot:async()=>({title:'Fixture',nodes:[],truncated:false}),act:async()=>({actual:'Fixture'}),screenshot:async()=>{},menus:async()=>[],traceStart:async()=>{},traceStop:async()=>{},close:async()=>{},...overrides};
}
test('runner records assertion failures and skips remaining steps', async () => {
  const ws=await workspace();
  const out=await runSuite({...suite,tests:[{...suite.tests[0],steps:[{name:'Broken',action:'assertTitle',value:'Wrong'},{name:'Must skip',action:'assertTitle',value:'Fixture'}]}]},ws,()=>fake({act:async()=>{throw new Error('Assertion failed')}}));
  assert.equal(out.result.summary.failed,1);assert.equal(out.result.tests[0].steps[1].status,'skipped');
  assert.match(await ws.read(out.directory+'/index.html'),/TestWeave/);
});
test('runner reports setup and teardown failures', async () => {
  const setup=await runSuite(suite,await workspace(),()=>fake({start:async()=>{throw new Error('Missing binary')}}));
  assert.equal(setup.result.status,'failed');assert.match(setup.result.tests[0].error!,/Setup failed/);
  const teardown=await runSuite(suite,await workspace(),()=>fake({close:async()=>{throw new Error('Cannot close')}}));
  assert.equal(teardown.result.status,'failed');assert.match(teardown.result.tests[0].error!,/teardown/);
});
test('semantic healing is explicit, recorded, and never patches assertions', async () => {
  let count=0;
  const input={...suite,healing:'semantic',tests:[{id:'heal',name:'Heal',steps:[{name:'Save',action:'click',locator:{css:'#old',name:'Save',role:'button'}},{name:'Verify',action:'assertTitle',value:'Fixture'}]}]};
  const out=await runSuite(input,await workspace(),()=>fake({snapshot:async()=>({title:'Fixture',nodes:[{name:'Save',role:'button',testId:'new-save'}],truncated:false}),act:async()=>{if(count++===0)throw Object.assign(new Error('missing'),{code:'LOCATOR_NOT_FOUND'});return {actual:'ok'}}}));
  assert.equal(out.result.status,'healed');assert.equal(out.result.summary.healed,1);assert.equal(out.result.tests[0].steps[0].healing?.applied,true);
  const bad=await runSuite({...suite,healing:'semantic'},await workspace(),()=>fake({act:async()=>{throw Object.assign(new Error('missing assertion target'),{code:'LOCATOR_NOT_FOUND'})}}));
  assert.equal(bad.result.status,'failed');
});
test('report safely embeds hostile app content and provides accessible drilldown', () => {
  const run: RunResult={schemaVersion:1,id:'x',name:'</script><script>alert(1)</script>',target:'web',startedAt:new Date().toISOString(),durationMs:10,status:'failed',summary:{total:1,passed:0,failed:1,healed:0,skipped:0},tests:[{id:'x',name:'<img onerror=alert(1)>',tags:[],status:'failed',durationMs:10,steps:[]}],environment:{platform:'test',node:'test',playwright:'test'}};
  const html=renderReport(run);assert.ok(!html.includes('</script><script>alert(1)'));assert.match(html,/role="dialog"/);assert.match(html,/application\/json/);assert.match(html,/aria-label="Search tests"/);
});

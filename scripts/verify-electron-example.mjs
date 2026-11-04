import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('examples/electron/report');
const provenance=JSON.parse(await readFile(join(root,'provenance.json'),'utf8'));
for(const [file,sha] of Object.entries(provenance.sha256)){
  assert.ok(!file.includes('/')&&!file.includes('\\'));
  assert.equal(createHash('sha256').update(await readFile(join(root,file))).digest('hex'),sha,file);
}
const run=JSON.parse(await readFile(join(root,'results.json'),'utf8'));
assert.deepEqual(run.summary,{total:2,passed:2,failed:0,healed:0,skipped:0});
const screenshots=run.tests.flatMap(test=>test.steps.map(step=>step.screenshot));
assert.equal(screenshots.length,5);
for(const file of screenshots)assert.ok(provenance.sha256[file],file);
for(const test of run.tests){
  assert.equal(test.sessions[0].info.runtime.electron,provenance.electron);
  assert.equal(test.sessions[0].info.runtime.chromium,provenance.chromium);
  for(const step of test.steps)assert.ok(provenance.sha256[step.evidence],step.evidence);
}
for(const file of ['index.html','detailed.html']){
  const html=await readFile(join(root,file),'utf8');
  assert.match(html,/Application runtimes and connection capabilities/);
  assert.ok(!/kpit|beacon|milindw3|D:\\\\automation_mcp|C:\\\\Users\\\\/i.test(html));
}
console.log(JSON.stringify({electron:provenance.electron,chromium:provenance.chromium,passed:run.summary.passed,screenshots:screenshots.length,verifiedHashes:Object.keys(provenance.sha256).length}));

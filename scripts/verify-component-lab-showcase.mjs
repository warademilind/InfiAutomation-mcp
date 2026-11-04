import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve('showcases/inficomponent-lab');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const provenance=read('provenance.json');
for(const artifact of read('presentation-manifest.json').artifacts)assert.equal(sha(fs.readFileSync(path.join(root,artifact.path))),artifact.sha256,'Presentation asset changed: '+artifact.path);
for(const artifact of provenance.artifacts){
 const target=path.resolve(root,artifact.path);assert.ok(target.startsWith(root+path.sep));
 const bytes=fs.readFileSync(target);assert.equal(sha(bytes),artifact.publishedSha256,artifact.path);
 if(artifact.path.endsWith('.png'))assert.equal(artifact.sourceSha256,artifact.publishedSha256,'Published screenshot pixels changed');
 if(/\.(?:json|html|md|mjs)$/.test(artifact.path))assert.ok(!/kpit|beacon|milindw3|[CDE]:[\\/]+Users[\\/]/i.test(bytes.toString('utf8')),'Private text: '+artifact.path);
}
const final='acceptance-20261104-acceptance-rerun';
assert.equal(sha(fs.readFileSync(path.join(root,'REQUIREMENTS.md'))),provenance.requirements.sourceSha256);
assert.equal(provenance.requirements.sourceSha256,provenance.requirements.importedCopySha256,'Published requirement source differs from the recorded imported requirement');
const results=read(final+'/mcp-report/results.json'),summary=read(final+'/summary.json');
assert.deepEqual(results.summary,{total:26,passed:26,failed:0,healed:0,skipped:0});
assert.equal(results.tests.reduce((sum,test)=>sum+test.steps.length,0),523);
assert.equal(provenance.publishedScreenshots,484);assert.equal(summary.notRunCases.length,4);
assert.equal(summary.connectionChecks.length,7);assert.ok(summary.connectionChecks.every(check=>check.status==='passed'));
const video=read('media/recording.json');assert.equal(video.capturedCases,3);assert.match(video.scope,/interrupted/);assert.match(video.scope,/not a full-suite/);
assert.equal(sha(fs.readFileSync(path.join(root,'media/execution.mp4'))),video.videoSha256);
assert.ok(video.durationSeconds>150&&video.durationSeconds<160);
const tour=read('media/report-tour.json');assert.equal(sha(fs.readFileSync(path.join(root,'media/report-tour.mp4'))),tour.videoSha256);assert.ok(tour.durationSeconds>20);
for(const run of [results,read('acceptance-20261104-acceptance/mcp-report/results.json')])for(const test of run.tests)for(const step of test.steps){for(const asset of [step.screenshot,step.evidence,...(step.attachments||[]).map(attachment=>attachment.path)].filter(Boolean)){const file=path.resolve(root,run===results?final:'acceptance-20261104-acceptance','mcp-report',asset.split('#')[0]);assert.ok(fs.existsSync(file),'Missing dynamic evidence '+asset);}}
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
let links=0;const missing=[];
for(const file of files(root).filter(file=>file.endsWith('.html'))){
 const text=fs.readFileSync(file,'utf8');
 for(const match of text.matchAll(/<(?:a|img|iframe|source|track|script|link)\b[^>]*?\s(?:href|src)="([^"<>]+)"/g)){
  const href=match[1];if(/^(?:https?:|data:|mailto:|#)/.test(href)||href.includes('+')||href.includes('${'))continue;
  const target=path.resolve(path.dirname(file),decodeURIComponent(href.split(/[?#]/)[0]));
  assert.ok(target===root||target.startsWith(root+path.sep),'Escaping link '+href);
  if(!fs.existsSync(target))missing.push(path.relative(root,file)+' -> '+href);links++;
 }
}
assert.deepEqual(missing,[],'Missing showcase links');
console.log(JSON.stringify({checkedArtifacts:provenance.artifacts.length,publishedScreenshots:484,capturedScreenshots:504,typedCases:results.summary,connectionChecks:7,manualNotRun:4,recordedVideoCases:3,videoSeconds:video.durationSeconds,localLinks:links}));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, truncate } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Workspace } from '../src/workspace.js';
import { importRequirements, readRequirements } from '../src/documents.js';
import { createPlan, loadPlan } from '../src/planning.js';
import { generateSuite } from '../src/workflows.js';
import { traceability, renderTraceability } from '../src/traceability.js';
import { suiteSchema, type RunResult } from '../src/schema.js';
import { runSuite } from '../src/runner.js';
import { pdf, docx } from './helpers/documents.js';
async function workspace(){await mkdir('.infiautomation/unit',{recursive:true});return new Workspace(await mkdtemp(resolve('.infiautomation/unit/requirements-')))}
const planInput={name:'Requirement plan',goal:'Verify save feedback',target:{kind:'web' as const},requirements:[{id:'REQ-SAVE-001',text:'Save displays a success message',source:'Section 2.1',acceptanceCriteria:['The saved name is displayed']},{id:'REQ-EXPORT-002',text:'Export is available'}],questions:['Is persistence after reload required?'],scenarios:[{name:'Save',requirementIds:['REQ-SAVE-001'],steps:['Save project'],expected:'Success'}],path:'plans/project.md'};
const suiteInput={schemaVersion:1,name:'Requirement cases',planPath:'plans/project.json',target:{kind:'web'},tests:[{id:'save',name:'Save',requirements:['REQ-SAVE-001'],steps:[{name:'Verify',action:'assertTitle',value:'Fixture'}]}]};
test('document import preserves hashed snapshots, reads all chunks and rejects escapes/oversized files',async()=>{
 const ws=await workspace(),text='REQ-SAVE-001: Save must show success.\n'.repeat(500);
 await ws.write('requirements.md',text);const imported=await importRequirements('requirements.md',ws);
 assert.equal(imported.documentId.length,64);assert.equal(imported.text.length,12000);assert.equal(imported.nextOffset,12000);
 await ws.write('requirements.md','Changed source');const tail=await readRequirements(imported.documentId,ws,12000,24000);
 assert.equal(imported.text+tail.text,text);assert.equal(tail.nextOffset,null);
 await assert.rejects(()=>importRequirements('../outside.md',ws),/inside/);
 await assert.rejects(()=>readRequirements('../escape',ws));
 await ws.write('too-large.txt','x');await truncate(ws.path('too-large.txt'),21*1024*1024);
 await assert.rejects(()=>importRequirements('too-large.txt',ws),/20 MiB/);
 await ws.write('.infiautomation/requirements/'+imported.documentId+'/text.txt','Tampered');
 await assert.rejects(()=>readRequirements(imported.documentId,ws),/modified/);
});
test('real DOCX/PDF text extraction works locally and textless PDFs report the OCR requirement',async()=>{
 const ws=await workspace();
 await writeFile(ws.path('requirements.docx'),docx('REQ-SAVE-001: Save shows success.'));
 const word=await importRequirements('requirements.docx',ws);assert.match(word.text,/REQ-SAVE-001/);
 await writeFile(ws.path('requirements.pdf'),pdf('REQ-EXPORT-002: Export shows feedback.'));
 const document=await importRequirements('requirements.pdf',ws);assert.equal(document.pages,1);assert.match(document.text,/Page 1/);assert.match(document.text,/REQ-EXPORT-002/);
 await writeFile(ws.path('scanned.pdf'),pdf(''));
 await assert.rejects(()=>importRequirements('scanned.pdf',ws),/OCR/);
 await ws.write('old.doc','legacy');await assert.rejects(()=>importRequirements('old.doc',ws),/legacy/);
});
test('plans preserve original IDs, acceptance criteria, provenance, questions and uncovered requirements',async()=>{
 const ws=await workspace();await ws.write('source.txt','Save displays success.');const document=await importRequirements('source.txt',ws);
 const created=await createPlan({...planInput,documents:[document.documentId]},ws);
 assert.deepEqual(created.uncovered,['REQ-EXPORT-002']);
 const saved=await loadPlan('plans/project.json',ws);assert.equal(saved.requirements[0].id,'REQ-SAVE-001');assert.equal(saved.requirements[0].acceptanceCriteria[0],'The saved name is displayed');assert.equal(saved.documents[0].documentId,document.documentId);assert.equal(saved.questions.length,1);
 await assert.rejects(()=>createPlan({...planInput,requirements:[planInput.requirements[0],planInput.requirements[0]]},ws),/unique/);
 await assert.rejects(()=>createPlan({...planInput,scenarios:[{...planInput.scenarios[0],requirementIds:['REQ-UNKNOWN']}]},ws),/Unknown requirement/);
 const original=await createPlan({...planInput,requirements:[{id:'REQ / 4.2',text:'Original ID'}],scenarios:[{...planInput.scenarios[0],requirementIds:['REQ / 4.2']}],path:'original.md'},ws);assert.deepEqual(original.requirements,['REQ / 4.2']);
 const legacy=await createPlan({...planInput,requirements:['Save'],scenarios:[{...planInput.scenarios[0],requirementIds:['R01']}],path:'legacy.md'},ws);assert.deepEqual(legacy.requirements,['R01']);
});
test('plan-linked generation and execution reject unknown/untraced cases before any app launches',async()=>{
 const ws=await workspace();await createPlan(planInput,ws);
 const generated=await generateSuite(suiteInput,'tests/save.json',ws);assert.equal(generated.coverage?.summary.unmapped,1);
 await assert.rejects(()=>generateSuite(suiteInput,'tests/conflict.json',ws,'other-plan.json'),/Conflicting/);
 await generateSuite({...suiteInput,planPath:ws.path('plans/project.json')},'tests/portable.json',ws,'plans/project.json');assert.equal(JSON.parse(await ws.read('tests/portable.json')).planPath,'plans/project.json');
 const unknown={...suiteInput,tests:[{...suiteInput.tests[0],requirements:['FAKE']}]};
 await assert.rejects(()=>generateSuite(unknown,'tests/bad.json',ws),/Unknown requirement/);
 await assert.rejects(()=>generateSuite({...suiteInput,tests:[{...suiteInput.tests[0],requirements:[]}]},'tests/empty.json',ws),/at least one/);
 let launched=false;await assert.rejects(()=>runSuite(unknown,ws,()=>{launched=true;throw new Error('Must not start')}),/Unknown requirement/);assert.equal(launched,false);
});
test('traceability distinguishes mapping gaps, not-run, failures and healing, and escapes document content',async()=>{
 const ws=await workspace();await createPlan(planInput,ws);const plan=await loadPlan('plans/project.json',ws),suite=suiteSchema.parse(suiteInput);
 const before=traceability(plan,suite);assert.equal(before.summary.notRun,1);assert.equal(before.requirements[1].status,'unmapped');
 const run={id:'run',tests:[{id:'save',status:'failed'}]} as RunResult;
 const after=traceability(plan,suite,run);assert.equal(after.requirements[0].status,'failed');
 run.tests[0].status='healed';assert.equal(traceability(plan,suite,run).requirements[0].status,'healed');
 plan.requirements[0].text='<script>alert(1)</script>';const html=renderTraceability(traceability(plan,suite,run));assert.ok(!html.includes('<script>alert(1)</script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('detailed.html#save'));
});

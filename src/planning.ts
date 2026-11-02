import { z } from 'zod';
import { policySchema, type Snapshot } from './schema.js';
import { Workspace } from './workspace.js';
import { documentIdSchema, documentSchema, importedDocument } from './documents.js';
export const requirementSchema=z.object({id:z.string().trim().min(1).max(120).refine(value=>!/[\u0000-\u001f\u007f]/.test(value),'Requirement IDs cannot contain control characters'),text:z.string().min(1),source:z.string().optional(),acceptanceCriteria:z.array(z.string().min(1)).default([])}).strict();
const scenarioSchema=z.object({name:z.string().min(1),requirementIds:z.array(z.string().min(1)).min(1),layers:z.array(z.enum(['web','desktop','electron','api','database','ux'])).default([]),preconditions:z.array(z.string()).default([]),steps:z.array(z.string().min(1)).min(1),expected:z.string().min(1),priority:z.enum(['critical','high','normal']).default('normal')}).strict();
export const planInputSchema=z.object({
  name:z.string().min(1),goal:z.string().min(1),requirements:z.array(z.union([z.string().min(1),requirementSchema])).min(1),risks:z.array(z.string()).default([]),questions:z.array(z.string()).default([]),documents:z.array(documentIdSchema).default([]),apiDocuments:z.array(documentIdSchema).default([]),policy:policySchema.optional(),target:z.object({kind:z.enum(['web','electron','desktop','api','database','mixed'])}).strict(),scenarios:z.array(scenarioSchema).min(1),path:z.string().regex(/\.md$/i,'Plan path must end in .md').default('test-plans/plan.md')
}).strict();
export const savedPlanSchema=z.object({schemaVersion:z.literal(1),name:z.string(),goal:z.string(),target:z.object({kind:z.enum(['web','electron','desktop','api','database','mixed'])}),requirements:z.array(requirementSchema).min(1),risks:z.array(z.string()),questions:z.array(z.string()),documents:z.array(documentSchema),apiDocuments:z.array(documentIdSchema).default([]),policy:policySchema.optional(),scenarios:z.array(scenarioSchema),uncovered:z.array(z.string())});
export type SavedPlan=z.infer<typeof savedPlanSchema>;
export async function loadPlan(path:string,workspace:Workspace):Promise<SavedPlan>{
  const plan=savedPlanSchema.parse(JSON.parse(await workspace.read(path)));
  if(new Set(plan.requirements.map(r=>r.id)).size!==plan.requirements.length)throw new Error('Plan contains duplicate requirement IDs');
  const ids=new Set(plan.requirements.map(r=>r.id));
  for(const scenario of plan.scenarios)for(const id of scenario.requirementIds)if(!ids.has(id))throw new Error('Unknown requirement ID in saved plan: '+id);
  plan.uncovered=plan.requirements.map(r=>r.id).filter(id=>!plan.scenarios.some(s=>s.requirementIds.includes(id)));
  return plan;
}
export async function createPlan(input:z.input<typeof planInputSchema>,workspace:Workspace,evidence?:Snapshot){
  const data=planInputSchema.parse(input);
  const requirements=data.requirements.map((r,i)=>typeof r==='string'?{id:'R'+String(i+1).padStart(2,'0'),text:r,acceptanceCriteria:[]}:r);
  const ids=requirements.map(r=>r.id);if(new Set(ids).size!==ids.length)throw new Error('Requirement IDs must be unique; custom IDs cannot collide with generated R01-style IDs');
  for(const scenario of data.scenarios)for(const id of scenario.requirementIds)if(!ids.includes(id))throw new Error('Unknown requirement ID: '+id);
  const covered=new Set(data.scenarios.flatMap(s=>s.requirementIds)),uncovered=ids.filter(id=>!covered.has(id));
  const documents=await Promise.all(data.documents.map(id=>importedDocument(id,workspace)));
  for(const id of data.apiDocuments)await workspace.read('.infiautomation/api-documents/'+id+'/catalog.json');
  const saved:SavedPlan={schemaVersion:1,name:data.name,goal:data.goal,target:data.target,requirements,risks:data.risks,questions:data.questions,documents,apiDocuments:data.apiDocuments,policy:data.policy,scenarios:data.scenarios,uncovered};
  const jsonPath=data.path.replace(/\.md$/i,'.json');
  const text='# '+data.name+'\n\n'+data.goal+'\n\nTarget: '+data.target.kind+'\n\n## Source documents\n\n'+(documents.map(d=>'- '+d.sourcePath+' (SHA-256 '+d.documentId+')').join('\n')||'No imported source document linked.')+'\n\n## Requirements\n\n'+requirements.map(r=>'- **'+r.id+'** '+r.text+(r.source?'\n  Source: '+r.source:'')+(r.acceptanceCriteria.length?'\n'+r.acceptanceCriteria.map(c=>'  - Acceptance: '+c).join('\n'):'')).join('\n')+'\n\n## Open questions\n\n'+(data.questions.map(q=>'- '+q).join('\n')||'None supplied. This does not prove the requirements are complete.')+'\n\n## Risks\n\n'+(data.risks.map(r=>'- '+r).join('\n')||'No risks supplied.')+'\n\n## Scenarios\n\n'+data.scenarios.map((s,i)=>'### TC-'+String(i+1).padStart(3,'0')+' - '+s.name+'\n\nPriority: '+s.priority+' | Requirements: '+s.requirementIds.join(', ')+'\n\nPreconditions: '+(s.preconditions.join('; ')||'Fresh application session')+'\n\n'+s.steps.map((v,i)=>(i+1)+'. '+v).join('\n')+'\n\nExpected: '+s.expected).join('\n\n')+'\n\n## Scenario coverage gaps\n\n'+(uncovered.join(', ')||'Every supplied requirement maps to at least one planned scenario. Execution and acceptance still need verification.')+'\n\n## Observation provenance\n\n'+(evidence?'Observed window: '+evidence.title+'\n\n'+JSON.stringify(evidence.nodes.slice(0,50),null,2):'No live snapshot attached. Inspect the running app before generating executable locators.')+'\n';
  const extension='\n## Cross-layer scope\n\n'+data.scenarios.map(s=>'- '+s.name+': '+(s.layers.join(', ')||data.target.kind)).join('\n')+'\n\n## API document provenance\n\n'+(data.apiDocuments.join('\n')||'No structured API catalog linked.')+'\n\n## Execution policy\n\n'+(data.policy?'```json\n'+JSON.stringify(data.policy,null,2)+'\n```\n\nStructured restrictions are enforced by schemaVersion 2 execution. Natural-language do/don\'t notes must be translated into supported restrictions and explicit assertions; unresolved rules need review.':'No structured execution policy supplied.')+'\n';
  await workspace.write(jsonPath,JSON.stringify(saved,null,2));
  return {path:await workspace.write(data.path,text+extension),jsonPath:workspace.path(jsonPath),requirements:ids,uncovered,scenarios:data.scenarios.length,questions:data.questions,documents:documents.map(d=>({documentId:d.documentId,sourcePath:d.sourcePath}))};
}

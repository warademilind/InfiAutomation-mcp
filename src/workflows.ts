import { z } from 'zod';
import { suiteSchema, type Snapshot, type Suite, type Target } from './schema.js';
import { Workspace } from './workspace.js';
export const planInputSchema = z.object({
  name: z.string().min(1), goal: z.string().min(1), requirements: z.array(z.string().min(1)).min(1),
  risks: z.array(z.string()).default([]), target: z.object({ kind: z.enum(['web', 'electron', 'desktop']) }),
  scenarios: z.array(z.object({ name: z.string(), requirementIds: z.array(z.string()), preconditions: z.array(z.string()).default([]), steps: z.array(z.string()).min(1), expected: z.string().min(1), priority: z.enum(['critical','high','normal']).default('normal') })).min(1),
  path: z.string().default('test-plans/plan.md')
}).strict();
export async function createPlan(input: z.infer<typeof planInputSchema>, workspace: Workspace, evidence?: Snapshot) {
  const data = planInputSchema.parse(input);
  const requirementIds = data.requirements.map((_,i) => 'R' + String(i+1).padStart(2,'0'));
  for (const scenario of data.scenarios) for (const id of scenario.requirementIds) if (!requirementIds.includes(id)) throw new Error('Unknown requirement ID: ' + id);
  const covered = new Set(data.scenarios.flatMap(s=>s.requirementIds));
  const uncovered = requirementIds.filter(id=>!covered.has(id));
  const text = '# ' + data.name + '\n\n' + data.goal + '\n\nTarget: ' + data.target.kind + '\n\n## Requirements\n\n' + data.requirements.map((r,i)=>'- **'+requirementIds[i]+'** '+r).join('\n') + '\n\n## Risks\n\n' + (data.risks.map(r=>'- '+r).join('\n')||'No risks supplied.') + '\n\n## Scenarios\n\n' + data.scenarios.map((s,i)=>'### TC-'+String(i+1).padStart(3,'0')+' · '+s.name+'\n\nPriority: '+s.priority+' · Requirements: '+s.requirementIds.join(', ')+'\n\nPreconditions: '+(s.preconditions.join('; ')||'Fresh application session')+'\n\n'+s.steps.map((v,i)=>(i+1)+'. '+v).join('\n')+'\n\nExpected: '+s.expected).join('\n\n')+'\n\n## Coverage gaps\n\n'+(uncovered.join(', ')||'All supplied requirements map to scenarios.')+'\n\n## Observation provenance\n\n'+(evidence?'Observed window: '+evidence.title+'\n\n'+JSON.stringify(evidence.nodes.slice(0,50),null,2):'No live snapshot attached. Verify locators in a running session before generating an executable suite.')+'\n';
  return { path: await workspace.write(data.path, text), uncovered, scenarios: data.scenarios.length };
}
export async function generateSuite(input: unknown, path: string, workspace: Workspace) {
  const suite = suiteSchema.parse(input);
  if (!path.endsWith('.json')) throw new Error('Suite path must end in .json');
  const source = path.slice(0,-5)+'.test.mjs';
  await workspace.write(path, JSON.stringify(suite,null,2));
  const code = 'import { runSuite, Workspace } from "@infiautomation/mcp";\nconst suite = '+JSON.stringify(suite,null,2)+';\nconst { result, directory } = await runSuite(suite, new Workspace());\nconsole.log(directory);\nprocess.exitCode = result.status === "failed" ? 1 : 0;\n';
  await workspace.write(source,code);
  return { path: workspace.path(path), source: workspace.path(source), tests: suite.tests.length, requirements: [...new Set(suite.tests.flatMap(t=>t.requirements))] };
}
export function targetHelp(target: Target) {
  return target.kind === 'desktop' ? 'Interactive Windows desktop + built FlaUI worker required. Attach via pid or windowTitle, or launch executable.' : target.kind === 'electron' ? 'Playwright Electron launch requires inspect fuses enabled; CDP attach requires a debug endpoint.' : 'Use accessible roles/test IDs, frame locators for iframes, and fresh browser contexts for isolation.';
}
export type { Suite };

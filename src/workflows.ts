import { relative, sep } from 'node:path';
﻿import { suiteSchema, type Suite, type Target } from './schema.js';
import { Workspace } from './workspace.js';
import { loadPlan } from './planning.js';
import { validateTraceability, writeTraceability } from './traceability.js';
import { effectivePolicy } from './execution-values.js';
export { createPlan, planInputSchema } from './planning.js';
export async function generateSuite(input: unknown, path: string, workspace: Workspace, planPath?: string) {
  const suite = suiteSchema.parse(input);
  const portable=(value:string)=>relative(workspace.root,workspace.path(value)).split(sep).join('/');
  if(planPath&&suite.planPath&&portable(planPath)!==portable(suite.planPath))throw new Error('Conflicting planPath values; link the suite to one saved plan');
  if(planPath||suite.planPath)suite.planPath=portable(planPath||suite.planPath!);
  const plan=suite.planPath?await loadPlan(suite.planPath,workspace):undefined;
  if(plan?.policy&&suite.schemaVersion===1)throw new Error('A structured plan policy requires schemaVersion 2');
  if(suite.schemaVersion===2)effectivePolicy(plan?.policy,suite.policy);
  if(plan)validateTraceability(plan,suite);
  if (!path.endsWith('.json')) throw new Error('Suite path must end in .json');
  const source = path.slice(0,-5)+'.test.mjs';
  await workspace.write(path, JSON.stringify(suite,null,2));
  const code = 'import { runSuite, Workspace } from "@infiautomation/mcp";\nconst suite = '+JSON.stringify(suite,null,2)+';\nconst { result, directory } = await runSuite(suite, new Workspace());\nconsole.log(directory);\nprocess.exitCode = result.status === "failed" ? 1 : 0;\n';
  await workspace.write(source,code);
  const coverage=plan?await writeTraceability(plan,suite,workspace,path.slice(0,-5)+'.coverage'):undefined;
  return { path: workspace.path(path), source: workspace.path(source), tests: suite.tests.length, requirements: [...new Set(suite.tests.flatMap(t=>t.requirements))],...(coverage?{coverage}:{} ) };
}
export function targetHelp(target: Target) {
  return target.kind === 'desktop' ? 'Interactive Windows desktop + built FlaUI worker required. Attach via pid or windowTitle, or launch executable.' : target.kind === 'electron' ? 'Playwright Electron launch requires inspect fuses enabled; CDP attach requires a debug endpoint.' : 'Use accessible roles/test IDs, frame locators for iframes, and fresh browser contexts for isolation.';
}
export type { Suite };

import { z } from 'zod';
export const locatorSchema = z.object({
  role: z.string().optional(), name: z.string().optional(), testId: z.string().optional(),
  label: z.string().optional(), text: z.string().optional(), css: z.string().optional(),
  automationId: z.string().optional(), controlType: z.string().optional(), className: z.string().optional(),
  frame: z.string().optional(), windowTitle: z.string().optional()
}).strict().refine(v => Object.values(v).some(Boolean), 'At least one locator field is required');
export type Selector = z.infer<typeof locatorSchema>;
export const targetSchema = z.object({
  kind: z.enum(['web', 'electron', 'desktop']), url: z.string().optional(),
  browser: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  channel: z.string().optional(), headless: z.boolean().default(true),
  executable: z.string().optional(), args: z.array(z.string()).default([]),
  cwd: z.string().optional(), cdpUrl: z.string().url().optional(),
  pid: z.number().int().positive().optional(), windowTitle: z.string().optional(),
  timeoutMs: z.number().int().min(100).max(120000).default(10000)
}).strict().superRefine((v, ctx) => {
  if (v.kind === 'electron' && !v.executable && !v.cdpUrl) ctx.addIssue({ code: 'custom', message: 'Electron requires executable or cdpUrl' });
  if (v.kind === 'desktop' && !v.executable && !v.pid && !v.windowTitle) ctx.addIssue({ code: 'custom', message: 'Desktop requires executable, pid or windowTitle' });
});
export type Target = z.infer<typeof targetSchema>;
export const actionNames = ['navigate', 'click', 'doubleClick', 'fill', 'press', 'select', 'check', 'uncheck', 'hover', 'setRange', 'focusWindow', 'selectWindow', 'menu', 'assertText', 'assertValue', 'assertVisible', 'assertEnabled', 'assertChecked', 'assertCount', 'assertTitle', 'screenshot', 'waitFor'] as const;
export const stepSchema = z.object({
  name: z.string().min(1), action: z.enum(actionNames), locator: locatorSchema.optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  contains: z.boolean().default(false), timeoutMs: z.number().int().min(100).max(120000).optional(),
  menuPath: z.array(z.string()).max(12).optional()
}).strict().superRefine((v, ctx) => {
  const global = ['navigate', 'press', 'focusWindow', 'selectWindow', 'menu', 'assertTitle', 'screenshot'];
  if (!global.includes(v.action) && !v.locator) ctx.addIssue({ code: 'custom', message: v.action + ' requires locator' });
  if (['navigate', 'fill', 'press', 'select', 'setRange', 'assertText', 'assertValue', 'assertTitle', 'assertCount', 'selectWindow'].includes(v.action) && v.value === undefined) ctx.addIssue({ code: 'custom', message: v.action + ' requires value' });
  if (v.action === 'menu' && !v.menuPath?.length) ctx.addIssue({ code: 'custom', message: 'menu requires menuPath' });
});
export type Step = z.infer<typeof stepSchema>;
export const caseSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/), name: z.string().min(1),
  tags: z.array(z.string()).default([]), requirements: z.array(z.string()).default([]),
  steps: z.array(stepSchema).min(1).max(200)
}).strict();
export const legacySuiteSchema = z.object({
  schemaVersion: z.literal(1), name: z.string().min(1), target: targetSchema,
  planPath: z.string().min(1).optional(), tests: z.array(caseSchema).min(1).max(500), healing: z.enum(['off', 'semantic']).default('off')
}).strict().superRefine((v,ctx) => {
  if (new Set(v.tests.map(t => t.id)).size !== v.tests.length) ctx.addIssue({code:'custom',message:'Test IDs must be unique'});
  for (const test of v.tests) if (!test.steps.some(step => step.action.startsWith('assert'))) ctx.addIssue({code:'custom',message:'Test ' + test.id + ' needs at least one explicit assertion'});
});
export type LegacySuite = z.infer<typeof legacySuiteSchema>;
export const policySchema = z.object({
  dos: z.array(z.string()).default([]), donts: z.array(z.string()).default([]),
  allowedOrigins: z.array(z.string().url()).default([]),
  allowedMethods: z.array(z.enum(['GET','HEAD','OPTIONS','POST','PUT','PATCH','DELETE'])).default(['GET','HEAD','OPTIONS']),
  deniedTargets: z.array(z.string()).default([]), deniedUiActions: z.array(z.enum(actionNames)).default([]),
  captureScreenshots: z.boolean().default(true), redactKeys: z.array(z.string()).default([])
}).strict();
export const databaseKinds = ['sqlite','postgres','mysql','mssql','oracle','mongodb','redis','odbc'] as const;
export const apiTargetSchema = z.object({kind:z.literal('api'),baseUrl:z.string().url(),headers:z.record(z.string(),z.string()).default({}),timeoutMs:z.number().int().min(100).max(120000).default(10000)}).strict();
export const databaseTargetSchema = z.object({kind:z.literal('database'),driver:z.enum(databaseKinds),connectionEnv:z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).optional(),file:z.string().optional(),database:z.string().optional(),timeoutMs:z.number().int().min(100).max(120000).default(10000),maxRows:z.number().int().min(1).max(10000).default(100)}).strict().superRefine((v,ctx)=>{if(v.driver==='sqlite'?!v.file:!v.connectionEnv)ctx.addIssue({code:'custom',message:'SQLite requires file; other databases require connectionEnv (credentials never belong in suites)'});});
export const unifiedTargetSchema = z.union([targetSchema,apiTargetSchema,databaseTargetSchema]);
const valueCheck = z.object({path:z.string(),equals:z.unknown().optional(),contains:z.string().optional(),exists:z.boolean().optional()}).strict().refine(v=>Object.hasOwn(v,'equals')||v.contains!==undefined||v.exists!==undefined,'Supply equals, contains or exists');
const captureSchema = z.record(z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/),z.string()).default({});
const common = {name:z.string().min(1),target:z.string().min(1)};
export const apiStepSchema = z.object({...common,kind:z.literal('api'),method:z.enum(['GET','HEAD','OPTIONS','POST','PUT','PATCH','DELETE']).default('GET'),path:z.string(),headers:z.record(z.string(),z.string()).default({}),body:z.unknown().optional(),soapAction:z.string().optional(),soapVersion:z.enum(['1.1','1.2']).optional(),expect:z.object({status:z.number().int().min(100).max(599),checks:z.array(valueCheck).default([]),jsonSchema:z.record(z.string(),z.unknown()).optional(),maxDurationMs:z.number().positive().optional(),allowSoapFault:z.boolean().default(false)}).strict(),capture:captureSchema}).strict();
export const databaseStepSchema = z.object({...common,kind:z.literal('database'),operation:z.enum(['query','find','get']).default('query'),sql:z.string().optional(),params:z.array(z.unknown()).default([]),collection:z.string().optional(),filter:z.record(z.string(),z.unknown()).default({}),key:z.string().optional(),expect:z.object({rowCount:z.number().int().min(0).optional(),checks:z.array(valueCheck).default([]),maxDurationMs:z.number().positive().optional()}).strict().refine(v=>v.rowCount!==undefined||v.checks.length>0,'Database checks require rowCount or explicit value checks'),capture:captureSchema}).strict();
export const uxStepSchema = z.object({...common,kind:z.literal('ux'),check:z.enum(['accessibility','layout','performance','visual']),viewport:z.object({width:z.number().int().min(240).max(4096),height:z.number().int().min(240).max(4096)}).strict().optional(),selector:z.string().optional(),maxDurationMs:z.number().positive().optional(),maxViolations:z.number().int().min(0).default(0),tags:z.array(z.string()).default(['wcag2a','wcag2aa','wcag21a','wcag21aa']),maxOverflowPx:z.number().min(0).default(1),minTapTargetPx:z.number().min(0).default(0),baseline:z.string().regex(/\.png$/i).optional(),maxDiffRatio:z.number().min(0).max(1).default(0),threshold:z.number().min(0).max(1).default(0.1)}).strict().superRefine((v,ctx)=>{if(v.check==='visual'&&!v.baseline)ctx.addIssue({code:'custom',message:'Visual checks need an existing approved baseline PNG; tests never approve their own baseline'});});
export const unifiedStepSchema = z.discriminatedUnion('kind',[
  z.object({...common,kind:z.literal('ui'),step:stepSchema,capture:captureSchema}).strict(),apiStepSchema,databaseStepSchema,uxStepSchema
]);
export const unifiedSuiteSchema = z.object({schemaVersion:z.literal(2),name:z.string().min(1),targets:z.record(z.string().regex(/^[A-Za-z][A-Za-z0-9_-]*$/).refine(v=>!['constructor','prototype','__proto__'].includes(v)),unifiedTargetSchema),planPath:z.string().min(1).optional(),policy:policySchema.default({dos:[],donts:[],allowedOrigins:[],allowedMethods:['GET','HEAD','OPTIONS'],deniedTargets:[],deniedUiActions:[],captureScreenshots:true,redactKeys:[]}),healing:z.enum(['off','semantic']).default('off'),tests:z.array(z.object({id:z.string().regex(/^[a-zA-Z0-9_-]+$/),name:z.string().min(1),tags:z.array(z.string()).default([]),requirements:z.array(z.string()).default([]),steps:z.array(unifiedStepSchema).min(1).max(200)}).strict()).min(1).max(500)}).strict().superRefine((v,ctx)=>{
  if(!Object.keys(v.targets).length)ctx.addIssue({code:'custom',message:'At least one named target is required'});
  if(new Set(v.tests.map(t=>t.id)).size!==v.tests.length)ctx.addIssue({code:'custom',message:'Test IDs must be unique'});
  for(const test of v.tests){
    if(!test.steps.some(s=>s.kind==='ui'?s.step.action.startsWith('assert'):s.kind==='ux'&&s.check==='performance'?s.maxDurationMs!==undefined:true))ctx.addIssue({code:'custom',message:'Test '+test.id+' needs an explicit assertion; performance collection without a threshold is measurement only'});
    for(const step of test.steps){const target=v.targets[step.target];const compatible=target&&(step.kind==='ui'?['web','electron','desktop'].includes(target.kind):step.kind==='ux'?(step.check==='visual'?['web','electron','desktop']:['web','electron']).includes(target.kind):target.kind===step.kind);if(!compatible)ctx.addIssue({code:'custom',message:'Unknown or incompatible target '+step.target+' for '+step.kind});}
  }
});
export const suiteSchema = z.union([legacySuiteSchema,unifiedSuiteSchema]);
export type UnifiedSuite = z.infer<typeof unifiedSuiteSchema>;
export type UnifiedStep = z.infer<typeof unifiedStepSchema>;
export type DatabaseTarget = z.infer<typeof databaseTargetSchema>;
export type Suite = z.infer<typeof suiteSchema>;
export interface UiNode { name: string; role?: string; testId?: string; automationId?: string; controlType?: string; className?: string; text?: string; value?: string; path?: string; depth?: number; enabled?: boolean; visible?: boolean; checked?: boolean; children?: UiNode[]; }
export interface Snapshot { title: string; url?: string; nodes: UiNode[]; accessibility?: string; truncated: boolean; windows?: unknown[]; }
export interface Healing { original: Selector; proposed: Selector; confidence: number; reason: string; applied: boolean; }
export interface StepResult { name: string; action: string; status: 'passed' | 'failed' | 'healed' | 'skipped'; durationMs: number; error?: string; actual?: unknown; screenshot?: string; healing?: Healing; layer?: string; target?: string; evidence?: string; timings?: Record<string,number>; attachments?: {label:string;path:string}[]; }
export interface CaseResult { requirements?: string[]; id: string; name: string; tags: string[]; status: 'passed' | 'failed' | 'healed' | 'skipped'; durationMs: number; steps: StepResult[]; error?: string; trace?: string; }
export interface RunResult { traceability?: {planPath:string;total:number;unmapped:number}; schemaVersion: 1 | 2; id: string; name: string; target: string; startedAt: string; durationMs: number; status: 'passed' | 'failed' | 'healed'; summary: { total: number; passed: number; failed: number; healed: number; skipped: number }; tests: CaseResult[]; environment: { platform: string; node: string; playwright: string }; policy?: z.infer<typeof policySchema>; layers?: {layer:string;steps:number;passed:number;healed?:number;failed:number;skipped:number;durationMs:number}[]; }

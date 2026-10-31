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
export const suiteSchema = z.object({
  schemaVersion: z.literal(1), name: z.string().min(1), target: targetSchema,
  planPath: z.string().min(1).optional(), tests: z.array(caseSchema).min(1).max(500), healing: z.enum(['off', 'semantic']).default('off')
}).strict().superRefine((v,ctx) => {
  if (new Set(v.tests.map(t => t.id)).size !== v.tests.length) ctx.addIssue({code:'custom',message:'Test IDs must be unique'});
  for (const test of v.tests) if (!test.steps.some(step => step.action.startsWith('assert'))) ctx.addIssue({code:'custom',message:'Test ' + test.id + ' needs at least one explicit assertion'});
});
export type Suite = z.infer<typeof suiteSchema>;
export interface UiNode { name: string; role?: string; testId?: string; automationId?: string; controlType?: string; className?: string; text?: string; value?: string; path?: string; depth?: number; enabled?: boolean; visible?: boolean; checked?: boolean; children?: UiNode[]; }
export interface Snapshot { title: string; url?: string; nodes: UiNode[]; accessibility?: string; truncated: boolean; windows?: unknown[]; }
export interface Healing { original: Selector; proposed: Selector; confidence: number; reason: string; applied: boolean; }
export interface StepResult { name: string; action: string; status: 'passed' | 'failed' | 'healed' | 'skipped'; durationMs: number; error?: string; actual?: unknown; screenshot?: string; healing?: Healing; }
export interface CaseResult { requirements?: string[]; id: string; name: string; tags: string[]; status: 'passed' | 'failed' | 'healed' | 'skipped'; durationMs: number; steps: StepResult[]; error?: string; trace?: string; }
export interface RunResult { traceability?: {planPath:string;total:number;unmapped:number}; schemaVersion: 1; id: string; name: string; target: string; startedAt: string; durationMs: number; status: 'passed' | 'failed' | 'healed'; summary: { total: number; passed: number; failed: number; healed: number; skipped: number }; tests: CaseResult[]; environment: { platform: string; node: string; playwright: string }; }

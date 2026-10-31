import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { targetSchema, stepSchema, locatorSchema, suiteSchema } from './schema.js';
import { Workspace } from './workspace.js';
import { diagnose } from './doctor.js';
import { VERSION } from './runtime.js';
import { createDriver } from './drivers/index.js';
import type { Driver } from './drivers/types.js';
import { runSuite } from './runner.js';
import { suggestHealing } from './healing.js';
import { createPlan, generateSuite, planInputSchema } from './workflows.js';

const guide = 'TestWeave workflow: session_start -> ui_snapshot/ui_menus -> plan_create -> test_generate -> test_run -> test_status -> report_get. Use observed selectors and explicit expected outcomes. plan_create stores the MCP host/model-authored plan; it does not call a separate model API. Never invent app behavior. Healing defaults off; semantic mode only retries a missing locator with a unique exact accessible identity, records the change and preserves assertions. Desktop requires Windows plus a built worker; GitHub-hosted headless runners cannot control an interactive Windows desktop.';
export function createMcpServer(workspace = new Workspace()) {
  const server = new McpServer({ name: 'testweave-mcp', version: VERSION });
  const sessions = new Map<string, Driver>();
  const jobs = new Map<string, { status: string; directory?: string; summary?: unknown; error?: string }>();
  let tail: Promise<unknown> = Promise.resolve();
  function enqueue<T>(fn: () => Promise<T>): Promise<T> { const next = tail.then(fn); tail = next.catch(() => {}); return next; }
  function session(id: string) { const driver = sessions.get(id); if (!driver) throw new Error('Unknown or closed session: ' + id); return driver; }
  function tool<S extends z.ZodType>(name: string, description: string, schema: S, handler: (args: z.infer<S>) => Promise<unknown>, readOnly = false) {
    server.registerTool(name, { description, inputSchema: schema as any, annotations: { readOnlyHint: readOnly, destructiveHint: !readOnly, openWorldHint: true } }, async (args: any) => {
      try {
        const value = await handler(schema.parse(args));
        const structuredContent = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : { result: value };
        return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }], structuredContent };
      } catch (error) { return { isError: true, content: [{ type: 'text' as const, text: error instanceof Error ? error.message : String(error) }] }; }
    });
  }
  const idSchema = z.object({ sessionId: z.string() }).strict();
  tool('doctor', 'Check platform capabilities and workspace. Does not install or launch anything.', z.object({}).strict(), async () => {
    return { ...diagnose(workspace), guide };
  }, true);
  tool('session_start', 'Launch web/Electron/desktop or attach to a CDP endpoint/native PID. Runs on this machine. Desktop actions are serialized.', z.object({ target: targetSchema }).strict(), async ({ target }) => enqueue(async () => {
    if (sessions.size >= 5) throw new Error('Close an existing session before opening another (maximum 5)');
    const driver = createDriver(target);
    try {
      await driver.start();
      const snapshot = await driver.snapshot(), sessionId = randomUUID();
      sessions.set(sessionId, driver);
      return { sessionId, kind: target.kind, snapshot };
    } catch (error) { await driver.close().catch(() => {}); throw error; }
  }));
  tool('session_list', 'List sessions owned by this MCP process.', z.object({}).strict(), async () => ({ sessions: [...sessions].map(([sessionId,driver])=>({sessionId,kind:driver.kind})) }), true);
  tool('session_close', 'Close an owned session; native attached applications stay open.', idSchema, async ({ sessionId }) => enqueue(async () => {
    await session(sessionId).close(); sessions.delete(sessionId); return { closed: true };
  }));
  tool('ui_snapshot', 'Read the real accessible controls, IDs, labels and windows. Bounded tree; truncated indicates omitted controls.', idSchema.extend({ depth: z.number().int().min(1).max(32).default(8), maxNodes: z.number().int().min(1).max(5000).default(500) }), async ({ sessionId, depth, maxNodes }) => enqueue(() => session(sessionId).snapshot(depth, maxNodes)), true);
  tool('ui_action', 'Perform a typed action or assertion. Use exact selectors from a live snapshot; ambiguous targets fail.', idSchema.extend({ step: stepSchema }), async ({ sessionId, step }) => enqueue(async () => {
    if (step.action === 'screenshot') throw new Error('Use ui_screenshot for evidence capture');
    return session(sessionId).act(step);
  }));
  tool('ui_screenshot', 'Capture the active target to a PNG inside the workspace.', idSchema.extend({ path: z.string().default('.testweave/session.png') }), async ({ sessionId, path }) => enqueue(async () => {
    if (!path.endsWith('.png')) throw new Error('Screenshot path must end in .png');
    await workspace.write(path, ''); await session(sessionId).screenshot(await workspace.safe(path)); return { path: workspace.path(path) };
  }));
  tool('ui_menus', 'Discover real menus and nested entries. Electron reads Menu API; native uses bounded UIA ExpandCollapse without invoking leaf commands. Web reads currently exposed menu roles.', idSchema.extend({ depth: z.number().int().min(1).max(12).default(6) }), async ({ sessionId, depth }) => enqueue(() => session(sessionId).menus(depth)));
  tool('plan_create', 'Persist a requirement-traced test plan authored by the MCP host/model, optionally with live observation evidence. Supply concrete preconditions, steps and expected outcomes.', planInputSchema.extend({ sessionId: z.string().optional() }), async (args) => enqueue(async () => {
    const { sessionId, ...plan } = args;
    return createPlan(plan, workspace, sessionId ? await session(sessionId).snapshot() : undefined);
  }));
  tool('test_generate', 'Validate and write an executable JSON suite plus a portable .test.mjs runner from host/model-authored cases. Explicit assertions are required to verify behavior.', z.object({ suite: suiteSchema, path: z.string().default('tests/generated.suite.json') }).strict(), async ({ suite, path }) => generateSuite(suite, path, workspace));
  tool('test_run', 'Queue a saved suite or inline suite for sequential execution. Returns immediately with jobId; poll test_status. Each case gets a fresh session. Writes screenshots, traces and summary/detailed HTML.', z.object({ path: z.string().optional(), suite: suiteSchema.optional() }).strict().refine(v => Boolean(v.path) !== Boolean(v.suite), 'Supply exactly one of path or suite'), async ({ path, suite }) => {
    const input = suite || suiteSchema.parse(JSON.parse(await workspace.read(path!)));
    const jobId = randomUUID(); const job: { status: string; directory?: string; summary?: unknown; error?: string } = { status: 'queued' };
    jobs.set(jobId, job);
    void enqueue(async () => {
      job.status = 'running';
      try { const out = await runSuite(input, workspace); Object.assign(job, { status: out.result.status, directory: out.directory, summary: out.result.summary }); }
      catch (error) { job.status = 'error'; job.error = String(error); }
    });
    return { jobId, status: job.status, next: 'Call test_status with this jobId' };
  });
  tool('test_status', 'Read a queued/running/finished test job, including report directory.', z.object({ jobId: z.string() }).strict(), async ({ jobId }) => {
    const job = jobs.get(jobId); if (!job) throw new Error('Unknown job ID; jobs belong to this MCP process'); return { jobId, ...job };
  }, true);
  tool('report_get', 'Read the latest run or a specified report directory. Returns truthful summary and links to offline HTML and raw results.', z.object({ directory: z.string().optional() }).strict(), async ({ directory }) => {
    if (!directory) directory = JSON.parse(await workspace.read('.testweave/latest.json')).directory;
    const path = directory!;
    const data = JSON.parse(await workspace.read(path + '/results.json'));
    return { id: data.id, status: data.status, summary: data.summary, summaryHtml: workspace.path(path + '/index.html'), detailedHtml: workspace.path(path + '/detailed.html'), resultsJson: workspace.path(path + '/results.json') };
  }, true);
  tool('heal_suggest', 'Propose selector repairs using exact accessible identities in a real snapshot. Does not execute or modify anything; ambiguous/fuzzy identity yields no automatic repair.', idSchema.extend({ locator: locatorSchema }), async ({ sessionId, locator }) => enqueue(async () => ({ candidates: suggestHealing(locator, await session(sessionId).snapshot()), policy: 'Review candidates. Only unique exact identities can be retried. Assertions are never weakened.' })), true);
  tool('heal_apply', 'Preview or persist a locator-only patch in a suite, with a backup and audit log. Cannot modify assertion steps or expected values. Rerun the patched suite to verify.', z.object({ path: z.string(), testId: z.string(), stepIndex: z.number().int().min(0), locator: locatorSchema, apply: z.boolean().default(false) }).strict(), async ({ path, testId, stepIndex, locator, apply }) => {
    const suite = suiteSchema.parse(JSON.parse(await workspace.read(path)));
    const test = suite.tests.find(t=>t.id===testId), step = test?.steps[stepIndex];
    if (!step?.locator) throw new Error('Step not found or has no locator');
    if (step.action.startsWith('assert')) throw new Error('Assertion steps cannot be patched by heal_apply');
    const patch = { testId, stepIndex, original: step.locator, proposed: locator, at: new Date().toISOString(), verified: false };
    if (apply) {
      const backup = path + '.before-heal-' + Date.now() + '.json';
      await workspace.write(backup, JSON.stringify(suite,null,2));
      step.locator = locator;
      await generateSuite(suite,path,workspace);
      await workspace.write(path + '.heal-' + Date.now() + '.json', JSON.stringify(patch,null,2));
      return { applied: true, backup, patch, next: 'Run the suite to verify the patch' };
    }
    return { applied: false, patch };
  });
  server.registerResource('workflow-guide', 'testweave://guide', { mimeType: 'text/plain', description: 'Capabilities, workflow and evidence policy' }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/plain', text: guide }] }));
  const prompts: Record<string,string> = {
    'test-planner': 'Inspect the target using session_start, ui_snapshot and ui_menus. Turn the user goal into positive, negative, boundary and recovery scenarios with explicit expected outcomes and R01-style requirement IDs. Call plan_create with concrete steps and observed evidence. Ask about unknown business rules instead of inventing them.',
    'test-generator': 'Read the test plan and inspect real controls. Create a schemaVersion 1 suite with unique case IDs, precise semantic selectors, requirements and explicit assertions. Call test_generate. Then call test_run and poll test_status. Inspect report_get. Do not report a test passed unless the runner says it passed.',
    'test-healer': 'Inspect failed results, errors, screenshots and the live UI. Use heal_suggest. Preserve test intent and all assertions. Preview a locator patch with heal_apply; apply only a supported locator repair, then rerun. Report unresolved application defects and ambiguous targets honestly.'
  };
  for (const [name,text] of Object.entries(prompts)) server.registerPrompt(name, { description: text }, async () => ({ messages: [{ role: 'user' as const, content: { type: 'text' as const, text } }] }));
  return { server, close: async () => { await tail; for (const driver of sessions.values()) await driver.close().catch(() => {}); sessions.clear(); } };
}

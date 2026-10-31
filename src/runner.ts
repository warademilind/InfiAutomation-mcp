import { loadPlan } from './planning.js';
import { validateTraceability, writeTraceability } from './traceability.js';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { suiteSchema, type CaseResult, type RunResult, type Suite, type StepResult } from './schema.js';
import { Workspace } from './workspace.js';
import { createDriver } from './drivers/index.js';
import type { Driver } from './drivers/types.js';
import { suggestHealing } from './healing.js';
import { renderReport } from './report.js';
const require = createRequire(import.meta.url);
export async function runSuite(input: unknown, workspace = new Workspace(), factory: (target: Suite['target']) => Driver = createDriver): Promise<{ result: RunResult; directory: string }> {
  const suite = suiteSchema.parse(input), start = Date.now();
  const plan=suite.planPath?await loadPlan(suite.planPath,workspace):undefined;
  if(plan)validateTraceability(plan,suite);
  const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + randomUUID().slice(0, 8);
  const directory = '.infiautomation/runs/' + id;
  await mkdir(await workspace.safe(directory), { recursive: true });
  const result: RunResult = { schemaVersion: 1, id, name: suite.name, target: suite.target.kind, startedAt: new Date().toISOString(), durationMs: 0, status: 'passed', summary: { total: suite.tests.length, passed: 0, failed: 0, healed: 0, skipped: 0 }, tests: [], environment: { platform: process.platform + '-' + process.arch, node: process.version, playwright: require('playwright/package.json').version } };
  for (const test of suite.tests) {
    const begun = Date.now(), driver = factory(suite.target.kind==='web'&&!suite.target.cwd?{...suite.target,cwd:workspace.root}:suite.target);
    const record: CaseResult = { requirements: test.requirements, id: test.id, name: test.name, tags: test.tags, status: 'passed', durationMs: 0, steps: [] };
    result.tests.push(record);
    let trace = false;
    try {
      await driver.start();
      if (suite.target.kind !== 'desktop') { await driver.traceStart(); trace = true; }
      for (let i = 0; i < test.steps.length; i++) {
        const step = test.steps[i], stepStart = Date.now();
        const row: StepResult = { name: step.name, action: step.action, status: 'passed', durationMs: 0 };
        record.steps.push(row);
        if (record.status === 'failed') { row.status = 'skipped'; continue; }
        try {
          if (step.action !== 'screenshot') {
            try { row.actual = await driver.act(step); }
            catch (error) {
              if (suite.healing !== 'semantic' || !step.locator || (error as { code?: string }).code !== 'LOCATOR_NOT_FOUND' || step.action.startsWith('assert')) throw error;
              const candidates = suggestHealing(step.locator, await driver.snapshot());
              if (candidates.length !== 1) throw error;
              row.healing = candidates[0];
              row.actual = await driver.act({ ...step, locator: row.healing.proposed });
              row.healing.applied = true; row.status = 'healed';
            }
          }
          const screenshot = test.id + '-step-' + (i + 1) + '.png';
          await driver.screenshot(await workspace.safe(directory + '/' + screenshot));
          row.screenshot = screenshot;
          if (row.status === 'healed') record.status = 'healed';
        } catch (error) {
          row.status = 'failed'; row.error = error instanceof Error ? error.message : String(error);
          record.status = 'failed';
          const screenshot = test.id + '-step-' + (i + 1) + '-failure.png';
          try { await driver.screenshot(await workspace.safe(directory + '/' + screenshot)); row.screenshot = screenshot; } catch { /* original error remains */ }
          try { await workspace.write(directory + '/' + test.id + '-failure-snapshot.json', JSON.stringify(await driver.snapshot(), null, 2)); } catch { /* original error remains */ }
        } finally { row.durationMs = Date.now() - stepStart; }
      }
    } catch (error) {
      record.status = 'failed'; record.error = 'Setup failed: ' + (error instanceof Error ? error.message : String(error));
      record.steps.push({ name: 'Session setup', action: 'setup', status: 'failed', durationMs: Date.now() - begun, error: record.error });
      for (const step of test.steps) record.steps.push({ name: step.name, action: step.action, status: 'skipped', durationMs: 0 });
    } finally {
      if (trace) {
        const name = test.id + '-trace.zip';
        try { await driver.traceStop(await workspace.safe(directory + '/' + name)); record.trace = name; }
        catch (error) { record.status = 'failed'; record.error = 'Trace finalization failed: ' + String(error); }
      }
      try { await driver.close(); }
      catch (error) { record.status = 'failed'; record.error = 'Session teardown failed: ' + String(error); }
      record.durationMs = Date.now() - begun;
      result.summary[record.status]++;
    }
    // Checkpoint JSON allows users to inspect interrupted runs.
    await workspace.write(directory + '/results.partial.json', JSON.stringify(result, null, 2));
  }
  result.durationMs = Date.now() - start;
  result.status = result.summary.failed ? 'failed' : result.summary.healed ? 'healed' : 'passed';
  if(plan){const coverage=await writeTraceability(plan,suite,workspace,directory,result);result.traceability={planPath:suite.planPath!,total:coverage.summary.total,unmapped:coverage.summary.unmapped};}
  await workspace.write(directory + '/results.json', JSON.stringify(result, null, 2));
  await workspace.write(directory + '/index.html', renderReport(result));
  await workspace.write(directory + '/detailed.html', renderReport(result, true));
  await workspace.write('.infiautomation/latest.json', JSON.stringify({ id, directory, summary: result.summary, status: result.status }, null, 2));
  return { result, directory: workspace.path(directory) };
}

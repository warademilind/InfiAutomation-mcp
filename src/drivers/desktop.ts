import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createInterface } from 'node:readline';
import { access } from 'node:fs/promises';
import { nativeWorkerPath, isDll } from '../runtime.js';
import type { Snapshot, Step, Target } from '../schema.js';
import type { Driver } from './types.js';
export class DesktopDriver implements Driver {
  readonly kind = 'desktop' as const;
  private child?: ChildProcessWithoutNullStreams;
  private pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void; timer: NodeJS.Timeout }>();
  private serial = 0;
  private diagnostics = '';
  private pid?: number;
  private owned = false;
  private windowTitle?: string;
  constructor(readonly target: Target) { this.pid = target.pid; this.windowTitle = target.windowTitle; }
  private async request(command: string, args: Record<string, unknown> = {}): Promise<any> {
    if (!this.child || this.child.exitCode !== null || this.child.killed) throw new Error('Desktop worker is not running: ' + this.diagnostics);
    const id = ++this.serial;
    return new Promise((resolvePromise, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error('Desktop worker timed out: ' + command + '. ' + this.diagnostics)); this.child?.kill(); }, command === 'start' ? Math.max(60000, this.target.timeoutMs + 5000) : this.target.timeoutMs + 5000);
      this.pending.set(id, { resolve: resolvePromise, reject, timer });
      this.child!.stdin.write(JSON.stringify({ id, command, pid: this.pid, windowTitle: this.windowTitle, timeoutMs: this.target.timeoutMs, ...args }) + '\n');
    });
  }
  async start() {
    if (process.platform !== 'win32') throw new Error('Native desktop automation requires Windows and an unlocked interactive desktop. Web/Electron work on supported Playwright platforms.');
    const worker = nativeWorkerPath();
    try { await access(worker); } catch { throw new Error('Desktop worker missing. Run the same TestWeave launcher with: setup --desktop --skip-browser. Install .NET 8 Windows Desktop Runtime, or build from source with npm run build:native.'); }
    const command = isDll(worker) ? (process.env.TESTWEAVE_DOTNET || 'dotnet') : worker;
    this.child = spawn(command, isDll(worker) ? [worker] : [], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    let errors = '';
    this.child.stderr.on('data', chunk => { errors = (errors + chunk.toString()).slice(-4000); this.diagnostics = errors; });
    createInterface({ input: this.child.stdout }).on('line', line => {
      try {
        const data = JSON.parse(line), item = this.pending.get(data.id);
        if (!item) return;
        clearTimeout(item.timer); this.pending.delete(data.id);
        if (data.ok) item.resolve(data.data);
        else { const error = Object.assign(new Error(data.error || 'Desktop request failed'), { code: data.code }); item.reject(error); }
      } catch { /* non-protocol diagnostics must not reach MCP stdout */ }
    });
    const rejectAll = (error: Error) => { for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(error); } this.pending.clear(); };
    this.child.on('error', rejectAll);
    this.child.on('exit', code => rejectAll(new Error('Desktop worker exited (' + code + '): ' + errors)));
    const data = await this.request('start', { executable: this.target.executable, args: this.target.args, cwd: this.target.cwd });
    this.pid = data.pid; this.owned = data.owned;
  }
  async snapshot(depth = 8, maxNodes = 500): Promise<Snapshot> { return this.request('snapshot', { depth, maxNodes }); }
  async act(step: Step): Promise<unknown> {
    if (step.action === 'selectWindow') { this.windowTitle = String(step.value); return this.request('focusWindow'); }
    return this.request('action', { step });
  }
  async screenshot(path: string) { await this.request('screenshot', { path }); }
  async menus(depth = 6) { return this.request('menus', { depth, maxNodes: 1500 }); }
  async traceStart() {}
  async traceStop(_path: string) {}
  async close() {
    if (!this.child) return;
    try { if (!this.child.killed && this.child.exitCode === null) await this.request('close', { owned: this.owned }); } finally { this.child.stdin.end(); this.child.kill(); this.child = undefined; }
  }
}

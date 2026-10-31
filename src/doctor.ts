import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { nativeWorkerPath, isDll, VERSION } from './runtime.js';
import { chromium } from 'playwright';
import { Workspace } from './workspace.js';
export function diagnose(workspace = new Workspace()) {
  const nativePath = nativeWorkerPath();
  const dotnet = spawnSync(process.env.TESTWEAVE_DOTNET || 'dotnet', ['--list-runtimes'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  const runtimes = dotnet.stdout || '';
  const desktopRuntime = /Microsoft.WindowsDesktop.App 8\./.test(runtimes);
  const nativeWorkerInstalled = existsSync(nativePath);
  return { version: VERSION, node: process.version, runtimeSupported: Number(process.versions.node.split('.')[0]) >= 24, platform: process.platform, workspace: workspace.root, chromiumInstalled: existsSync(chromium.executablePath()), nativeWorkerInstalled, nativeWorkerPath: nativePath, dotnetDesktopRuntime8: desktopRuntime, desktopAvailable: process.platform === 'win32' && nativeWorkerInstalled && (!isDll(nativePath) || desktopRuntime), web: true, electron: true };
}

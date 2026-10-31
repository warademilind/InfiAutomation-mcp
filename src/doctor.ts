import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { Workspace } from './workspace.js';
export function diagnose(workspace = new Workspace()) {
  const nativePath = process.env.TESTWEAVE_NATIVE_WORKER || fileURLToPath(new URL('../native/publish/TestWeave.Native.dll', import.meta.url));
  const dotnet = spawnSync(process.env.TESTWEAVE_DOTNET || 'dotnet', ['--list-runtimes'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  const runtimes = dotnet.stdout || '';
  const desktopRuntime = /Microsoft.WindowsDesktop.App 8\./.test(runtimes);
  const nativeWorkerInstalled = existsSync(nativePath);
  return { version: '0.1.0', node: process.version, runtimeSupported: Number(process.versions.node.split('.')[0]) >= 24, platform: process.platform, workspace: workspace.root, chromiumInstalled: existsSync(chromium.executablePath()), nativeWorkerInstalled, dotnetDesktopRuntime8: desktopRuntime, desktopAvailable: process.platform === 'win32' && nativeWorkerInstalled && (nativePath.endsWith('.exe') || desktopRuntime), web: true, electron: true };
}

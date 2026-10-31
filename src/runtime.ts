import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = fileURLToPath(new URL('../', import.meta.url));
export const VERSION: string = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;
export function cacheDirectory(env: NodeJS.ProcessEnv = process.env): string {
  if (env.TESTWEAVE_CACHE_DIR) return resolve(env.TESTWEAVE_CACHE_DIR);
  const base = process.platform === 'win32' ? env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local') : env.XDG_CACHE_HOME || join(homedir(), '.cache');
  return join(base, 'testweave-mcp');
}
export function cachedNativeWorker(env: NodeJS.ProcessEnv = process.env): string {
  return join(cacheDirectory(env), VERSION, 'native', 'TestWeave.Native.dll');
}
export function nativeWorkerPath(env: NodeJS.ProcessEnv = process.env): string {
  if (env.TESTWEAVE_NATIVE_WORKER) return resolve(env.TESTWEAVE_NATIVE_WORKER);
  const built = join(PACKAGE_ROOT, 'native', 'publish', 'TestWeave.Native.dll');
  return existsSync(built) ? built : cachedNativeWorker(env);
}
export function isDll(path: string) { return path.toLowerCase().endsWith('.dll'); }
export function parseCli(argv: string[]): { command?: string; args: string[]; workspace?: string } {
  const args: string[] = []; let workspace: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--workspace') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error('--workspace requires a directory');
      workspace = resolve(value);
    } else if (arg.startsWith('--workspace=')) {
      const value = arg.slice('--workspace='.length);
      if (!value) throw new Error('--workspace requires a directory');
      workspace = resolve(value);
    } else args.push(arg);
  }
  return { command: args[0], args: args.slice(1), workspace };
}
export function systemWorkingDirectory(cwd: string, env: NodeJS.ProcessEnv = process.env): boolean {
  const current = resolve(cwd).toLowerCase();
  if (dirname(current) === current) return true;
  return [env.SystemRoot, env.WINDIR, env.ProgramFiles, env['ProgramFiles(x86)']].some(base => {
    if (!base) return false;
    const path = resolve(base).toLowerCase();
    return current === path || current.startsWith(path + (process.platform === 'win32' ? '\\' : '/'));
  });
}

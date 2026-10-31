import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { writeFile, mkdir, mkdtemp, rename, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { VERSION, cacheDirectory, cachedNativeWorker, nativeReleaseAsset } from './runtime.js';

export function checksumFromManifest(manifest: string, name: string): string {
  const matches = manifest.split(/\r?\n/).map(line => /^([a-fA-F0-9]{64})\s+\*?(.+)$/.exec(line.trim())).filter((m): m is RegExpExecArray => Boolean(m && m[2] === name));
  if (matches.length !== 1) throw new Error('Checksum manifest must contain exactly one SHA-256 for ' + name);
  return matches[0][1].toLowerCase();
}
export function verifyChecksum(bytes: Uint8Array, expected: string): void {
  if (!/^[a-f0-9]{64}$/i.test(expected) || createHash('sha256').update(bytes).digest('hex') !== expected.toLowerCase()) throw new Error('Native worker checksum mismatch; the archive was not extracted');
}
async function download(url: string, limit: number): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error('Download failed (' + response.status + '): ' + url);
  if (Number(response.headers.get('content-length') || 0) > limit) throw new Error('Download exceeds expected size limit');
  if (!response.body) throw new Error('Download has no body');
  const chunks: Uint8Array[] = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > limit) throw new Error('Download exceeds expected size limit');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
export async function runSetupProcess(command: string, args: string[], env = process.env): Promise<void> {
  await new Promise<void>((done, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'inherit', 'inherit'], windowsHide: true, env });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? done() : reject(new Error('Setup command failed (' + (signal || code) + '): ' + command)));
  });
}
export async function installNativeWorker(): Promise<string> {
  const asset = nativeReleaseAsset();
  const worker = cachedNativeWorker();
  const destination = dirname(worker);
  try { await access(worker); await access(join(destination, 'InfiAutomation.Native.runtimeconfig.json')); return worker; } catch {}
  const base = 'https://github.com/warademilind/InfiAutomation-mcp/releases/download/v' + VERSION + '/';
  console.error('Downloading InfiAutomation Windows worker v' + VERSION + '...');
  const manifest = (await download(base + 'SHA256SUMS.txt', 64 * 1024)).toString('utf8');
  const bytes = await download(base + asset, 32 * 1024 * 1024);
  verifyChecksum(bytes, checksumFromManifest(manifest, asset));
  await mkdir(join(cacheDirectory(), VERSION), { recursive: true });
  const staging = await mkdtemp(join(cacheDirectory(), VERSION, '.native-setup-'));
  const archive = join(staging, asset), extracted = join(staging, 'content');
  await writeFile(archive, bytes);
  await mkdir(extracted);
  const script = 'Expand-Archive -LiteralPath $env:INFIAUTOMATION_SETUP_ARCHIVE -DestinationPath $env:INFIAUTOMATION_SETUP_DESTINATION -Force';
  await runSetupProcess('powershell.exe', ['-NoLogo','-NoProfile','-NonInteractive','-Command',script], { ...process.env, INFIAUTOMATION_SETUP_ARCHIVE: archive, INFIAUTOMATION_SETUP_DESTINATION: extracted });
  await access(join(extracted, 'InfiAutomation.Native.dll'));
  await access(join(extracted, 'InfiAutomation.Native.runtimeconfig.json'));
  try { await rename(extracted, destination); }
  catch (error) {
    // Concurrent setup may already have installed this exact version.
    try { await access(worker); await access(join(destination, 'InfiAutomation.Native.runtimeconfig.json')); }
    catch { throw error; }
  }
  await writeFile(join(destination, 'installation.json'), JSON.stringify({ version: VERSION, sha256: checksumFromManifest(manifest, asset), source: base + asset }, null, 2));
  return worker;
}
export async function setup(args: string[]): Promise<void> {
  const allowed = new Set(['--desktop','--skip-browser','--with-deps']);
  for (const arg of args) if (!allowed.has(arg)) throw new Error('Unknown setup option: ' + arg);
  if (args.includes('--desktop')) nativeReleaseAsset();
  if (args.includes('--skip-browser') && args.includes('--with-deps')) throw new Error('--with-deps cannot be combined with --skip-browser');
  if (!args.includes('--skip-browser')) {
    const require = createRequire(import.meta.url);
    const cli = join(dirname(require.resolve('playwright/package.json')), 'cli.js');
    await runSetupProcess(process.execPath, [cli, 'install', ...(args.includes('--with-deps') ? ['--with-deps'] : []), 'chromium']);
  }
  let nativeWorker: string | undefined;
  if (args.includes('--desktop')) nativeWorker = await installNativeWorker();
  console.log(JSON.stringify({ version: VERSION, setup: 'complete', ...(nativeWorker ? { nativeWorker, requirement: '.NET 8 Windows Desktop Runtime and an unlocked Windows desktop' } : {}), next: 'Start your MCP client, then call doctor' }, null, 2));
}

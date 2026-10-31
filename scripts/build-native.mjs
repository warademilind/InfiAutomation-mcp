import { spawnSync } from 'node:child_process';
import { existsSync, copyFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
if (process.platform !== 'win32') { console.error('Build the Windows worker on Windows. Web/Electron do not require it.'); process.exit(1); }
const local = resolve(root, '.tools/dotnet/dotnet.exe');
const dotnet = process.env.INFIAUTOMATION_DOTNET || (existsSync(local) ? local : 'dotnet');
const rid = process.env.INFIAUTOMATION_NATIVE_RID || (process.arch === 'arm64' ? 'win-arm64' : 'win-x64');
const run = spawnSync(dotnet, ['publish', resolve(root, 'native/InfiAutomation.Native/InfiAutomation.Native.csproj'), '-c', 'Release', '-r', rid, '--self-contained', 'false', '-p:UseAppHost=false', '-o', resolve(root, 'native/publish')], { stdio: 'inherit', windowsHide: true });
if (run.error) console.error(run.error.message);
if (run.status === 0) {
  for (const name of ['LICENSE','THIRD_PARTY_NOTICES.md']) copyFileSync(resolve(root,name),resolve(root,'native/publish',name));
  for (const name of readdirSync(resolve(root,'native/licenses'))) copyFileSync(resolve(root,'native/licenses',name),resolve(root,'native/publish',name));
}
process.exit(run.status ?? 1);

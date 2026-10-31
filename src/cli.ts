#!/usr/bin/env node
import { access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createMcpServer } from './server.js';
import { runSuite } from './runner.js';
import { Workspace } from './workspace.js';
import { diagnose } from './doctor.js';
import { VERSION, parseCli, systemWorkingDirectory } from './runtime.js';
import { setup } from './setup.js';

async function launchWorkspace(create: boolean, requestedWorkspace?: string): Promise<Workspace> {
  let root = requestedWorkspace || process.env.INFIAUTOMATION_WORKSPACE || process.cwd();
  const explicit = Boolean(requestedWorkspace || process.env.INFIAUTOMATION_WORKSPACE);
  if (!explicit) {
    try {
      if (systemWorkingDirectory(root)) throw new Error('System working directory');
      await access(root, constants.W_OK);
    } catch { root = resolve(homedir(), 'InfiAutomation'); }
  }
  root = resolve(root);
  if (create) { await mkdir(root, { recursive: true }); await access(root, constants.W_OK); }
  process.env.INFIAUTOMATION_WORKSPACE = root;
  return new Workspace(root);
}
async function main() {
  const { command, args, workspace: requestedWorkspace } = parseCli(process.argv.slice(2));
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('InfiAutomation requires Node.js 24 or newer. Upgrade Node.js so npx and your MCP client use the supported runtime.');
  if (command === '--help' || command === 'help') {
    console.log('InfiAutomation MCP '+VERSION+'\n\n  infiautomation-mcp                              Start stdio MCP server\n  infiautomation-mcp --workspace <directory>       Choose test workspace\n  infiautomation-mcp setup                        Install matching Chromium\n  infiautomation-mcp setup --desktop              Also cache verified Windows x64/ARM64 worker\n  infiautomation-mcp setup --with-deps          Install Chromium with Linux OS dependencies\n  infiautomation-mcp setup --desktop --skip-browser\n  infiautomation-mcp run <suite.json>              Run suite and generate offline HTML\n  infiautomation-mcp doctor                       Check prerequisites\n  infiautomation-mcp --version\n\nDesktop runtime: .NET 8 Windows Desktop Runtime + unlocked Windows desktop.\nMCP startup never installs software or writes diagnostics to stdout.');
    return;
  }
  if (command === '--version') { console.log(VERSION); return; }
  if (command === 'setup') { await setup(args); return; }
  if (command && !['serve','run','doctor'].includes(command)) throw new Error('Unknown command: ' + command);
  const workspace = await launchWorkspace(command !== 'doctor', requestedWorkspace);
  if (command === 'run') {
    if (!args[0]) throw new Error('Usage: infiautomation-mcp run <suite.json>');
    const suite = JSON.parse(await workspace.read(args[0]));
    const { result, directory } = await runSuite(suite,workspace);
    console.log(JSON.stringify({ status: result.status, summary: result.summary, directory },null,2));
    process.exitCode = result.status === 'failed' ? 1 : 0; return;
  }
  if (command === 'doctor') { console.log(JSON.stringify(diagnose(workspace),null,2)); return; }
  const instance = createMcpServer(workspace);
  const shutdown = async () => { await instance.close(); process.exit(0); };
  process.once('SIGINT',shutdown); process.once('SIGTERM',shutdown);
  process.stdin.once('end', () => { void instance.close().finally(()=>process.exit(0)); });
  serveStdio(() => instance.server);
}
main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });

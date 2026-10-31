#!/usr/bin/env node
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createMcpServer } from './server.js';
import { runSuite } from './runner.js';
import { Workspace } from './workspace.js';
import { diagnose } from './doctor.js';
const [command, ...args] = process.argv.slice(2);
async function main() {
  if (command === '--help' || command === 'help') {
    console.log('TestWeave MCP 0.1.0\n\n  testweave-mcp                   Start stdio MCP server\n  testweave-mcp run <suite.json>   Run a suite and generate offline HTML\n  testweave-mcp doctor             Check prerequisites\n  testweave-mcp --version\n\nSet TESTWEAVE_WORKSPACE to choose where plans, suites and reports are written.\nWindows native: npm run build:native');
    return;
  }
  if (command === '--version') { console.log('0.1.0'); return; }
  if (command === 'run') {
    if (!args[0]) throw new Error('Usage: testweave-mcp run <suite.json>');
    const workspace = new Workspace();
    const suite = JSON.parse(await workspace.read(args[0]));
    const { result, directory } = await runSuite(suite,workspace);
    console.log(JSON.stringify({ status: result.status, summary: result.summary, directory },null,2));
    process.exitCode = result.status === 'failed' ? 1 : 0; return;
  }
  if (command === 'doctor') {
    console.log(JSON.stringify(diagnose(),null,2)); return;
  }
  if (command && command !== 'serve') throw new Error('Unknown command: ' + command);
  const instance = createMcpServer();
  const shutdown = async () => { await instance.close(); process.exit(0); };
  process.once('SIGINT',shutdown); process.once('SIGTERM',shutdown);
  process.stdin.once('end', () => { void instance.close().finally(()=>process.exit(0)); });
  await serveStdio(() => instance.server);
}
main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });

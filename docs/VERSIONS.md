# Versions, compatibility and rollback

| Release | Purpose | Suite compatibility |
| --- | --- | --- |
| [0.5.0](https://github.com/warademilind/InfiAutomation-mcp/releases/tag/v0.5.0) | Electron/CDP compatibility, explicit window selection, native menu invocation and runtime evidence | Version 1 and version 2; new fields/tools require 0.5.0 |
| [0.4.0](https://github.com/warademilind/InfiAutomation-mcp/releases/tag/v0.4.0) | Mixed UI/API/database/UX plans, timing evidence, API catalogs and execution policy | Existing version 1 suites plus new version 2 suites |
| [0.3.2](https://github.com/warademilind/InfiAutomation-mcp/releases/tag/v0.3.2) | Stable report navigation and interactive report improvements | Version 1 |
| [0.3.1](https://github.com/warademilind/InfiAutomation-mcp/releases/tag/v0.3.1) | Earlier public release; original Calculator evidence | Version 1 |

Release tags, Git history and existing release assets are retained. No historical report is rewritten by installing a new version. Version 2 suites need 0.4.0 or newer; an older CLI will reject their schema rather than interpret them as version 1. Recorded Calculator results still identify the version that actually executed them.

## Upgrade a stable installation

Finish running jobs and fully exit your MCP client first. For the installation at C:/InfiTests:

```powershell
npm.cmd install --prefix C:/InfiTests/tools/infiautomation --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.5.0/infiautomation-mcp-0.5.0.tgz
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js --version
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js setup --desktop
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js doctor --workspace C:/InfiTests
```

Run each line only after the previous one succeeds. Omit `--desktop` unless you need Windows UIA. Restart the MCP client and call the actual doctor tool; expect 0.5.0. The stable CLI path stays the same, so its saved MCP connection usually needs no edit. npm registry publication is separate: use release URLs until the scoped package is published. See the [Electron guide](ELECTRON.md) for the new connection tools and compatibility limits.

## Keep both versions installed

Install into separate prefixes, then register distinct MCP server names or switch which one is active:

```powershell
npm.cmd install --prefix C:/InfiTests/tools/infiautomation-0.3.2 --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.3.2/infiautomation-mcp-0.3.2.tgz
npm.cmd install --prefix C:/InfiTests/tools/infiautomation-0.4.0 --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.4.0/infiautomation-mcp-0.4.0.tgz
npm.cmd install --prefix C:/InfiTests/tools/infiautomation-0.5.0 --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.5.0/infiautomation-mcp-0.5.0.tgz
```

CLI paths end in `node_modules/@infiautomation/mcp/dist/cli.js` beneath each prefix. Run that version's setup and doctor separately; native workers are cached by version. Do not run two native sessions against the same Windows desktop. Use separate workspaces if you want completely separate latest-run pointers and generated plans.

## Roll back the stable path

Fully exit the MCP client, repeat the upgrade install command with both `0.5.0` occurrences changed to `0.4.0`, run that CLI's setup/doctor, then restart the client. Existing version 1/2 suites remain supported by 0.4.0, but remove 0.5.0-only fields such as `windowUrlContains` and `menuSource` when using an older CLI. To return to 0.3.2, use version 1 suites. Existing plans/tests/reports outside the tools installation are retained. In-progress job IDs belong to their MCP process and do not survive a restart.

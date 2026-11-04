# Electron: native menu to renderer assertions

This synthetic adapter example uses the repository's Electron fixture. It verifies actual native menu effects and a form result in separate cases, with healing off. It does not claim coverage of another application's business requirements.

[Open the recorded HTML report](report/index.html) · [Detailed steps and screenshots](report/detailed.html) · [Actual result JSON](report/results.json) · [Evidence provenance](report/provenance.json). The recorded Windows x64 run passed 2/2 cases with five screenshots using Electron 45.2.1 / Chromium 156.0.8078.75. View it online at [the live Electron report](https://warademilind.github.io/InfiAutomation-mcp/examples/electron/report/), or keep this folder together and open the report locally. It is a synthetic fixture run, not a recording of your application.

To execute this repository fixture, clone the repository, open its root and run `npm ci` (builds the CLI), then `npm ci --prefix integration/fixtures/electron`. The fixture pins Electron 45.2.1. Viewing the recorded report needs no installation. Testing your own installed Electron app does not require this fixture dependency. Set these environment variables in PowerShell, using your checkout path:

```powershell
$env:ELECTRON_APP = 'C:/Projects/InfiAutomation-mcp/integration/fixtures/electron/node_modules/electron/dist/electron.exe'
$env:ELECTRON_MAIN = 'C:/Projects/InfiAutomation-mcp/integration/fixtures/electron/main.cjs'
node dist/cli.js run examples/electron/suite.json --workspace C:/Projects/InfiAutomation-mcp
```

Run from the checkout root. Linux/macOS use their Electron executable path instead of `electron.exe`; Linux CI needs a display such as Xvfb. A packaged app normally uses its installed executable with `args: []`; its title, locators and assertions must come from inspecting that app.

The suite uses schema version 2 and named targets, so an owned Electron target can be combined with web, API, database and UX steps. For cross-layer examples see [the unified E2E guide](../../docs/UNIFIED_E2E.md). To build requirement coverage, import your requirements, create a plan and use `test_generate` to link its saved JSON `planPath`; this simple adapter suite is intentionally not presented as requirement acceptance.

Open the run directory returned by the CLI: `index.html` (summary), `detailed.html` (step drill-down), screenshots and `results.json`. The Environment panel includes actual Electron and embedded Chromium versions. Keep the report directory together when sharing it.

The automated [Electron integration tests](../../integration/electron.test.ts) also exercise late secondary windows, ID-based selection, disabled menus, native checkbox state, explicit DOM menus and an actual MCP CDP connection that leaves the app running after detach. [Connection guide and troubleshooting](../../docs/ELECTRON.md).

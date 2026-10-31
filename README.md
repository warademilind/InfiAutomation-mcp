# TestWeave MCP

**One testing workflow for web, Electron, and Windows desktop applications.**

TestWeave connects an MCP-compatible AI client to real application controls, then turns a test plan into reusable tests and evidence-rich, offline HTML reports. It also runs saved suites directly from the command line.

- **Inspect:** browser accessibility snapshots, Windows UI Automation trees, multiple windows, native Electron menus, and bounded nested-menu discovery.
- **Plan and generate:** requirement-traced plans, validated JSON suites, portable JavaScript test runners, and planner/generator/healer MCP prompts.
- **Execute:** sequential cases with fresh sessions, explicit assertions, screenshots, and Playwright traces.
- **Heal with evidence:** opt-in, exact-identity selector recovery; locator-only patches with backups; no weakened assertions.
- **Report:** summary dashboard, searchable/filterable case explorer, step drill-down, evidence images, healing audit, environment details, JSON export, dark/light themes, and print layout. No CDN or report server required.

> **Scope:** Web and Electron use Playwright on its supported operating systems. Native desktop automation currently uses FlaUI on **Windows**. No framework can guarantee every app: inaccessible canvas controls, protected windows, disabled Electron inspect fuses, elevated apps, and locked desktops need app-specific setup or another adapter. Native macOS/Linux desktop apps are not supported in v0.1.

![TestWeave report showing clean passes, explicit failures, and an auditable healed case](docs/images/report-overview.png)

The verification fixture above deliberately includes one failing assertion and one healed selector to demonstrate truthful reporting.

## Quick start: npx from GitHub

Install **Node.js 24 LTS or newer**, then run this once in a terminal:

```sh
npx --yes https://github.com/warademilind/testweave-mcp/releases/download/v0.1.1/testweave-mcp-0.1.1.tgz setup
```

On **Windows x64**, add native desktop support with:

```sh
npx --yes https://github.com/warademilind/testweave-mcp/releases/download/v0.1.1/testweave-mcp-0.1.1.tgz setup --desktop
```

Desktop testing also needs the **.NET 8 Windows Desktop Runtime** and a signed-in, unlocked desktop. The setup command installs matching Chromium and caches the matching native worker from this repository's release, verifying its SHA-256 checksum before extraction. It does not install .NET or require a .NET SDK. Use `setup --desktop --skip-browser` for desktop-only testing.

### Connect an MCP client

Paste this into a client that accepts an `mcpServers` configuration:

```json
{
  "mcpServers": {
    "testweave": {
      "command": "npx",
      "args": [
        "--yes",
        "https://github.com/warademilind/testweave-mcp/releases/download/v0.1.1/testweave-mcp-0.1.1.tgz"
      ]
    }
  }
}
```

Restart or reload the client, enable TestWeave's tools, and ask it to call `doctor`. This launcher downloads a compiled release package: **no clone, Git installation, build command, or local executable path is required**. The first launch needs internet access to download the package and dependencies. MCP startup itself never installs browsers or desktop workers. This is GitHub distribution; `testweave-mcp@latest` is not published to the npm registry yet.

The same stdio server works across compatible clients; configuration file names and wrappers differ. See the ready-to-copy [general JSON](examples/mcp.npx.json), [Codex TOML](examples/codex.npx.toml), and [VS Code servers-style JSON](examples/vscode.npx.json). Newer VS Code versions that accept `.mcp.json` can use the general JSON. Source-checkout configurations remain in [mcp-clients.json](examples/mcp-clients.json).

By default, plans, suites and reports go into the client's current working directory. If it is a system folder, drive root, or unwritable, the launcher uses `~/TestWeave`. To choose a project explicitly, append `"--workspace", "/absolute/path/your-test-project"` to `args`, or set `TESTWEAVE_WORKSPACE`. On Windows JSON paths use doubled backslashes, for example `D:\\tests`. Existing suites and executable paths remain local to the machine running the MCP.

Check prerequisites at any time:

```sh
npx --yes https://github.com/warademilind/testweave-mcp/releases/download/v0.1.1/testweave-mcp-0.1.1.tgz doctor
```

### Develop from source

Install Node.js 24 and Git, then:

```sh
git clone https://github.com/warademilind/testweave-mcp.git
cd testweave-mcp
npm ci
npm run build
node dist/cli.js setup
node dist/cli.js run examples/web.suite.json
```

The source example uses a self-contained HTML fixture. Open the reported `index.html` for the summary and `detailed.html` for the test explorer. From a checkout, native source builds additionally need the **.NET 8 SDK**: run `npm run build:native`. The worker uses FlaUI 5.0.0 with pinned NuGet dependencies. For custom worker locations set `TESTWEAVE_NATIVE_WORKER` to the DLL's absolute path.

**GitHub hosts source and downloadable builds; automation runs locally beside the app under test.** Native desktop automation needs the same privilege level as its target. Attach with `pid` or a unique `windowTitle`, or launch an `executable`. Attached native applications are left open. One native session per Windows desktop is supported.

## Use it with an AI client

Ask the connected client:

> Inspect this application. Build a test plan for its project form, including validation and recovery cases. Save a reusable suite, execute it, and give me the summary and detailed HTML reports. Preserve assertions when proposing selector repairs.

The included `test-planner`, `test-generator`, and `test-healer` prompts guide the host model. Planning and generation are authored by that model and validated/persisted by TestWeave; there is no hidden LLM service, required API key, or claim that a template independently understands arbitrary business rules.

Typical sequence:

```text
session_start → ui_snapshot / ui_menus → plan_create → test_generate
                                                    ↓
                                              test_run → test_status → report_get
                                                    ↓
                                       heal_suggest → heal_apply → rerun
```

Long suites run as background jobs inside the MCP process; `test_run` returns a job ID immediately. Keep the client/server alive and poll `test_status`. CLI execution waits and exits nonzero for failed cases. Healed cases are a separate outcome.

## A test is a portable document

```json
{
  "schemaVersion": 1,
  "name": "Project form",
  "target": { "kind": "web", "url": "http://localhost:3000" },
  "healing": "off",
  "tests": [{
    "id": "project-save",
    "name": "Save a project",
    "requirements": ["R01"],
    "tags": ["smoke"],
    "steps": [
      { "name": "Name", "action": "fill", "locator": { "label": "Project name" }, "value": "Launch" },
      { "name": "Save", "action": "click", "locator": { "role": "button", "name": "Save project" } },
      { "name": "Verify", "action": "assertText", "locator": { "testId": "status" }, "value": "Saved Launch" }
    ]
  }]
}
```

For Electron, set `kind: "electron"` and `executable` plus optional `args`, or supply an existing Chromium `cdpUrl`. Native Electron menu reading requires launch mode; CDP-only connections expose renderer menus. Playwright's Electron API remains experimental.

For Windows native apps use `kind: "desktop"` and `executable`, `pid`, or `windowTitle`. Locators use `automationId`, `controlType`, `name`, and optional `windowTitle`. See [examples](examples/) and [tool/action reference](docs/API.md).

## Honest healing and honest results

Healing defaults to **off**. `semantic` mode retries only a locator that resolved to **zero controls before the action**, using a unique exact accessible name and compatible role/control type. It never retries a failed assertion, fuzzy-matches a nearby button, or blindly repeats a partially completed action. Every repair appears in the report.

`heal_apply` previews by default; `apply: true` writes a locator-only patch, backup and audit record. Assertion steps cannot be patched. A patch is unverified until the test is rerun.

Menu discovery reads actual runtime controls. It never substitutes a predefined menu list. UIA discovery expands supported submenu containers, collapses what it opened, and never invokes leaf commands. Lazy/non-accessible menus may require explicit navigation; truncated trees and discovery errors are reported.

## GitHub automation

The repository includes:

- Linux/Windows/macOS Node build and unit/protocol checks.
- Chromium and Electron fixture integration on Linux.
- Compilation of the Windows worker on a Windows runner.
- An opt-in native fixture workflow for a **self-hosted interactive Windows runner**.
- Tag-driven releases with npm-format tarball, native Windows worker, and SHA-256 checksums.

See [CI and release guide](docs/CI.md). Native UI automation is not claimed to work on GitHub-hosted unattended Windows desktops. GitHub Pages can host a deliberately sanitized report; TestWeave does not upload private test artifacts automatically.

## Develop and verify

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm ci --prefix integration/fixtures/electron
npm run test:integration:web
npm run test:integration:electron
```

On Windows with .NET 8+, build the worker and native fixture, then run `npm run test:integration:native`. See [CONTRIBUTING.md](CONTRIBUTING.md).

Reports and screenshots stay under `.testweave/` and are ignored by Git. The browser and target application can still access the network. Executable paths and actions are trusted local-user inputs; connect only a trusted MCP client. See [SECURITY.md](SECURITY.md).

## Upstream foundations

| Component | Pinned version | Source |
| --- | --- | --- |
| Playwright | 1.64.1 | [Microsoft Playwright](https://github.com/microsoft/playwright) |
| FlaUI UIA3 | 5.0.0 | [FlaUI](https://github.com/FlaUI/FlaUI) |
| MCP TypeScript server/client SDK | 2.4.0 | [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) |
| Zod | 4.6.7 | [Zod](https://github.com/colinhacks/zod) |

Versions were checked on 31 October 2026 and are locked in package/restore lockfiles. Dependencies are used through their public APIs, with upstream attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

MIT licensed. Independent project; not affiliated with Microsoft, FlaUI, or the MCP maintainers.

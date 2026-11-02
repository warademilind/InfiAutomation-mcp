# InfiAutomation MCP

**One testing workflow for web, Electron, Windows desktop, REST/SOAP APIs, database verification and automated UI/UX checks.**

InfiAutomation connects an MCP-compatible AI client to real application controls, then turns a test plan into reusable tests and evidence-rich, offline HTML reports. It also runs saved suites directly from the command line.

- **Inspect:** browser accessibility snapshots, Windows UI Automation trees, multiple windows, native Electron menus, and bounded nested-menu discovery.
- **Requirement documents:** extract PDF/Word/Markdown/text locally with source hashes and bounded chunks; preserve requirement IDs and acceptance criteria; keep ambiguities as open questions.
- **Traceability:** link a suite to its saved plan, reject unknown/untraced case references, and inspect requirement coverage with direct case drill-down.
- **Plan and generate:** requirement-traced plans, validated JSON suites, portable JavaScript test runners, and planner/generator/healer MCP prompts.
- **Execute:** sequential cases with fresh sessions, explicit assertions, screenshots, and Playwright traces.
- **Cross-layer E2E:** version 2 named targets share captures across browser/desktop, REST/SOAP and read-only database steps in one case. Existing version 1 suites keep working.
- **API documents:** import OpenAPI/Swagger, Postman v2 or WSDL as planning data; author explicit status/body/schema/negative cases from documented expectations.
- **UI/UX and timing:** axe accessibility, mobile overflow/tap targets, approved visual baselines, browser navigation/paint metrics, API elapsed time and DB connection/query time.
- **Execution policy:** preserve user do/don't notes and enforce supported method/origin/target/action restrictions, read checks, screenshot permission and redacted evidence.
- **Heal with evidence:** opt-in, exact-identity selector recovery; locator-only patches with backups; no weakened assertions.
- **Report:** summary dashboard, searchable/filterable case explorer, step drill-down, evidence images, healing audit, environment details, JSON export, dark/light themes, and print layout. No CDN or report server required.

> **Scope:** Web and Electron use Playwright on its supported operating systems. Native desktop automation currently uses FlaUI on **Windows**. No framework can guarantee every app: inaccessible canvas controls, protected windows, disabled Electron inspect fuses, elevated apps, and locked desktops need app-specific setup or another adapter. Native macOS/Linux desktop apps are not supported. Database compatibility is documented per adapter; arbitrary applications or databases are not universally guaranteed.

![InfiAutomation report showing clean passes, explicit failures, and an auditable healed case](docs/images/report-overview.png)

The verification fixture above deliberately includes one failing assertion and one healed selector to demonstrate truthful reporting.

## Start here

Follow the guides in order. All Windows examples use the generic workspace **C:/InfiTests**; choose a writable folder and update the paths if yours differs.

| Guide | What you will do |
| --- | --- |
| [Start-to-finish user guide](docs/USER_GUIDE.md) | Install prerequisites, run the demo, create plans/cases from documents, execute, heal and read reports |
| [Connect an AI client](docs/CLIENT_SETUP.md) | Copy complete Codex, Copilot/VS Code or portable MCP configurations |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Resolve certificate errors, connection resets, .NET detection, pasted commands and cached-launcher recovery |
| [Tool reference](docs/API.md) | Look up exact tool inputs, actions and locators |
| [Use the HTML reports](docs/REPORTS.md) | Navigate stable panels, search and page cases, review repairs, and expand screenshots and actual results |
| [Mixed UI/API/database/UX guide](docs/UNIFIED_E2E.md) | Run a complete synthetic example, import API documents, chain values and interpret timing evidence |
| [Database adapters](docs/DATABASES.md) | SQLite, PostgreSQL, MySQL/MariaDB, SQL Server, Oracle, MongoDB, Redis and ODBC extension path |
| [Version history and rollback](docs/VERSIONS.md) | Keep earlier releases, use both suite formats and install versions side by side |
| [Calculator: requirements to reports](examples/calculator/README.md) | Explore the original plan, nine executable cases, 53 actual screenshots, and linked summary, detailed and coverage HTML reports |

**[Open the live Calculator walkthrough](https://warademilind.github.io/InfiAutomation-mcp/examples/calculator/)** to follow requirements → plan → cases → recorded execution → screenshots and coverage. The example uses provisional UI-derived expectations, with its original plan and suite included. You can also download the repository and open `examples/calculator/index.html` offline.

**Available release: v0.4.0 from GitHub.** The npm registry package `@infiautomation/mcp` is pending first publication; `npx @infiautomation/mcp@latest` currently returns `E404`. The public GitHub package needs no Git installation, npm login, GitHub login or source build.

## Quick start on Windows

Install **Node.js 24+**. Windows native testing also needs the **.NET 8 Windows Desktop Runtime**, an unlocked interactive desktop and the same privilege level as the target. The [user guide](docs/USER_GUIDE.md#2-install-prerequisites) gives the exact runtime installation steps. Web/Electron-only users do not need that Windows worker runtime.

Run each line separately in PowerShell. The install below uses a permanent local folder, so subsequent CLI/MCP starts avoid npm/GitHub package lookups:

```powershell
node --version
New-Item -ItemType Directory -Path C:/InfiTests -Force
npm.cmd install --prefix C:/InfiTests/tools/infiautomation --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.4.0/infiautomation-mcp-0.4.0.tgz
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js --version
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js setup
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js doctor --workspace C:/InfiTests
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js init-demo --workspace C:/InfiTests
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js run infi-demo/suite.json --workspace C:/InfiTests
```

Expected: version `0.4.0`, successful setup, `chromiumInstalled: true`, then **3 passed demo cases**. Stop at a failed stage and follow [troubleshooting](docs/TROUBLESHOOTING.md). For another demo run, repeat only the final `run` command.

For Windows native support, use `setup --desktop` after installing .NET and verify all native fields in doctor. The demo above is a web fixture; test your actual native/Electron app separately.

Open the run directory printed by the runner: `index.html` is the summary, `detailed.html` provides step drill-down, and `traceability.html` shows requirement coverage. Next, [connect your AI client](docs/CLIENT_SETUP.md) and follow the [requirement-document workflow](docs/USER_GUIDE.md#8-create-a-plan-from-your-requirement-document).

Copy-ready stable local configurations: [Codex](examples/codex.local.toml), [VS Code/Copilot](examples/vscode.local.json), [portable JSON](examples/mcp.local.json). The [GitHub npx alternative](docs/CLIENT_SETUP.md#4-github-npx-alternative) remains available for clients that prefer it; npm can contact the release server on a later invocation.

For macOS/Linux, follow the [platform-specific commands](docs/USER_GUIDE.md#13-macos-and-linux). Startup does not automatically download browser/native software.
**[Run the new REST/SOAP + browser + SQLite + UX example](examples/unified-e2e/README.md)**, or [open its recorded linked report](https://warademilind.github.io/InfiAutomation-mcp/examples/unified-e2e/report/).

### Platform support and prerequisites

| Capability | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Web testing with Playwright | Yes | Yes | Yes |
| Electron renderer testing | Yes, supported Electron apps | Yes, supported Electron apps | Yes, supported Electron apps |
| Native desktop via FlaUI/UIA3 | Yes; interactive desktop | No native adapter yet | No native adapter yet |
| REST/SOAP, API catalogs, read-only database adapters | Yes; optional driver prerequisites apply | Yes; optional driver prerequisites apply | Yes; optional driver prerequisites apply |
| Browser accessibility/layout/performance/visual checks | Yes | Yes | Yes |
| Plans, suite generation, healing, HTML reports | Yes | Yes | Yes |

Use Playwright-supported operating systems and an app exposing usable controls. Native desktop testing requires the **.NET 8 Windows Desktop Runtime**, the same privilege level as the target, and a signed-in, unlocked Windows desktop. Prebuilt x64 and ARM64 workers are provided; ARM64 is cross-built and requires validation on ARM64 hardware. Setup verifies the release SHA-256 checksum before caching the worker. It does not install .NET. Building from source additionally requires the .NET 8 SDK.

Run `setup --desktop --skip-browser` for desktop-only testing. On Linux, `setup --with-deps` also asks Playwright to install OS browser dependencies and may require elevated package-manager permissions. Electron targets need their app executable/CDP endpoint and a display server where required. No automation framework can execute every app on every machine.

By default, plans, suites and reports use the client's working directory. System folders, drive roots, or unwritable folders fall back to `~/InfiAutomation`. Append `"--workspace", "/absolute/path/your-test-project"` to `args`, or set `INFIAUTOMATION_WORKSPACE` to choose a project. Windows JSON paths need doubled backslashes, such as `D:\\tests`. Run the launcher with `doctor` to inspect the effective workspace, browser installation, and desktop runtime.

### Develop from source

Install Node.js 24 and Git, then:

```sh
git clone https://github.com/warademilind/InfiAutomation-mcp.git
cd InfiAutomation-mcp
npm ci
npm run build
node dist/cli.js setup
node dist/cli.js run examples/web.suite.json
```

The source example uses a self-contained HTML fixture. Open the reported `index.html` for the summary and `detailed.html` for the test explorer. From a checkout, native source builds additionally need the **.NET 8 SDK**: run `npm run build:native`. The worker uses FlaUI 5.0.0 with pinned NuGet dependencies. For custom worker locations set `INFIAUTOMATION_NATIVE_WORKER` to the DLL's absolute path.

**GitHub hosts source and downloadable builds; automation runs locally beside the app under test.** Native desktop automation needs the same privilege level as its target. Attach with `pid` or a unique `windowTitle`, or launch an `executable`. Attached native applications are left open. One native session per Windows desktop is supported.

## Use it with an AI client

Ask the connected client:

> Inspect this application. Build a test plan for its project form, including validation and recovery cases. Save a reusable suite, execute it, and give me the summary and detailed HTML reports. Preserve assertions when proposing selector repairs.

The included `test-planner`, `test-generator`, and `test-healer` prompts guide the host model. Planning and generation are authored by that model and validated/persisted by InfiAutomation; there is no hidden LLM service, required API key, or claim that a template independently understands arbitrary business rules.

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

## Requirements and case coverage

`requirements_import` and `requirements_read` provide source text to the connected model. `plan_create` saves both Markdown and JSON, preserving original IDs, acceptance criteria, source clauses and open questions. `test_generate` accepts `planPath` (or `suite.planPath`) to validate requirement references and produce a pre-run coverage report. Linked runs add `traceability.html`/JSON; `traceability_get` returns recorded mappings and outcomes. A mapped or passed case does not prove every acceptance criterion is covered. Scanned PDFs need OCR outside this MCP; extraction is not semantic test generation.

![Requirement coverage with case links and explicit open questions](docs/images/requirements-coverage.png)

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

See [CI and release guide](docs/CI.md). Native UI automation is not claimed to work on GitHub-hosted unattended Windows desktops. GitHub Pages can host a deliberately sanitized report; InfiAutomation does not upload private test artifacts automatically.

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

Reports and screenshots stay under `.infiautomation/` and are ignored by Git. The browser and target application can still access the network. Executable paths and actions are trusted local-user inputs; connect only a trusted MCP client. See [SECURITY.md](SECURITY.md).

## Upstream foundations

| Component | Pinned version | Source |
| --- | --- | --- |
| Playwright | 1.64.1 | [Microsoft Playwright](https://github.com/microsoft/playwright) |
| FlaUI UIA3 | 5.0.0 | [FlaUI](https://github.com/FlaUI/FlaUI) |
| MCP TypeScript server/client SDK | 2.4.0 | [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) |
| Zod | 4.6.7 | [Zod](https://github.com/colinhacks/zod) |

Versions were checked on 31 October 2026 and are locked in package/restore lockfiles. Dependencies are used through their public APIs, with upstream attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

MIT licensed. Independent project; not affiliated with Microsoft, FlaUI, or the MCP maintainers.

For package publication and repository review settings, see [PUBLISHING.md](docs/PUBLISHING.md).

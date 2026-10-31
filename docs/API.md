# Tool and suite reference

## MCP tools

| Tool | Input / result |
| --- | --- |
| `doctor` | Capability/platform/worker check; no installation |
| `session_start` | `{target}` → `sessionId`, live snapshot |
| `session_list` | Sessions owned by this MCP process |
| `session_close` | `sessionId`; closes owned app, preserves attached native app |
| `ui_snapshot` | `sessionId`, `depth` (1–32), `maxNodes` (1–5000) |
| `ui_action` | `sessionId`, `step` → actual action/assertion result |
| `ui_screenshot` | `sessionId`, relative `path` ending in .png |
| `ui_menus` | `sessionId`, `depth` (1–12); real menus, error/truncation metadata |
| `plan_create` | Name, goal, requirements, scenarios with R01-style references, risks, target kind, path, optional sessionId for evidence |
| `test_generate` | Validated `suite`, .json `path` → JSON and .test.mjs files |
| `test_run` | Exactly one of saved `path` or inline `suite` → background `jobId` |
| `test_status` | `jobId` → queued/running/passed/healed/failed/error, report directory |
| `report_get` | Optional `directory`; defaults to most recent run |
| `heal_suggest` | `sessionId`, `locator` → exact-identity proposals, no mutation |
| `heal_apply` | Suite path, testId, zero-based stepIndex, locator, apply (default false); backup/audit on write |

Resource: `infiautomation://guide`. Prompts: `test-planner`, `test-generator`, `test-healer`.

## Target configuration

```json
{ "kind": "web", "url": "http://localhost:3000", "browser": "chromium", "headless": true, "timeoutMs": 10000 }
```

`browser`: chromium/firefox/webkit. Optional `channel` selects an installed Chromium channel such as chrome/msedge. Install the relevant browser first.

Electron: `{"kind":"electron","executable":"/path/to/app","args":[]}`, or `{"kind":"electron","cdpUrl":"http://127.0.0.1:9222"}`. The app must allow debugging; InfiAutomation does not disable its security fuses. `cwd` controls launch working directory.

Desktop: `{"kind":"desktop","pid":1234}`, `{"kind":"desktop","windowTitle":"Unique title"}`, or `{"kind":"desktop","executable":"C:\\path\\App.exe"}`. A Calculator launcher may delegate to a separate process; use an observed actual PID/title if automatic resolution is ambiguous.

## Locator rules

Web/Electron precedence: `css` → `testId` → `role` with exact `name` → exact `label` → exact `text`. One optional `frame` CSS selector scopes to an iframe. Open shadow DOM is supported by Playwright. A CSS locator may also carry name/role identity metadata for healing; CSS remains its original strategy.

Desktop fields are combined with exact matches: `automationId`, `controlType` (e.g. Button/Edit/Slider), `name`, `className`, and optional `windowTitle` substring selecting exactly one app window. Prefer stable automation IDs.

Ambiguous targets fail. There is no implicit first-element selection. `assertCount` intentionally accepts multiple matches. Snapshots may be bounded; use depth/maxNodes thoughtfully. Accessible names computed by the DOM helper are advisory; Playwright's role/name locator remains authoritative.

## Step actions

Every step has `name`, `action`, optional `locator`, `value`, `timeoutMs`, `contains` (false), and `menuPath`.

| Action | Web / Electron | Windows |
| --- | --- | --- |
| click, doubleClick, hover | Playwright locator | FlaUI control |
| fill | Input value | UIA ValuePattern; focused keyboard fallback |
| press | Playwright key chord | Common Control/Alt/Shift/Enter/Arrow chords |
| select | HTML option value | Native combo item text |
| check / uncheck | Checkbox | TogglePattern; state verified |
| setRange | Use fill/press on accessible slider | UIA RangeValue |
| navigate | URL, value required | Unsupported |
| selectWindow | Unique title substring among pages | Unique native window title substring |
| focusWindow | Bring current page forward | Focus current native window |
| menu | Explicit array of exact menuitem names | Explicit array of live menuitem names |
| assertText / assertValue | Retry until expected string matches | Retry UIA name/value until expected matches |
| assertVisible | Retry for visible/hidden (value false) | UIA visibility state |
| assertEnabled / assertChecked | Boolean, defaults true | Boolean, defaults true |
| assertCount | Number of locator matches | Number of locator matches |
| assertTitle | Exact or contains title | Exact or contains title |
| waitFor | Visible locator | Visible control |
| screenshot | Runner captures evidence | Runner captures visible window |

Suite validation requires at least one explicit assertion per case to verify app behavior; action success alone cannot establish a business outcome. The provided examples include explicit assertions.

## Artifacts and outcomes

`.infiautomation/runs/<run-id>/` contains `index.html`, `detailed.html`, `results.json`, partial checkpoints, step screenshots, failure snapshots, and per-case web/Electron trace ZIP files.

Cases run in order, each with a fresh session. Attached PID/CDP targets share application state; use explicit setup steps or launch mode for isolation. A failed step skips later steps in that case; later cases still execute. Setup, evidence-capture, trace-finalization and teardown failures fail the case. Clean passes and healed passes are counted separately.

This is a semantic runner, not a drop-in executor for arbitrary existing .spec.ts files. Generated .test.mjs files call the same exported runner. To run those JavaScript files directly, install `@infiautomation/mcp` in that project. With an npx-only installation, run the saved JSON suite using the launcher with `run <suite.json>` instead. Existing Playwright code can be migrated to JSON steps or run alongside InfiAutomation with Playwright's own test runner.

## Runtime configuration

- `INFIAUTOMATION_WORKSPACE`: directory containing plans, suites and reports. All file writes are confined to it, including junction/symlink checks.
- `INFIAUTOMATION_NATIVE_WORKER`: explicit worker .exe or framework-dependent .dll. Otherwise, a source build is preferred, then the version-matched worker installed by `setup --desktop`.
- `INFIAUTOMATION_CACHE_DIR`: optional setup cache root. Defaults to LocalAppData/infiautomation-mcp on Windows and XDG_CACHE_HOME/infiautomation-mcp (or ~/.cache/infiautomation-mcp) elsewhere. Native workers are isolated by package version and architecture.
- `INFIAUTOMATION_DOTNET`: dotnet executable for native builds or DLL launch.
- `INFIAUTOMATION_NATIVE_RID`: win-x64 (default) or win-arm64 for source builds.
- `INFIAUTOMATION_DEBUG_NATIVE=1`: native initialization/request diagnostics on stderr.
- `PLAYWRIGHT_BROWSERS_PATH`: standard upstream browser cache override.

MCP uses stdio only in v0.2. Do not expose its stdin/stdout over an unauthenticated network bridge.

## Launcher setup

Run `infiautomation-mcp setup` with the same launcher/package version used by the client to install matching Chromium. On Windows x64/ARM64, `setup --desktop` also downloads the matching native worker; `--skip-browser` omits Chromium. On Linux, `--with-deps` asks Playwright to install OS browser dependencies and may require elevated package-manager permissions. Setup is an explicit CLI action, never a side effect of starting the stdio server. `--workspace <directory>` and `--workspace=<directory>` override the workspace environment variable. Run `doctor` to inspect the effective workspace and available runtimes.

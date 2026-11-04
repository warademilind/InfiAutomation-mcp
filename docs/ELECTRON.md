# Electron desktop automation

InfiAutomation uses the Playwright library directly. It can launch an Electron app, attach to its Chromium renderer through CDP, or use Windows UI Automation for controls exposed to accessibility. Electron support was present before 0.5.0; 0.5.0 improves window selection, native menu invocation and runtime evidence.

**Installed Chrome does not determine Electron compatibility.** Each Electron release bundles its own Chromium and Node.js. InfiAutomation uses that running runtime rather than replacing or downgrading it. No ChromeDriver download or matching is needed.

Upstream Playwright MCP also supports a CDP endpoint for Electron renderer automation. It is browser focused; a CDP connection does not expose Electron's main process, native Menu API or OS dialogs. InfiAutomation adds an Electron launch adapter and explicit Windows UIA integration.

## Choose a connection

| Connection | What it can automate | Prerequisites | On session close |
| --- | --- | --- | --- |
| `kind: electron`, `executable` | Renderer DOM, multiple windows, screenshots, native application menu discovery and command invocation | Compatible Electron app; Playwright's experimental launch support is documented for Electron 21+; inspect fuse enabled; app launches in a display session | Closes the app it launched |
| `kind: electron`, `cdpUrl` | Exposed renderer DOM, windows, assertions, screenshots and compatible Playwright features | App already exposes an authorized, compatible Chromium DevTools endpoint | Disconnects; app and existing windows stay open |
| `kind: desktop`, PID/title/executable | Windows accessible controls, native menus/dialogs, screenshots | Windows, unlocked desktop, .NET 8 Desktop Runtime, worker, accessible controls and matching privileges | Attached app stays open; owned app closes |

CDP compatibility depends on the embedded Chromium protocol. There is no guaranteed bridge for every historical or customized Electron build. Windows UIA does not depend on Chromium protocol versions, but only works with controls the app exposes to accessibility. A canvas, inaccessible custom control or protected surface may still require app changes. Native macOS/Linux OS controls are not implemented.

## 1. Install and connect the MCP

Use Node.js 24+ and follow [client setup](CLIENT_SETUP.md). Upgrade the stable installation while your MCP client is fully closed:

```powershell
npm.cmd install --prefix C:/InfiTests/tools/infiautomation --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.5.0/infiautomation-mcp-0.5.0.tgz
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js --version
```

Expect `0.5.0`. Keep the existing stable MCP command/path, restart the client and call `doctor`. `electron: true` in doctor means the adapter is available; only a successful connection and assertions prove your app works. No separate Electron npm dependency or Chrome installation is required for a user's installed app. Playwright browser setup is needed for separate web tests; the Windows worker is needed only for UIA.

## 2. Launch a packaged Electron app

Call `session_start` with the real executable and observed main-window title. Examples use generic paths; replace the executable and title with your app's values.

```json
{
  "target": {
    "kind": "electron",
    "executable": "C:/Apps/Example/Example.exe",
    "args": [],
    "windowTitle": "Example - Workspace",
    "timeoutMs": 30000
  }
}
```

For an unpackaged development app, set `executable` to its Electron binary, `args` to `["C:/Projects/Example/main.js"]` and `cwd` to `C:/Projects/Example`. InfiAutomation removes inherited `ELECTRON_RUN_AS_NODE` from the child launch environment.

`windowTitle` is a case-sensitive substring. Optional `windowUrlContains`, for example `workspace.html`, narrows selection further; both filters must match. Startup waits for a matching renderer, so a splash window need not be selected. More than one match fails. Set stable filters rather than relying on window creation order.

After startup:

1. Save the returned `sessionId` and read its `snapshot` and `info`.
2. Call `session_info` for actual Electron/Chromium/Node/Playwright versions and capabilities.
3. Call `ui_windows` for the current windows, titles, URLs and session-local `windowId` values.
4. Call `ui_window_select` with `{ "sessionId": "<returned-id>", "windowId": "<observed-id>" }` to select one. Refresh the list if it closes; IDs do not survive a new session.
5. Use `ui_snapshot` for selectors, `ui_action` for typed actions/assertions and `ui_screenshot` for evidence.

Reusable suites can use `selectWindow` with an observed title substring; it waits and requires one match. Closed windows and duplicate titles produce errors, not implicit first-window actions.

## 3. Native menus and DOM menus

Call `ui_menus` first. A launched Electron session reads the application's native Menu API, including nested, disabled and checked items. To invoke an observed leaf command:

```json
{
  "sessionId": "<returned-id>",
  "step": {
    "name": "Export JSON",
    "action": "menu",
    "menuSource": "native",
    "menuPath": ["File", "Export", "Export JSON"]
  }
}
```

Then assert the actual output or UI result. Every label must match exactly, including any mnemonic characters. Disabled/hidden items, duplicate labels and paths ending at a submenu fail. This invokes Electron's `MenuItem.click` wrapper against the selected window; it does not physically open the OS menu or demonstrate its visual presentation. Discovery does not invoke leaf commands. Native context/tray menus outside the application menu are not enumerated by this API.

Use `menuSource: "dom"` for HTML menus, especially if their root label is also present in the native menu. The default `auto` uses the native menu when its root label matches, otherwise renderer menu roles. CDP supports DOM menus; a request for `native` returns a capability error instead of pretending the native action succeeded. Use explicit Windows UIA to test visible native menu/dialog presentation.

## 4. Attach to an already running app using CDP

The app owner must permit debugging. Start a dedicated test instance with the app's supported debugging options. For apps that honor Electron/Chromium flags, this PowerShell example exposes a loopback endpoint:

```powershell
& 'C:/Apps/Example/Example.exe' --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222
Invoke-RestMethod http://127.0.0.1:9222/json/version
```

Some apps ignore these arguments, disable debugging or forward a second launch to an existing instance. Follow their documented test/debug configuration; do not modify production binaries or disable security fuses. Keep the endpoint local and available only during testing. Use an unused port if 9222 is occupied.

Call `session_start`:

```json
{
  "target": {
    "kind": "electron",
    "cdpUrl": "http://127.0.0.1:9222",
    "windowTitle": "Example - Workspace",
    "timeoutMs": 30000
  }
}
```

An actual browser WebSocket endpoint from `webSocketDebuggerUrl` is also accepted. InfiAutomation attaches with Playwright's supported `noDefaults: true`, preserving the app's download/focus/media defaults and avoiding context-management overrides rejected by older Electron builds. It enumerates existing renderer pages across contexts and does not create a blank replacement tab. CDP reports Electron versions only if exposed in the user agent; custom user agents can hide them. `mainProcess` and `nativeElectronMenus` are false.

Inspection and schema version 1 suites support CDP. Version 2 execution deliberately requires owned sessions for its execution policy; launch an isolated Electron target when combining UI, API, DB and UX steps. An existing attached app can have requests, service workers and state outside the suite's control; attachment is not policy isolation.

## 5. Explicit Windows UIA alternative

If Electron launch/CDP is unavailable, inspect an app's accessible Windows controls:

```json
{ "target": { "kind": "desktop", "windowTitle": "Example - Workspace", "timeoutMs": 15000 } }
```

An observed PID can narrow attachment. Use `session_start` and `ui_snapshot` to discover real automation IDs/names, then create Windows UIA locators. DOM CSS/test IDs do not automatically translate to UIA. If your test app supports it, its `--force-renderer-accessibility` option may expose more controls; inspect again rather than assuming it did. This alternative is explicit, never a silent selector substitution after a failed assertion.

Both launch adapters remove inherited `ELECTRON_RUN_AS_NODE` from their child environment. This prevents VS Code/Electron hosts from accidentally starting an Electron GUI in Node mode. The Windows-specific integration check verifies this with an accessible Electron form: input, button invocation and the actual resulting text, without CDP or the Electron inspect API. Run `npm run test:integration:electron:native` with `INFIAUTOMATION_NATIVE_TEST=1` on a prepared unlocked Windows machine; the maintainer-only interactive workflow includes this check.

## 6. Create and run a test plan

Prompt your MCP host:

> Use InfiAutomation to inspect my Electron executable and select the main window by its observed title/URL. Show session_info and ui_windows. Read the complete supplied requirements with requirements_import/requirements_read. Create a requirement-linked plan and cases using observed controls and explicit expected results. Include native menu result assertions where supported. Keep healing off. Close inspection sessions, run the saved suite, poll test_status until finished, then return report_get and traceability_get results. Do not invent selectors or acceptance criteria.

See the executable [Electron example](../examples/electron/README.md) and [mixed E2E guide](UNIFIED_E2E.md). Version 2 can name owned Electron, web, native, API and database targets in the same case. Performance/layout/accessibility checks work on compatible Electron renderer pages; approved screenshot baselines remain explicit. New reports expose actual connection/runtime evidence under **Environment → Application runtimes and connection capabilities**.

## Troubleshooting

| Symptom | Check / recovery |
| --- | --- |
| Electron launch timeout | Verify actual executable, args/cwd, display session and supported Electron runtime. The `nodeCliInspect` fuse must not be disabled for Playwright launch. Use an authorized CDP connection or explicit UIA if available; the MCP does not rewrite fuses. |
| No matching renderer | Finish app startup/login; verify title capitalization and URL substring. A missing renderer does not create a new tab. Ensure the endpoint is from this app. |
| Multiple matches | Narrow title and URL filters; inspect windows and use one observed session-local ID. |
| Endpoint refused / timed out | Check `/json/version`, correct host/port, firewall and app debug policy. Confirm the app actually accepted the flags. |
| Protocol error / unsupported CDP method | Embedded Chromium may be incompatible. Record session_info/error, use a supported app/runtime build or explicit Windows UIA. Updating installed Chrome does not update Electron. |
| Native menu unavailable over CDP | Expected capability limitation. Use Electron launch for Menu API, DOM mode for HTML menus, or UIA for Windows native controls. |
| Menu invocation passed but output assertion failed | Invocation is not proof of success. Inspect app output, selected window and original assertion; preserve the failure. |
| Native dialog absent from DOM snapshot | OS dialogs are not renderer DOM. Use Windows UIA if exposed; no automatic dialog stubbing is performed. |
| Empty UIA tree | Check accessibility exposure, privilege level and unlocked desktop. App-specific accessibility configuration may be required. |
| Version 2 rejects CDP | Use owned Electron launch for structured execution policy, or a version 1 suite for existing CDP attachment. |
| `npx @infiautomation/mcp@latest` gives E404 | Registry publication is separate. Use the GitHub release package and permanent installation path above. |

## Compatibility evidence and upstream references

The automated fixture verifies launched and attached apps, multiple windows, native nested menu results/checkboxes, explicit DOM menus, screenshot evidence, MCP tool calls and app state surviving detachment. The CI `web-electron` check runs both the pinned Electron 45.2.1 fixture and a separate Electron 21.4.4 fixture with Playwright 1.64.1. These are concrete tested builds, not a guarantee for every version in between, every OS or every packaged app. The older runtime is a compatibility test fixture, not a recommendation to deploy an obsolete app runtime.

Local verification on Windows x64 with Playwright 1.64.1:

| Electron | Embedded Chromium | Launch / native menus / MCP CDP attachment |
| --- | --- | --- |
| 21.4.4 | 106.0.5249.199 | All three integration tests passed |
| 45.2.1 | 156.0.8078.75 | All three integration tests passed |

- [Playwright MCP CDP configuration](https://playwright.dev/mcp/configuration/browser-extension#connect-via-cdp-endpoint)
- [Playwright experimental Electron support and launch requirements](https://playwright.dev/docs/api/class-electron)
- [Playwright CDP limitations](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [Electron versions and bundled dependencies](https://www.electronjs.org/docs/latest/tutorial/electron-versioning)
- [Electron MenuItem invocation](https://www.electronjs.org/docs/latest/api/menu-item#menuitemclick)

Previous release assets and schemas remain available; see [versions and rollback](VERSIONS.md).

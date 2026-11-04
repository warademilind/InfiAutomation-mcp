# Changelog

## 0.5.0

- Improve Electron launch and CDP attachment with title/URL window selection, startup waiting and explicit ambiguity errors; attachment never opens a replacement tab.
- Attach through CDP using Playwright's supported `noDefaults` option to preserve application settings and avoid unsupported context-management overrides on older Electron runtimes.
- Add `session_info`, `ui_windows` and `ui_window_select`, with real runtime versions, ownership and transport-specific capabilities.
- Invoke observed native Electron menu commands through `MenuItem.click`, reject disabled/hidden/ambiguous paths, and allow explicit DOM menu selection.
- Include actual application runtime/capability evidence in new version 1 and version 2 HTML/JSON reports.
- Remove inherited `ELECTRON_RUN_AS_NODE` from the Windows worker environment so Electron GUIs can also be launched through the explicit UIA adapter from VS Code/Electron hosts.
- Test multiwindow apps, native menu effects and checkboxes, MCP CDP attachment, retained app state after detach and older embedded Chromium compatibility.
- Document Electron launch, CDP and explicit Windows UIA fallback without promising compatibility with every Electron version or weakening app security fuses. Existing releases and suite formats remain available.

## 0.4.0

- Add version 2 named targets and cross-layer cases for web, Windows desktop, Electron, REST/SOAP, database reads and UX checks. Version 1 suites remain supported.
- Add OpenAPI/Swagger, Postman v2 and WSDL operation catalogs, paginated reading and plan provenance.
- Add explicit status/body/JSON Schema/fault/latency assertions, typed per-case captures and environment-secret references.
- Add SQLite, PostgreSQL, MySQL/MariaDB, SQL Server, Oracle, MongoDB, Redis and ODBC adapter paths. Optional server drivers are installed separately; compatibility is documented per adapter.
- Add structured do/don't execution policy, conservative plan/suite policy merging, redacted JSON evidence and database read restrictions.
- Add axe accessibility, responsive layout, browser navigation/paint/checkpoint LCP/CLS and approved PNG visual checks; native desktop also supports PNG baselines.
- Add report layer filters, per-layer outcomes, request/connection/query/action timings, JSON evidence links, visual artifacts and policy inspection.
- Add a synthetic requirements-to-report example, real service CI checks, and version coexistence/rollback instructions.

## 0.3.2

- Fix report navigation shifts, preserve explorer state, reserve evidence image space and stabilize embedded report height.
- Improve overview, healing audit, pagination, focus handling and screenshot drill-down.

## 0.3.1

- Earlier public UI testing workflow with requirement imports, mapped plans/cases, auditable locator healing and offline reports.

See [version compatibility](docs/VERSIONS.md) and [GitHub releases](https://github.com/warademilind/InfiAutomation-mcp/releases).

# One plan across UI, APIs, databases and UX

Available in **0.4.0**. Existing `schemaVersion: 1` UI suites continue to run. Use `schemaVersion: 2` for named targets and mixed steps. Earlier release assets and recorded reports remain available; see [version history and rollback](VERSIONS.md).

## What one journey can verify

| Stage | Example assertion | Evidence |
| --- | --- | --- |
| REST | POST an order, assert HTTP 201 and JSON Schema, capture order ID | Redacted request/response, elapsed request time |
| Browser | Open captured ID and assert the displayed status | Screenshot, UI action duration |
| Windows desktop | Open the same record in your business desktop app and assert its status | UIA assertion, screenshot, action duration |
| Database | SELECT the captured ID with a bound parameter | Rows, row count, connection and query duration |
| SOAP | POST an XML envelope and assert the response value or an expected fault | Parsed XML, status, request duration |
| UX | Check mobile overflow, selected axe rules, approved visual baseline and browser timing | Findings, current/baseline/diff PNGs, navigation and paint metrics |

One test case shares captured values across its steps. Cases have fresh UI/API sessions and isolated captures. Targets start on first use and stay available until that case ends. Databases use a bounded worker process and a fresh connection per database step. A failed step fails the case and skips its remaining steps. Setup, teardown and evidence-write errors are never silently turned into passes. Version 2 browser policy requires an isolated browser/Electron launch; existing CDP attachment suites continue to use version 1.

For a real business E2E, provide your application's actual URLs, desktop locators, API contracts, database connection and acceptance criteria. The included local order fixture is synthetic. Its separate Calculator example demonstrates switching UI targets; it is not an order-processing desktop application.

## Run the complete local example

Prerequisites: Node.js 24+, the installed 0.4.0 CLI, Chromium (`setup`), and an available localhost port 47831. SQLite is built into the supported Node runtime; no database server or extra database package is needed for this demo. Node may print an experimental SQLite warning on stderr.

PowerShell, using the stable installation from the installation guide:

```powershell
Set-Location C:/InfiTests
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js init-e2e-demo --workspace C:/InfiTests
node C:/InfiTests/e2e-demo/server.mjs C:/InfiTests
```

Keep that terminal open. In a second PowerShell terminal:

```powershell
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js run e2e-demo/suite.json --workspace C:/InfiTests
```

Open `index.html` in the returned run directory. Keep the folder together: the summary, detailed report, traceability HTML, results JSON, step JSON and screenshots use relative links. In the report, inspect **Layers & timings**, **Execution policy**, and a case's **Actual result** / **Open JSON evidence** links.

The initializer creates requirements, imported API catalogs, Markdown/JSON plan, suite, portable runner and pre-execution coverage. It refuses to overwrite an existing `e2e-demo` folder. The local server creates synthetic orders through its REST endpoint; the database test adapter only reads them. Stop the fixture with Ctrl+C when finished.

Inside an MCP client, ordinary chat can request:

```text
Read e2e-demo/plan.json and e2e-demo/suite.json. Use test_run on the saved suite,
poll test_status until it finishes, then show report_get and traceability_get.
Preserve the saved policy and every assertion. Report actual results only.
```

## Web and desktop in one case

The [mixed UI suite](../examples/unified-e2e/mixed-ui.suite.json) checks 2 + 3 in a browser and Windows Calculator in the same case. Start the local example server first. Open exactly one English Windows Calculator in Standard mode, keep Windows unlocked, install the matching desktop worker, and close any native inspection session.

```powershell
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js run e2e-demo/mixed-ui.suite.json --workspace C:/InfiTests
```

The structure is:

```json
{
  "schemaVersion": 2,
  "name": "Web and desktop together",
  "targets": {
    "portal": {"kind": "web", "url": "http://localhost:3000"},
    "desktopApp": {"kind": "desktop", "windowTitle": "Observed unique title"}
  },
  "tests": [{
    "id": "same-record", "name": "Verify both applications",
    "steps": [
      {"kind": "ui", "target": "portal", "name": "Web status", "step": {"name": "Status", "action": "assertText", "locator": {"testId": "status"}, "value": "Approved"}},
      {"kind": "ui", "target": "desktopApp", "name": "Desktop status", "step": {"name": "Status", "action": "assertText", "locator": {"automationId": "ObservedStatusId"}, "value": "Approved"}}
    ]
  }]
}
```

This structural example needs your real title, controls and navigation. Inspect them with `session_start`, `ui_snapshot`, `ui_menus`, then close inspection sessions before `test_run`. Desktop tests require interactive Windows; GitHub-hosted headless runners cannot control a user's desktop.

## API documents to a plan and executable cases

1. Put the approved specification inside the workspace. Remove embedded credentials first.
2. Use `api_document_import` for OpenAPI/Swagger JSON/YAML, Postman Collection v2, or WSDL XML. It creates a SHA-256-addressed operation catalog without calling a service. DTD/entity declarations are refused. External `$ref`, WSDL imports and includes are preserved for review and are not fetched automatically.
3. Call `api_document_read` with the document ID; follow `nextOffset` until null. Review authentication, path/query parameters, payloads, responses, errors and schemas. Import any separately supplied referenced documents too. This is cataloging, not a complete OpenAPI/WSDL compiler.
4. For prose/PDF/DOCX requirements use `requirements_import` and read every `requirements_read` chunk. Scanned documents require OCR first.
5. Ask the MCP host's model to author a plan preserving original IDs, acceptance criteria, questions and negative/boundary cases. `plan_create` accepts `target.kind: "mixed"`, per-scenario `layers`, imported `documents`, `apiDocuments`, and `policy`.
6. Generate a version 2 suite using `test_generate`, linked to the plan's **JSON** sidecar, not Markdown. An API description supplies a contract; unknown business rules remain questions. The tools do not call a separate AI model or invent expected business behavior.
7. Provide approved endpoint/authentication values, run with `test_run`, poll `test_status`, and inspect `report_get` plus `traceability_get`.

Example client prompt:

```text
Import api/openapi.yaml and requirements/order-rules.pdf, then read every page
and chunk. Build a mixed test plan for web, REST and PostgreSQL. Preserve source
requirement IDs. Include success, invalid-input, not-found and authorization
cases only where the specification defines their expected results. Record
unknown rules as questions. Use synthetic data, approved test hosts and a
read-only DB account; never delete data. Translate these rules into structured
policy and explicit assertions. Generate linked schemaVersion 2 cases for review.
```

## REST and SOAP steps

API targets have `kind: "api"`, `baseUrl`, optional `headers` and `timeoutMs`. Playwright's APIRequestContext performs requests without launching a browser. API contexts are isolated from browser cookies; provide authentication explicitly through environment references. Automatic redirects are disabled, including credential-bearing redirects. TLS validation stays enabled.

Every API step needs `expect.status`. Optional `expect.checks` support `equals`, `contains` and `exists` at paths such as `body.order.id`, `headers.content-type` or `body.items.0.id`. `expect.jsonSchema` validates response bodies with Ajv (draft 7 or explicitly declared 2020-12). `expect.maxDurationMs` asserts elapsed request-to-body time. The evidence body is limited to 2 MiB after receipt; this is not a streaming download or load-test engine.

```json
{
  "kind": "api", "target": "service", "name": "Create an order",
  "method": "POST", "path": "/orders",
  "headers": {"Authorization": "Bearer ${env.TEST_API_TOKEN}"},
  "body": {"product": "Synthetic keyboard"},
  "expect": {"status": 201, "checks": [{"path": "body.status", "equals": "created"}], "maxDurationMs": 1500},
  "capture": {"orderId": "body.id"}
}
```

POST/PUT/PATCH/DELETE must appear in the effective `policy.allowedMethods`; defaults allow GET/HEAD/OPTIONS only. A POST can still have side effects even when used for SOAP, so authorize its test endpoint deliberately.

SOAP uses the same API target with an XML string body, `soapVersion: "1.1"` or `"1.2"`, and optional `soapAction`. XML namespaces are removed in the parsed evidence path, and XML leaf text remains a string: compare `"5"`, not `5`. Unexpected SOAP Faults fail even with HTTP 200. For a documented fault test set `expect.allowSoapFault: true`, assert the expected HTTP status and explicit fault fields. This release does not implement WS-Security signing/encryption, XSD validation or generated SOAP clients. JSON Schema assertions apply to JSON bodies.

Use `api_request` for an interactive request before authoring a suite. Use the same target/step shape plus optional `policy`; the result links to recorded redacted JSON evidence.

## Captures and secrets

`${vars.orderId}` reads a capture from an earlier step in the same case. An exact placeholder preserves its JSON type; interpolation into other text produces a string. `${env.TEST_API_TOKEN}` reads a process environment variable and marks its value for redaction. Missing values fail; no JavaScript expressions or arbitrary code are evaluated.

Use captures in API paths/bodies, UI values and database **params**. SQL text must never contain interpolation. Captures do not cross cases. Database credentials are supplied via `connectionEnv`, not suite JSON. MCP clients may require environment variables in their server configuration rather than inheriting all shell variables.

## Do / don't enforcement

Store user-provided notes under `policy.dos` and `policy.donts`. Translate supported restrictions into:

- `allowedOrigins`: approved HTTP(S) origins. API calls default to their target's origin if the list is empty. Browser suites with a list also install a request-route guard and block service workers in newly created web contexts.
- `allowedMethods`: allowed API/browser HTTP methods; default GET/HEAD/OPTIONS.
- `deniedTargets` and `deniedUiActions`: blocked named targets and typed UI actions.
- `captureScreenshots`: disable when screenshots may disclose application data. Visual checks then fail policy validation.
- `redactKeys`: additional exact case-insensitive JSON field names to hide.

Linked plan restrictions and suite restrictions are combined conservatively: methods/origins intersect, denials merge, and either can disable screenshots. Policy conflicts are checked before execution. Plan-linked legacy suites with a structured policy must migrate to version 2 rather than silently ignoring it. Locator healing cannot alter policy, assertions, API requests, database statements or approved visual baselines.

Arbitrary natural-language rules are not automatically executable. Record unsupported restrictions as questions and do not run dependent scenarios until resolved. Origin checks are application-level guards, not an OS network sandbox: desktop apps, browser extensions, popups/CDP, DNS changes and external processes need environment/network controls. Use isolated test systems and read-only DB accounts. Disable screenshots and review artifacts before sharing; JSON redaction does not censor screenshot pixels or the contents of your source documents.

## UI/UX checks and timing interpretation

| Check | Supports | What is measured/asserted |
| --- | --- | --- |
| `accessibility` | Web, Electron renderer | axe-core selected WCAG tags, findings and `maxViolations`; incomplete checks remain explicit |
| `layout` | Web, Electron renderer | Optional viewport, horizontal overflow, optional minimum interactive target width/height |
| `performance` | Web, Electron renderer | Navigation TTFB, DOMContentLoaded, load/interactive, paint entries, observed LCP/CLS, selector visibility wait |
| `visual` | Web, Electron, Windows desktop | Existing approved baseline PNG, current PNG, pixel diff, dimension equality, `maxDiffRatio` |
| UI functional steps | Web, Electron, desktop | Explicit controls/content assertions and action duration; keyboard sequences use `press` |

`performance.maxDurationMs` checks DOMContentLoaded and this step's selector wait. It does not measure arbitrary application rendering or backend server processing. LCP/CLS are checkpoint observations, not final field Core Web Vitals. API `requestMs` includes request plus receipt of the response body. Database `connectMs`, `queryMs` and `totalMs` distinguish connection/query time from worker overhead. UI `actionMs` excludes screenshot capture; total step time includes evidence work.

Visual baselines must be supplied and reviewed in advance. Keep OS, fonts, viewport, browser version, scale and application state consistent. A missing/mismatched baseline fails. The runner never auto-approves a changed screenshot. Automated UI/UX checks do not replace human usability evaluation, screen-reader testing or a complete accessibility audit.

See [database adapters and examples](DATABASES.md), [tool reference](API.md), [reports](REPORTS.md) and [upgrade/rollback](VERSIONS.md).

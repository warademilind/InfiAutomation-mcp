# One plan: REST, SOAP, browser, database and UX

This synthetic example creates an order through REST, captures its ID, checks the same order in a browser and SQLite, then checks mobile layout, automated accessibility and browser timing. Separate cases verify SOAP addition and a documented REST 404 response.

**[Open the recorded HTML report](https://warademilind.github.io/InfiAutomation-mcp/examples/unified-e2e/report/)**. Explore **Layers & timings**, select a case, expand actual results and follow its JSON/screenshot links. GitHub's source viewer does not render repository HTML; clone/download this folder and open `report/index.html` for offline use.

| Stage | Source / evidence |
| --- | --- |
| Requirements | [Synthetic requirements](requirements.md) |
| API contract | [OpenAPI](openapi.yaml), [SOAP WSDL](math.wsdl) |
| Plan input | [Requirement IDs, scenarios, layers and user rules](plan.input.json) |
| Recorded saved plan | [Readable plan](plan.md), [JSON sidecar](plan.json) |
| Executable cases | [Mixed suite](suite.json) |
| Real execution | [Summary](report/index.html), [case drill-down](report/detailed.html), [raw results](report/results.json) |
| Requirement coverage | [Linked outcomes](report/traceability.html), [raw traceability](report/traceability.json) |
| Preview | [Recorded report screenshot](report/report-preview.png) |
| Evidence provenance | [Recorded run and SHA-256 manifest](provenance.json) |
| Web + Windows desktop | [Browser and Calculator in one case](mixed-ui.suite.json) |

The report's timings are observations from one local synthetic run, not production benchmarks or load-test percentiles. It records its actual execution version, platform and timestamp. Native Calculator is a separate runnable example; it is not represented as part of this order application's three-case report. Automated accessibility checks do not establish complete WCAG conformance or subjective usability.

## Reproduce from an installed release

Follow [the complete E2E steps](../../docs/UNIFIED_E2E.md#run-the-complete-local-example). In brief: use `init-e2e-demo`, start the generated local `server.mjs` in one terminal, then run `e2e-demo/suite.json` in another. It uses Node.js 24+, Chromium and built-in SQLite. No production services or database credentials are needed.

For the separate mixed UI example, also install the matching Windows worker, open one English Calculator in Standard mode and keep the desktop unlocked. Run `e2e-demo/mixed-ui.suite.json` while the local fixture server is running. Replace its locators/title with observed values for another application.

## Reproduce from this source checkout

```sh
npm ci
npm run build
node dist/cli.js setup
node scripts/verify-unified-demo.mjs
```

The verification script starts the local fixture on an available port, exercises the real MCP stdio tools, and writes a fresh report under `.infiautomation`. It also checks the report interactions and deliberate visual-baseline failure. It does not overwrite this recorded public evidence.

Database adapter setup and qualification: [DATABASES.md](../../docs/DATABASES.md). Release coexistence/rollback: [VERSIONS.md](../../docs/VERSIONS.md).

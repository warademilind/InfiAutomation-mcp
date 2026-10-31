# Contributing

Use Node 24 LTS. Install dependencies with npm ci and retain package-lock.json.

1. npm run check
2. npm run build
3. npm test (includes a real stdio MCP client/server handshake)
4. npx playwright install chromium
5. npm ci --prefix integration/fixtures/electron
6. npm run test:integration:web
7. npm run test:integration:electron

For Windows native tests, install .NET 8+, run npm run build:native, build integration/fixtures/native/Fixture.csproj in Release, then run npm run test:integration:native on an unlocked interactive desktop.

The native integration fixture is built from this repository and exercises controls without touching a real user's applications. One browser integration case intentionally fails and another intentionally heals; the integration test asserts the exact report counts. That expected negative control is not a failing integration test.

Add meaningful tests for changes to selector resolution, assertions, healing, lifecycle, artifact handling or protocol behavior. Keep stdout exclusively for MCP when in server mode. Do not add predefined UI/menu lists and label them observed evidence.

Adapter interface: src/drivers/types.ts. Add a platform adapter with explicit capabilities and validation; update the support matrix and CI. Existing drivers must reject unsupported actions with actionable errors.

This repository uses MIT for its own code. Do not copy upstream code without preserving the applicable license and notices. Prefer public dependency APIs.

## Contribution and review policy

Everyone may fork this public repository and open a pull request against `main`. Only `@warademilind` is the code owner and has write/admin access. Contributor changes require passing CI, resolved review conversations, and a fresh code-owner approval. New commits dismiss prior approvals. Force-pushes and branch deletion are blocked. Public users may comment or submit advisory reviews; those reviews do not replace the required owner approval.

The repository owner retains administrator bypass for maintainer changes and recovery. GitHub prevents authors from approving their own pull requests, so requiring the sole owner to approve their own PR would lock the project. No other collaborators receive write/admin access by default.

# Third-party notices

InfiAutomation's own source is MIT licensed. It integrates these upstream projects through package dependencies rather than vendoring their implementation.

| Dependency | License | Project |
| --- | --- | --- |
| Playwright 1.64.1 and its browser tooling | Apache-2.0 | https://github.com/microsoft/playwright |
| MCP TypeScript SDK 2.4.0 | Apache-2.0 | https://github.com/modelcontextprotocol/typescript-sdk |
| FlaUI 5.0.0 (UIA3/Core) | MIT | https://github.com/FlaUI/FlaUI |
| Zod 4.6.7 | MIT | https://github.com/colinhacks/zod |
| Mammoth 1.13.0 | BSD-2-Clause | https://github.com/mwilliamson/mammoth.js |
| unpdf 2.1.0 | MIT; bundled PDF.js Apache-2.0 | https://github.com/unjs/unpdf |
| Electron fixture runtime | MIT, plus Chromium/Node notices | https://github.com/electron/electron |
| TypeScript, tsx, Node type definitions | Their distributed package licenses | See package-lock.json |

Transitive dependencies retain their own licenses. npm and NuGet lockfiles identify the exact dependency graph; installed packages contain upstream notices. Browser distributions and the .NET runtime and worker include additional platform/runtime notices, which must remain with redistributed artifacts.

No private app data, test reports, or binaries from the earlier local project are included as source.

## Unified testing dependencies (0.4.0)

| Dependency | License | Project |
| --- | --- | --- |
| axe-core / @axe-core/playwright | MPL-2.0 | https://github.com/dequelabs/axe-core-npm |
| Ajv / ajv-formats | MIT | https://github.com/ajv-validator/ajv |
| fast-xml-parser | MIT | https://github.com/NaturalIntelligence/fast-xml-parser |
| yaml | ISC | https://github.com/eemeli/yaml |
| pixelmatch | ISC | https://github.com/mapbox/pixelmatch |
| pngjs | MIT | https://github.com/pngjs/pngjs |

Optional database packages are installed separately by the user: pg (MIT), mysql2 (MIT), mssql (MIT), oracledb (Apache-2.0 or UPL-1.0), mongodb (Apache-2.0), redis (MIT), odbc (MIT). Node's bundled SQLite and upstream notices remain applicable. Native ODBC prerequisites and vendor drivers can have separate distribution/license terms. Exact bundled package versions are in package-lock.json; verify each optional package's distributed license when redistributing it.

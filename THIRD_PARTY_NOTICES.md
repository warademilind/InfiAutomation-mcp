# Third-party notices

InfiAutomation's own source is MIT licensed. It integrates these upstream projects through package dependencies rather than vendoring their implementation.

| Dependency | License | Project |
| --- | --- | --- |
| Playwright 1.64.1 and its browser tooling | Apache-2.0 | https://github.com/microsoft/playwright |
| MCP TypeScript SDK 2.4.0 | Apache-2.0 | https://github.com/modelcontextprotocol/typescript-sdk |
| FlaUI 5.0.0 (UIA3/Core) | MIT | https://github.com/FlaUI/FlaUI |
| Zod 4.6.7 | MIT | https://github.com/colinhacks/zod |
| Electron fixture runtime | MIT, plus Chromium/Node notices | https://github.com/electron/electron |
| TypeScript, tsx, Node type definitions | Their distributed package licenses | See package-lock.json |

Transitive dependencies retain their own licenses. npm and NuGet lockfiles identify the exact dependency graph; installed packages contain upstream notices. Browser distributions and the .NET runtime and worker include additional platform/runtime notices, which must remain with redistributed artifacts.

No private app data, test reports, or binaries from the earlier local project are included as source.

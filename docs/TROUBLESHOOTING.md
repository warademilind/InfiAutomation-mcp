# Installation and connection troubleshooting

Start with [USER_GUIDE.md](USER_GUIDE.md). All paths below are generic examples for a workspace at **C:/InfiTests**. Keep the original error and stop at the failed stage; a later plan-generation success does not establish that UI execution is ready.

## Quick symptom guide

| Symptom | Next section |
| --- | --- |
| npm `E404` for `@infiautomation/mcp@latest` | [1. Unpublished registry package](#1-npm-e404-or-unsupported-node) |
| `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` or certificate-chain error | [2. Certificate trust](#2-certificate-error-during-installation-or-browser-download) |
| `ECONNRESET` downloading the release | [3. Network reset / cached recovery](#3-econnreset-while-npm-fetches-the-github-release) |
| .NET installer succeeded, doctor still reports false | [4. Runtime detection](#4-net-installed-but-doctor-reports-false) |
| PowerShell displays `>>` | [5. Incomplete pasted command](#5-powershell-shows-the-continuation-prompt) |
| Demo failed or `infi-demo` already exists | [6. Demo execution](#6-browser-missing-or-demo-already-exists) |
| CLI works, MCP tools missing in the IDE | [7. Client connection](#7-cli-works-but-the-client-has-no-tools) |
| App inspection, documents or healing fails | [8. Testing workflow](#8-application-document-and-healing-problems) |

## 1. npm E404 or unsupported Node

`npm exec @infiautomation/mcp@latest` followed by HTTP 404 means the client requested the registry package, which is still pending first publication. Install/use the public GitHub tarball from the guide. Consumers do not need an npm account for that release. Replace the saved package argument and restart the server; a log that still shows the registry name indicates that an older configuration is being loaded.

Check Node independently:

```powershell
node --version
```

Version 24+ is required. Upgrade Node and fully restart the terminal/client if needed. Changing the package URL fixes its lookup; using Node 24+ meets the runtime requirement.

## 2. Certificate error during installation or browser download

Errors such as `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` mean Node could not validate the download's certificate chain. A corporate HTTPS inspection proxy is one possible cause; the error alone does not identify the issuer.

### Use Windows system trust when supported

If your company's CA is already trusted by Windows, Node **24.6+ or a newer supported major** can use that store. In the PowerShell session that will run the install/setup commands:

```powershell
$env:NODE_USE_SYSTEM_CA = "1"
```

Then retry the exact install/setup command that failed. This retains certificate verification. Node 24.0-24.5 users should update to a current Node 24 patch or use the IT-approved PEM method below. See [Node's system-CA documentation](https://nodejs.org/api/cli.html#node_use_system_ca1).

For the stable launcher in the guide:

```powershell
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js setup --desktop
```

### IT-provided PEM certificate and proxy

If Windows trust does not resolve it, ask IT for the approved root/intermediate CA bundle in **PEM** format and the approved proxy settings, if required. For this example, have the bundle saved as `C:/InfiTests/certificates/company-ca.pem`, then run:

```powershell
Test-Path C:/InfiTests/certificates/company-ca.pem
```

Continue after `True`:

```powershell
$env:NODE_EXTRA_CA_CERTS = "C:/InfiTests/certificates/company-ca.pem"
```

Retry the failed command in the same session. This path is an example location for an actual IT-provided file; the MCP does not supply company certificates. For a required proxy, set `HTTPS_PROXY` to the exact approved address IT supplies. Avoid embedding proxy credentials in shared logs or configuration. Playwright documents both [custom CAs and proxy downloads](https://playwright.dev/docs/browsers#install-behind-a-firewall-or-a-proxy).

For a client launched separately from PowerShell, put the required certificate environment entries in its server `env` configuration. Check organization policy with IT before changing shared trust or proxy settings. Certificate validation should stay enabled.

## 3. ECONNRESET while npm fetches the GitHub release

A reset from `release-assets.githubusercontent.com` occurs while fetching the package, before InfiAutomation's command starts. It can be transient or related to the network/proxy; it does not show that .NET or a test assertion failed.

1. Use your approved network/proxy and retry once if appropriate. Ask IT to check required npm/GitHub release and Playwright CDN connectivity when resets persist.
2. After a successful installation, prefer the [stable local launcher](USER_GUIDE.md#3-create-a-workspace-and-install-a-stable-local-launcher). Its startup does not fetch the package.
3. If you previously installed successfully through npx, the package may still be in the npm cache. The following temporary recovery locates **version 0.3.2** dynamically. It includes no username or fixed cache hash.

Run each line separately in PowerShell:

```powershell
$InfiNpmCache = (npm.cmd config get cache).Trim()
```

```powershell
$InfiCandidates = Get-ChildItem -Path "$InfiNpmCache\_npx\*\node_modules\@infiautomation\mcp\package.json" -File -ErrorAction SilentlyContinue
```

```powershell
$InfiPackage = $InfiCandidates | Where-Object { (Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json).version -eq '0.3.2' } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

```powershell
if (-not $InfiPackage) { throw 'Version 0.3.2 was not found in this npm cache. Restore approved network access and complete installation.' }
```

```powershell
$InfiCli = Join-Path $InfiPackage.DirectoryName 'dist/cli.js'
```

```powershell
Test-Path $InfiCli
```

Continue after `True`:

```powershell
node $InfiCli --version
```

```powershell
node $InfiCli doctor --workspace C:/InfiTests
```

For an existing demo:

```powershell
node $InfiCli run infi-demo/suite.json --workspace C:/InfiTests
```

This directly runs installed files and avoids npm's remote package lookup. Cache contents are temporary; a cache cleanup can remove this launcher. A permanent local install is preferable for client configuration.

npm's `--offline` option requires the necessary cached download responses and dependencies. An installed npx folder does not guarantee that every response npm needs is cached; `ENOTCACHED` can still occur. Direct recovery above uses the installed CLI. See [npm caching behavior](https://docs.npmjs.com/cli/v11/commands/npm-exec/#a-note-on-caching).

## 4. .NET installed but doctor reports false

Native Windows testing needs **Microsoft.WindowsDesktop.App 8.x** matching the worker's architecture. Seeing only `Microsoft.NETCore.App` does not meet this requirement.

For the standard Windows host:

```powershell
& "$env:ProgramFiles\dotnet\dotnet.exe" --list-runtimes
```

If that command lists `Microsoft.WindowsDesktop.App 8.0.*`, the runtime is installed. A terminal or IDE opened before installation may have an older PATH or choose another .NET host. Set the host explicitly in the current session:

```powershell
$env:INFIAUTOMATION_DOTNET = "$env:ProgramFiles\dotnet\dotnet.exe"
```

Then check again:

```powershell
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js doctor --workspace C:/InfiTests
```

If using temporary cache recovery, use `node $InfiCli doctor --workspace C:/InfiTests` instead. Expected for native testing: `nativeWorkerInstalled`, `dotnetDesktopRuntime8`, and `desktopAvailable` are all `true`.

If the executable is elsewhere, use that actual path. If the runtime line is absent, install the architecture-matched .NET 8 **Desktop Runtime**. Source builds additionally need the SDK; running the release worker does not.

For independently launched clients, add the same host path under the server's `env`, as shown in [CLIENT_SETUP.md](CLIENT_SETUP.md), then restart the client. A session variable set in PowerShell is not a persistent IDE configuration.

## 5. PowerShell shows the continuation prompt

If you see `>>` after pasting a command, PowerShell is waiting for the rest of an expression, often a closing quote. Press **Ctrl+C** to return to the normal prompt. Paste one complete command from the guide, including its real quotes. Do not include a `PS ...>` prompt, Markdown link formatting, a shortened URL containing `...`, or a literal `%27` suffix.

`npx.cmd` and `npm.cmd` avoid invoking PowerShell script wrappers when execution policy blocks `.ps1` files. No execution-policy change is required for these commands.

## 6. Browser missing or demo already exists

- `chromiumInstalled: false`: run matching-release `setup`, resolve any download error, then recheck doctor. Cases may all fail at browser launch if the executable is missing; inspect the recorded error before changing assertions.
- A generic Playwright warning about project dependencies can appear during setup through a packaged launcher. Check the actual download result and final setup status; the warning alone does not establish failure. Installing an unrelated Playwright version does not select the browser revision expected by this release.
- `infi-demo already exists`: the creation command protects your edits. Repeat only `run infi-demo/suite.json` for another execution, or choose a new workspace for a fresh demonstration.
- A passed demo validates the bundled web fixture. Inspect and execute explicit cases against your actual native/Electron target separately.
- Reports are under `.infiautomation/runs`. Use the directory returned for that run. `latest.json` references a completed saved run and can still refer to an earlier run if a new job failed before producing reports.

## 7. CLI works but the client has no tools

Check the [client-specific configuration](CLIENT_SETUP.md): Codex uses TOML; VS Code's `.vscode/mcp.json` uses `servers`; clients supporting portable JSON use `mcpServers`. Use actual absolute paths, start the server, enable tools and complete the client's trust flow.

`$InfiCli`, `$env:USERPROFILE` and other shell expressions are not automatically expanded inside literal JSON/TOML path strings. Use the actual path in the configuration. Optional environment entries belong under the server's `env` object/table.

An IDE can inherit a different PATH or environment from PowerShell. Restart it after Node/.NET changes, use an absolute Node executable if needed, and verify through the actual MCP `doctor` tool. A terminal with a manually started stdio server may stay blank while it waits for protocol messages; check it using an MCP client.

For WSL, containers, SSH or remote development, a server started in that environment controls that environment. The native worker must run in the interactive Windows session that owns the target app. This release's local stdio configuration does not create a remote desktop bridge.

## 8. Application, document and healing problems

| Symptom | Action |
| --- | --- |
| Native session already owns the desktop | Close inspection/healing sessions with `session_close` before native `test_run` |
| Native click/keyboard target cannot be foregrounded | Keep an unlocked interactive desktop, match privilege levels and inspect the target window |
| Screenshot includes another window | Keep the target unobscured; screenshots capture the visible desktop region |
| Electron startup fails | Check the executable, arguments, supported Electron debugging/inspect settings and startup timeout |
| Document path rejected | Put the document inside the configured workspace; escaping paths and links are blocked |
| PDF extraction has no text | Supply OCR/text output or DOCX; the MCP does not perform OCR |
| Unknown/unmapped requirement IDs | Correct the suite references or update the linked plan JSON |
| Healer has no candidate | Inspect actual controls and preserve the failure; repair only a supported identity match |
| Assertion fails | Diagnose app behavior, data or requirement ambiguity; preserve the specified expected outcome |

Continue with [requirements and test plans](USER_GUIDE.md#8-create-a-plan-from-your-requirement-document), or consult the [API reference](API.md) for exact tool inputs.

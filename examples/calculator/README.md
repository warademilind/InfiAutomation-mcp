# Windows Calculator: requirements to execution evidence

Start with **[index.html](index.html)** for the linked visual walkthrough. Download or clone this repository and open that file in a browser; GitHub's source viewer does not render repository HTML. Keep the entire `examples/calculator` folder together so report links and screenshots work offline.

This example includes the original Calculator plan, executable cases and a recorded successful run: **9/9 cases passed, 53 step screenshots, 7/7 mapped items passed, healing off**, in 20.745 seconds on Windows x64. The run started on 2 November 2026 at 16:01:02 UTC using InfiAutomation MCP 0.3.1, Node 26.13.0 and Playwright 1.64.1.

**Scope matters:** no functional requirement document was supplied for this run. UI01â€“UI05 are provisional expectations derived from the observed UI; WF01â€“WF02 describe the requested test workflow. Passing these mapped cases does not prove product acceptance or complete Calculator coverage. Open questions remain in the plan and coverage report.

## Explore the complete journey

| Stage | Readable HTML | Source / data |
| --- | --- | --- |
| Overview | [Linked walkthrough](index.html) | [Publication provenance and evidence hashes](provenance.json) |
| Requirements | [Requirements, criteria and questions](requirements.html) | [Requirement reading view](requirements.md) |
| Plan | [Scenarios and risks](plan.html) | [Original Markdown](plan.md), [original saved JSON](plan.json) |
| Cases | [Actions, locators, expectations and screenshots](cases.html) | [Executable suite](suite.json) |
| Execution | [Summary dashboard](report/index.html) | [Recorded results](report/results.json) |
| Drill-down | [Detailed case and step report](report/detailed.html) | 53 linked PNG screenshots |
| Coverage | [Requirement-to-case outcomes](report/traceability.html) | [Recorded traceability](report/traceability.json) |

The supplied archive contains the original plan, suite and recorded output. The public suite changes only `planPath` to `examples/calculator/plan.json`. The original plan files, result JSON and traceability JSON are preserved. Screenshots are losslessly cropped to the Calculator content area to remove surrounding terminal margins and window chrome; their displayed results and control pixels are unchanged. Original images remain private. Crop bounds and original/published checksums are recorded in the provenance file. Report HTML adds navigation back to the walkthrough. The requirement reading view and journey pages were prepared for publication. No fresh execution is claimed. See [provenance.json](provenance.json).

## Replay on Windows

### 1. Prepare the machine

Use Node.js **24+**, the **.NET 8 Windows Desktop Runtime**, and an unlocked interactive Windows desktop. Install these through your normal software installation process. A .NET SDK is not required for the prebuilt release. Match Node/worker/runtime architecture. Windows x64 was used for the recorded example; ARM64 requires validation on ARM64 hardware.

Run these commands in PowerShell, one line at a time:

```powershell
node --version
& "$env:ProgramFiles/dotnet/dotnet.exe" --list-runtimes
$env:PATH = "$env:ProgramFiles/dotnet;" + $env:PATH
New-Item -ItemType Directory -Path C:/InfiTests -Force
npm.cmd install --prefix C:/InfiTests/tools/infiautomation --save-exact --no-audit --no-fund https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.3.1/infiautomation-mcp-0.3.1.tgz
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js --version
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js setup --desktop --skip-browser
```

Expected: version `0.3.1`, a matching native worker, and `Microsoft.WindowsDesktop.App 8.0.x` in the runtime list. For web testing too, run `setup --desktop` without `--skip-browser`. The npm registry package is not yet published; use the pinned GitHub URL above.

### 2. Obtain the example

Clone the repository, or use GitHub's **Code â†’ Download ZIP**, extract it, and place the repository root at `C:/InfiTests/InfiAutomation-mcp`. That folder must contain `examples/calculator/suite.json`. With Git installed:

```powershell
git clone https://github.com/warademilind/InfiAutomation-mcp.git C:/InfiTests/InfiAutomation-mcp
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js doctor --workspace C:/InfiTests/InfiAutomation-mcp
Invoke-Item C:/InfiTests/InfiAutomation-mcp/examples/calculator/index.html
```

For native-only setup, `chromiumInstalled: false` is acceptable. `nativeWorkerInstalled`, `dotnetDesktopRuntime8`, and `desktopAvailable` must be true.

### 3. Prepare and inspect Calculator

Open **one** Windows Calculator window in **English Standard mode**. Keep it visible and unobscured; close unrelated Calculator instances. Existing history is not cleared. The memory case stores, recalls and clears Calculator memory, so use a test session.

```powershell
Start-Process calc.exe
```

The suite attaches to the unique window title `Calculator`. A localized title, a different app version or multiple matching windows requires inspection and a local suite adjustment. Do not copy an old process ID or guess an executable path under WindowsApps.

When connected through an MCP client, ask it to start an inspection session with `{"kind":"desktop","windowTitle":"Calculator"}`, read `ui_snapshot`, and compare every suite Automation ID and expected text. Close that inspection session using `session_close` before running the suite. Use [client setup](../../docs/CLIENT_SETUP.md) to connect your client if needed.

### 4. Execute and open the new reports

```powershell
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js run examples/calculator/suite.json --workspace C:/InfiTests/InfiAutomation-mcp
```

The CLI prints the actual status, counts and new report directory. It returns a nonzero exit code on failure. New evidence goes into `.infiautomation/runs/<new-run-id>` and does not replace the recorded example.

```powershell
$InfiLatest = Get-Content C:/InfiTests/InfiAutomation-mcp/.infiautomation/latest.json -Raw | ConvertFrom-Json
$InfiRun = Join-Path C:/InfiTests/InfiAutomation-mcp $InfiLatest.directory
Invoke-Item (Join-Path $InfiRun index.html)
Invoke-Item (Join-Path $InfiRun detailed.html)
Invoke-Item (Join-Path $InfiRun traceability.html)
```

From an MCP client, call `test_run` with `path: "examples/calculator/suite.json"`, poll `test_status` using the returned `jobId`, then use `report_get` and `traceability_get`. Only runner results establish whether the new run passed.

## Common replay problems

| Symptom | What to check |
| --- | --- |
| No Calculator window / ambiguous match | Open one Calculator, inspect its current title or PID, and update a local suite copy if needed. Store-app launchers may delegate to another process. |
| Header or display assertion fails | Select Standard mode, inspect actual text, and check language/version. Investigate a changed behavior before changing an expected outcome. |
| Control missing | Compare the live UI tree with the exact Automation ID. Keep healing off until the cause is understood. |
| Native worker/runtime missing | Run `setup --desktop --skip-browser`; confirm .NET **Desktop** Runtime 8 and refreshed PATH, then repeat doctor. |
| Screenshots show another window | Keep Calculator foreground and unobscured; unlock the desktop. Avoid concurrent native automation. |
| Desktop inspection conflict | Close the MCP desktop inspection session with `session_close` before `test_run`. |
| JSON error mentioning `#` | Supply `plan.json` to `test_generate` or `planPath`, rather than Markdown `plan.md`. |
| Network or certificate failure during installation | Follow the [installation troubleshooting guide](../../docs/TROUBLESHOOTING.md); use approved certificates/proxy settings. |
| HTML opens as source / images missing | Open in a browser and preserve the complete extracted folder structure. |

For document-driven planning and reviewed selector healing, see the [user guide](../../docs/USER_GUIDE.md). This Calculator baseline demonstrates the workflow; replace provisional expectations with approved source requirements for your own product.

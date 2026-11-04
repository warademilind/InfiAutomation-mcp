# Connect InfiAutomation to an AI client

First complete [installation and the demo](USER_GUIDE.md). These examples use release **0.5.0**, a workspace at **C:/InfiTests**, and the stable local installation at **C:/InfiTests/tools/infiautomation**. Replace these paths if you chose another location. All examples use generic paths.

Choose exactly one server entry named `infiautomation` in your client. Preserve unrelated existing configuration. PowerShell variables such as `$InfiCli` are not shared with an independently started IDE; put actual absolute paths in the configuration.

## 1. Codex CLI and Codex VS Code extension

Codex CLI and the IDE extension share `~/.codex/config.toml`. On Windows, find it under `%USERPROFILE%\.codex\config.toml`. Project-scoped `.codex/config.toml` is also supported for trusted projects. These locations and the command/args/env settings are described in the [official OpenAI MCP documentation](https://developers.openai.com/codex/mcp/).

1. Install/sign in to your Codex client.
2. Open its configuration file. Create it if needed.
3. Add or update the following server block. Copy only the TOML content.

```toml
[mcp_servers.infiautomation]
command = "node"
args = ["C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js", "--workspace", "C:/InfiTests"]
startup_timeout_sec = 120
tool_timeout_sec = 180
```

For Windows native testing, if .NET is in the standard installation directory, also add:

```toml
[mcp_servers.infiautomation.env]
INFIAUTOMATION_DOTNET = "C:/Program Files/dotnet/dotnet.exe"
```

Use the actual .NET executable path if it differs. Web/Electron-only users can omit this environment table. If your approved network needs Windows system certificate trust and your Node version supports it, add `NODE_USE_SYSTEM_CA = "1"` to this same environment table. See [certificate troubleshooting](TROUBLESHOOTING.md#2-certificate-error-during-installation-or-browser-download).

4. Save the file and restart the Codex session/extension.
5. In the CLI, run `codex mcp list` to confirm the server is configured.
6. Ask the agent to perform the [connection check](#5-check-the-actual-mcp-connection).

Copy-ready Windows native example: [codex.local.toml](../examples/codex.local.toml). On macOS/Linux, use your actual absolute CLI and workspace paths and omit the Windows .NET entry. If `node` resolves to an older version in the IDE, set `command` to the absolute Node 24+ executable path printed by `(Get-Command node).Source` in PowerShell, or `command -v node` on macOS/Linux.

## 2. VS Code with GitHub Copilot

Open **C:/InfiTests** in VS Code, sign in to Copilot, and use an agent session with MCP support. Organization policy may govern availability. Configuration destinations vary by version/harness, so the guided flow is recommended:

1. Run **MCP: Add Server** from the Command Palette and choose **Command (stdio)**.
2. Enter this complete launch command:

```text
node C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js --workspace C:/InfiTests
```

3. Name the server `infiautomation`.
4. For personal use, choose **Global -> Copilot Global** when available. For a compatible shared workspace, choose workspace-root **.mcp.json** when offered. Current VS Code makes that workspace-root destination dependent on `chat.mcp.workspaceRootConfig.enabled`.
5. Review the trust prompt, start/restart the server, and enable its tools. Current Copilot sessions expose tools through **Chat: Open Customizations -> Tools**; Local harness sessions can use **Configure Tools** in the chat input.
6. Perform the [connection check](#5-check-the-actual-mcp-connection).

For a portable destination that accepts `mcpServers`, this is the complete configuration. Add/change the .NET entry for Windows native testing:

```json
{
  "mcpServers": {
    "infiautomation": {
      "command": "node",
      "args": [
        "C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js",
        "--workspace",
        "C:/InfiTests"
      ],
      "env": {
        "INFIAUTOMATION_DOTNET": "C:/Program Files/dotnet/dotnet.exe"
      }
    }
  }
}
```

For the compatible **Local harness** format, use `.vscode/mcp.json` with a **`servers`** wrapper and **`type: stdio`**; copy [vscode.local.json](../examples/vscode.local.json). This destination is retained for compatibility and is labeled deprecated by current guided setup. Portable configurations use **`mcpServers`**; copy [mcp.local.json](../examples/mcp.local.json). Keep the wrapper appropriate to the selected destination.

Save changes, check server output for startup errors, and verify an actual tool call. See [official VS Code MCP documentation](https://code.visualstudio.com/docs/agent-customization/mcp-servers) for destination and tool controls in your installed version.

## 3. Other clients accepting mcpServers

Use the client's documented MCP configuration location. The complete server definition is:

```json
{
  "mcpServers": {
    "infiautomation": {
      "command": "node",
      "args": [
        "C:/InfiTests/tools/infiautomation/node_modules/@infiautomation/mcp/dist/cli.js",
        "--workspace",
        "C:/InfiTests"
      ],
      "env": {
        "INFIAUTOMATION_DOTNET": "C:/Program Files/dotnet/dotnet.exe"
      }
    }
  }
}
```

Copy-ready file: [mcp.local.json](../examples/mcp.local.json). Omit/change the Windows .NET entry as appropriate. This definition requires a client that can start a local stdio process. A remote HTTP-only client cannot use a local `node` command directly; this release does not provide a hosted HTTP service.

## 4. GitHub npx alternative

For an initial try or a client where you prefer npx, the public package can be launched without the persistent local installation. Node 24+ is still required. Run setup with the same release first:

```powershell
npx.cmd --yes https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.5.0/infiautomation-mcp-0.5.0.tgz setup --desktop
```

For web-only work, omit `--desktop`. Then use `command: npx` and these arguments in the appropriate server entry:

```json
[
  "--yes",
  "https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.5.0/infiautomation-mcp-0.5.0.tgz",
  "--workspace",
  "C:/InfiTests"
]
```

Client-specific complete files:

| Client format | GitHub npx example | Stable local example |
| --- | --- | --- |
| Codex TOML | [codex.github.toml](../examples/codex.github.toml) | [codex.local.toml](../examples/codex.local.toml) |
| VS Code `servers` | [vscode.github.json](../examples/vscode.github.json) | [vscode.local.json](../examples/vscode.local.json) |
| Portable `mcpServers` | [mcp.github.json](../examples/mcp.github.json) | [mcp.local.json](../examples/mcp.local.json) |

The `*.npx.*` examples are aliases for the same GitHub launcher. npm can recheck or fetch a remote tarball on a later invocation; this mode needs suitable network access and a longer startup allowance. If a Windows client cannot resolve `npx`, try `npx.cmd`, or use the stable local Node launcher.

The registry package name `@infiautomation/mcp@latest` is pending npm publication. A public GitHub release does not create an npm registry package.

## 5. Check the actual MCP connection

In your connected client, paste:

```text
Use the InfiAutomation MCP doctor tool now.
Show its actual tool response, version, workspace, browser installation,
and native prerequisites. Do not substitute a terminal command for this connection check.
```

Expected: an actual `doctor` tool call, version `0.5.0`, and your intended workspace. For Chromium work, check `chromiumInstalled`; for Windows native work also check `nativeWorkerInstalled`, `dotnetDesktopRuntime8`, and `desktopAvailable`.

If no tool call is available, inspect server output/configuration, check the wrapper and absolute paths, enable the tools, and restart the client. Running CLI doctor in PowerShell verifies the executable and that terminal's environment; this MCP tool call verifies the independently launched client process.

After connection, continue with [requirement documents and plans](USER_GUIDE.md#8-create-a-plan-from-your-requirement-document). To test a native or Electron app, supply the actual target and inspect its controls; the web demonstration does not certify those apps.

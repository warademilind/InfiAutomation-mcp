# CI, releases, and public distribution

## Three execution locations

1. **Developer machine:** web, Electron, and Windows native (when on Windows).
2. **GitHub-hosted Linux CI:** browser/Electron fixtures under Xvfb, unit/protocol checks, publishable source/package validation.
3. **Interactive self-hosted Windows runner:** real desktop UI tests with an unlocked signed-in desktop. Do not run the native automation job as an unattended Windows service.

The native workflow is manual and restricted to the repository's own default branch. It has no pull_request trigger. Use a dedicated test account and isolated runner for UI automation.

## Source and package use

Use the GitHub release directly with npx (no clone required), clone and build, or install a downloaded tarball:

```sh
npx --yes https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.2.0/infiautomation-mcp-0.2.0.tgz setup
npx --yes https://github.com/warademilind/InfiAutomation-mcp/releases/download/v0.2.0/infiautomation-mcp-0.2.0.tgz doctor
```

The tarball includes compiled JavaScript and native **source**, not the SDK or a large prebuilt native worker. A separate release asset supplies the worker. Run the same npx launcher with `setup --desktop` to download and verify it, or point `INFIAUTOMATION_NATIVE_WORKER` to a manually extracted InfiAutomation.Native.dll. Install the .NET 8 Windows Desktop Runtime on the target Windows machine.

The public npm package is `@infiautomation/mcp`. It requires an authenticated npm publisher with scope access; follow [PUBLISHING.md](PUBLISHING.md) for first publication and the prepared OIDC workflow. A GitHub release is usable without npm publication. Core CI runs a real npx MCP/browser check on Windows, macOS and Linux.

## Cut a release

After tests pass:

```sh
git tag v0.2.0
git push origin v0.2.0
```

The release workflow builds the Node tarball and Windows x64/ARM64 workers, computes SHA-256 checksums, then creates the matching GitHub release. The worker is a framework-dependent DLL with supporting libraries. ARM64 workers are cross-built; runtime validation on ARM64 hardware is still required.

Source commits and artifacts are versioned. Downloaded executables are not checked into Git. GitHub Release binaries are unsigned in v0.2; organizational signing is a later deployment choice.

## Reports

CI uploads report artifacts only from its own test fixtures. Users' real app reports stay ignored locally. Do not publish screenshots/traces with credentials, customer data or private URLs. To use GitHub Pages, explicitly sanitize a report folder and publish that folder through your organization's Pages workflow.

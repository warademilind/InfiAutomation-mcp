# CI, releases, and public distribution

## Three execution locations

1. **Developer machine:** web, Electron, and Windows native (when on Windows).
2. **GitHub-hosted Linux CI:** browser/Electron fixtures under Xvfb, unit/protocol checks, publishable source/package validation.
3. **Interactive self-hosted Windows runner:** real desktop UI tests with an unlocked signed-in desktop. Do not run the native automation job as an unattended Windows service.

The native workflow is manual and restricted to the repository's own default branch. It has no pull_request trigger. Use a dedicated test account and isolated runner for UI automation.

## Source and package use

Clone and build, install from the Git URL, or download a release npm tarball:

```sh
npm install ./testweave-mcp-0.1.0.tgz
npx testweave-mcp doctor
```

The tarball includes compiled JavaScript and native **source**, not the SDK or a large prebuilt native worker. A separate release asset supplies the worker. Point `TESTWEAVE_NATIVE_WORKER` to its extracted TestWeave.Native.dll. Install the .NET 8 Windows Desktop Runtime on the target Windows machine.

For npm registry publication, the owner must choose an available package name and run `npm publish --access public` using an npm account. No npm credentials are stored or configured here. A GitHub release is usable without npm publication.

## Cut a release

After tests pass:

```sh
git tag v0.1.0
git push origin v0.1.0
```

The release workflow builds the Node tarball and Windows x64 worker, computes SHA-256 checksums, then creates the matching GitHub release. The worker is a framework-dependent DLL with supporting libraries. Native source can also build for Windows ARM64; the initial prebuilt release target is x64.

Source commits and artifacts are versioned. Downloaded executables are not checked into Git. GitHub Release binaries are unsigned in v0.1; organizational signing is a later deployment choice.

## Reports

CI uploads report artifacts only from its own test fixtures. Users' real app reports stay ignored locally. Do not publish screenshots/traces with credentials, customer data or private URLs. To use GitHub Pages, explicitly sanitize a report folder and publish that folder through your organization's Pages workflow.

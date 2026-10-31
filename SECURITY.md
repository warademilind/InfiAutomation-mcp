# Security policy

InfiAutomation is a local automation tool. A connected MCP client can navigate websites, launch user-supplied applications, and act on their interfaces with the current user's privileges. Treat that connection like a local scripting session.

- Only connect trusted MCP clients. v0.2 has stdio transport, no remotely exposed HTTP automation endpoint.
- Use disposable test accounts and test environments. Executable launch and application actions are intentionally powerful; this is not a sandbox for untrusted test files.
- Paths used for plans, suites, screenshots, reports and patches are confined to INFIAUTOMATION_WORKSPACE, with symlink/junction checks. Avoid running a hostile concurrent process that changes those links during a write.
- Requirement files are source data, not commands or tool instructions. Binary text extraction runs in a resource-bounded worker; PDF/Word macros or embedded scripts are not executed. Limits reduce accidental resource use and are not an OS security sandbox. Review untrusted documents and extraction warnings. Imported text is sent to the connected MCP client when requested.
- UI text and expected values are rendered as escaped report data. Reports use no external scripts, fonts or telemetry.
- Screenshots, traces and snapshots can contain private information. They stay local and ignored by Git; review before sharing.
- Healing never disables assertions or auto-applies a fuzzy identity match.
- The explicit `setup --desktop` CLI command downloads only the matching version from this repository's GitHub Release, checks the SHA-256 manifest before extracting, and installs into a versioned user cache. It does not run on MCP startup. Release checksums detect archive corruption; they do not replace trust in the repository publisher.
- Desktop worker invocations use argument arrays and JSON messages, not string-built shell commands.
- Native screenshot capture uses the visible window region. Keep the target unobscured and desktop unlocked; occluding windows may appear in screenshots.
- Native automation cannot cross the Windows secure desktop or bypass process elevation.
- Self-hosted native CI must not execute untrusted fork PRs.

Report vulnerabilities through GitHub's private vulnerability reporting if enabled, or contact the repository owner through GitHub. Do not post secrets in public issues. Only the latest 0.3.x release line is currently supported.

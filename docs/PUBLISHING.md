# Public npm distribution

The intended consumer command is `npx --yes @infiautomation/mcp@latest`. Package and scope names are lowercase; the GitHub repository is `warademilind/InfiAutomation-mcp`.

The code and release package are ready for npm. The npm registry command is available only after the first successful publication. GitHub login does not authenticate npm and does not grant ownership of an npm scope. Until publication, use [the GitHub npx configuration](../examples/mcp.github.json).

## First publication by the maintainer

1. Sign in to npmjs.com and ensure you own the `infiautomation` user scope or have publish access through an npm organization named `infiautomation`. Create that organization through npm if needed and available. The GitHub repository name does not reserve the npm scope.
2. Use Node.js 24 or newer. In a terminal, run `npm login`, then `npm whoami`. Complete npm's browser/2FA prompts yourself. Do not share a password, token, or recovery code in chat or Git.
3. Clone `https://github.com/warademilind/InfiAutomation-mcp.git`, enter the checkout, run `npm ci`, `npm run check`, `npm test`, and `npm pack --dry-run`.
4. Publish the reviewed version with `npm publish --access public`. Complete any required npm 2FA confirmation. Versions cannot be republished with different contents.
5. Verify with `npm view @infiautomation/mcp version dist-tags --json` and `npx --yes @infiautomation/mcp@latest --version`. Run `npx --yes @infiautomation/mcp@latest setup`, adding `--desktop` on Windows when needed.
6. Remove the README's publication-pending notice through a maintainer-reviewed change after verification.

The package has `publishConfig.access: public` and points at the public npm registry. Dependencies are pinned in the lockfile. Publishing the GitHub tarball alone does not create a registry package or a `latest` dist-tag.

## Later releases with trusted publishing

After the package exists, configure a trusted publisher in its npm package settings:

- Provider: GitHub Actions.
- Organization/user: `warademilind`.
- Repository: `InfiAutomation-mcp` (match case exactly).
- Workflow filename: `publish-npm.yml`.
- Environment: leave empty, matching the workflow.
- Allow direct `npm publish` if npm shows that permission option.

Then run the **Publish npm** workflow on `main`. It accepts only the original repository, default branch and actor `warademilind`; uses GitHub-hosted runners; runs checks/tests; and publishes with provenance and OIDC. No long-lived npm token is stored in the repository. The workflow is deliberately manual and is not triggered by fork PRs or a release tag.

See the official [npm trusted-publishing instructions](https://docs.npmjs.com/trusted-publishers/).

## Repository review policy

Anyone may fork and submit a pull request. `.github/CODEOWNERS` names only `@warademilind` for every file. Main requires CI, resolved conversations, and code-owner approval for contributor changes; new commits dismiss stale approvals. The owner retains administrator bypass for their own maintainer work and recovery because GitHub does not allow a PR author to approve their own PR. Public advisory reviews do not replace code-owner approval.

`.github/main-protection.json` records the intended protection settings. An administrator can reapply them with:

```sh
gh api --method PUT repos/warademilind/InfiAutomation-mcp/branches/main/protection --input .github/main-protection.json
```

Inspect GitHub's branch-protection settings and collaborators after applying. Granting another person admin access would also grant administrator bypass; do not add other administrators if the owner must remain the sole maintainer.

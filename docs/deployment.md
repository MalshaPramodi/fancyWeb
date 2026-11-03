# Cloudflare Pages setup

Status: pending account connection and verified hosted deployment.

## Owner-requested static asset configuration

The owner explicitly requested a root `wrangler.jsonc` before supplying the live
URL. It names the deployment `fancyweb`, sets compatibility date `2026-11-01`,
serves `./dist`, and uses `single-page-application` fallback. `npm run build`
outputs to `dist` using Vite's default output directory. This is a Workers static
assets configuration; adding it does not itself establish the planned Pages Git
integration. The owner is setting up Cloudflare and will supply the hosted URL.

Commit 4 retains the exact planned message and contains this requested config.
Phase 0 remains pending until the resulting live deployment is verified.

The owner has chosen to keep `MalshaPramodi/fancyWeb`. All app files are at this
Git repository's root; the nested local checkout path is not a deployment root.

## Connect once

1. Sign into Cloudflare, open Workers & Pages, then Create application > Pages >
   Connect to Git.
2. Authorize GitHub access to `MalshaPramodi/fancyWeb` and select that repository.
3. Set the production branch to `main`.
4. Use build command `npm run build` and build output directory `dist`.
5. Leave root directory empty (repository root).
6. Set `NODE_VERSION` to `24` for production and preview builds.
7. Deploy. Record the actual `pages.dev` URL and verify the setup screen renders.

Do not add API credentials or bank details to deployment settings. The public
`VITE_ORDER_API_URL` remains empty through Phase 4. There are no Pages Functions
or backend services in the current scope.

## Verify automatic deployment

Commit 4 uses the exact message `ci: connect Cloudflare Pages deployment` for the
owner-requested configuration. After it is pushed to `main`, verify that Cloudflare
builds that commit successfully and check the actual live page. Record the
confirmed URL in PROGRESS.md and only then mark Phase 0 complete.

Git integration automatically builds connected pushes. Cloudflare's build logs
and deployment commit SHA should match the pushed commit. Never invent a live URL.

References:

- [Cloudflare Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare React guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)

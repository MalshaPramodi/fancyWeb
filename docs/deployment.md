# Cloudflare deployment

Status: live setup deployment verified on 2026-11-04 (Asia/Colombo).

URL: https://fancyweb.mpramodi0039.workers.dev/

The owner selected Workers static assets via Wrangler instead of the originally
planned Pages hosting. The homepage and `/preview-check` return HTTP 200 and the
same app HTML. Deployed JavaScript and CSS return HTTP 200 and match the local
production build. Build, lint and formatting checks pass. Browser visual checks
and observation of automatic deployment on a future push remain outstanding.

## Owner-requested static asset configuration

The owner explicitly requested a root `wrangler.jsonc` before supplying the live
URL. It names the deployment `fancyweb`, sets compatibility date `2026-11-01`,
serves `./dist`, and uses `single-page-application` fallback. `npm run build`
outputs to `dist` using Vite's default output directory. This is a Workers static
assets configuration. The owner supplied the Workers URL above, and the hosted
static build and SPA fallback have been verified.

Commit 4 retains the exact planned message and contains this requested config.
Phase 0 is complete with the owner-approved hosting adjustment.

The owner has chosen to keep `MalshaPramodi/fancyWeb`. All app files are at this
Git repository's root; the nested local checkout path is not a deployment root.

## Original Pages setup (reference only)

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

## Future automatic deployment check

Commit 4 uses the exact message `ci: connect Cloudflare Pages deployment` for the
owner-requested configuration and is pushed to `main`. On the next planned push,
check that Cloudflare rebuilds automatically and serves the new version.

Git integration automatically builds connected pushes. Cloudflare's build logs
and deployment commit SHA should match the pushed commit. Never invent a live URL.

References:

- [Cloudflare Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare React guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)

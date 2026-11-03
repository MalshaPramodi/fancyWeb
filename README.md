# Fancytastic Christmas Cookie Box

A mobile-first Christmas cookie box ordering website for Fancytastic, Sri Lanka.
The project follows [FANCYTASTIC_AGENT_PLAN.md](FANCYTASTIC_AGENT_PLAN.md).
See [PROGRESS.md](PROGRESS.md) for the phase and commit checklist.

## Current scope

Phase 0 setup. Phases 1–4 will use mock data and clearly marked placeholder
images only. Backend work starts only after the owner's Phase 4 design approval.
The agent must stop after commit 25 for review.

The owner chose to retain the existing `MalshaPramodi/fancyWeb` GitHub repository.

## Local development

Use Node.js 24 (see `.node-version`) and npm. From the repository root:

```sh
npm ci
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.
Vite prints the local development URL (normally http://localhost:5173).

```sh
npm run build        # strict TypeScript check and static build into dist/
npm run lint         # ESLint, zero warnings
npm run format:check # Prettier check
npm run format       # apply formatting
npm run preview      # serve the production build locally
```

The stack is React, Vite, TypeScript, Tailwind CSS 3, ESLint and Prettier.
Tailwind 3 keeps theme tokens in `tailwind.config.js`, as the plan specifies.
TypeScript 5.9 is pinned within the ESLint TypeScript parser's supported range.

## Structure

```text
public/placeholders/  Labelled image placeholders, added in Phase 1
src/components/       Shared UI components
src/steps/            BuildBox, Delivery, Payment and Done steps
src/store/            Box and order state
src/config/           brand.ts, products.ts, delivery.ts, payment.ts (later phases)
src/lib/              Formatting, validation and upload helpers
src/styles/           Shared styles and animation rules
docs/                 Deployment and later owner documentation
```

Empty directories are tracked with `.gitkeep` files. No backend is implemented.

## Business content and environment

All business content must live in the four config files listed above when those
features are introduced. Prices, delivery dates and fees, bank details, WhatsApp
number and real photos are still needed. Use labelled placeholders; do not invent
real values. Currency is LKR and business timezone is Asia/Colombo.

`.env.example` documents the later `VITE_ORDER_API_URL` setting. It stays empty
through Phase 4. Never commit secrets. Vite's `VITE_` variables are public browser
configuration, not a place to store credentials.

## Cloudflare Pages

Follow [docs/deployment.md](docs/deployment.md) to connect this repository.
Deployment remains pending until the Cloudflare connection and live URL are
verified. A local preview does not establish the required hosted deployment.

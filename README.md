# Fancytastic Christmas Cookie Box

A mobile-first Christmas cookie box ordering website for Fancytastic, Sri Lanka.
The project follows [FANCYTASTIC_AGENT_PLAN.md](FANCYTASTIC_AGENT_PLAN.md).
See [PROGRESS.md](PROGRESS.md) for the phase and commit checklist.

## Current scope

Phases 0–3 are complete: setup, elegant Christmas theme, cookie box builder,
snowfall, mobile summary and validated delivery details with gift options.
The preview uses labelled placeholder images, LKR 0 prices/fees and example
December dates. Next requires a full box and valid delivery details. Payment
currently shows a placeholder; payment and confirmation are Phase 4.
Backend work starts only after the owner's Phase 4 design approval.
The agent must stop after commit 25 for review.

The owner chose to retain the existing `MalshaPramodi/fancyWeb` GitHub repository.

The current design is elegant and modern: Cormorant Garamond headlines, Inter
body text, evergreen and ivory, antique gold details and a burgundy accent.
Section 2 of the plan defines the visual direction. Phase 3 resumed after UI review.

Site-wide canvas snowfall is configured in `src/config/brand.ts` under `snowfall`.
Its colour and density feed Tailwind theme tokens. The shared layout mounts it once,
behind content and controls. A header toggle remembers the visitor's choice when
localStorage is available; hidden tabs and reduced-motion preferences pause drawing.

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
npm test             # box state, phones, delivery schedule and gift validation
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

Neutral SVG placeholders keep their original filenames. Their palette is generated
from `tailwind.config.js` by `scripts/generate-placeholders.mjs` during builds.
Replacing a placeholder with your own file without the generator marker preserves
it on subsequent builds.

## Business content and environment

All business content must live in the four config files listed above when those
features are introduced. Prices, delivery dates and fees, bank details, WhatsApp
number and real photos are still needed. Use labelled placeholders; do not invent
real values. Currency is LKR and business timezone is Asia/Colombo.

`src/config/delivery.ts` marks fees and dates with `isPlaceholder: true`. Its
example delivery dates are 20–22 December 2026 and its example order deadline is
18 December 2026; these are demo values, not confirmed availability. Validation
enforces the configured dates and deadline in Asia/Colombo, including on submit.
The gift-message limit is configurable. Checkout details stay in memory while
navigating and reset on a page reload; only the snow preference uses localStorage.

`.env.example` documents the later `VITE_ORDER_API_URL` setting. It stays empty
through Phase 4. Never commit secrets. Vite's `VITE_` variables are public browser
configuration, not a place to store credentials.

## Cloudflare Pages

Follow [docs/deployment.md](docs/deployment.md) to connect this repository.
The owner-requested `wrangler.jsonc` serves the `dist` build as Cloudflare static
assets with single-page-application fallback.
Live setup preview: https://fancyweb.mpramodi0039.workers.dev/ (verified).
The owner selected Cloudflare Workers static assets instead of Pages hosting.

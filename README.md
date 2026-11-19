# Fancytastic Christmas Cookie Box

A mobile-first Christmas cookie box ordering website for Fancytastic, Sri Lanka.
The project follows [FANCYTASTIC_AGENT_PLAN.md](FANCYTASTIC_AGENT_PLAN.md).
See [PROGRESS.md](PROGRESS.md) for the phase and commit checklist.

## Current scope

Phases 0–4 and the owner-requested standalone treats extension are implemented:
elegant Christmas styling, cookie box builder and packaging animation, snowfall,
delivery/gift options, placeholder bank details, slip previews/compression and
mock confirmation. Customers may choose a full gift box, standalone Danish Butter
Cookies and Mini Christmas Cookie Packs, or both. At least one item is required;
a started gift box must be filled. All prices and delivery fees remain labelled
LKR 0 placeholders, with example December dates.
See [the preview notes](docs/preview-notes.md) for the review walkthrough.
Backend work starts only after the owner's Phase 4 design approval.
The agent stops after the six standalone-treats extension commits for review.

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
npm test             # box/extras state, totals, delivery, slips and mock orders
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
src/config/           brand.ts, products.ts, delivery.ts, payment.ts
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

`src/config/products.ts` holds both cookie flavours and `extraProducts`, including
their descriptions, image paths, placeholder unit prices and placeholder maximum
quantities of 20. Quantity controls accept 0 through each configured maximum.
Replace `public/placeholders/danish-butter-cookies.svg` and
`public/placeholders/mini-christmas-pack.svg` by filename when photos are ready.

`src/store/selection.ts` is the source of truth for quantity limits, selected
extra lines, checkout readiness, totals and the serializable order payload.
The payload has `box` (or null), `extras`, `delivery` and `totals`; see the plan
for its full shape. An empty box costs nothing and is omitted from the payload.
Payment and receipts use the same grand total. Mock submission takes a detached
snapshot of the payload and adds `id` and `createdAt`; confirmation and WhatsApp
use that snapshot. Order again clears extras along with the rest of the order.

Payment details in `src/config/payment.ts` are explicitly marked placeholders.
Test uploads accept JPG/PNG up to 10 MB and PDF up to 1 MB; large images are
compressed locally to at most 1 MB. Files stay in memory and are never uploaded.
Confirmation waits briefly and generates an `FT-DEMO` reference without an API
request. No real order or payment is created. The WhatsApp button stays disabled
until the owner supplies a real business number in `src/config/brand.ts`.

`.env.example` documents the later `VITE_ORDER_API_URL` setting. It stays empty
through Phase 4. Never commit secrets. Vite's `VITE_` variables are public browser
configuration, not a place to store credentials.

## Cloudflare Pages

Follow [docs/deployment.md](docs/deployment.md) to connect this repository.
The owner-requested `wrangler.jsonc` serves the `dist` build as Cloudflare static
assets with single-page-application fallback.
Published preview: https://fancyweb.mpramodi0039.workers.dev/.
The owner selected Cloudflare Workers static assets instead of Pages hosting.

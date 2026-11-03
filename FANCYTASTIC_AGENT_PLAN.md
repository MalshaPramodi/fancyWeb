# Fancytastic Christmas Cookie Box: Agent Workplan

> **For the coding agent:** This file is the single source of truth for the project. Read it fully before writing any code. Follow the phases in order, make the commits listed in section 7, and stop at every checkpoint marked **STOP**. If something is unclear or missing (prices, dates, bank details), use a clearly marked placeholder in the config files instead of inventing real data.

---

## 1. Goal

Build a seasonal, mobile-first ordering website for **Fancytastic**, a small Sri Lankan food business launching a **Christmas cookie pack**.

Customers will:
1. Build a gift box by **dragging cookies into a box**.
2. Enter delivery details.
3. Pay by bank transfer and **upload the payment slip** (used because a payment gateway may not be available).
4. See an **order confirmation**.

The site must be **production-ready**, usable by real customers, and **hosted for free**. It exists only for the Christmas season, so the Christmas look and feel is a core requirement.

## 2. Look and feel: elegant and modern

The reference video "Fancy_Webs.mp4" informs the **build-your-own-box interaction**, not the visual style. Preserve all existing drag, tap, keyboard, sizing, summary and effects-toggle functionality.

- Keep the **box in the centre**, with cookie trays alongside it on larger screens and stacked comfortably on phones. Use generous white space and a calm visual hierarchy.
- Palette: **deep evergreen, ivory/cream, muted antique gold, with burgundy as the only accent**. All colours, including placeholder tints, borders and shadows, originate in the Tailwind theme tokens.
- Fonts: **Cormorant Garamond** (or Playfair Display) for refined serif headlines and **Inter** (or DM Sans) for body text and buttons. Use light to regular weights, Google Fonts with fallbacks, and no festive display font.
- Use **1px borders, subtle soft shadows and small radii**. No thick outlines, chunky buttons or candy-cane decoration.
- Use thin line icons, a restrained **gold ribbon on the box**, and quiet, slow snowfall. Preserve the effects toggle and respect `prefers-reduced-motion` for every animation.
- Snowfall uses one reusable full-screen fixed canvas in the shared layout, behind content and controls. Mix small soft ice-blue-white dots and thin six-arm flakes with slow downward drift and slight sway. Keep colour and density in theme tokens sourced from `src/config/brand.ts`, alongside size, speed and opacity settings. Scale density with the viewport (about 25 mobile / 60 desktop), handle resize and pixel ratio, pause hidden tabs, and disable motion for reduced-motion users. Place a persisted on/off toggle in the header; default on and guard localStorage access. Snow must not intercept clicks, obscure fields or affect drag-and-drop.
- Replace every cartoon asset in `/public/placeholders/` with a clearly labelled, neutral tinted rectangle and simple outline cookie silhouette. **Keep all filenames** so real photographs can replace them later.
- Motion is **slow and smooth**, using gentle fades or short eased transitions for filled slots and the receipt. **No bouncing or shaking**, including full-box feedback. Future box closing follows the same restrained direction. This supersedes earlier animation wording elsewhere in the plan and its historical commit messages.
- Receipt and checkout retain a clear item summary, total and a centred card with a few fields and one clear button.
- Copy is **short and warm, with no exclamation marks or emojis**. Keep text easy to translate into Sinhala and Tamil later.

This is a visual revision only. Do not start Phase 3 or change ordering behaviour as part of this revision.

## 3. Tech stack (all free)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS | Fast, deploys as static files |
| Drag and drop | Native Pointer Events (or `@dnd-kit`) | Must work on touch phones; tap-to-add fallback |
| Animation | CSS plus Framer Motion (sparingly) | Keep it light for low-end phones |
| Hosting | **Cloudflare Pages** (alternatives: Netlify, Vercel) | Free, auto-deploys from GitHub |
| Orders and slips | **Google Apps Script web app + Google Sheet + Google Drive** | Free, no server, owner manages orders in a Sheet |
| Notifications | Apps Script email to the owner, plus a prefilled WhatsApp link for the customer | Free |
| Optional later | PayHere (Sri Lankan payment gateway) | Only if card payments are wanted |

Alternative backend: Supabase (database plus file storage). Free projects can pause after inactivity, so check the current free-tier terms before choosing it.

## 4. Rules for the agent

1. **Frontend first.** Phases 1 to 4 use mock data and placeholder images only, with no backend. **STOP after Phase 4** for the owner's design review.
2. **All business content lives in config files**, never hard-coded in components: `src/config/brand.ts`, `products.ts`, `delivery.ts`, `payment.ts`.
3. **Placeholders:** use clearly labelled placeholder images in `/public/placeholders/` (for example `cookie-choco.svg`, `logo.svg`, `box.svg`, `hero.svg`) so they can be swapped later by filename.
4. **Mobile-first.** Most customers will be on phones. Design and test at 360px width first.
5. **Every drag action needs a tap alternative** (tap a cookie to add it, tap a filled slot to remove it) and keyboard support.
6. **Currency is LKR**, formatted like `LKR 2,600`. **Timezone is Asia/Colombo.**
7. **No secrets in the repo.** The Apps Script URL goes in an environment variable (`VITE_ORDER_API_URL`), with `.env.example` committed.
8. **Small, conventional commits** (section 7). Each commit leaves the app building and working.
9. After each phase: run build and lint, do a manual check, then summarise what was done and what is next.
10. Keep a `PROGRESS.md` file with a checklist of phases and commits, updated as work completes.
11. Do not add features that are not in this plan without asking.

## 5. Project structure (suggested)

```
fancytastic-xmas/
├─ public/placeholders/        # swap real images here by filename
├─ src/
│  ├─ components/              # Box, Slot, CookieTray, Receipt, Stepper, Snow, Lights ...
│  ├─ pages/ or steps/         # BuildBox, Delivery, Payment, Done
│  ├─ store/                   # box + order state
│  ├─ config/                  # brand.ts, products.ts, delivery.ts, payment.ts
│  ├─ lib/                     # format (LKR), validation, image compression, api client
│  └─ styles/
├─ docs/                       # backend-setup.md, owner-guide.md
├─ apps-script/                # Code.gs for the Google Apps Script backend
├─ .env.example
├─ PROGRESS.md
└─ README.md
```

## 6. Phases

### Phase 0: Setup
- Create the GitHub repo `fancytastic-xmas`, scaffold Vite + React + TypeScript + Tailwind, add ESLint and Prettier, folder structure and README.
- Connect Cloudflare Pages to the repo so every push to `main` produces a live preview URL early.

### Phase 1: Design system and layout shell
- Theme tokens (colours, fonts, radii, shadows) in the Tailwind config. Light theme is enough; keep contrast accessible.
- Header (logo placeholder, "Christmas Cookie Box" title), snow and lights effect (respects `prefers-reduced-motion`, with an on/off toggle), footer with contact placeholders.
- Stepper with four steps: **Build box, Delivery, Payment, Done**.
- Sticky bottom bar on mobile showing progress (for example "7/12 cookies"), the running total, and Back and Next buttons.

### Phase 2: Box builder (core feature)
- Box size selector (6, 9 or 12 cookies; prices in config). Changing size keeps existing cookies where possible.
- Cookie trays, each with name, placeholder photo and a count badge. Placeholder flavours: Choco Chip, Gingerbread, Butter Star, Red Velvet, Cashew Crunch, Coconut Snow.
- Drag a cookie into the box and it lands in the first empty slot. Tapping a cookie adds it. Tapping a filled slot removes it.
- "Box is full" message with a shake animation. A "Surprise me" button fills the remaining slots.
- Receipt panel listing items, box price and total, sliding in as the box fills.
- State in one store (for example Zustand or React context), with unit tests for add, remove, resize and totals.

### Phase 3: Delivery details and gift options
- Fields: name, WhatsApp/phone (validate Sri Lankan formats such as `07XXXXXXXX` and `+947XXXXXXXX`), address, delivery area (Colombo and suburbs, other areas, self pickup, each with its fee from config), preferred delivery date (limited to the dates and last-order date in config), optional gift message with a character limit, and a "this is a gift" toggle.
- Inline validation with plain messages that say how to fix the problem.

### Phase 4: Payment, slip upload and confirmation
- Show bank transfer details from config (bank, account name, account number, branch) with a **copy button**, and the exact amount to pay.
- Slip upload: accept JPG, PNG or PDF; show a preview; compress images in the browser to about 1 MB or less; reject files that are too large or the wrong type.
- Required checkbox: "I have transferred the amount and attached my slip."
- A card payment option shown as "Coming soon" so a gateway can be added later.
- Confirmation screen: closing-box animation, order number (for example `FT-1234`), summary, status "Payment under verification", a **"Send details on WhatsApp"** button with a prefilled message, and an "Order again" button.
- Submission is mocked in this phase (short delay and a fake order number).
- **STOP. Share the live preview URL with the owner for design review and adjustments.**

### Phase 5: Backend integration (only after design approval)
- Apps Script web app that receives the order as JSON, validates it, saves the slip to a Drive folder, appends a row to a Google Sheet (order number, date, name, phone, address, items, total, slip link, status) and emails the owner.
- Order number generated server-side. Guard against double submission (disable the button, send an idempotency key).
- Status column values: Pending, Verified, Out for delivery, Delivered, Cancelled.
- Frontend shows a clear loading state and a retry message on failure. If the request fails, show the WhatsApp fallback so no order is lost.
- Document the deployment steps in `docs/backend-setup.md` for the owner.

### Phase 6: Production hardening
- Accessibility: keyboard use, focus states, colour contrast, alt text, labelled form fields.
- Performance: compressed images (WebP), lazy loading, target Lighthouse 90+ on mobile.
- SEO and sharing: page title, meta description, Open Graph image (for Facebook, WhatsApp and Instagram previews).
- Basic spam protection: hidden honeypot field and a simple rate limit in Apps Script.
- A short privacy note on the checkout page saying what customer data is collected and why. Collect only what delivery needs.
- Offline and error states, a 404 page, and an "ordering closed" banner driven by the last-order date in config.
- Optional analytics (a free, privacy-friendly option, or Cloudflare's built-in).

### Phase 7: Launch and handover
- Replace placeholders with the real photos, logo, prices, bank details and WhatsApp number.
- Test end to end on a real Android phone and an iPhone: place a test order, then check the Sheet, Drive and email.
- Attach a custom domain if the owner has one (optional).
- Write `docs/owner-guide.md`: how to change prices, flavours, dates and images, and how to read and manage orders.
- Tag release `v1.0.0`. After Christmas, add a "Closed for this season" switch.

## 7. GitHub commit plan

Use Conventional Commits. Push to `main` for the first commits, then use feature branches and pull requests if preferred.

**Phase 0**
1. `chore: scaffold Vite React TypeScript project`
2. `chore: add Tailwind, ESLint, Prettier`
3. `docs: add README and project structure`
4. `ci: connect Cloudflare Pages deployment`

**Phase 1**
5. `feat(theme): add Christmas design tokens and fonts`
6. `feat(layout): add header, footer and page shell`
7. `feat(fx): add snowfall and twinkling lights with reduced-motion support`
8. `feat(nav): add stepper and sticky bottom bar`
9. `chore(assets): add placeholder images and brand config`

**Phase 2**
10. `feat(config): add products, box sizes and pricing config`
11. `feat(state): add box store with unit tests`
12. `feat(box): render gift box with slots`
13. `feat(trays): add cookie trays with count badges`
14. `feat(dnd): add pointer-based drag and drop with ghost element`
15. `feat(dnd): add tap-to-add, tap-to-remove and keyboard support`
16. `feat(box): add size selector, full-box feedback and surprise-me`
17. `feat(receipt): add sliding receipt panel with totals`

**Phase 3**
18. `feat(delivery): add delivery form with validation`
19. `feat(delivery): add area fees, date picker and gift message`

**Phase 4**
20. `feat(payment): add bank details panel with copy buttons`
21. `feat(payment): add slip upload with preview and compression`
22. `feat(confirm): add confirmation screen with closing-box animation`
23. `feat(confirm): add WhatsApp prefilled message button`
24. `feat(order): add mocked order submission`
25. `docs: add preview notes for owner review` (**STOP: review checkpoint**)

**Phase 5**
26. `feat(api): add Apps Script order endpoint and Sheet schema`
27. `feat(api): save payment slips to Drive`
28. `feat(api): send owner notification email`
29. `feat(order): connect frontend to API with retry and fallback`
30. `docs: add backend setup guide`

**Phase 6 and 7**
31. `fix(a11y): improve focus, contrast and labels`
32. `perf: optimise images and lazy load`
33. `feat(seo): add meta tags and Open Graph image`
34. `feat(security): add honeypot and double-submit protection`
35. `feat(ui): add ordering-closed banner from config`
36. `docs: add owner guide`
37. `chore(release): v1.0.0`

## 8. Acceptance checklist (before launch)

- [ ] A customer on a 360px phone can build a full box by dragging or tapping, with no horizontal scroll.
- [ ] Cannot proceed unless the box is full, required fields are valid and a slip is attached.
- [ ] Totals are correct for every box size and delivery area.
- [ ] A test order appears in the Sheet with the slip link, and the owner receives an email.
- [ ] Failed submissions show a clear message and the WhatsApp fallback.
- [ ] The last order date is enforced. All text and images are editable via config or filename swap.
- [ ] Lighthouse mobile score of 90 or higher for performance and accessibility.

## 9. Information still needed from the owner

Use placeholders until these are provided:
- Cookie flavours and box prices
- Delivery areas, fees and delivery dates, plus the last order date
- Bank account details and the WhatsApp number
- Logo and cookie photos
- Whether Sinhala and Tamil are needed in addition to English

# Owner preview notes

The frontend through Phase 4, including the standalone treats extension, is ready
for owner review at https://fancyweb.mpramodi0039.workers.dev/. The owner authorized
six extension commits with a push after each. Backend implementation is on hold.

## Run locally

From the repository directory containing `package.json`, run:

```sh
npm.cmd run dev
```

Open the URL printed by Vite, normally http://localhost:5173. Keep the terminal
running. On other shells, `npm run dev` works too.

## Review the checkout

1. Try the three order types: extras only, gift box only, and both together.
   Under Add more treats, choose Danish Butter Cookies and/or Mini Christmas
   Cookie Packs using minus, plus or a typed quantity. Confirm quantities stay
   between 0 and the placeholder maximum of 20, and each selected line shows
   its total. With extras only, leave the box empty and continue directly.
   An entirely empty order cannot continue; a partly filled box must be finished
   or its cookies removed before continuing with extras only.
2. For a gift box, choose a box size. Drag, tap or use the keyboard to add cookies, or choose
   Surprise me. When full, the same box gently closes into an evergreen Christmas
   package with a gold ribbon. Use Open box to edit to change cookies, or Wrap my
   box to close it again. A full box enables Next. Check the receipt and bottom
   summary include every selected item and quantity, with the correct total.
3. Enter test delivery details with a valid Sri Lankan-format phone number.
   Try pickup and delivery, the gift toggle and optional message, then Back/Next.
   The example dates are 20–22 December 2026, with an example last-order date of
   18 December 2026 in Asia/Colombo. These are unconfirmed demo dates.
4. Review the bank placeholders, copy buttons and total. Do not transfer money.
   All prices and fees are labelled LKR 0 placeholders.
5. Attach a non-sensitive test JPG, PNG or PDF. JPG/PNG inputs may be up to
   10 MB and are compressed locally to at most 1 MB when needed. PDFs must
   already be at most 1 MB. Check the preview, replace/remove controls and errors.
6. For this preview only, tick the required transfer acknowledgement and confirm.
   A short loading state leads to a demo order number, closing-box animation,
   order summary and Payment under verification status. No real payment or
   order is created, and the file is never sent anywhere. Extras-only orders skip
   the gift-box animation. Confirm all chosen extras appear with their quantities.
7. Check Order again clears the box, extras, delivery details and slip. Try the snow
   toggle, keyboard navigation and a narrow phone-sized window. Reduced-motion
   settings suppress the snow and closing animation.

The WhatsApp button is disabled because the business number is still missing.
The prefilled-message helper is ready for a real configured number; no number
has been invented. Card payment remains Coming soon.

## Content still needed

- `src/config/products.ts`: confirmed flavours, box/extra prices, extra descriptions
  and per-product maximum quantities (currently placeholder 20).
- `src/config/delivery.ts`: areas, fees, delivery dates and last-order date.
- `src/config/payment.ts`: bank, account name, number and branch.
- `src/config/brand.ts`: business WhatsApp number and contact information.
- `public/placeholders/`: real logo and photos, retaining the existing filenames
  or updating the configured paths together.

All checkout data and files stay in browser memory and reset on reload. Only
the snow preference uses localStorage. There is no Sheet, Drive upload, email
notification or backend integration at this stage.

## Checks and review checkpoint

Build, lint and 22 unit tests pass. Browser checks at 360px and 1440px cover the
complete mock checkout, upload errors, image compression, PDF preview, copy
fallback, duplicate-submit blocking, deadline revalidation, reset and reduced
motion. No horizontal overflow, browser exceptions or API requests were observed.
This does not replace testing on a physical phone.

The standalone treats checks cover typed quantities and configured limits, empty
and partial-box blocking, and six complete checkouts: extras-only, box-only and
combined orders on mobile and desktop. Each delivery area is exercised, selected
items appear throughout checkout, Back preserves quantities, and Order again
clears the entire selection. Nonzero test fixtures check total arithmetic while
the actual product config keeps placeholder prices at LKR 0.

The extension is a frontend review checkpoint. Phase 5 requires separate design
approval; no backend work has started. All business details remain placeholders.

# UPL — Universal Pay Link (one QR, any money)

Static, non‑custodial pay link router. Rails:
- **Swiss QR‑bill** (CH/LI IBAN; CHF/EUR; SPC 0200), **SEPA EPC QR** (Instant‑ready), **UPI**, **Pix**,
- **Lightning/LNURL**, **Bitcoin**, **Solana Pay (USDC/SOL)**, **EVM**,
- **PayPal.Me**, **Revolut.me**, **Cash App**, **Venmo**, plus copy IDs for **Zelle**, **Interac**, **PayID (AU)**, **FPS (HK)**.

## Demo
Try the demo at: https://mgillr.github.io/upl/?u=demo

## Use
- Host on GitHub Pages.
- Create `/profiles/<n>.json`.
- Open: `/index.html?u=<n>` (or Worker `/u/<n>`).
- Optional query: `?amount=10&note=coffee&fiat=CHF`.

## Dev quickstart
- `index.html` — QR, Swiss QR‑bill, EPC QR, fintech links, share.
- `make.html` — profile generator (Swiss address + new rails).
- `schema.json` — profile schema.
- `.github/workflows/validate.yml` — validates profiles.
- `scripts/build-directory.mjs` + `build-directory.yml` — static directory pages.
- `worker.js` — Cloudflare redirect `/u/<n>` → Pages URL.
- `telegram-worker.js` — (optional) Telegram webhook bot.

## Swiss QR‑bill Notes
- Line format per SIX "Swiss Implementation Guidelines for the QR-bill" (SPC 0200, UTF‑8, trailer `EPD`).
  Creditor structured address uses AdrTp `S`. Currency CHF or EUR. (See Table "Swiss QR Code data elements".)

## Recent Fixes
- Fixed syntax error in Swiss QR-bill helper function (changed `reference:''` to `reference=''`)
- Removed duplicate variable declarations to prevent JavaScript errors
- Added `.nojekyll` file to disable Jekyll processing on GitHub Pages
- Fixed payment method selection so all options work correctly
- Fixed modal handling to prevent multiple modals from opening at once
- Improved modal closing behavior

## GitHub Pages Setup
To host this on your own GitHub Pages:

1. Fork this repository
2. Go to your repository's Settings > Pages
3. Under "Source", select "Deploy from a branch"
4. Select the "gh-pages" branch and "/ (root)" folder
5. Click "Save"
6. Wait a few minutes for the site to deploy
7. Your site will be available at `https://[your-username].github.io/upl/`

**Important**: Make sure GitHub Pages is enabled in your repository settings. If you're the repository owner, go to Settings > Pages and ensure it's configured correctly.
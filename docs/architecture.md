# Architecture

## Overview

```
Browser ──► Firebase Hosting (static Nuxt output from firebase/www/)
   │
   └─ form POST ──► Cloud Function `submitForm` (us-central1)
                        │ zod validation (models.ts)
                        │ reCAPTCHA v3 (score ≥ 0.5, bypassed in emulator)
                        ├─► notification email → business inbox
                        └─► confirmation email → visitor (if email present)
                             via Gmail SMTP + nodemailer
```

## Pieces

- **Nuxt 4 (`www/`)** builds/generates the static marketing site. The deploy flow places the generated output into `firebase/www/`, which is why `firebase.json` sets `hosting.public` to `"www"` (relative to `firebase/`).
- **Firebase Hosting** serves the static site with long-lived cache headers for `_nuxt/`, `_fonts/`, `images/`, `videos/`.
- **Cloud Functions** (`firebase/functions/`) expose `submitForm`, an HTTPS function handling all site forms. The static site POSTs to it from CORS-allowed origins only.
- **Secrets** (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_SENDER`, `RECAPTCHA_SECRET_KEY`) live in Firebase Secret Manager via `defineSecret`.
- **Email** goes out via Gmail SMTP + nodemailer; templates are inline-styled HTML in `functions/src/templates/`.
- **reCAPTCHA v3** guards submissions (min score 0.5); skipped when running in the emulator.
- **Content** lives in `www/content/` (Nuxt Content `news` collection).

## i18n — important

The site is bilingual (en/es). **Every new page and every internal link MUST use `localePath()`** — e.g., `<NuxtLink :to="localePath('contact')">` — never hardcoded paths. This is what keeps a visitor's language selection intact across navigation. Translation files live in `www/i18n/locales/` and are registered in `www/i18n/i18n.config.ts`.

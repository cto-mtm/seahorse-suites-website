# Architecture

## Overview

```
Browser ──► Firebase Hosting (static Nuxt output from firebase/www/)
   │
   └─ form POST ──► Cloud Function `submitForm` (us-central1)
                        │ zod validation (models.ts)
                        │ reCAPTCHA Enterprise assessment (score ≥ 0.5, bypassed in emulator)
                        ├─► notification email → business inbox
                        └─► confirmation email → visitor (if email present)
                             via Gmail SMTP + nodemailer
```

## Pieces

- **Nuxt 4 (`www/`)** builds/generates the static marketing site. The deploy flow places the generated output into `firebase/www/`, which is why `firebase.json` sets `hosting.public` to `"www"` (relative to `firebase/`).
- **Firebase Hosting** serves the static site with long-lived cache headers for `_nuxt/`, `_fonts/`, `images/`, `videos/`.
- **Cloud Functions** (`firebase/functions/`) expose `submitForm`, an HTTPS function handling all site forms. The static site POSTs to it from CORS-allowed origins only.
- **Secrets** (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_SENDER`) live in Firebase Secret Manager via `defineSecret`. reCAPTCHA needs no secret — the function calls the Assessment API with its own service-account credentials (ADC).
- **Email** goes out via Gmail SMTP + nodemailer; templates are inline-styled HTML in `functions/src/templates/`.
- **reCAPTCHA Enterprise** guards submissions. The client (`enterprise.js` + `grecaptcha.enterprise.execute`) produces an action-scoped token; the function creates an Assessment via the `@google-cloud/recaptcha-enterprise` client library (authenticated by ADC) and rejects submissions whose token is invalid, whose action doesn't match, or whose score is below 0.5. Skipped when running in the emulator.
- **Content** lives in `www/content/` (Nuxt Content `news` collection).

## i18n — important

The site is bilingual (en/es). **Every new page and every internal link MUST use `localePath()`** — e.g., `<NuxtLink :to="localePath('contact')">` — never hardcoded paths. This is what keeps a visitor's language selection intact across navigation. Translation files live in `www/i18n/locales/` and are registered in `www/i18n/i18n.config.ts`.

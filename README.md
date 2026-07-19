# Seahorse Suites — Website

Marketing site for **Seahorse Suites** (seahorsesuites.com): a Nuxt 4 static site served by Firebase Hosting, with Cloud Functions handling form submissions.

## What's in the box

- `www/` — Nuxt 4 site (Nuxt UI, Tailwind, i18n en/es, Nuxt Content news collection, SEO module, GA via nuxt-gtag).
- `firebase/` — Hosting config + `submitForm` Cloud Function (zod validation, reCAPTCHA v3, Gmail SMTP emails via nodemailer).
- `docs/architecture.md` — how the pieces fit together.

## Quick start

```bash
cd www && npm install && npm run dev          # site on :3000
cd ../firebase/functions && npm install       # functions deps
npm run build                                 # compile functions
firebase emulators:start --only functions     # forms backend locally
```

## Routing note

All internal app navigation uses `@nuxtjs/i18n`. Always use `localePath()` (e.g., `<NuxtLink :to="localePath('contact')">`) so language preferences persist across page loads.

## Image optimization

Run `npm run optimize:images` in `www/` to batch convert `public/images/` content to `.webp`. Use `npm run optimize:images -- --dry-run` to preview. Flags: `--quality=78`, `--max-width=1920`.

## Logo assets

Originals live in `/logos/` (color, white, black — 2000×2000 PNG). Trimmed, web-optimized versions are at `www/public/images/logo/seahorse-{color,white,black}.png` and rendered via the `SeahorseMark.vue` component (`variant` + `size` props).

## Adding a new form type

1. Edit `firebase/functions/src/models.ts` — add a new key to `formConfigs` with its zod schema.
2. Redeploy functions (`npm run deploy` in `firebase/functions/`).
3. Call it from the site: `useSubmitForm('your-type', {...})`.

## Adding a legacy redirect

1. Add the 301 rule to `routeRules` in `www/nuxt.config.ts`.
2. Record it in `legacy_urls.md`.

## Required secrets (before deploying functions)

```bash
firebase functions:secrets:set GMAIL_USER
firebase functions:secrets:set GMAIL_APP_PASSWORD
firebase functions:secrets:set GMAIL_SENDER
firebase functions:secrets:set RECAPTCHA_SECRET_KEY
```

## Deploy

Build the Nuxt site so its static output lands in `firebase/www/` (e.g., `npm run generate` in `www/`, then copy/point output to `firebase/www/`), then run `firebase deploy` from the repo root.

## Keeping dependencies fresh

Versions in `package.json` are pinned to the dates this boilerplate was
generated. They're intentionally NOT auto-updated on install — the goal is
that `npm install && npm run dev` always works on day one.

Recommended workflow when starting a new project from this scaffold:

1. `npm install` in both `www/` and `firebase/functions/` and confirm
   `npm run dev` boots cleanly.
2. Commit the scaffold as your baseline (`git commit -m "initial scaffold"`).
3. Run `npm outdated` in each folder to see drift, and `npm audit` for
   security issues.
4. Upgrade deliberately — one major version at a time, testing between each.
   Watch especially for breaking changes in Nuxt, Nuxt UI, Firebase
   Functions, and zod (these have all shipped breaking majors in the past).
5. After upgrading, re-run `npm run dev` and click through the key pages /
   submit the contact form before committing.

Avoid running `npm update` blindly — it will pull breaking majors without
warning and you'll lose the "clean baseline" property.

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
    timeline: { enabled: true }
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    'nuxt-gtag',
    '@nuxtjs/i18n'
  ],

  i18n: {
    // Resolved relative to the i18n/ restructure dir → i18n/i18n.config.ts
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'es', name: 'Español', language: 'es-ES' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default'
  },

  runtimeConfig: {
    public: {
      // Deployed `submitForm` Cloud Function (2nd-gen HTTPS, us-central1).
      submitFormUrl: 'https://us-central1-seahorse-suites-website.cloudfunctions.net/submitForm',
      // reCAPTCHA Enterprise SITE key (public). Used client-side by
      // grecaptcha.enterprise.execute(). The Cloud Function verifies the token
      // via the reCAPTCHA Enterprise Assessment API. Set to 'REPLACE_ME' to
      // disable (forms then send no token — fine locally, where the Cloud
      // Function bypasses reCAPTCHA in the emulator).
      recaptchaSiteKey: '6Lc9stctAAAAAPDg-NB8ukUbsbkUqcWxoAR7qwIg'
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        // Generated from logos/color.png by `node scripts/generate-favicons.mjs`
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16.png', sizes: '16x16' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  gtag: {
    id: 'REPLACE_ME_GA_ID'
  },

  site: {
    url: 'https://seahorsesuites.com',
    name: 'Seahorse Suites',
    // Keyword-rich site description echoing the terms guests search on Airbnb
    // and Vrbo (vacation rental, pet-friendly, Old Town Sanibel, Gulf, shelling).
    description: 'Seahorse Suites — pet-friendly vacation rentals in Old Town Sanibel Island, Florida. Newly renovated beach-house suites steps from the Gulf of Mexico, the historic Sanibel Lighthouse, and world-famous shelling beaches. Book on Airbnb or Vrbo, or direct.',
    defaultLocale: 'en'
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  image: {
    provider: 'none'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'accent', 'success', 'info', 'warning', 'error', 'neutral']
    }
  },

  routeRules: {
    // ────────────────────────────────────────────────────────────
    // LEGACY URL REDIRECTS
    // Add 301 redirects for old URLs from a prior site or domain
    // restructure. Keep this list in sync with /legacy_urls.md.
    //
    // Pattern A — single page:
    //   '/old-path': { redirect: { to: '/new-path', statusCode: 301 } },
    //
    // Pattern B — directory with wildcard:
    //   '/old-section/**': { redirect: { to: '/new-section', statusCode: 301 } },
    //
    // Pattern C — section merged into another:
    //   '/team': { redirect: { to: '/about#team', statusCode: 301 } },
    // ────────────────────────────────────────────────────────────

    // '/rooms': { redirect: { to: '/#suites', statusCode: 301 } },
  }
})

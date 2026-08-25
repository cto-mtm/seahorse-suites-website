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
      // reCAPTCHA v3 SITE key (public). REPLACE_ME with the real key to enable
      // bot protection in production. Until then, forms send no token — which
      // is fine locally (the Cloud Function bypasses reCAPTCHA in the emulator).
      recaptchaSiteKey: 'REPLACE_ME'
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  gtag: {
    id: 'REPLACE_ME_GA_ID'
  },

  site: {
    url: 'https://seahorsesuites.com',
    name: 'Seahorse Suites',
    description: 'Your beachfront escape on Sanibel Island, FL. Pet-friendly suites in Old Town Sanibel — steps from the Gulf, the lighthouse, and world-famous shelling beaches.',
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

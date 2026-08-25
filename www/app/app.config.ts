export default defineAppConfig({
  // Single source of truth for public contact details. Reused by the
  // footer, the reservation form's mailto:/WhatsApp templates, etc.
  contact: {
    email: 'seahorsesuites@gmail.com',
    // Display string (human-readable)
    phone: '+1 573 529 1529',
    // Digits only, E.164 without the '+', for tel: and wa.me links
    phoneE164: '15735291529',
    // WhatsApp number (same line). wa.me expects digits only, no '+'.
    whatsapp: '15735291529'
  },
  booking: {
    // Airbnb host profile — lists all properties in one place (used by the Book Now modal)
    airbnbUrl: 'https://www.airbnb.com/users/profile/1529338761913645803',
    // Individual listing URLs per suite (keys = suite slugs), used on the
    // suite detail pages. REPLACE_ME with the real listing URLs.
    airbnb: {
      'seahorse-retreat': 'https://www.airbnb.com/rooms/REPLACE_ME_SEAHORSE_RETREAT',
      'sunset-haven': 'https://www.airbnb.com/rooms/REPLACE_ME_SUNSET_HAVEN',
      'coastal-bliss': 'https://www.airbnb.com/rooms/REPLACE_ME_COASTAL_BLISS',
      'ocean-breeze': 'https://www.airbnb.com/rooms/REPLACE_ME_OCEAN_BREEZE',
      'beachside-escape': 'https://www.airbnb.com/rooms/REPLACE_ME_BEACHSIDE_ESCAPE'
    },
    // Vrbo has no host-profile page, so each suite links directly.
    vrbo: {
      'seahorse-retreat': 'https://www.vrbo.com/REPLACE_ME_SEAHORSE_RETREAT',
      'sunset-haven': 'https://www.vrbo.com/REPLACE_ME_SUNSET_HAVEN',
      'coastal-bliss': 'https://www.vrbo.com/REPLACE_ME_COASTAL_BLISS',
      'ocean-breeze': 'https://www.vrbo.com/REPLACE_ME_OCEAN_BREEZE',
      'beachside-escape': 'https://www.vrbo.com/REPLACE_ME_BEACHSIDE_ESCAPE'
    }
  },
  ui: {
    colors: {
      // Brand: #40d6dc — 'cyan' is the closest built-in Nuxt UI palette.
      // The exact brand scale ("ocean") lives in tailwind.config.ts and
      // as CSS vars in assets/css/main.css for pixel-perfect usage.
      primary: 'cyan',
      secondary: 'sky',
      accent: 'amber',
      neutral: 'slate',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'red'
    }
    // Button size overrides — extend later, e.g.:
    // button: {
    //   slots: { base: 'tracking-brand font-body font-semibold' },
    //   defaultVariants: { size: 'lg' }
    // }
  }
})

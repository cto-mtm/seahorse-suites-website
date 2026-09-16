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
      'seahorse-retreat': 'https://www.airbnb.com/rooms/1441180543462756486',
      'sunset-haven': 'https://www.airbnb.com/rooms/1247829517412810829',
      'coastal-bliss': 'https://www.airbnb.com/rooms/1247797360491215033',
      'ocean-breeze': 'https://www.airbnb.com/rooms/1247748784270445888',
      'beachside-escape': ''
    },
    // Vrbo has no host-profile page, so each suite links directly.
    vrbo: {
      'seahorse-retreat': 'https://www.vrbo.com/4361518',
      'sunset-haven': 'https://www.vrbo.com/4361506',
      'coastal-bliss': 'https://www.vrbo.com/4363082',
      'ocean-breeze': 'https://www.vrbo.com/4363107',
      'beachside-escape': 'https://www.vrbo.com/4363125'
    }
  },
  // Official website for each nearby business on the /explore pages, keyed by
  // attraction slug. Leave a value empty ('') to hide the "Visit website"
  // button for that place. FILL THESE IN with the real business URLs — they
  // are intentionally blank so the site never links to an unverified page.
  explore: {
    websites: {
      // EmOcean (Sporty Seahorse Shop, 362 Periwinkle Way) — official
      // coastal wear store website confirmed by the client.
      'emocean': 'https://emoceanscostalwear.com/',
      'wickies': 'https://wickieslighthouserestaurant.com',
      'magic-bus': 'https://themagicbussanibel.com',
      'bel-deli': 'https://www.thebelbagelsanddeli.com'
    } as Record<string, string>
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

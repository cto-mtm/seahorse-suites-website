<script setup lang="ts">
// Site-wide social share image (per-page og:title/description are inferred
// from each page's useSeoMeta by @nuxtjs/seo). Swap /images/og/default.jpg
// for a real property photo (1200×630) when available.
useSeoMeta({
  ogImage: 'https://seahorsesuites.com/images/og/default.jpg',
  twitterCard: 'summary_large_image'
})

// Structured data: lodging business for Google local/travel results.
// REPLACE_ME: verify geo coordinates (currently approximate for
// 1167 Buttonwood Lane) and add real listing URLs once live.
useSchemaOrg([
  defineLocalBusiness({
    '@type': 'LodgingBusiness',
    name: 'Seahorse Suites',
    description: 'Pet-friendly vacation suites in Old Town Sanibel — steps from the Gulf, the historic lighthouse, and world-famous shelling beaches.',
    url: 'https://seahorsesuites.com',
    telephone: '+1-573-529-1529',
    email: 'seahorsesuites@gmail.com',
    image: 'https://seahorsesuites.com/images/og/default.jpg',
    logo: 'https://seahorsesuites.com/images/logo/seahorse-color.png',
    address: {
      streetAddress: '1167 Buttonwood Lane',
      addressLocality: 'Sanibel',
      addressRegion: 'FL',
      postalCode: '33957',
      addressCountry: 'US'
    },
    geo: {
      latitude: 26.4536,
      longitude: -82.0165
    },
    petsAllowed: true,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'High-speed WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Complimentary bicycles', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Laundry facilities', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Beach essentials provided', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Patios with fire pit', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Fully equipped kitchens', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free on-site parking', value: true }
    ]
  })
])
</script>

<template>
  <div>
    <AppLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

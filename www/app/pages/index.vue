<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('Index.metaTitle'),
  description: () => t('Index.metaDescription')
})

useScrollReveal()

// Scroll-linked effects. The parallax offset is relative to the
// attractions section's position in the viewport (NOT absolute page
// scroll), so the background always stays within its overscan area.
const watermarkY = ref(0)
const parallaxY = ref(0)
const attractionsSection = ref<HTMLElement | null>(null)

function onScroll() {
  // Gentle, clamped drift for the fixed seahorse watermark
  watermarkY.value = Math.max(-100, Math.min(100, window.scrollY * -0.03))

  const el = attractionsSection.value
  if (el) {
    const rect = el.getBoundingClientRect()
    // 0 when the section top hits the viewport top; small offset either side
    parallaxY.value = Math.max(-120, Math.min(120, rect.top * -0.12))
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const suites = useSuites()
const amenities = useAmenities()
const { open: openBooking } = useBookingModal()

const attractions = useAttractions()
</script>

<template>
  <div class="relative overflow-x-clip">
    <!-- ═══ Floating seahorse watermark (drifts gently + tracks scroll) ═══ -->
    <div
      class="pointer-events-none fixed right-[4%] top-1/3 z-0 hidden opacity-[0.07] lg:block"
      :style="{ transform: `translateY(${watermarkY}px)` }"
      aria-hidden="true"
    >
      <SeahorseMark variant="black" size="h-72" class="floaty" />
    </div>

    <!-- ═══ 1. HERO ═══ -->
    <section class="relative flex min-h-screen items-center justify-center ocean-bg text-white">
      <!-- Background video (falls back to the animated CSS ocean while loading) -->
      <video
        class="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
      />
      <!-- Graded scrim: stronger at top (header) and bottom (copy), lighter mid-frame -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(180deg, rgba(11, 51, 58, 0.55) 0%, rgba(11, 51, 58, 0.32) 40%, rgba(11, 51, 58, 0.68) 100%)"
        aria-hidden="true"
      />

      <!-- Animated ocean layers -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute inset-x-0 top-[18%] ocean-shimmer">
          <div class="mx-auto h-40 max-w-4xl rounded-full blur-3xl" style="background: rgba(64, 214, 220, 0.3)" />
        </div>

        <!--
          Drifting translucent waves. Each SVG is 200% wide with a path that
          repeats every 720 viewBox units, so the translateX(-50%) drift
          loop is perfectly seamless.
        -->
        <svg class="wave-drift-slow absolute bottom-16 left-0 w-[200%]" viewBox="0 0 2880 120" preserveAspectRatio="none" style="height: 150px">
          <path
            d="M0,60 C120,30 240,30 360,60 C480,90 600,90 720,60 C840,30 960,30 1080,60 C1200,90 1320,90 1440,60 C1560,30 1680,30 1800,60 C1920,90 2040,90 2160,60 C2280,30 2400,30 2520,60 C2640,90 2760,90 2880,60 L2880,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.08)"
          />
        </svg>
        <svg class="wave-drift absolute bottom-6 left-0 w-[200%]" viewBox="0 0 2880 120" preserveAspectRatio="none" style="height: 130px">
          <path
            d="M0,60 C120,90 240,90 360,60 C480,30 600,30 720,60 C840,90 960,90 1080,60 C1200,30 1320,30 1440,60 C1560,90 1680,90 1800,60 C1920,30 2040,30 2160,60 C2280,90 2400,90 2520,60 C2640,30 2760,30 2880,60 L2880,120 L0,120 Z"
            fill="rgba(125, 225, 234, 0.16)"
          />
        </svg>
        <svg class="wave-drift-mid absolute bottom-0 left-0 w-[200%]" viewBox="0 0 2880 120" preserveAspectRatio="none" style="height: 110px">
          <path
            d="M0,70 C120,45 240,45 360,70 C480,95 600,95 720,70 C840,45 960,45 1080,70 C1200,95 1320,95 1440,70 C1560,45 1680,45 1800,70 C1920,95 2040,95 2160,70 C2280,45 2400,45 2520,70 C2640,95 2760,95 2880,70 L2880,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.22)"
          />
        </svg>

        <!-- Static shoreline bridging into the white intro section -->
        <svg class="absolute -bottom-px left-0 w-full" viewBox="0 0 1440 48" preserveAspectRatio="none" style="height: 48px">
          <path d="M0,34 C240,10 480,46 720,30 C960,14 1200,42 1440,22 L1440,48 L0,48 Z" fill="#ffffff" />
        </svg>
      </div>

      <!-- Hero copy -->
      <div class="relative z-10 px-5 text-center">
        <SeahorseMark variant="color" size="h-24" class="mx-auto mb-6 floaty drop-shadow-[0_0_30px_rgba(11,51,58,0.8)]" />
        <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-200)] drop-shadow-[0_1px_8px_rgba(11,51,58,0.9)]">
          {{ t('Index.heroKicker') }}
        </p>
        <h1 class="mt-4 animate-fade-up font-display text-5xl font-medium uppercase tracking-[0.18em] drop-shadow-[0_2px_20px_rgba(11,51,58,0.7)] md:text-7xl lg:text-8xl" style="animation-delay: 0.15s">
          {{ t('Index.heroTitle') }}
        </h1>
        <p class="mt-6 animate-fade-up font-body text-lg font-medium tracking-brand text-white drop-shadow-[0_1px_12px_rgba(11,51,58,0.9)] md:text-2xl" style="animation-delay: 0.3s">
          {{ t('Index.heroSubtitle') }}
        </p>
        <p class="mt-3 animate-fade-up font-display text-xl italic tracking-brand text-[var(--ss-ocean-200)] drop-shadow-[0_1px_10px_rgba(11,51,58,0.9)] md:text-2xl" style="animation-delay: 0.42s">
          {{ t('Index.heroTagline') }}
        </p>
        <div class="mt-10 animate-fade-up" style="animation-delay: 0.55s">
          <button
            type="button"
            class="group relative inline-block overflow-hidden rounded-full border-2 border-white/80 px-10 py-4 font-bold tracking-brand-wide uppercase text-white shadow-coastal backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-[var(--ss-ocean-300)] hover:text-[var(--ss-ocean-950)]"
            style="background: rgba(11, 51, 58, 0.35)"
            @click="openBooking"
          >
            <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-300)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
            <span class="relative z-10">{{ t('Index.heroCta') }}</span>
          </button>
        </div>
      </div>

      <!-- Scroll cue -->
      <a
        href="#intro"
        class="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-xs tracking-brand-wide uppercase text-white/90 drop-shadow-[0_1px_8px_rgba(11,51,58,0.9)] transition-colors hover:text-white"
      >
        {{ t('Index.heroScroll') }}
        <UIcon name="i-lucide-chevron-down" class="mx-auto mt-1 block size-5 animate-bounce" />
      </a>
    </section>

    <!-- ═══ 2. INTRO / ABOUT ═══ -->
    <section id="intro" class="relative bg-white py-24 md:py-32">
      <div class="mx-auto max-w-3xl px-5 text-center">
        <p class="reveal eyebrow">{{ t('Index.introEyebrow') }}</p>
        <h2 class="reveal reveal-delay-1 mt-4 font-display text-4xl md:text-5xl">
          {{ t('Index.introTitle') }}
        </h2>
        <p class="reveal reveal-delay-2 mt-6 text-lg leading-relaxed text-[var(--ss-ocean-800)]">
          {{ t('Index.introBody') }}
        </p>
      </div>
    </section>

    <!-- Divider: white → sand -->
    <div class="bg-fade-sand h-16" aria-hidden="true" />

    <!-- ═══ 3. FEATURED SUITES ═══ -->
    <section id="suites" class="scroll-mt-24 bg-[var(--ss-sand-100)] pb-24 md:pb-32">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="text-center">
          <p class="reveal eyebrow">{{ t('Suites.eyebrow') }}</p>
          <h2 class="reveal reveal-delay-1 mt-4 font-display text-4xl md:text-5xl">{{ t('Suites.title') }}</h2>
          <p class="reveal reveal-delay-2 mt-4 text-[var(--ss-ocean-800)]">{{ t('Suites.subtitle') }}</p>
        </div>

        <div class="mt-14 grid gap-8 md:grid-cols-3">
          <article
            v-for="(suite, i) in suites"
            :key="suite.title"
            class="group reveal overflow-hidden rounded-2xl bg-white shadow-coastal transition-all duration-500 hover:-translate-y-2"
            :class="`reveal-delay-${i + 1}`"
          >
            <!--
              IMAGE SLOT — replace the gradient placeholder with a real photo:
              <NuxtImg :src="`/images/suites/${suite.slug}/main.webp`" :alt="suite.title" class="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            -->
            <div class="relative h-64 overflow-hidden">
              <div
                class="reveal-scale flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105"
                :class="suite.gradient"
              >
                <UIcon :name="suite.icon" class="size-16 text-white/70" />
              </div>
            </div>

            <div class="p-7 transition-transform duration-500 group-hover:-translate-y-1">
              <h3 class="font-display text-2xl">{{ suite.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-[var(--ss-ocean-800)]">{{ suite.desc }}</p>
              <div class="mt-5 flex items-center justify-between gap-3">
                <p class="text-xs font-semibold tracking-brand text-[var(--ss-ocean-600)]">{{ suite.specs }}</p>
                <NuxtLink
                  :to="localePath({ name: 'suites-slug', params: { slug: suite.slug } })"
                  class="shrink-0 text-xs font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-600)] transition-colors group-hover:text-[var(--ss-ocean-400)]"
                >
                  {{ t('Suites.viewSuite') }} →
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Wave divider: sand → white -->
    <div class="bg-[var(--ss-sand-100)]">
      <WaveDivider class="text-white" />
    </div>

    <!-- ═══ 4. AMENITIES ═══ -->
    <section id="amenities" class="scroll-mt-24 bg-white py-24 md:py-32">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="text-center">
          <p class="reveal eyebrow">{{ t('Amenities.eyebrow') }}</p>
          <h2 class="reveal reveal-delay-1 mt-4 font-display text-4xl md:text-5xl">{{ t('Amenities.title') }}</h2>
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(amenity, i) in amenities"
            :key="amenity.title"
            class="group reveal rounded-2xl border border-[var(--ss-ocean-100)] p-7 transition-all duration-500 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
            :class="`reveal-delay-${(i % 4 % 3) + 1}`"
          >
            <div class="flex size-12 items-center justify-center rounded-full bg-[var(--ss-ocean-50)] text-[var(--ss-ocean-600)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--ss-ocean-400)] group-hover:text-white">
              <UIcon :name="amenity.icon" class="size-6" />
            </div>
            <h3 class="mt-5 font-display text-xl">{{ amenity.title }}</h3>
            <p class="mt-2 text-sm text-[var(--ss-ocean-800)]">{{ amenity.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ 5. TRUST / GUEST REVIEWS ═══ -->
    <TrustBanner />

    <!-- ═══ 6. LOCAL ATTRACTIONS (parallax) ═══ -->
    <section id="attractions" ref="attractionsSection" class="relative scroll-mt-24 overflow-hidden py-28 text-white md:py-40">
      <!-- Parallax background layer (moves slower than the foreground) -->
      <div
        class="absolute inset-x-0 -top-32 -bottom-32 ocean-bg"
        :style="{ transform: `translateY(${parallaxY}px)` }"
        aria-hidden="true"
      >
        <!--
          Swap for a real photo when available:
          <NuxtImg src="/images/attractions/coastline.webp" alt="" class="h-full w-full object-cover opacity-50" />
        -->
        <div class="absolute inset-x-0 bottom-1/4 ocean-shimmer">
          <div class="mx-auto h-52 max-w-5xl rounded-full bg-[var(--ss-ocean-300)]/25 blur-3xl" />
        </div>
      </div>

      <div class="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div>
          <p class="reveal eyebrow !text-[var(--ss-ocean-300)]">{{ t('Index.attractionsEyebrow') }}</p>
          <h2 class="reveal reveal-delay-1 mt-4 font-display text-4xl md:text-5xl">{{ t('Index.attractionsTitle') }}</h2>
          <p class="reveal reveal-delay-2 mt-6 leading-relaxed text-[var(--ss-ocean-100)]">{{ t('Index.attractionsBody') }}</p>
          <NuxtLink
            :to="localePath('contact')"
            class="reveal reveal-delay-3 group relative mt-8 inline-block overflow-hidden rounded-full border-2 border-[var(--ss-ocean-300)] px-8 py-3 text-sm font-bold tracking-brand-wide uppercase transition-all duration-500 hover:scale-105 hover:text-[var(--ss-ocean-950)]"
          >
            <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-300)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
            <span class="relative z-10">{{ t('Index.attractionsCta') }}</span>
          </NuxtLink>
        </div>

        <ul class="space-y-4">
          <li
            v-for="(attraction, i) in attractions"
            :key="attraction.slug"
            class="reveal"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <NuxtLink
              :to="localePath({ name: 'explore-slug', params: { slug: attraction.slug } })"
              class="group flex items-center gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md transition-all duration-500 hover:translate-x-2 hover:bg-white/15"
            >
              <UIcon :name="attraction.icon" class="size-6 shrink-0 text-[var(--ss-ocean-300)]" />
              <span class="flex-1 text-sm md:text-base">{{ attraction.label }}</span>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 shrink-0 text-[var(--ss-ocean-300)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- ═══ 7. FINAL CTA ═══ -->
    <section class="bg-fade-sand-up py-24 text-center md:py-32">
      <div class="mx-auto max-w-3xl px-5">
        <h2 class="reveal font-display text-4xl md:text-5xl">{{ t('Index.ctaTitle') }}</h2>
        <button
          type="button"
          class="reveal reveal-delay-2 group relative mt-10 inline-block overflow-hidden rounded-full bg-[var(--ss-ocean-400)] px-12 py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] shadow-coastal transition-all duration-500 hover:scale-105"
          @click="openBooking"
        >
          <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
          <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">{{ t('Index.ctaButton') }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

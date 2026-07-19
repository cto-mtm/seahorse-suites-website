<script setup lang="ts">
/**
 * Guest reviews + platform trust badges (Airbnb Guest favourite,
 * Vrbo Premier Host, Airbnb Superhost) in Seahorse Suites styling.
 */
const { t } = useI18n()

const reviews = computed(() => [
  { text: t('TrustBanner.review1Text'), name: t('TrustBanner.review1Name') },
  { text: t('TrustBanner.review2Text'), name: t('TrustBanner.review2Name') },
  { text: t('TrustBanner.review3Text'), name: t('TrustBanner.review3Name') }
])
</script>

<template>
  <section class="bg-fade-sand py-24 md:py-32">
    <div class="mx-auto max-w-6xl px-5 md:px-8">
      <div class="text-center">
        <p class="reveal eyebrow">{{ t('TrustBanner.eyebrow') }}</p>
        <h2 class="reveal reveal-delay-1 mt-4 font-display text-4xl md:text-5xl">{{ t('TrustBanner.title') }}</h2>
      </div>

      <!-- Reviews -->
      <div class="mt-14 grid gap-8 md:grid-cols-3">
        <figure
          v-for="(review, i) in reviews"
          :key="review.name"
          class="reveal flex flex-col rounded-2xl bg-white p-8 shadow-coastal transition-all duration-500 hover:-translate-y-1"
          :class="`reveal-delay-${i + 1}`"
        >
          <UIcon name="i-lucide-quote" class="size-6 text-[var(--ss-ocean-300)]" aria-hidden="true" />
          <blockquote class="mt-4 flex-1 font-display text-xl leading-relaxed text-[var(--ss-ocean-900)]">
            “{{ review.text }}”
          </blockquote>
          <figcaption class="mt-6">
            <span class="flex gap-1 text-amber-400" role="img" aria-label="5 out of 5 stars">
              <svg v-for="n in 5" :key="n" viewBox="0 0 20 20" class="size-4 fill-current" aria-hidden="true">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </span>
            <span class="mt-2 block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">{{ review.name }}</span>
          </figcaption>
        </figure>
      </div>

      <!-- Platform badges -->
      <div class="reveal reveal-delay-2 mt-16 flex flex-col items-center justify-center gap-10 md:flex-row md:gap-0">
        <!-- 5.0 Guest favourite -->
        <div class="flex items-center gap-4 md:px-12">
          <UIcon name="i-lucide-award" class="size-9 text-[var(--ss-ocean-500)]" aria-hidden="true" />
          <div>
            <p class="font-display text-4xl leading-none text-[var(--ss-ocean-950)]">{{ t('TrustBanner.badgeRating') }}</p>
            <p class="mt-1 text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-700)]">{{ t('TrustBanner.badgeGuestFav') }}</p>
          </div>
        </div>

        <span class="hidden size-1.5 rounded-full bg-[var(--ss-ocean-300)] md:block" aria-hidden="true" />

        <!-- Vrbo Premier Host -->
        <div class="flex items-center gap-4 md:px-12">
          <UIcon name="i-lucide-badge-check" class="size-9 text-[var(--ss-ocean-500)]" aria-hidden="true" />
          <div>
            <p class="font-display text-2xl leading-tight text-[var(--ss-ocean-950)]">{{ t('TrustBanner.badgeVrbo') }}</p>
            <p class="mt-1 text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-700)]">{{ t('TrustBanner.badgePremier') }}</p>
          </div>
        </div>

        <span class="hidden size-1.5 rounded-full bg-[var(--ss-ocean-300)] md:block" aria-hidden="true" />

        <!-- Airbnb Superhost -->
        <div class="flex items-center gap-4 md:px-12">
          <UIcon name="i-lucide-medal" class="size-9 text-[var(--ss-ocean-500)]" aria-hidden="true" />
          <div>
            <p class="font-display text-2xl leading-tight text-[var(--ss-ocean-950)]">{{ t('TrustBanner.badgeAirbnb') }}</p>
            <p class="mt-1 text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-700)]">{{ t('TrustBanner.badgeSuperhost') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

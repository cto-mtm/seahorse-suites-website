<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

useScrollReveal()

const attractions = useAttractions()
const attraction = computed(() =>
  attractions.value.find(a => a.slug === route.params.slug)
)

if (!attraction.value) {
  throw createError({ statusCode: 404, statusMessage: 'Location not found', fatal: true })
}

const { open: openBooking } = useBookingModal()

// Site name is appended automatically by the SEO module's title template
useSeoMeta({
  title: () => attraction.value?.title,
  description: () => attraction.value?.tag
})
</script>

<template>
  <div v-if="attraction">
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <NuxtLink
        :to="localePath('index') + '#attractions'"
        class="animate-fade-up inline-flex items-center gap-2 text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-300)] transition-colors hover:text-white"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        {{ t('Explore.backToAll') }}
      </NuxtLink>
      <h1 class="animate-fade-up mt-6 font-display text-4xl uppercase tracking-[0.1em] md:text-6xl" style="animation-delay: 0.15s">
        {{ attraction.title }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-2xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ attraction.tag }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-5xl px-5 md:px-8">
        <!--
          HERO IMAGE PLACEHOLDER — replace with a real photo:
          <NuxtImg :src="`/images/explore/${attraction.slug}/hero.webp`" :alt="attraction.title"
            class="h-full w-full object-cover" />
        -->
        <div class="reveal-scale relative h-72 overflow-hidden rounded-3xl shadow-coastal md:h-[28rem]">
          <div class="flex h-full w-full items-center justify-center bg-gradient-to-br" :class="attraction.gradient">
            <UIcon :name="attraction.icon" class="size-24 text-white/60" />
          </div>
        </div>

        <div class="mt-14 grid gap-12 md:grid-cols-[1fr_minmax(16rem,20rem)]">
          <!-- Body -->
          <div class="reveal">
            <p class="text-lg leading-relaxed text-[var(--ss-ocean-900)]">{{ attraction.body1 }}</p>
            <p class="mt-6 leading-relaxed text-[var(--ss-ocean-800)]">{{ attraction.body2 }}</p>

            <!--
              GALLERY PLACEHOLDERS — replace with real photos:
              <NuxtImg :src="`/images/explore/${attraction.slug}/1.webp`" alt="..." class="h-52 w-full rounded-2xl object-cover" />
              <NuxtImg :src="`/images/explore/${attraction.slug}/2.webp`" alt="..." class="h-52 w-full rounded-2xl object-cover" />
            -->
            <div class="mt-10 grid gap-5 sm:grid-cols-2">
              <div
                v-for="n in 2"
                :key="n"
                class="reveal-scale flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-coastal"
                :class="attraction.gradient"
              >
                <UIcon name="i-lucide-image" class="size-10 text-white/50" />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="reveal reveal-delay-1 space-y-6 self-start">
            <div class="rounded-2xl border border-[var(--ss-ocean-100)] p-6">
              <p class="eyebrow">{{ t('Explore.gettingThere') }}</p>
              <p class="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-[var(--ss-ocean-800)]">
                <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0 text-[var(--ss-ocean-400)]" />
                {{ attraction.distance }}
              </p>
            </div>

            <div class="rounded-2xl bg-[var(--ss-sand-100)] p-6">
              <p class="eyebrow">{{ t('Explore.highlightsTitle') }}</p>
              <ul class="mt-4 space-y-3">
                <li
                  v-for="highlight in attraction.highlights"
                  :key="highlight"
                  class="flex items-start gap-2.5 text-sm text-[var(--ss-ocean-900)]"
                >
                  <UIcon name="i-lucide-star" class="mt-0.5 size-4 shrink-0 text-[var(--ss-ocean-400)]" />
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="bg-fade-sand py-20 text-center md:py-24">
      <div class="mx-auto max-w-2xl px-5">
        <h2 class="reveal font-display text-3xl md:text-4xl">{{ t('Explore.ctaTitle') }}</h2>
        <button
          type="button"
          class="reveal reveal-delay-1 group relative mt-8 inline-block overflow-hidden rounded-full bg-[var(--ss-ocean-400)] px-10 py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] shadow-coastal transition-all duration-500 hover:scale-105"
          @click="openBooking"
        >
          <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
          <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">{{ t('Explore.ctaButton') }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

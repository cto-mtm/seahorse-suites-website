<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const appConfig = useAppConfig()

useScrollReveal()

const suites = useSuites()
const allAmenities = useAmenities()

const suite = computed(() =>
  suites.value.find(s => s.slug === route.params.slug)
)

if (!suite.value) {
  throw createError({ statusCode: 404, statusMessage: 'Suite not found', fatal: true })
}

/** This suite's amenities, drawn from the shared amenity catalogue */
const suiteAmenities = computed(() =>
  allAmenities.value.filter(a => suite.value?.amenityKeys.includes(a.key))
)

const otherSuites = computed(() =>
  suites.value.filter(s => s.slug !== suite.value?.slug)
)

const bookingLinks = computed(() => {
  const slug = suite.value?.slug ?? ''
  return [
    {
      name: 'Airbnb',
      label: t('Suites.bookAirbnb'),
      url: (appConfig.booking.airbnb as Record<string, string>)[slug] ?? appConfig.booking.airbnbUrl,
      icon: 'i-lucide-house',
      accent: '#FF5A5F'
    },
    {
      name: 'Vrbo',
      label: t('Suites.bookVrbo'),
      url: (appConfig.booking.vrbo as Record<string, string>)[slug] ?? '#',
      icon: 'i-lucide-umbrella',
      accent: '#245ABC'
    }
  ]
})

// Site name is appended automatically by the SEO module's title template
useSeoMeta({
  title: () => `${suite.value?.title} — ${suite.value?.specs}`,
  description: () => suite.value?.desc
})
</script>

<template>
  <div v-if="suite">
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <NuxtLink
        :to="localePath('suites')"
        class="animate-fade-up inline-flex items-center gap-2 text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-300)] transition-colors hover:text-white"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        {{ t('Suites.backToAll') }}
      </NuxtLink>
      <h1 class="animate-fade-up mt-6 font-display text-4xl uppercase tracking-[0.1em] md:text-6xl" style="animation-delay: 0.15s">
        {{ suite.title }}
      </h1>
      <p class="animate-fade-up mt-4 text-sm font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-300)]" style="animation-delay: 0.25s">
        {{ suite.specs }}
      </p>
      <p class="animate-fade-up mx-auto mt-4 max-w-2xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.35s">
        {{ suite.desc }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <!--
          GALLERY — replace the gradient placeholders with real photos.
          Drop files into /public/images/suites/<slug>/ and swap:
          <NuxtImg :src="`/images/suites/${suite.slug}/main.webp`" :alt="suite.title" class="h-full w-full object-cover" />
          <NuxtImg :src="`/images/suites/${suite.slug}/1.webp`" alt="..." class="h-full w-full object-cover" />
          ... (2.webp, 3.webp, 4.webp)
        -->
        <div class="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <div class="reveal-scale relative h-72 overflow-hidden rounded-3xl shadow-coastal md:col-span-2 md:row-span-2 md:h-auto">
            <div class="flex h-full w-full items-center justify-center bg-gradient-to-br" :class="suite.gradient">
              <UIcon :name="suite.icon" class="size-20 text-white/60" />
            </div>
          </div>
          <div
            v-for="n in 4"
            :key="n"
            class="reveal-scale hidden h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-coastal md:flex"
            :class="[suite.gradient, `reveal-delay-${(n % 3) + 1}`]"
          >
            <UIcon name="i-lucide-image" class="size-8 text-white/50" />
          </div>
        </div>

        <div class="mt-14 grid gap-12 lg:grid-cols-[1fr_minmax(18rem,22rem)]">
          <!-- Main content -->
          <div>
            <p class="reveal text-lg leading-relaxed text-[var(--ss-ocean-900)]">{{ suite.long }}</p>

            <!-- Feature checklist -->
            <ul class="reveal reveal-delay-1 mt-8 grid gap-3 sm:grid-cols-2">
              <li
                v-for="feature in suite.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-[var(--ss-ocean-900)]"
              >
                <UIcon name="i-lucide-check" class="size-4 shrink-0 text-[var(--ss-ocean-400)]" />
                {{ feature }}
              </li>
            </ul>

            <!-- Amenities -->
            <div class="reveal reveal-delay-2 mt-12">
              <p class="eyebrow">{{ t('Suites.included') }}</p>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <div
                  v-for="amenity in suiteAmenities"
                  :key="amenity.key"
                  class="group flex items-center gap-4 rounded-2xl border border-[var(--ss-ocean-100)] p-4 transition-all duration-300 hover:border-[var(--ss-ocean-300)]"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--ss-ocean-50)] text-[var(--ss-ocean-600)] transition-all duration-300 group-hover:bg-[var(--ss-ocean-400)] group-hover:text-white">
                    <UIcon :name="amenity.icon" class="size-5" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-[var(--ss-ocean-950)]">{{ amenity.title }}</p>
                    <p class="text-xs text-[var(--ss-ocean-700)]">{{ amenity.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking sidebar -->
          <aside class="reveal reveal-delay-1 self-start lg:sticky lg:top-28">
            <div class="overflow-hidden rounded-3xl border border-[var(--ss-ocean-100)] shadow-coastal">
              <div class="ocean-bg px-6 py-5 text-white">
                <p class="font-display text-2xl tracking-brand">{{ t('Suites.bookTitle') }}</p>
                <p class="mt-1 text-xs text-[var(--ss-ocean-200)]">{{ t('Suites.bookSubtitle') }}</p>
              </div>
              <div class="space-y-3 p-6">
                <!-- Direct reservation — the primary, pushed path -->
                <NuxtLink
                  :to="localePath({ name: 'reserve', query: { suite: suite.slug } })"
                  class="group flex items-center gap-3.5 rounded-xl border-2 border-[var(--ss-ocean-300)] bg-[var(--ss-ocean-50)] px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
                >
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--ss-ocean-400)] text-[var(--ss-ocean-950)] transition-transform duration-300 group-hover:scale-110">
                    <UIcon name="i-lucide-calendar-heart" class="size-5" />
                  </span>
                  <span class="flex-1">
                    <span class="block text-sm font-bold tracking-brand text-[var(--ss-ocean-950)]">{{ t('Suites.bookDirect') }}</span>
                    <span class="mt-0.5 block text-xs tracking-brand text-[var(--ss-ocean-600)]">{{ t('Suites.bookDirectHint') }}</span>
                  </span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 text-[var(--ss-ocean-400)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--ss-ocean-500)]"
                  />
                </NuxtLink>

                <p class="pt-1 text-xs font-bold tracking-brand uppercase text-[var(--ss-ocean-700)]">{{ t('Suites.orPlatforms') }}</p>

                <a
                  v-for="platform in bookingLinks"
                  :key="platform.name"
                  :href="platform.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-3.5 rounded-xl border border-[var(--ss-ocean-100)] px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
                >
                  <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                    :style="{ backgroundColor: platform.accent }"
                  >
                    <UIcon :name="platform.icon" class="size-5" />
                  </span>
                  <span class="flex-1 text-sm font-bold tracking-brand text-[var(--ss-ocean-950)]">{{ platform.label }}</span>
                  <UIcon
                    name="i-lucide-arrow-up-right"
                    class="size-4 text-[var(--ss-ocean-300)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ss-ocean-500)]"
                  />
                </a>

                <p class="pt-2 text-center text-xs text-[var(--ss-ocean-600)]">
                  {{ t('Suites.orAsk') }}
                  <NuxtLink
                    :to="localePath('contact')"
                    class="font-semibold text-[var(--ss-ocean-500)] underline-offset-2 hover:underline"
                  >
                    {{ t('Suites.askLink') }}
                  </NuxtLink>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- More suites -->
    <section class="bg-fade-sand py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <p class="reveal eyebrow text-center">{{ t('Suites.moreSuites') }}</p>
        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="(other, i) in otherSuites"
            :key="other.slug"
            :to="localePath({ name: 'suites-slug', params: { slug: other.slug } })"
            class="group reveal overflow-hidden rounded-2xl bg-white shadow-coastal transition-all duration-500 hover:-translate-y-1"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <div class="flex h-28 items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105" :class="other.gradient">
              <UIcon :name="other.icon" class="size-8 text-white/70" />
            </div>
            <div class="p-4">
              <p class="font-display text-lg leading-tight">{{ other.title }}</p>
              <p class="mt-1 text-xs tracking-brand text-[var(--ss-ocean-600)]">{{ other.specs }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('Photos.metaTitle'),
  description: () => t('Photos.metaDescription'),
  keywords: () => t('Photos.metaKeywords'),
  ogTitle: () => t('Photos.metaTitle'),
  ogDescription: () => t('Photos.metaDescription')
})

useScrollReveal()

const photos = usePropertyPhotos()
const suites = useSuites()
const { open: openBooking } = useBookingModal()

// Location-at-a-glance distances (client asked these be front and center).
const distances = computed(() => [
  { icon: 'i-lucide-umbrella', stat: t('Photos.beachStat'), label: t('Photos.beachLabel') },
  { icon: 'i-lucide-tower-control', stat: t('Photos.lighthouseStat'), label: t('Photos.lighthouseLabel') },
  { icon: 'i-lucide-shopping-bag', stat: t('Photos.shopsStat'), label: t('Photos.shopsLabel') },
  { icon: 'i-lucide-car', stat: t('Photos.causewayStat'), label: t('Photos.causewayLabel') }
])

// One shared lightbox grid, reused by every "View all" button.
const galleryOpen = ref(false)
const galleryPhotos = ref<{ src: string, thumb: string }[]>([])
const galleryTitle = ref('')

function openGallery(title: string, set: { src: string, thumb: string }[]) {
  galleryTitle.value = title
  galleryPhotos.value = set
  galleryOpen.value = true
}
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Photos.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Photos.title') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-2xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Photos.subtitle') }}
      </p>
    </section>

    <!-- ═══ Location at a glance (distances) ═══ -->
    <section class="bg-[var(--ss-sand-100)] py-16 md:py-20">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="text-center">
          <p class="reveal eyebrow">{{ t('Photos.locationEyebrow') }}</p>
          <h2 class="reveal reveal-delay-1 mt-3 font-display text-3xl md:text-4xl">{{ t('Photos.locationTitle') }}</h2>
          <p class="reveal reveal-delay-2 mx-auto mt-4 max-w-2xl text-[var(--ss-ocean-800)]">{{ t('Photos.locationNote') }}</p>
        </div>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(d, i) in distances"
            :key="d.label"
            class="reveal flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-coastal"
            :class="`reveal-delay-${(i % 4 % 3) + 1}`"
          >
            <span class="flex size-14 items-center justify-center rounded-full bg-[var(--ss-ocean-50)] text-[var(--ss-ocean-500)]">
              <UIcon :name="d.icon" class="size-7" />
            </span>
            <p class="mt-4 font-display text-2xl text-[var(--ss-ocean-950)]">{{ d.stat }}</p>
            <p class="mt-1 text-sm font-semibold tracking-brand text-[var(--ss-ocean-600)]">{{ d.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Aerial ═══ -->
    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="reveal">
          <h2 class="font-display text-3xl md:text-4xl">{{ t('Photos.aerialTitle') }}</h2>
          <p class="mt-3 max-w-2xl text-[var(--ss-ocean-800)]">{{ t('Photos.aerialSubtitle') }}</p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="(photo, i) in photos.property.aerial.slice(0, 6)"
            :key="photo.src"
            type="button"
            class="reveal-scale group relative h-56 overflow-hidden rounded-2xl shadow-coastal"
            :aria-label="t('Photos.photoAlt', { title: t('Photos.aerialTitle'), n: i + 1 })"
            @click="openGallery(t('Photos.aerialTitle'), photos.property.aerial)"
          >
            <NuxtImg
              :src="photo.thumb"
              :alt="t('Photos.photoAlt', { title: t('Photos.aerialTitle'), n: i + 1 })"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        </div>

        <div class="mt-8 text-center">
          <button
            type="button"
            class="rounded-full border border-[var(--ss-ocean-300)] px-8 py-3 text-sm font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-700)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
            @click="openGallery(t('Photos.aerialTitle'), photos.property.aerial)"
          >
            {{ t('Photos.viewAll', { n: photos.property.aerial.length }) }}
          </button>
        </div>
      </div>
    </section>

    <!-- ═══ Inside the Suites ═══ -->
    <section class="bg-[var(--ss-sand-100)] py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="reveal">
          <h2 class="font-display text-3xl md:text-4xl">{{ t('Photos.suitesTitle') }}</h2>
          <p class="mt-3 max-w-2xl text-[var(--ss-ocean-800)]">{{ t('Photos.suitesSubtitle') }}</p>
        </div>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(suite, i) in suites"
            :key="suite.slug"
            :to="localePath({ name: 'suites-slug', params: { slug: suite.slug } })"
            class="group reveal overflow-hidden rounded-2xl bg-white shadow-coastal transition-all duration-500 hover:-translate-y-2"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <div class="relative h-56 overflow-hidden">
              <NuxtImg
                :src="photos.suites[suite.slug]?.hero.thumb"
                :alt="suite.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="flex items-center justify-between gap-3 p-6">
              <div>
                <h3 class="font-display text-xl">{{ suite.title }}</h3>
                <p class="mt-1 text-xs font-semibold tracking-brand text-[var(--ss-ocean-600)]">{{ suite.specs }}</p>
              </div>
              <span class="shrink-0 text-xs font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-600)] transition-colors group-hover:text-[var(--ss-ocean-400)]">
                {{ t('Photos.viewSuite') }} →
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ Building & Grounds ═══ -->
    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="reveal">
          <h2 class="font-display text-3xl md:text-4xl">{{ t('Photos.exteriorTitle') }}</h2>
          <p class="mt-3 max-w-2xl text-[var(--ss-ocean-800)]">{{ t('Photos.exteriorSubtitle') }}</p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="(photo, i) in photos.property.exterior.slice(0, 6)"
            :key="photo.src"
            type="button"
            class="reveal-scale group relative h-56 overflow-hidden rounded-2xl shadow-coastal"
            :aria-label="t('Photos.photoAlt', { title: t('Photos.exteriorTitle'), n: i + 1 })"
            @click="openGallery(t('Photos.exteriorTitle'), photos.property.exterior)"
          >
            <NuxtImg
              :src="photo.thumb"
              :alt="t('Photos.photoAlt', { title: t('Photos.exteriorTitle'), n: i + 1 })"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        </div>

        <div class="mt-8 text-center">
          <button
            type="button"
            class="rounded-full border border-[var(--ss-ocean-300)] px-8 py-3 text-sm font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-700)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
            @click="openGallery(t('Photos.exteriorTitle'), photos.property.exterior)"
          >
            {{ t('Photos.viewAll', { n: photos.property.exterior.length }) }}
          </button>
        </div>
      </div>
    </section>

    <!-- ═══ CTA band ═══ -->
    <section class="bg-fade-sand py-20 text-center md:py-24">
      <div class="mx-auto max-w-2xl px-5">
        <h2 class="reveal font-display text-3xl md:text-4xl">{{ t('Photos.ctaTitle') }}</h2>
        <button
          type="button"
          class="reveal reveal-delay-1 group relative mt-8 inline-block overflow-hidden rounded-full bg-[var(--ss-ocean-400)] px-10 py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] shadow-coastal transition-all duration-500 hover:scale-105"
          @click="openBooking"
        >
          <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
          <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">{{ t('Photos.ctaButton') }}</span>
        </button>
      </div>
    </section>

    <!-- Shared fullscreen gallery -->
    <PhotoGalleryModal
      :photos="galleryPhotos"
      :title="galleryTitle"
      :open="galleryOpen"
      @close="galleryOpen = false"
    />
  </div>
</template>

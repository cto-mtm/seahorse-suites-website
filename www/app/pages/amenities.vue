<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('Amenities.metaTitle'),
  description: () => t('Amenities.metaDescription')
})

useScrollReveal()

const amenities = useAmenities()
const photos = usePropertyPhotos()
const { open: openBooking } = useBookingModal()

/** Curated amenity photos paired with their localized alt text */
const gallery = computed(() =>
  photos.property.amenityGallery.map((photo, i) => ({
    ...photo,
    alt: t(`Amenities.galleryAlt${i + 1}`)
  }))
)
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Amenities.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Amenities.pageTitle') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Amenities.pageSubtitle') }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="grid gap-8 md:grid-cols-2">
          <article
            v-for="(amenity, i) in amenities"
            :key="amenity.key"
            class="group reveal flex gap-6 rounded-3xl border border-[var(--ss-ocean-100)] p-8 transition-all duration-500 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
            :class="`reveal-delay-${(i % 2) + 1}`"
          >
            <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--ss-ocean-50)] text-[var(--ss-ocean-600)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--ss-ocean-400)] group-hover:text-white">
              <UIcon :name="amenity.icon" class="size-7" />
            </div>
            <div>
              <h2 class="font-display text-2xl">{{ amenity.title }}</h2>
              <p class="mt-3 leading-relaxed text-[var(--ss-ocean-800)]">{{ amenity.long }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Photo band -->
    <section class="bg-white pb-16 md:pb-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="text-center">
          <p class="reveal eyebrow">{{ t('Amenities.galleryEyebrow') }}</p>
          <h2 class="reveal reveal-delay-1 mt-4 font-display text-3xl md:text-4xl">{{ t('Amenities.galleryTitle') }}</h2>
        </div>
        <div class="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3">
          <div
            v-for="(photo, i) in gallery"
            :key="photo.src"
            class="reveal-scale h-48 overflow-hidden rounded-2xl shadow-coastal md:h-56"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <NuxtImg
              :src="photo.thumb"
              :alt="photo.alt"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="bg-fade-sand py-20 text-center md:py-28">
      <div class="mx-auto max-w-2xl px-5">
        <h2 class="reveal font-display text-3xl md:text-4xl">{{ t('Amenities.ctaTitle') }}</h2>
        <button
          type="button"
          class="reveal reveal-delay-1 group relative mt-8 inline-block overflow-hidden rounded-full bg-[var(--ss-ocean-400)] px-10 py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] shadow-coastal transition-all duration-500 hover:scale-105"
          @click="openBooking"
        >
          <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
          <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">{{ t('Amenities.ctaButton') }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('Explore.metaTitle'),
  description: () => t('Explore.metaDescription'),
  keywords: () => t('Explore.metaKeywords')
})

useScrollReveal()

const attractions = useAttractions()
const photos = usePropertyPhotos()
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Explore.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Explore.indexTitle') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-2xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Explore.indexSubtitle') }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(attraction, i) in attractions"
            :key="attraction.slug"
            :to="localePath({ name: 'explore-slug', params: { slug: attraction.slug } })"
            class="group reveal overflow-hidden rounded-3xl bg-white shadow-coastal transition-all duration-500 hover:-translate-y-2"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <div class="relative h-52 overflow-hidden">
              <NuxtImg
                v-if="photos.explore[attraction.slug]"
                :src="photos.explore[attraction.slug]?.hero.thumb"
                :alt="attraction.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105"
                :class="attraction.gradient"
              >
                <UIcon :name="attraction.icon" class="size-14 text-white/70" />
              </div>
            </div>

            <div class="p-6">
              <h2 class="font-display text-2xl leading-tight">{{ attraction.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-[var(--ss-ocean-800)]">{{ attraction.tag }}</p>
              <p class="mt-4 flex items-start gap-2 text-xs font-semibold tracking-brand text-[var(--ss-ocean-600)]">
                <UIcon name="i-lucide-map-pin" class="mt-0.5 size-3.5 shrink-0 text-[var(--ss-ocean-400)]" />
                {{ attraction.distance }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

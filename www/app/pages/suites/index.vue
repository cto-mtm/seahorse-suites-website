<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('Suites.metaTitle'),
  description: () => t('Suites.metaDescription'),
  keywords: () => t('Suites.metaKeywords')
})

useScrollReveal()

const suites = useSuites()
const photos = usePropertyPhotos()
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Suites.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Suites.title') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-2xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Suites.pageSubtitle') }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-6xl space-y-16 px-5 md:space-y-24 md:px-8">
        <article
          v-for="(suite, i) in suites"
          :key="suite.slug"
          :id="suite.slug"
          class="group grid scroll-mt-28 items-center gap-8 md:grid-cols-2 md:gap-14"
        >
          <NuxtLink
            :to="localePath({ name: 'suites-slug', params: { slug: suite.slug } })"
            class="reveal-scale relative block h-80 overflow-hidden rounded-3xl shadow-coastal md:h-[26rem]"
            :class="i % 2 === 1 ? 'md:order-2' : ''"
            :aria-label="suite.title"
          >
            <NuxtImg
              :src="photos.suites[suite.slug]?.hero.src"
              :alt="suite.title"
              :loading="i === 0 ? undefined : 'lazy'"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </NuxtLink>

          <div class="reveal" :class="i % 2 === 1 ? 'md:order-1' : ''">
            <h2 class="font-display text-3xl md:text-4xl">{{ suite.title }}</h2>
            <p class="mt-2 text-sm font-semibold tracking-brand uppercase text-[var(--ss-ocean-600)]">
              {{ suite.specs }}
            </p>
            <p class="mt-5 leading-relaxed text-[var(--ss-ocean-800)]">{{ suite.long }}</p>

            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li
                v-for="feature in suite.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-[var(--ss-ocean-900)]"
              >
                <UIcon name="i-lucide-check" class="size-4 shrink-0 text-[var(--ss-ocean-400)]" />
                {{ feature }}
              </li>
            </ul>

            <div class="mt-8 flex flex-wrap items-center gap-6">
              <NuxtLink
                :to="localePath({ name: 'suites-slug', params: { slug: suite.slug } })"
                class="group/btn relative overflow-hidden rounded-full bg-[var(--ss-ocean-400)] px-8 py-3 text-sm font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] transition-all duration-500 hover:scale-105"
              >
                <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover/btn:translate-x-0" aria-hidden="true" />
                <span class="relative z-10 transition-colors duration-500 group-hover/btn:text-[var(--ss-ocean-300)]">{{ t('Suites.viewSuite') }}</span>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

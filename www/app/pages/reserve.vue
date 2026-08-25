<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()
const { open: openBooking } = useBookingModal()

useSeoMeta({
  title: () => t('Reserve.metaTitle'),
  description: () => t('Reserve.metaDescription')
})

useScrollReveal()
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Reserve.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Reserve.title') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Reserve.subtitle') }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-2xl px-5">
        <div class="reveal">
          <ReservationForm />
        </div>

        <!-- Secondary: booking platforms -->
        <div class="reveal reveal-delay-1 mt-12 rounded-2xl border border-[var(--ss-ocean-100)] bg-[var(--ss-ocean-50)] p-6 text-center md:p-8">
          <p class="font-display text-2xl tracking-brand text-[var(--ss-ocean-950)]">{{ t('Reserve.alsoOnHeading') }}</p>
          <p class="mx-auto mt-1.5 max-w-md text-sm text-[var(--ss-ocean-700)]">{{ t('Reserve.alsoOnHint') }}</p>
          <div class="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              :href="appConfig.booking.airbnbUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-center gap-2.5 rounded-full border border-[var(--ss-ocean-200)] bg-white px-6 py-3 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
            >
              <span class="flex size-6 items-center justify-center rounded-full text-white" style="background-color: #FF5A5F">
                <UIcon name="i-lucide-house" class="size-3.5" />
              </span>
              {{ t('BookingModal.airbnbLabel') }}
            </a>
            <button
              type="button"
              class="group flex items-center justify-center gap-2.5 rounded-full border border-[var(--ss-ocean-200)] bg-white px-6 py-3 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
              @click="openBooking"
            >
              <span class="flex size-6 items-center justify-center rounded-full text-white" style="background-color: #245ABC">
                <UIcon name="i-lucide-umbrella" class="size-3.5" />
              </span>
              {{ t('Suites.bookVrbo') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

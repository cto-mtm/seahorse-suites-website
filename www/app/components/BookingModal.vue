<script setup lang="ts">
/**
 * Book Now modal.
 * - Airbnb: one link to the host profile (all suites in one place).
 * - Vrbo: no host-profile page exists, so each suite links to its
 *   own listing (URLs in app.config.ts → booking.vrbo, keyed by slug).
 * Mounted once in layouts/default.vue; open via useBookingModal().open().
 */
const { t } = useI18n()
const localePath = useLocalePath()
const { isOpen, close } = useBookingModal()
const appConfig = useAppConfig()
const suites = useSuites()

const vrboSuites = computed(() =>
  suites.value.map(suite => ({
    slug: suite.slug,
    title: suite.title,
    icon: suite.icon,
    url: (appConfig.booking.vrbo as Record<string, string>)[suite.slug] ?? '#'
  }))
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[90] flex items-center justify-center p-5"
        role="dialog"
        aria-modal="true"
        :aria-label="t('BookingModal.title')"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[var(--ss-ocean-950)]/70 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <!-- Card -->
        <div class="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-coastal">
          <div class="ocean-bg px-8 pb-6 pt-8 text-center text-white">
            <SeahorseMark variant="color" size="h-12" class="mx-auto mb-3 floaty" />
            <h2 class="font-display text-3xl tracking-brand">{{ t('BookingModal.title') }}</h2>
            <p class="mt-2 text-sm text-[var(--ss-ocean-100)]">{{ t('BookingModal.subtitle') }}</p>
            <button
              type="button"
              class="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-all duration-300 hover:rotate-90 hover:text-white"
              :aria-label="t('BookingModal.close')"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>

          <div class="overflow-y-auto p-7">
            <!-- Direct reservation — the primary, pushed path -->
            <NuxtLink
              :to="localePath('reserve')"
              class="group flex items-center gap-4 rounded-2xl border-2 border-[var(--ss-ocean-300)] bg-[var(--ss-ocean-50)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
              @click="close"
            >
              <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--ss-ocean-400)] text-[var(--ss-ocean-950)] transition-transform duration-300 group-hover:scale-110">
                <UIcon name="i-lucide-calendar-heart" class="size-6" />
              </span>
              <span class="flex-1">
                <span class="block font-bold tracking-brand text-[var(--ss-ocean-950)]">{{ t('BookingModal.directLabel') }}</span>
                <span class="mt-0.5 block text-xs tracking-brand text-[var(--ss-ocean-600)]">{{ t('BookingModal.directHint') }}</span>
              </span>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-5 text-[var(--ss-ocean-400)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--ss-ocean-500)]"
              />
            </NuxtLink>

            <p class="mt-6 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">{{ t('BookingModal.orPlatforms') }}</p>

            <!-- Airbnb — all suites via the host profile -->
            <a
              :href="appConfig.booking.airbnbUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group mt-3 flex items-center gap-4 rounded-2xl border border-[var(--ss-ocean-100)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
              @click="close"
            >
              <span
                class="flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                style="background-color: #FF5A5F"
              >
                <UIcon name="i-lucide-house" class="size-6" />
              </span>
              <span class="flex-1">
                <span class="block font-bold tracking-brand text-[var(--ss-ocean-950)]">{{ t('BookingModal.airbnbLabel') }}</span>
                <span class="mt-0.5 block text-xs tracking-brand text-[var(--ss-ocean-600)]">{{ t('BookingModal.airbnbHint') }}</span>
              </span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-5 text-[var(--ss-ocean-300)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ss-ocean-500)]"
              />
            </a>

            <!-- Vrbo — one direct listing per suite -->
            <div class="mt-6">
              <p class="text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">{{ t('BookingModal.vrboHeading') }}</p>
              <p class="mt-1 text-xs tracking-brand text-[var(--ss-ocean-600)]">{{ t('BookingModal.vrboHint') }}</p>

              <div class="mt-3 space-y-2.5">
                <a
                  v-for="suite in vrboSuites"
                  :key="suite.slug"
                  :href="suite.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-3.5 rounded-xl border border-[var(--ss-ocean-100)] px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-300)] hover:shadow-coastal"
                  @click="close"
                >
                  <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                    style="background-color: #245ABC"
                  >
                    <UIcon :name="suite.icon" class="size-4.5" />
                  </span>
                  <span class="flex-1 text-sm font-semibold text-[var(--ss-ocean-950)]">{{ suite.title }}</span>
                  <UIcon
                    name="i-lucide-arrow-up-right"
                    class="size-4 text-[var(--ss-ocean-300)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ss-ocean-500)]"
                  />
                </a>
              </div>
            </div>

            <p class="mt-6 text-center text-xs text-[var(--ss-ocean-600)]">
              {{ t('BookingModal.orContact') }}
              <NuxtLink
                :to="localePath('contact')"
                class="font-semibold text-[var(--ss-ocean-500)] underline-offset-2 hover:underline"
                @click="close"
              >
                {{ t('BookingModal.contactLink') }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active > div:last-child,
.modal-fade-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from > div:last-child,
.modal-fade-leave-to > div:last-child {
  transform: translateY(16px) scale(0.97);
}
</style>

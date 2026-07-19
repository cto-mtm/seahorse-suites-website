<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { submitForm } = useSubmitForm()

const quickLinks = computed(() => [
  { label: t('AppHeader.suites'), to: localePath('suites') },
  { label: t('AppHeader.amenities'), to: localePath('amenities') },
  { label: t('AppHeader.attractions'), to: localePath('index') + '#attractions' },
  { label: t('AppHeader.contact'), to: localePath('contact') }
])

const email = ref('')
const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function subscribe() {
  if (!email.value || state.value === 'sending') return
  state.value = 'sending'
  const result = await submitForm('newsletter', { email: email.value })
  state.value = result.success ? 'success' : 'error'
  if (result.success) email.value = ''
}

</script>

<template>
  <footer class="relative bg-[var(--ss-ocean-950)] text-white">
    <!-- Wave flowing into the footer -->
    <WaveDivider class="absolute -top-16 md:-top-24 left-0 text-[var(--ss-ocean-950)]" />

    <div class="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
      <div class="grid gap-12 md:grid-cols-3">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3">
            <SeahorseMark variant="color" size="h-14" class="floaty" />
            <span class="font-display text-xl tracking-[0.25em] uppercase text-white">Seahorse<br>Suites</span>
          </div>
          <p class="mt-4 max-w-xs font-display text-lg italic text-[var(--ss-ocean-200)]">
            {{ t('AppFooter.tagline') }}
          </p>
          <nav class="mt-6" :aria-label="t('AppFooter.linksTitle')">
            <p class="eyebrow !text-[var(--ss-ocean-300)]">{{ t('AppFooter.linksTitle') }}</p>
            <ul class="mt-3 space-y-2">
              <li v-for="link in quickLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="text-sm text-[var(--ss-ocean-100)] transition-colors hover:text-[var(--ss-ocean-300)]"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Contact placeholders -->
        <div>
          <p class="eyebrow !text-[var(--ss-ocean-300)]">{{ t('AppFooter.contactTitle') }}</p>
          <ul class="mt-4 space-y-3 text-sm text-[var(--ss-ocean-100)]">
            <li class="flex items-start gap-3">
              <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0 text-[var(--ss-ocean-400)]" />
              <a
                href="https://maps.google.com/?q=1167+Buttonwood+Lane,+Sanibel,+FL+33957"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors hover:text-[var(--ss-ocean-300)]"
              >{{ t('AppFooter.address') }}</a>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-lucide-phone" class="mt-0.5 size-4 shrink-0 text-[var(--ss-ocean-400)]" />
              <a href="tel:+15735291529" class="transition-colors hover:text-[var(--ss-ocean-300)]">{{ t('AppFooter.phone') }}</a>
            </li>
            <li class="flex items-start gap-3">
              <UIcon name="i-lucide-mail" class="mt-0.5 size-4 shrink-0 text-[var(--ss-ocean-400)]" />
              <a href="mailto:seahorsesuites@gmail.com" class="transition-colors hover:text-[var(--ss-ocean-300)]">{{ t('AppFooter.email') }}</a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <p class="eyebrow !text-[var(--ss-ocean-300)]">{{ t('AppFooter.newsletterTitle') }}</p>
          <p class="mt-4 text-sm text-[var(--ss-ocean-100)]">{{ t('AppFooter.newsletterSubtitle') }}</p>

          <form class="mt-5" aria-label="Newsletter" @submit.prevent="subscribe">
            <label for="newsletter-email" class="sr-only">{{ t('AppFooter.newsletterPlaceholder') }}</label>
            <div class="flex overflow-hidden rounded-full border border-[var(--ss-ocean-700)] focus-within:border-[var(--ss-ocean-400)]">
              <input
                id="newsletter-email"
                v-model="email"
                type="email"
                name="email"
                required
                autocomplete="email"
                :placeholder="t('AppFooter.newsletterPlaceholder')"
                aria-describedby="newsletter-status"
                class="w-full bg-transparent px-5 py-3 text-sm text-white placeholder:text-[var(--ss-ocean-400)] focus:outline-none"
              >
              <button
                type="submit"
                :disabled="state === 'sending'"
                class="group relative shrink-0 overflow-hidden bg-[var(--ss-ocean-400)] px-6 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-950)] transition-all duration-500 hover:bg-[var(--ss-ocean-300)] disabled:opacity-60"
              >
                {{ t('AppFooter.newsletterButton') }}
              </button>
            </div>
            <p
              id="newsletter-status"
              aria-live="polite"
              class="mt-3 min-h-5 text-sm"
              :class="state === 'error' ? 'text-red-300' : 'text-[var(--ss-ocean-300)]'"
            >
              <template v-if="state === 'success'">{{ t('AppFooter.newsletterSuccess') }}</template>
              <template v-else-if="state === 'error'">{{ t('AppFooter.newsletterError') }}</template>
            </p>
          </form>
        </div>
      </div>

      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--ss-ocean-800)] pt-6 text-xs tracking-brand text-[var(--ss-ocean-300)] md:flex-row">
        <span>© {{ new Date().getFullYear() }} Seahorse Suites. {{ t('AppFooter.rights') }}</span>
        <NuxtLink :to="localePath('index')" class="transition-colors hover:text-[var(--ss-ocean-400)]">seahorsesuites.com</NuxtLink>
      </div>
    </div>
  </footer>
</template>

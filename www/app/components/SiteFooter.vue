<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const quickLinks = computed(() => [
  { label: t('AppHeader.suites'), to: localePath('suites') },
  { label: t('AppHeader.photos'), to: localePath('photos') },
  { label: t('AppHeader.amenities'), to: localePath('amenities') },
  { label: t('AppHeader.attractions'), to: localePath('explore') },
  { label: t('AppHeader.contact'), to: localePath('contact') }
])
</script>

<template>
  <footer class="relative bg-[var(--ss-ocean-950)] text-white">
    <!-- Wave flowing into the footer -->
    <WaveDivider class="absolute -top-16 md:-top-24 left-0 text-[var(--ss-ocean-950)]" />

    <div class="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
      <div class="grid gap-12 md:grid-cols-2">
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

        <!-- Contact -->
        <div>
          <p class="eyebrow !text-[var(--ss-ocean-300)]">{{ t('AppFooter.contactTitle') }}</p>

          <!-- Map -->
          <a
            href="https://maps.google.com/?q=1167+Buttonwood+Lane,+Sanibel,+FL+33957"
            target="_blank"
            rel="noopener noreferrer"
            class="group mt-4 block overflow-hidden rounded-2xl border border-[var(--ss-ocean-800)] shadow-coastal"
            :aria-label="t('AppFooter.mapLabel')"
          >
            <iframe
              title="Seahorse Suites location map"
              src="https://www.google.com/maps?q=1167+Buttonwood+Lane,+Sanibel,+FL+33957&output=embed"
              class="h-44 w-full border-0 grayscale transition-all duration-500 group-hover:grayscale-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              tabindex="-1"
            />
          </a>

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
      </div>

      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--ss-ocean-800)] pt-6 text-xs tracking-brand text-[var(--ss-ocean-300)] md:flex-row">
        <span>© {{ new Date().getFullYear() }} Seahorse Suites. {{ t('AppFooter.rights') }}</span>
        <NuxtLink :to="localePath('index')" class="transition-colors hover:text-[var(--ss-ocean-400)]">seahorsesuites.com</NuxtLink>
      </div>
    </div>
  </footer>
</template>

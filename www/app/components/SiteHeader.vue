<script setup lang="ts">
/**
 * Smart navbar:
 * - transparent while at the top of the page (over the hero)
 * - hides on scroll down, reappears on scroll up
 * - frosted glass (backdrop-blur) once scrolled
 * - immersive full-screen ocean menu on mobile
 */
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

const atTop = ref(true)
const hidden = ref(false)
const menuOpen = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  atTop.value = y < 40
  // hide on scroll down, show on scroll up (never hide near the top)
  hidden.value = y > lastY && y > 160 && !menuOpen.value
  lastY = y
}

onMounted(() => {
  lastY = window.scrollY
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (import.meta.client) document.body.style.overflow = ''
})

// Lock page scroll while the full-screen menu is open, and make sure
// the header bar (with its close button) is always shown with the menu
watch(menuOpen, (open) => {
  if (open) hidden.value = false
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const links = computed(() => [
  { label: t('AppHeader.suites'), to: localePath('suites') },
  { label: t('AppHeader.amenities'), to: localePath('amenities') },
  { label: t('AppHeader.attractions'), to: localePath('index') + '#attractions' },
  { label: t('AppHeader.contact'), to: localePath('contact') }
])

const { open: openBooking } = useBookingModal()

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

// White header text over the hero at top, or over the open mobile menu
const onDark = computed(() => atTop.value || menuOpen.value)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-transform duration-500"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div
      class="transition-all duration-500"
      :class="[
        onDark
          ? 'bg-transparent text-white'
          : 'bg-white/80 backdrop-blur-md text-[var(--ss-ocean-950)] shadow-coastal',
        // While the full-screen menu is open, let taps fall through the
        // header strip to the menu's own close button (logo stays clickable)
        menuOpen ? 'pointer-events-none' : ''
      ]"
    >
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8" aria-label="Main">
        <!-- Logo -->
        <NuxtLink
          :to="localePath('index')"
          class="group pointer-events-auto relative z-10 flex items-center gap-3"
          aria-label="Seahorse Suites — Home"
          @click="menuOpen = false"
        >
          <SeahorseMark
            :variant="onDark ? 'white' : 'color'"
            size="h-9"
            class="transition-transform duration-500 group-hover:-rotate-6"
          />
          <span class="font-display text-lg md:text-xl tracking-[0.25em] uppercase">Seahorse&nbsp;Suites</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-8 lg:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="group relative text-sm font-semibold tracking-brand-wide uppercase"
          >
            {{ link.label }}
            <span class="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-500 group-hover:w-full" />
          </NuxtLink>

          <!-- Language toggle -->
          <button
            type="button"
            class="flex items-center gap-1 text-sm font-semibold tracking-brand uppercase opacity-80 transition-opacity hover:opacity-100"
            :aria-label="t('AppHeader.language')"
            @click="toggleLocale"
          >
            <UIcon name="i-lucide-globe" class="size-4" />
            {{ locale === 'en' ? 'ES' : 'EN' }}
          </button>

          <!-- Book Now CTA — opens the Airbnb/Vrbo picker -->
          <button
            type="button"
            class="group relative overflow-hidden rounded-full border px-6 py-2.5 text-sm font-bold tracking-brand-wide uppercase transition-all duration-500"
            :class="onDark
              ? 'border-white/70 text-white hover:text-[var(--ss-ocean-950)]'
              : 'border-[var(--ss-ocean-500)] text-[var(--ss-ocean-700)] hover:text-white'"
            @click="openBooking"
          >
            <span
              class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-400)] transition-transform duration-500 ease-out group-hover:translate-x-0"
              aria-hidden="true"
            />
            <span class="relative z-10">{{ t('AppHeader.bookNow') }}</span>
          </button>
        </div>

        <!-- Mobile menu button (hidden while open — the menu has its own close button) -->
        <button
          v-show="!menuOpen"
          type="button"
          class="relative z-10 flex size-11 items-center justify-center rounded-full lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="Menu"
          @click="menuOpen = true"
        >
          <UIcon name="i-lucide-menu" class="size-7" />
        </button>
      </nav>
    </div>

    <!-- ═══ Immersive full-screen mobile menu ═══
         Teleported to <body>: the header has a transform transition, which
         would otherwise make `fixed` position against the header box
         instead of the viewport. Sits at z-40, under the z-50 header bar,
         so the logo and close button stay visible on top. -->
    <Teleport to="body">
      <Transition name="menu-dive">
        <div
          v-if="menuOpen"
          id="mobile-menu"
          class="fixed inset-0 z-40 flex flex-col ocean-bg text-white lg:hidden"
        >
        <!-- Dedicated close button (independent of the header bar) -->
        <button
          type="button"
          class="menu-item absolute right-4 top-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:border-white/60 active:scale-90"
          style="animation-delay: 0.05s"
          aria-label="Close menu"
          @click="menuOpen = false"
        >
          <UIcon name="i-lucide-x" class="size-6" />
        </button>

        <!-- Giant seahorse watermark -->
        <div class="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 opacity-10" aria-hidden="true">
          <SeahorseMark variant="white" size="h-[70vh]" class="floaty" />
        </div>

        <!-- Drifting waves at the bottom -->
        <div class="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" aria-hidden="true">
          <svg class="wave-drift relative left-0 w-[200%]" viewBox="0 0 2880 120" preserveAspectRatio="none" style="height: 90px">
            <path
              d="M0,60 C120,90 240,90 360,60 C480,30 600,30 720,60 C840,90 960,90 1080,60 C1200,30 1320,30 1440,60 C1560,90 1680,90 1800,60 C1920,30 2040,30 2160,60 C2280,90 2400,90 2520,60 C2640,30 2760,30 2880,60 L2880,120 L0,120 Z"
              fill="rgba(125, 225, 234, 0.14)"
            />
          </svg>
        </div>

        <!-- Nav links (pt clears the fixed header bar above) -->
        <nav class="relative flex flex-1 flex-col justify-center gap-2 px-8 pt-20" aria-label="Mobile">
          <NuxtLink
            v-for="(link, i) in links"
            :key="link.to"
            :to="link.to"
            class="menu-item group flex items-baseline gap-4 py-3"
            :style="{ animationDelay: `${0.08 + i * 0.07}s` }"
            @click="menuOpen = false"
          >
            <span class="font-body text-xs font-semibold tracking-brand-wide text-[var(--ss-ocean-400)]">0{{ i + 1 }}</span>
            <span class="font-display text-4xl uppercase tracking-[0.12em] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--ss-ocean-300)] sm:text-5xl">
              {{ link.label }}
            </span>
          </NuxtLink>
        </nav>

        <!-- Bottom actions -->
        <div class="menu-item relative space-y-5 px-8 pb-12" style="animation-delay: 0.42s">
          <button
            type="button"
            class="group relative block w-full overflow-hidden rounded-full bg-[var(--ss-ocean-400)] py-4 text-center font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] shadow-coastal transition-transform duration-300 active:scale-95"
            @click="menuOpen = false; openBooking()"
          >
            {{ t('AppHeader.bookNow') }}
          </button>

          <div class="flex items-center justify-between text-sm text-[var(--ss-ocean-200)]">
            <button
              type="button"
              class="flex items-center gap-2 font-semibold tracking-brand uppercase transition-colors hover:text-white"
              @click="toggleLocale"
            >
              <UIcon name="i-lucide-globe" class="size-4" />
              {{ locale === 'en' ? 'Español' : 'English' }}
            </button>
            <span class="font-display italic tracking-brand">Sanibel Island, FL</span>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
/* Full-screen menu: dive-in fade */
.menu-dive-enter-active,
.menu-dive-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.menu-dive-enter-from,
.menu-dive-leave-to {
  opacity: 0;
  transform: translateY(-4%);
}

/* Staggered entrance for links + bottom actions */
@keyframes menu-item-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.menu-item {
  opacity: 0;
  animation: menu-item-in 0.5s ease-out forwards;
}
</style>

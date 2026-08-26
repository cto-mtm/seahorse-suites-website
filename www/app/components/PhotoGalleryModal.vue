<script setup lang="ts">
/**
 * Fullscreen photo gallery modal for suite detail pages.
 * Opens with a grid of all interior photos; supports keyboard navigation.
 */
const props = defineProps<{
  photos: Array<{ src: string; thumb: string }>
  title: string
  open: boolean
}>()

const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(() => props.open, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[var(--ss-ocean-950)]/80 backdrop-blur-sm"
          aria-hidden="true"
          @click="emit('close')"
        />

        <!-- Header -->
        <div class="relative z-10 flex items-center justify-between px-5 py-4 text-white md:px-8">
          <h2 class="font-display text-xl tracking-brand md:text-2xl">{{ title }}</h2>
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            :aria-label="'Close'"
            @click="emit('close')"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <!-- Scrollable grid -->
        <div class="relative z-10 flex-1 overflow-y-auto px-5 pb-8 md:px-8">
          <div class="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(photo, i) in photos"
              :key="photo.src"
              class="overflow-hidden rounded-xl"
            >
              <NuxtImg
                :src="photo.src"
                :alt="`${title} — photo ${i + 1}`"
                :loading="i < 6 ? undefined : 'lazy'"
                class="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

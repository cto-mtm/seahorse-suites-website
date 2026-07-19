<script setup lang="ts">
/**
 * Seahorse logo mark (vertical-rectangle proportion).
 * Renders the brand logo files from /public/images/logo/
 * (seahorse-color.png, seahorse-white.png, seahorse-black.png —
 * trimmed + optimized from the originals in /logos/).
 */
const props = withDefaults(
  defineProps<{
    variant?: 'color' | 'white' | 'black'
    size?: string
  }>(),
  { variant: 'color', size: 'h-10' }
)

const src = computed(() => `/images/logo/seahorse-${props.variant}.png`)
</script>

<template>
  <img
    :src="src"
    alt=""
    aria-hidden="true"
    :class="[size, 'w-auto select-none']"
    draggable="false"
  >
</template>

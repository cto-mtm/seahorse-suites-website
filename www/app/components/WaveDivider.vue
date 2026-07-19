<script setup lang="ts">
/**
 * Soft wave-shaped section divider.
 * The wave fills with `currentColor` — set a text color class on it
 * matching the section it "flows into" (e.g. `text-white`, `text-sand-100`).
 * `flip` mirrors it vertically for bottom edges.
 */
withDefaults(defineProps<{ flip?: boolean }>(), { flip: false })
</script>

<template>
  <svg
    class="block w-full h-16 md:h-24"
    :class="{ 'rotate-180': flip }"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0,64 C240,96 480,16 720,40 C960,64 1200,96 1440,48 L1440,100 L0,100 Z"
      fill="currentColor"
    />
  </svg>
</template>

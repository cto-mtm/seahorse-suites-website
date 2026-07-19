<script setup lang="ts">
/**
 * Initial page loader — seahorse mark on deep ocean, fades out
 * over 0.5s once the app has mounted.
 */
const visible = ref(true)

onMounted(() => {
  // Hold briefly so the fade reads as intentional, not as a flash.
  setTimeout(() => {
    visible.value = false
  }, 500)
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[100] flex items-center justify-center ocean-bg"
      aria-hidden="true"
    >
      <div class="flex flex-col items-center gap-4 text-white">
        <SeahorseMark variant="color" size="h-20" class="floaty" />
        <span class="font-display text-xl tracking-[0.3em] uppercase">Seahorse Suites</span>
      </div>
    </div>
  </Transition>
</template>

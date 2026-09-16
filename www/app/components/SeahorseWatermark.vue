<script setup lang="ts">
/**
 * Subtle seahorse watermark shown on every page (mounted once in the default
 * layout). Fixed, pointer-events-none, and very low opacity so it reads as a
 * brand background flourish behind the content — never in the way.
 *
 * z-0 keeps it above plain (non-positioned) white section backgrounds but
 * below every positioned/interactive element (hero copy at z-10, header at
 * z-50, modals at z-90+), so it stays decorative and non-interactive.
 */
</script>

<template>
  <div
    class="pointer-events-none fixed right-[4%] top-1/3 z-0 hidden opacity-[0.06] lg:block print:hidden"
    aria-hidden="true"
  >
    <SeahorseMark variant="black" size="h-72" class="floaty" />
  </div>
</template>

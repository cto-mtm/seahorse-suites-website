<template>
  <div class="flex min-h-screen flex-col">
    <SeahorseWatermark />
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <BookingModal />
  </div>
</template>

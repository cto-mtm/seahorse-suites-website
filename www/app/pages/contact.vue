<script setup lang="ts">
const { t } = useI18n()
const { submitForm } = useSubmitForm()

useSeoMeta({
  title: () => t('Contact.metaTitle'),
  description: () => t('Contact.metaDescription')
})

useScrollReveal()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const serverError = ref('')

async function onSubmit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  serverError.value = ''

  const result = await submitForm('contact', { ...form })

  if (result.success) {
    state.value = 'success'
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  } else {
    state.value = 'error'
    serverError.value = result.error ?? ''
  }
}
</script>

<template>
  <div>
    <!-- Dark ocean band behind the transparent header -->
    <section class="ocean-bg px-5 pb-16 pt-36 text-center text-white md:pb-24 md:pt-44">
      <p class="animate-fade-up eyebrow !text-[var(--ss-ocean-300)]">{{ t('Contact.eyebrow') }}</p>
      <h1 class="animate-fade-up mt-4 font-display text-5xl uppercase tracking-[0.12em] md:text-6xl" style="animation-delay: 0.15s">
        {{ t('Contact.title') }}
      </h1>
      <p class="animate-fade-up mx-auto mt-5 max-w-xl text-[var(--ss-ocean-100)]" style="animation-delay: 0.3s">
        {{ t('Contact.subtitle') }}
      </p>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="mx-auto max-w-2xl px-5">
        <!--
          WebMCP Declarative API: `toolname` / `tooldescription` expose this
          form as a structured tool for browser-based AI agents.
          Semantic markup per Modern Web Guidance: <form> wrapper, explicit
          <label for>, aria-describedby for hints and validation feedback.
        -->
        <form
          toolname="contact_seahorse_suites"
          tooldescription="Send a contact or booking inquiry message to Seahorse Suites. Provide name, email, and a message; phone is optional."
          novalidate
          class="reveal space-y-7 rounded-2xl border border-[var(--ss-ocean-100)] p-8 shadow-coastal md:p-10"
          @submit.prevent="onSubmit"
        >
          <div>
            <label for="contact-name" class="block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">
              {{ t('Contact.nameLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
            </label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              name="name"
              required
              autocomplete="name"
              :placeholder="t('Contact.namePlaceholder')"
              class="mt-2 w-full rounded-xl border border-[var(--ss-ocean-200)] px-4 py-3 transition-all duration-300 focus:border-[var(--ss-ocean-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-ocean-100)]"
            >
          </div>

          <div>
            <label for="contact-email" class="block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">
              {{ t('Contact.emailLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
            </label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              name="email"
              required
              autocomplete="email"
              :placeholder="t('Contact.emailPlaceholder')"
              aria-describedby="contact-email-hint"
              class="mt-2 w-full rounded-xl border border-[var(--ss-ocean-200)] px-4 py-3 transition-all duration-300 focus:border-[var(--ss-ocean-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-ocean-100)]"
            >
            <p id="contact-email-hint" class="mt-1.5 text-xs text-[var(--ss-ocean-600)]">{{ t('Contact.emailHint') }}</p>
          </div>

          <div>
            <label for="contact-phone" class="block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">
              {{ t('Contact.phoneLabel') }}
            </label>
            <input
              id="contact-phone"
              v-model="form.phone"
              type="tel"
              name="phone"
              autocomplete="tel"
              :placeholder="t('Contact.phonePlaceholder')"
              class="mt-2 w-full rounded-xl border border-[var(--ss-ocean-200)] px-4 py-3 transition-all duration-300 focus:border-[var(--ss-ocean-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-ocean-100)]"
            >
          </div>

          <div>
            <label for="contact-message" class="block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]">
              {{ t('Contact.messageLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              name="message"
              required
              rows="5"
              :placeholder="t('Contact.messagePlaceholder')"
              aria-describedby="contact-message-hint"
              class="mt-2 w-full rounded-xl border border-[var(--ss-ocean-200)] px-4 py-3 transition-all duration-300 focus:border-[var(--ss-ocean-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-ocean-100)]"
            />
            <p id="contact-message-hint" class="mt-1.5 text-xs text-[var(--ss-ocean-600)]">{{ t('Contact.messageHint') }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="state === 'sending'"
              aria-describedby="contact-form-status"
              class="group relative w-full overflow-hidden rounded-full bg-[var(--ss-ocean-400)] py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] transition-all duration-500 hover:scale-[1.02] disabled:opacity-60"
            >
              <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
              <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">
                {{ state === 'sending' ? t('Contact.sending') : t('Contact.submit') }}
              </span>
            </button>

            <p
              id="contact-form-status"
              role="status"
              aria-live="polite"
              class="mt-4 min-h-5 text-center text-sm"
              :class="state === 'error' ? 'text-red-600' : 'text-[var(--ss-ocean-600)]'"
            >
              <template v-if="state === 'success'">{{ t('Contact.success') }}</template>
              <template v-else-if="state === 'error'">{{ t('Contact.error') }} <span v-if="serverError" class="block text-xs opacity-70">{{ serverError }}</span></template>
            </p>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

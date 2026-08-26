<script setup lang="ts">
/**
 * Direct reservation request form.
 *
 * Collects suite / dates / party / contact details and turns them into ONE
 * templated message that can be sent three ways, all built from the same data:
 *   1. "Send Reservation Request" → POSTs to the `submitForm` Cloud Function
 *      (formType `request-booking`) which emails the team + auto-confirms the guest.
 *   2. Email  → a pre-filled `mailto:` to the guest's own mail client.
 *   3. WhatsApp → a pre-filled `wa.me` message.
 *
 * Native <input type="date"> is used deliberately (Zero Legacy Bloat guardrail:
 * prefer modern native browser APIs over date-picker libraries).
 */
const props = defineProps<{
  /** Pre-select a suite by slug (falls back to the `?suite=` query param). */
  initialSuite?: string
}>()

const { t } = useI18n()
const route = useRoute()
const appConfig = useAppConfig()
const suites = useSuites()
const { submitForm } = useSubmitForm()
const recaptcha = useRecaptcha()

const form = reactive({
  suite: '', // slug, or '' for "no preference"
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  pets: 0,
  name: '',
  email: '',
  phone: '',
  notes: ''
})

// Pre-select from prop or ?suite= query, if it's a real suite slug
const preselect = props.initialSuite || (typeof route.query.suite === 'string' ? route.query.suite : '')
if (preselect && suites.value.some(s => s.slug === preselect)) {
  form.suite = preselect
}

const selectedSuite = computed(() => suites.value.find(s => s.slug === form.suite) ?? null)
const petsAllowed = computed(() => (selectedSuite.value ? selectedSuite.value.petFriendly : true))
const maxGuests = computed(() => selectedSuite.value?.maxGuests ?? 12)

// Today (set client-side to avoid SSR hydration mismatch on the min attribute)
const todayStr = ref('')
onMounted(() => {
  todayStr.value = new Date().toISOString().slice(0, 10)
})

// Keep party size within the selected suite's limits
watch([petsAllowed, maxGuests], () => {
  if (!petsAllowed.value) form.pets = 0
  if (form.adults + form.children > maxGuests.value) {
    form.children = Math.max(0, maxGuests.value - form.adults)
    if (form.adults > maxGuests.value) form.adults = maxGuests.value
  }
})

// If check-out is on/before check-in, clear it so the guest re-picks a valid date
watch(() => form.checkIn, () => {
  if (form.checkOut && form.checkOut <= form.checkIn) form.checkOut = ''
})

function step(key: 'adults' | 'children' | 'pets', delta: number) {
  const min = key === 'adults' ? 1 : 0
  const next = form[key] + delta
  if (next < min) return
  if (key === 'pets' && !petsAllowed.value) return
  if (key === 'adults' || key === 'children') {
    const others = key === 'adults' ? form.children : form.adults
    if (next + others > maxGuests.value) return
  }
  form[key] = next
}

const counters = computed(() => [
  { key: 'adults' as const, label: t('Reserve.adultsLabel'), min: 1, disabled: false },
  { key: 'children' as const, label: t('Reserve.childrenLabel'), min: 0, disabled: false },
  { key: 'pets' as const, label: t('Reserve.petsLabel'), min: 0, disabled: !petsAllowed.value }
])

const nights = computed(() => {
  if (!form.checkIn || !form.checkOut) return 0
  const diff = Math.round(
    (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86_400_000
  )
  return diff > 0 ? diff : 0
})
const nightsText = computed(() =>
  nights.value > 0 ? `${nights.value} ${t('Reserve.nightsSuffix', nights.value)}` : ''
)

const guestSummary = computed(() => {
  const parts = [`${form.adults} ${t('Reserve.adultsUnit', form.adults)}`]
  if (form.children > 0) parts.push(`${form.children} ${t('Reserve.childrenUnit', form.children)}`)
  if (form.pets > 0) parts.push(`${form.pets} ${t('Reserve.petsUnit', form.pets)}`)
  return parts.join(', ')
})

const suiteLabel = computed(() =>
  selectedSuite.value ? selectedSuite.value.title : t('Reserve.noPreference')
)

const isValid = computed(() =>
  Boolean(
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.checkIn &&
    form.checkOut &&
    nights.value > 0
  )
)

/** The shared plain-text template used for both mailto: and WhatsApp. */
const plainMessage = computed(() => {
  const L = (k: string) => t(`Reserve.${k}`)
  const lines = [
    L('msgHeading'),
    '',
    `${L('msgSuite')}: ${suiteLabel.value}`,
    `${L('msgCheckIn')}: ${form.checkIn}`,
    `${L('msgCheckOut')}: ${form.checkOut}${nightsText.value ? ` (${nightsText.value})` : ''}`,
    `${L('msgGuests')}: ${guestSummary.value}`,
    `${L('msgName')}: ${form.name}`,
    `${L('msgEmail')}: ${form.email}`
  ]
  if (form.phone) lines.push(`${L('msgPhone')}: ${form.phone}`)
  if (form.notes) lines.push('', `${L('msgNotes')}:`, form.notes)
  return lines.join('\n')
})

const mailtoHref = computed(() =>
  `mailto:${appConfig.contact.email}?subject=${encodeURIComponent(t('Reserve.emailSubject'))}&body=${encodeURIComponent(plainMessage.value)}`
)
const whatsappHref = computed(() =>
  `https://wa.me/${appConfig.contact.whatsapp}?text=${encodeURIComponent(plainMessage.value)}`
)

const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const serverError = ref('')
const touched = ref(false)

async function onSubmit() {
  if (state.value === 'sending') return
  if (!isValid.value) {
    touched.value = true
    return
  }
  state.value = 'sending'
  serverError.value = ''

  const token = await recaptcha.execute('request_booking')
  const result = await submitForm('request-booking', {
    name: form.name,
    email: form.email,
    suite: suiteLabel.value,
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    nights: String(nights.value),
    guests: guestSummary.value,
    // Only include optional fields when filled, so they don't render as
    // empty rows in the notification email.
    ...(form.phone.trim() && { phone: form.phone.trim() }),
    ...(form.notes.trim() && { message: form.notes.trim() })
  }, token)

  if (result.success) {
    state.value = 'success'
  } else {
    // The mailto:/WhatsApp channels below remain a reliable fallback.
    state.value = 'error'
    serverError.value = result.error ?? ''
  }
}

function openMailto() {
  if (!isValid.value) { touched.value = true; return }
  window.location.href = mailtoHref.value
}
function openWhatsApp() {
  if (!isValid.value) { touched.value = true; return }
  window.open(whatsappHref.value, '_blank', 'noopener')
}

const inputClass =
  'mt-2 w-full rounded-xl border border-[var(--ss-ocean-200)] px-4 py-3 transition-all duration-300 focus:border-[var(--ss-ocean-400)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-ocean-100)]'
const labelClass =
  'block text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)]'
</script>

<template>
  <!--
    WebMCP Declarative API: `toolname` / `tooldescription` expose this form as a
    structured tool for browser-based AI agents. Semantic markup: <form> wrapper,
    explicit <label for>, aria-describedby for hints and status.
  -->
  <form
    toolname="request_reservation_seahorse_suites"
    tooldescription="Request a direct booking at Seahorse Suites. Provide check-in and check-out dates, number of adults/children/pets, name, and email; suite and phone are optional. Builds an email and WhatsApp message to the property."
    novalidate
    class="space-y-7 rounded-2xl border border-[var(--ss-ocean-100)] bg-white p-6 shadow-coastal md:p-9"
    @submit.prevent="onSubmit"
  >
    <!-- Suite -->
    <div>
      <label for="res-suite" :class="labelClass">{{ t('Reserve.suiteLabel') }}</label>
      <select id="res-suite" v-model="form.suite" name="suite" :class="inputClass">
        <option value="">{{ t('Reserve.noPreference') }}</option>
        <option v-for="s in suites" :key="s.slug" :value="s.slug">{{ s.title }} — {{ s.specs }}</option>
      </select>
    </div>

    <!-- Dates -->
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="res-checkin" :class="labelClass">
          {{ t('Reserve.checkInLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
        </label>
        <input
          id="res-checkin"
          v-model="form.checkIn"
          type="date"
          name="checkIn"
          required
          :min="todayStr"
          :class="inputClass"
        >
      </div>
      <div>
        <label for="res-checkout" :class="labelClass">
          {{ t('Reserve.checkOutLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
        </label>
        <input
          id="res-checkout"
          v-model="form.checkOut"
          type="date"
          name="checkOut"
          required
          :min="form.checkIn || todayStr"
          :class="inputClass"
        >
      </div>
      <p class="sm:col-span-2 -mt-1 text-xs text-[var(--ss-ocean-600)]">
        {{ t('Reserve.datesHint') }}
        <span v-if="nightsText" class="font-semibold text-[var(--ss-ocean-700)]">· {{ nightsText }}</span>
        <span class="block mt-1 text-[var(--ss-ocean-500)]">{{ t('Reserve.checkInOutTimes') }}</span>
      </p>
    </div>

    <!-- Guests -->
    <fieldset>
      <legend :class="labelClass">{{ t('Reserve.guestsLabel') }}</legend>
      <div class="mt-3 space-y-2.5">
        <div
          v-for="c in counters"
          :key="c.key"
          class="flex items-center justify-between rounded-xl border border-[var(--ss-ocean-100)] px-4 py-2.5"
          :class="c.disabled ? 'opacity-50' : ''"
        >
          <span class="text-sm font-semibold text-[var(--ss-ocean-900)]">{{ c.label }}</span>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-full border border-[var(--ss-ocean-200)] text-[var(--ss-ocean-700)] transition-colors hover:border-[var(--ss-ocean-400)] hover:text-[var(--ss-ocean-500)] disabled:opacity-40"
              :disabled="c.disabled || form[c.key] <= c.min"
              :aria-label="`${t('Reserve.decrease')} ${c.label}`"
              @click="step(c.key, -1)"
            >
              <UIcon name="i-lucide-minus" class="size-4" />
            </button>
            <span class="w-6 text-center text-sm font-bold tabular-nums text-[var(--ss-ocean-950)]" aria-live="polite">{{ form[c.key] }}</span>
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-full border border-[var(--ss-ocean-200)] text-[var(--ss-ocean-700)] transition-colors hover:border-[var(--ss-ocean-400)] hover:text-[var(--ss-ocean-500)] disabled:opacity-40"
              :disabled="c.disabled"
              :aria-label="`${t('Reserve.increase')} ${c.label}`"
              @click="step(c.key, 1)"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
            </button>
          </div>
        </div>
      </div>
      <p v-if="!petsAllowed" class="mt-2 text-xs text-[var(--ss-ocean-600)]">{{ t('Reserve.petsDisabledHint') }}</p>
      <p v-else-if="form.pets > 0" class="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <UIcon name="i-lucide-alert-triangle" class="mt-0.5 size-3.5 shrink-0" />
        <span>{{ t('Reserve.petFeeWarning') }}</span>
      </p>
    </fieldset>

    <!-- Contact -->
    <div>
      <label for="res-name" :class="labelClass">
        {{ t('Reserve.nameLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
      </label>
      <input
        id="res-name"
        v-model="form.name"
        type="text"
        name="name"
        required
        autocomplete="name"
        :placeholder="t('Reserve.namePlaceholder')"
        :class="inputClass"
      >
    </div>

    <div>
      <label for="res-email" :class="labelClass">
        {{ t('Reserve.emailLabel') }} <span aria-hidden="true" class="text-[var(--ss-ocean-400)]">*</span>
      </label>
      <input
        id="res-email"
        v-model="form.email"
        type="email"
        name="email"
        required
        autocomplete="email"
        :placeholder="t('Reserve.emailPlaceholder')"
        aria-describedby="res-email-hint"
        :class="inputClass"
      >
      <p id="res-email-hint" class="mt-1.5 text-xs text-[var(--ss-ocean-600)]">{{ t('Reserve.emailHint') }}</p>
    </div>

    <div>
      <label for="res-phone" :class="labelClass">{{ t('Reserve.phoneLabel') }}</label>
      <input
        id="res-phone"
        v-model="form.phone"
        type="tel"
        name="phone"
        autocomplete="tel"
        :placeholder="t('Reserve.phonePlaceholder')"
        :class="inputClass"
      >
    </div>

    <div>
      <label for="res-notes" :class="labelClass">{{ t('Reserve.notesLabel') }}</label>
      <textarea
        id="res-notes"
        v-model="form.notes"
        name="notes"
        rows="4"
        :placeholder="t('Reserve.notesPlaceholder')"
        :class="inputClass"
      />
    </div>

    <!-- Primary action: Cloud Function submit -->
    <div>
      <button
        type="submit"
        :disabled="state === 'sending'"
        aria-describedby="res-status"
        class="group relative w-full overflow-hidden rounded-full bg-[var(--ss-ocean-400)] py-4 font-bold tracking-brand-wide uppercase text-[var(--ss-ocean-950)] transition-all duration-500 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span class="absolute inset-0 -translate-x-full bg-[var(--ss-ocean-950)] transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
        <span class="relative z-10 transition-colors duration-500 group-hover:text-[var(--ss-ocean-300)]">
          {{ state === 'sending' ? t('Reserve.sending') : t('Reserve.submit') }}
        </span>
      </button>

      <p
        id="res-status"
        role="status"
        aria-live="polite"
        class="mt-4 min-h-5 text-center text-sm"
        :class="(state === 'error' || (touched && !isValid)) ? 'text-red-600' : 'text-[var(--ss-ocean-600)]'"
      >
        <template v-if="touched && !isValid">{{ t('Reserve.validationHint') }}</template>
        <template v-else-if="state === 'success'">{{ t('Reserve.success') }}</template>
        <template v-else-if="state === 'error'">
          {{ t('Reserve.error') }}
          <span v-if="serverError" class="mt-1 block text-xs opacity-70">{{ serverError }}</span>
        </template>
      </p>
    </div>

    <!-- Alternate channels: always available, built from the same template -->
    <div class="border-t border-[var(--ss-ocean-100)] pt-6">
      <p class="text-center text-xs font-semibold tracking-brand-wide uppercase text-[var(--ss-ocean-500)]">
        {{ t('Reserve.orSendVia') }}
      </p>
      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          class="group flex items-center justify-center gap-2.5 rounded-full border border-[var(--ss-ocean-200)] py-3.5 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
          @click="openMailto"
        >
          <UIcon name="i-lucide-mail" class="size-4.5 text-[var(--ss-ocean-500)]" />
          {{ t('Reserve.viaEmail') }}
        </button>
        <a
          :href="`tel:${appConfig.contact.phoneE164}`"
          class="group flex items-center justify-center gap-2.5 rounded-full border border-[var(--ss-ocean-200)] py-3.5 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
        >
          <UIcon name="i-lucide-phone" class="size-4.5 text-[var(--ss-ocean-500)]" />
          {{ t('Reserve.viaPhone') }}
        </a>
        <button
          type="button"
          class="group flex items-center justify-center gap-2.5 rounded-full border border-[var(--ss-ocean-200)] py-3.5 text-sm font-bold tracking-brand uppercase text-[var(--ss-ocean-800)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ss-ocean-400)] hover:shadow-coastal"
          @click="openWhatsApp"
        >
          <UIcon name="i-lucide-message-circle" class="size-4.5" style="color: #25D366" />
          {{ t('Reserve.viaWhatsApp') }}
        </button>
      </div>
    </div>
  </form>
</template>

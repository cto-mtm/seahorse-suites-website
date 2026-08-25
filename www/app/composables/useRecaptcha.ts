declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

// Module-level: the script is injected at most once per page load.
let scriptPromise: Promise<void> | null = null

/**
 * reCAPTCHA v3 helper. Lazily loads Google's script the first time a token is
 * requested (so it never weighs down initial page load) and returns a token for
 * the given action.
 *
 * Returns `undefined` when reCAPTCHA isn't configured (no site key) or on any
 * failure — the `submitForm` Cloud Function bypasses verification in the
 * emulator, so an absent token is fine for local development.
 */
export function useRecaptcha() {
  const config = useRuntimeConfig()
  const siteKey = config.public.recaptchaSiteKey as string

  const enabled = computed(() => import.meta.client && !!siteKey && siteKey !== 'REPLACE_ME')

  function loadScript(): Promise<void> {
    if (!scriptPromise) {
      scriptPromise = new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
        s.async = true
        s.defer = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
        document.head.appendChild(s)
      })
    }
    return scriptPromise
  }

  async function execute(action: string): Promise<string | undefined> {
    if (!enabled.value) return undefined
    try {
      await loadScript()
      await new Promise<void>(resolve => window.grecaptcha!.ready(() => resolve()))
      return await window.grecaptcha!.execute(siteKey, { action })
    } catch {
      return undefined
    }
  }

  return { execute, enabled }
}

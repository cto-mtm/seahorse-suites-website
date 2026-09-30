declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void
        execute: (siteKey: string, opts: { action: string }) => Promise<string>
      }
    }
  }
}

// Module-level: the script is injected at most once per page load.
let scriptPromise: Promise<void> | null = null

/**
 * reCAPTCHA Enterprise helper. Lazily loads Google's enterprise.js the first
 * time a token is requested (so it never weighs down initial page load) and
 * returns a token for the given action.
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
        s.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`
        s.async = true
        s.defer = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
        document.head.appendChild(s)
      })
    }
    return scriptPromise
  }

  /**
   * Runs the Enterprise challenge for `action` and returns the token, or
   * `undefined` if reCAPTCHA is disabled / fails. Enterprise action names must
   * match `[A-Za-z0-9/_]` — use underscores, not hyphens.
   */
  async function execute(action: string): Promise<string | undefined> {
    if (!enabled.value) return undefined
    try {
      await loadScript()
      await new Promise<void>(resolve => window.grecaptcha!.enterprise.ready(() => resolve()))
      return await window.grecaptcha!.enterprise.execute(siteKey, { action })
    } catch {
      return undefined
    }
  }

  return { execute, enabled }
}

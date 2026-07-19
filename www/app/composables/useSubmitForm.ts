export interface SubmitFormResult {
  success: boolean
  error?: string
}

/**
 * POSTs a form payload to the `submitForm` Cloud Function.
 * Never throws — server errors are surfaced via the return value.
 */
export function useSubmitForm() {
  const config = useRuntimeConfig()

  async function submitForm(
    formType: string,
    data: Record<string, unknown>,
    recaptchaToken?: string
  ): Promise<SubmitFormResult> {
    const url =
      config.public.submitFormUrl && config.public.submitFormUrl !== 'REPLACE_ME'
        ? config.public.submitFormUrl
        : 'https://us-central1-REPLACE_ME.cloudfunctions.net/submitForm'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, data, recaptchaToken })
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        return {
          success: false,
          error:
            typeof body?.error === 'string'
              ? body.error
              : `Request failed with status ${response.status}`
        }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  return { submitForm }
}

const MIN_SCORE = 0.5;

// GCP project that owns the reCAPTCHA Enterprise key. Static (not secret).
const PROJECT_ID = "seahorse-suites-website";

// Public reCAPTCHA Enterprise SITE key (safe to embed; also used client-side).
const SITE_KEY = "6Lc9stctAAAAAPDg-NB8ukUbsbkUqcWxoAR7qwIg";

export interface RecaptchaResult {
  success: boolean;
  score?: number;
  error?: string;
}

interface AssessmentResponse {
  tokenProperties?: {
    valid?: boolean;
    action?: string;
    invalidReason?: string;
  };
  riskAnalysis?: {
    score?: number;
  };
  error?: {
    message?: string;
  };
}

/**
 * Verifies a reCAPTCHA Enterprise token by creating an Assessment via the
 * reCAPTCHA Enterprise REST API. Authenticated with a restricted API key
 * (passed in as `apiKey`).
 *
 * Bypassed when running in the Functions emulator so local form testing needs
 * no keys.
 *
 * @param token   The token produced by grecaptcha.enterprise.execute() client-side.
 * @param apiKey  Google Cloud API key restricted to recaptchaenterprise.googleapis.com.
 * @param expectedAction  The action name the frontend used (e.g. "contact").
 */
export async function verifyRecaptcha(
  token: string,
  apiKey: string,
  expectedAction?: string,
): Promise<RecaptchaResult> {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  try {
    const url =
      `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments` +
      `?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey: SITE_KEY,
          ...(expectedAction ? { expectedAction } : {}),
        },
      }),
    });

    const result = (await response.json()) as AssessmentResponse;

    if (!response.ok) {
      return {
        success: false,
        error: result.error?.message ?? `Assessment request failed (${response.status})`,
      };
    }

    const tokenProps = result.tokenProperties;
    if (!tokenProps?.valid) {
      return {
        success: false,
        error: `Invalid token${tokenProps?.invalidReason ? `: ${tokenProps.invalidReason}` : ""}`,
      };
    }

    // If we told the API which action to expect, enforce it matches the token.
    if (expectedAction && tokenProps.action && tokenProps.action !== expectedAction) {
      return {
        success: false,
        error: `Action mismatch (expected "${expectedAction}", got "${tokenProps.action}")`,
      };
    }

    const score = result.riskAnalysis?.score ?? 0;
    if (score < MIN_SCORE) {
      return { success: false, score, error: "Score below threshold" };
    }

    return { success: true, score };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

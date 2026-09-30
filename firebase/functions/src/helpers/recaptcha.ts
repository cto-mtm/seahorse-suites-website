import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const MIN_SCORE = 0.5;

// GCP project that owns the reCAPTCHA Enterprise key.
const PROJECT_ID = "seahorse-suites-website";

// Public reCAPTCHA Enterprise SITE key (also used client-side).
const SITE_KEY = "6Lc9stctAAAAAPDg-NB8ukUbsbkUqcWxoAR7qwIg";

export interface RecaptchaResult {
  success: boolean;
  score?: number;
  error?: string;
}

// Reuse the client across warm invocations (recommended by Google).
let client: RecaptchaEnterpriseServiceClient | null = null;
function getClient(): RecaptchaEnterpriseServiceClient {
  if (!client) {
    client = new RecaptchaEnterpriseServiceClient();
  }
  return client;
}

/**
 * Verifies a reCAPTCHA Enterprise token by creating an Assessment via the
 * official client library. Authentication uses Application Default Credentials
 * (the Cloud Function's own service account) — no API key required.
 *
 * Bypassed when running in the Functions emulator so local form testing needs
 * no credentials.
 *
 * @param token           Token from grecaptcha.enterprise.execute() (client-side).
 * @param expectedAction  The action name the frontend used (e.g. "contact").
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
): Promise<RecaptchaResult> {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  try {
    const c = getClient();
    const projectPath = c.projectPath(PROJECT_ID);

    const [response] = await c.createAssessment({
      parent: projectPath,
      assessment: {
        event: {
          token,
          siteKey: SITE_KEY,
        },
      },
    });

    const tokenProps = response.tokenProperties;
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

    const score = response.riskAnalysis?.score ?? 0;
    if (score < MIN_SCORE) {
      return { success: false, score, error: "Score below threshold" };
    }

    return { success: true, score };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

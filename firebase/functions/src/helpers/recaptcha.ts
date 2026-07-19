const MIN_SCORE = 0.5;

export interface RecaptchaResult {
  success: boolean;
  score?: number;
  error?: string;
}

/**
 * Verifies a reCAPTCHA v3 token. Bypassed when running in the
 * Functions emulator so local form testing needs no keys.
 */
export async function verifyRecaptcha(
  token: string,
  secretKey: string,
): Promise<RecaptchaResult> {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const result = (await response.json()) as { success: boolean; score?: number };

    if (!result.success) {
      return { success: false, error: "Token verification failed" };
    }
    if ((result.score ?? 0) < MIN_SCORE) {
      return { success: false, score: result.score, error: "Score below threshold" };
    }
    return { success: true, score: result.score };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

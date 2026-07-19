import type { FormConfig } from "../models.js";
import { escapeHtml } from "../helpers/escapeHtml.js";

/** User-facing confirmation email — brand-neutral, inline styles only. */
export function buildConfirmationEmail(
  config: FormConfig,
  data: Record<string, unknown>,
): string {
  const name = escapeHtml(data.name ?? "there");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0b333a;padding:20px 32px;">
                <h1 style="margin:0;color:#40d6dc;font-size:20px;">Seahorse Suites</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <h2 style="margin:0 0 12px;color:#0b333a;font-size:18px;">${escapeHtml(config.confirmationSubject)}</h2>
                <p style="margin:0 0 12px;color:#334155;">Hi ${name},</p>
                <p style="margin:0 0 12px;color:#334155;">Thank you for reaching out. We've received your message and will get back to you shortly.</p>
                <p style="margin:0;color:#334155;">— The Seahorse Suites team</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">Seahorse Suites · REPLACE_ME_ADDRESS</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

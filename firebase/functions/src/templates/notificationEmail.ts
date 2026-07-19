import type { FormConfig } from "../models.js";
import { escapeHtml } from "../helpers/escapeHtml.js";

/** Internal notification email — brand-neutral, inline styles only. */
export function buildNotificationEmail(
  config: FormConfig,
  data: Record<string, unknown>,
): string {
  const rows = Object.entries(data)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#1d6069;text-transform:capitalize;vertical-align:top;">${escapeHtml(key)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#334155;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0b333a;padding:20px 32px;">
                <h1 style="margin:0;color:#40d6dc;font-size:20px;">${escapeHtml(config.subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <p style="margin:0 0 16px;color:#334155;">A new form submission was received:</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;">
                  ${rows}
                </table>
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

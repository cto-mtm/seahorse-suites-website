import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { ZodError } from "zod";
import formConfigs from "./models.js";
import { createTransporter, formatFrom } from "./helpers/mailer.js";
import { verifyRecaptcha } from "./helpers/recaptcha.js";
import { buildNotificationEmail } from "./templates/notificationEmail.js";
import { buildConfirmationEmail } from "./templates/confirmationEmail.js";

const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");
const GMAIL_SENDER = defineSecret("GMAIL_SENDER");
const RECAPTCHA_SECRET_KEY = defineSecret("RECAPTCHA_SECRET_KEY");

// REPLACE_ME: update with the production domain(s) before deploying
const ALLOWED_ORIGINS = [
  "https://seahorsesuites.com",
  "https://www.seahorsesuites.com",
  "http://localhost:3000",
];

export const submitForm = onRequest(
  {
    region: "us-central1",
    maxInstances: 10,
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_SENDER, RECAPTCHA_SECRET_KEY],
  },
  async (req, res) => {
    const origin = req.headers.origin ?? "";
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    }

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ success: false, error: "Method not allowed" });
      return;
    }

    try {
      const { formType, data, recaptchaToken } = req.body as {
        formType?: string;
        data?: Record<string, unknown>;
        recaptchaToken?: string;
      };

      const config = formType ? formConfigs[formType] : undefined;
      if (!formType || !config) {
        res.status(400).json({
          success: false,
          error: `Unknown formType "${formType}". Valid types: ${Object.keys(formConfigs).join(", ")}`,
        });
        return;
      }

      const recaptcha = await verifyRecaptcha(
        recaptchaToken ?? "",
        RECAPTCHA_SECRET_KEY.value(),
      );
      if (!recaptcha.success) {
        logger.warn("reCAPTCHA verification failed", { formType, error: recaptcha.error });
        res.status(403).json({ success: false, error: "reCAPTCHA verification failed" });
        return;
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = config.schema.parse(data ?? {});
      } catch (err) {
        if (err instanceof ZodError) {
          res.status(400).json({ success: false, error: err.flatten() });
          return;
        }
        throw err;
      }

      const transporter = createTransporter(
        GMAIL_USER.value(),
        GMAIL_APP_PASSWORD.value(),
      );
      const from = formatFrom(GMAIL_SENDER.value());

      const safeName = String(parsed.name ?? "Unknown").replace(/[\r\n]/g, "");
      await transporter.sendMail({
        from,
        to: config.notifyEmail,
        subject: `${config.subject} — ${safeName}`,
        html: buildNotificationEmail(config, parsed),
      });

      if (typeof parsed.email === "string" && parsed.email) {
        await transporter.sendMail({
          from,
          to: parsed.email,
          subject: config.confirmationSubject,
          html: buildConfirmationEmail(config, parsed),
        });
      }

      logger.info("Form submission processed", { formType });
      res.status(200).json({ success: true });
    } catch (err) {
      logger.error("submitForm failed", err as Error);
      res.status(500).json({ success: false, error: "Internal error" });
    }
  },
);

/**
 * Renders the email templates to firebase/functions/preview/*.html
 * for visual review in a browser.
 *
 * Usage: npm run preview:emails   (builds first, then runs this)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const previewDir = join(__dirname, "..", "preview");

const { buildNotificationEmail } = await import("../lib/templates/notificationEmail.js");
const { buildConfirmationEmail } = await import("../lib/templates/confirmationEmail.js");
const formConfigs = (await import("../lib/models.js")).default;

const config = formConfigs["contact"];
const sampleData = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555 000 0000",
  message: "Hello!\nDo you have ocean-view suites available in August?",
};

mkdirSync(previewDir, { recursive: true });
writeFileSync(join(previewDir, "notification.html"), buildNotificationEmail(config, sampleData));
writeFileSync(join(previewDir, "confirmation.html"), buildConfirmationEmail(config, sampleData));

console.log(`✓ Wrote ${join(previewDir, "notification.html")}`);
console.log(`✓ Wrote ${join(previewDir, "confirmation.html")}`);

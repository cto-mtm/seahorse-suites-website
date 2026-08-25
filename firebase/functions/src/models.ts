import { z } from "zod";

export interface FormConfig {
  schema: z.ZodObject<z.ZodRawShape>;
  notifyEmail: string;
  subject: string;
  confirmationSubject: string;
  requiredFields: string[];
  optionalFields: string[];
}

const formConfigs: Record<string, FormConfig> = {
  "contact": {
    schema: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().min(1),
    }),
    requiredFields: ["name", "email", "message"],
    optionalFields: ["phone"],
    notifyEmail: "seahorsesuites@gmail.com",
    subject: "New Contact Form Submission",
    confirmationSubject: "We received your message — Seahorse Suites",
  },
  "newsletter": {
    schema: z.object({
      email: z.string().email(),
    }),
    requiredFields: ["email"],
    optionalFields: [],
    notifyEmail: "seahorsesuites@gmail.com",
    subject: "New Newsletter Signup",
    confirmationSubject: "Welcome to the Seahorse Suites newsletter",
  },
  "request-booking": {
    schema: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      suite: z.string().min(1),
      checkIn: z.string().min(1),
      checkOut: z.string().min(1),
      nights: z.string().optional(),
      guests: z.string().min(1),
      message: z.string().optional(),
    }),
    requiredFields: ["name", "email", "suite", "checkIn", "checkOut", "guests"],
    optionalFields: ["phone", "nights", "message"],
    notifyEmail: "seahorsesuites@gmail.com",
    subject: "New Direct Reservation Request",
    confirmationSubject: "We received your reservation request — Seahorse Suites",
  },
  // Add more form types here following the same shape.
};

export default formConfigs;

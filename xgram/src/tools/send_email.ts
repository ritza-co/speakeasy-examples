import { z } from "zod";
import { type InferSchema } from "xmcp";
import { Resend } from "resend";

export const schema = {
  email: z.string().email().describe("Recipient email address"),
  subject: z.string().min(1).describe("Email subject"),
  text: z.string().min(1).describe("Email body (plain text)"),
  from: z
    .string()
    .optional()
    .describe('Optional sender like "Acme <onboarding@resend.dev>" (defaults to onboarding@resend.dev)'),
};

export const metadata = {
  name: "send_email",
  description: "Send an email using Resend",
};

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function sendEmail(input: InferSchema<typeof schema>) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    return {
      success: false,
      error: "Missing RESEND_API_KEY",
      details: "Set RESEND_API_KEY in the function environment before calling send_email.",
    };
  }

  const from = input.from ?? "Acme <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [input.email],
      subject: input.subject,
      // Use simple HTML wrapping; we escape to avoid HTML injection.
      html: `<p>${escapeHtml(input.text)}</p>`,
      // Also include text for clients that prefer it.
      text: input.text,
    });

    if (result.error) {
      return {
        success: false,
        error: "Failed to send email",
        details: result.error.message ?? String(result.error),
      };
    }

    const id = result.data?.id;
    return {
      success: true,
      id,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to send email",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}



import { Resend } from "resend";

// Outbound email is optional in every environment except real production —
// without RESEND_API_KEY set, sendEmail just logs and returns instead of
// throwing, so local dev and preview deploys keep working without it.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "Draftroom <support@mindcrossed.com>";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean }> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${subject}" to ${to}`);
    return { ok: false };
  }

  try {
    await resend.emails.send({ from: FROM, to, subject, html, text });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false };
  }
}

import { contactEmailTemplate } from "@/components/emailTemplates/contact";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = form.get("name")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const phone = form.get("phone")?.toString() || "";
    const company = form.get("company")?.toString() || "";
    const service = form.get("service")?.toString() || "";
    const message = form.get("message")?.toString() || "";

    const html = contactEmailTemplate({
      name,
      email,
      phone,
      company,
      service,
      message,
      submittedAt: new Date().toISOString(),
    });

    // Sender (configurable) and recipient (forced to owner's inbox)
    const from =
      process.env.RESEND_FROM ||
      "SIN Travels <onboarding@inquery.sintravelsandmanpower.com>";
    // Per request: all contact form submissions go to this address
    const to = ["yohanvishvajith@gmail.com"];
    const subject = `New contact request from ${name || email || "website"}`;

    // Create a simple plain-text fallback containing the submitted values
    const text = `New contact request\n\nName: ${name || "-"}\nEmail: ${
      email || "-"
    }\nPhone: ${phone || "-"}\nCompany: ${company || "-"}\nService: ${
      service || "-"
    }\nSubmitted: ${new Date().toISOString()}\n\nMessage:\n${message || "-"}\n`;

    // Send via Resend. The SDK will throw on network/auth errors so we catch below.
    // Log the outgoing envelope for debugging (do not log secrets in production)
    console.log(
      "Contact email send -> from:",
      from,
      "to:",
      to,
      "subject:",
      subject
    );
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      // Set Reply-To so replies go to the visitor who submitted the form
      headers: email ? { "Reply-To": email } : undefined,
      // Some providers support a dedicated replyTo field — include it as well
      replyTo: email || undefined,
    });

    // Log provider response to help diagnose delivery issues
    console.log("Resend send response:", data);

    // Return the provider response to the client for debugging in dev. In production you
    // might want to hide provider details and only return success/failure.
    return new Response(JSON.stringify({ ok: true, result: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact API send error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

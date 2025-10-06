export function contactEmailTemplate(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  submittedAt?: string;
}) {
  const submittedAt = data.submittedAt || new Date().toISOString();
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Contact Request</title>
    <style>
      body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: #f7fafc; color: #111827; }
      .container { max-width: 680px; margin: 24px auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 6px 18px rgba(2,6,23,0.08); }
      h1 { font-size: 20px; margin: 0 0 8px; color: #0b5fff; }
      p.lead { color: #374151; margin: 0 0 16px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th { text-align: left; padding: 8px 12px; background: #f1f5f9; color: #111827; width: 180px; }
      td { padding: 8px 12px; background: #fff; color: #374151; }
      .message { white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; }
      .footer { margin-top: 20px; color: #6b7280; font-size: 13px; }
      .badge { display:inline-block; background:#e6f0ff; color:#0b5fff; padding:4px 8px; border-radius:6px; font-weight:600 }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>New Contact Request</h1>
      <p class="lead">You have received a new message from the website contact form.</p>

      <table role="presentation">
        <tr>
          <th>Name</th>
          <td>${escapeHtml(data.name || "-")}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>${escapeHtml(data.email || "-")}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>${escapeHtml(data.phone || "-")}</td>
        </tr>
        <tr>
          <th>Company</th>
          <td>${escapeHtml(data.company || "-")}</td>
        </tr>
        <tr>
          <th>Service</th>
          <td>${escapeHtml(data.service || "-")}</td>
        </tr>
        <tr>
          <th>Submitted</th>
          <td>${escapeHtml(submittedAt)}</td>
        </tr>
      </table>

      <div class="message">
        <strong>Message:</strong>
        <div style="margin-top:8px">${escapeHtml(data.message || "-")}</div>
      </div>

      <div class="footer">This email was generated from the SIN Manpower website contact form.</div>
    </div>
  </body>
</html>`;
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

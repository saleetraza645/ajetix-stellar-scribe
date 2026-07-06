import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required)");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFileList(fileUrls) {
  if (!fileUrls?.length) return "None";
  return fileUrls
    .map((url, i) => {
      const label = typeof url === "string" ? url : url.name || url.path || `File ${i + 1}`;
      const link = typeof url === "string" ? url : url.path || url.url || label;
      return `${label}: ${link}`;
    })
    .join("\n");
}

function formatFileListHtml(fileUrls) {
  if (!fileUrls?.length) return "<p><em>None</em></p>";
  const items = fileUrls
    .map((url) => {
      const label = typeof url === "string" ? url : url.name || url.path || "Attachment";
      const link = typeof url === "string" ? url : url.path || url.url || label;
      return `<li><strong>${escapeHtml(label)}</strong> — <a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`;
    })
    .join("");
  return `<ul>${items}</ul>`;
}

/**
 * Send a contact-form notification email via direct SMTP (no third-party service).
 * @param {object} submission — saved ContactSubmission document or plain object
 */
export async function sendContactEmail(submission) {
  const to = process.env.ADMIN_NOTIFY_EMAIL || "info@ajetix.com";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const { name, email, budget, projectDetails, fileUrls = [] } = submission;

  const text = [
    "New contact form submission — Ajetix",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Budget: ${budget || "Not specified"}`,
    "",
    "Project details:",
    projectDetails,
    "",
    "Attached files:",
    formatFileList(fileUrls),
  ].join("\n");

  const html = `
    <h2>New contact form submission — Ajetix</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget || "Not specified")}</td></tr>
    </table>
    <h3>Project details</h3>
    <p style="white-space:pre-wrap;">${escapeHtml(projectDetails)}</p>
    <h3>Attached files</h3>
    ${formatFileListHtml(fileUrls)}
  `;

  const transporter = getTransporter();
  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject: `[Ajetix Contact] ${name}`,
    text,
    html,
  });
}

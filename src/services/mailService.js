import nodemailer from 'nodemailer';

const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE,
  SMTP_USER, SMTP_PASS,
  MAIL_FROM_EMAIL, MAIL_FROM_NAME,
  COMPANY_NAME, COMPANY_LOGO_URL,
  APP_LOGIN_URL
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE || 'false') === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

/**
 * Send registration / onboarding email with login credentials
 * and post applied for.
 */
export async function sendRegistrationEmail({
  to,
  name,
  phone,
  email,
  password,
  postAppliedFor
}) {
  const subject = `Welcome to ${COMPANY_NAME || 'Our Company'} — Your Login Details`;

  const html = buildHrWelcomeTemplate({
    name,
    phone,
    email,
    password,
    postAppliedFor,
    companyName: COMPANY_NAME || 'Our Company',
    logoUrl: COMPANY_LOGO_URL || '',
    loginUrl: APP_LOGIN_URL || '#'
  });

  await transporter.sendMail({
    from: `"${MAIL_FROM_NAME || COMPANY_NAME || 'HR'}" <${MAIL_FROM_EMAIL}>`,
    to,
    subject,
    html
  });
}

function buildHrWelcomeTemplate({
  name,
  phone,
  email,
  password,
  postAppliedFor,
  companyName,
  logoUrl,
  loginUrl
}) {
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone || '');
  const safeEmail = escapeHtml(email || '');
  const safePassword = escapeHtml(password || '');
  const safePost = escapeHtml(postAppliedFor || 'Not specified');

  const year = new Date().getFullYear();

  return `
  <div style="background:#f3f4f8;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.12);">
      <tr>
        <td style="background:linear-gradient(135deg,#0b5fff,#2563eb);padding:24px 24px 18px 24px;text-align:center;">
          ${logoUrl
            ? `<img src="${logoUrl}" alt="${escapeHtml(companyName)}" style="max-width:160px;height:auto;display:block;margin:0 auto 10px auto;" />`
            : ''
          }
          <div style="color:#dbeafe;font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Recruitment & Onboarding</div>
          <h1 style="color:#ffffff;margin:10px 0 4px 0;font-size:22px;font-weight:600;">Welcome, ${safeName}</h1>
          <p style="color:#e0ebff;margin:0;font-size:13px;">Your candidate account has been created successfully.</p>
        </td>
      </tr>

      <tr>
        <td style="padding:24px 24px 12px 24px;">
          <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">
            Thank you for your interest in <strong>${escapeHtml(companyName)}</strong>. We’re pleased to inform you that your candidate portal access has been set up for the position below.
          </p>

          <!-- Application Summary -->
          <div style="border:1px solid #e5e7eb;border-radius:14px;padding:16px 16px 12px 16px;margin:18px 0;background:#f9fafb;">
            <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:8px;">
              Application Summary
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr>
                <td style="padding:5px 0;width:160px;color:#6b7280;">Candidate Name</td>
                <td style="padding:5px 0;"><strong>${safeName}</strong></td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#6b7280;">Post Applied For</td>
                <td style="padding:5px 0;"><strong>${safePost}</strong></td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#6b7280;">Phone</td>
                <td style="padding:5px 0;"><strong>${safePhone}</strong></td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#6b7280;">Email</td>
                <td style="padding:5px 0;"><strong>${safeEmail}</strong></td>
              </tr>
            </table>
          </div>

          <!-- Login Credentials -->
          <div style="border:1px dashed #cbd5f5;border-radius:14px;padding:16px;margin:16px 0;background:#eef2ff;">
            <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:8px;">
              Login Credentials
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr>
                <td style="padding:5px 0;width:160px;color:#4b5563;">Username</td>
                <td style="padding:5px 0;"><strong>${safePhone}</strong></td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#4b5563;">Temporary Password</td>
                <td style="padding:5px 0;"><strong>${safePassword}</strong></td>
              </tr>
            </table>
            <p style="margin:10px 0 0 0;font-size:12px;color:#6b7280;">
              For security reasons, please change this password after your first login.
            </p>
          </div>

          <!-- CTA -->
          <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;">
            You can access the candidate portal using the button below to complete your profile, upload documents, and track the status of your application.
          </p>

          <div style="text-align:center;margin:18px 0 28px 0;">
            <a href="${loginUrl}"
               style="display:inline-block;padding:12px 22px;border-radius:999px;background:#0b5fff;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
              Open Candidate Portal
            </a>
          </div>

          <!-- Next steps -->
          <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:4px;font-size:12px;color:#6b7280;line-height:1.6;">
            <p style="margin:0 0 6px 0;">
              <strong>Next steps:</strong>
            </p>
            <ul style="margin:0 0 8px 18px;padding:0;">
              <li>Log in using the credentials above.</li>
              <li>Review and complete your profile information.</li>
              <li>Upload any required documents (if applicable).</li>
            </ul>
            <p style="margin:0 0 6px 0;">
              If you did not initiate this registration, please contact our HR team immediately.
            </p>
            <p style="margin:0;">
              Warm regards,<br/>
              <strong>${escapeHtml(companyName)} — HR & Recruitment Team</strong>
            </p>
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align:center;color:#9ca3af;font-size:11px;margin-top:18px;">
      © ${year} ${escapeHtml(companyName)}. All rights reserved.
    </div>
  </div>
  `;
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

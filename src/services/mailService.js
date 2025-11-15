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

export async function sendRegistrationEmail({ to, name, phone, email, password }) {
  const subject = `Welcome to ${COMPANY_NAME || 'Our Company'} — Your Account Credentials`;
  const html = buildHrWelcomeTemplate({
    name, phone, email, password,
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

function buildHrWelcomeTemplate({ name, phone, email, password, companyName, logoUrl, loginUrl }) {
  return `
  <div style="background:#f6f8fb;padding:32px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(16,24,40,.08);">
      <tr>
        <td style="background:#0b5fff;padding:24px 24px 12px 24px;text-align:center;">
          ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="max-width:160px;height:auto;display:block;margin:0 auto 8px auto;" />` : ''}
          <div style="color:#eaf1ff;font-size:14px;letter-spacing:.08em;text-transform:uppercase;">Human Resources</div>
          <h1 style="color:#fff;margin:8px 0 0 0;font-size:20px;font-weight:600;">Welcome, ${escapeHtml(name)}!</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 12px 0;">We’re excited to have you at <strong>${companyName}</strong>. Your account has been created successfully. Below are your login credentials:</p>
          <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:16px 0;background:#fafbff;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 0;width:160px;color:#6b7280;">Name</td><td style="padding:6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;"><strong>${escapeHtml(phone)}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><strong>${escapeHtml(email)}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Password</td><td style="padding:6px 0;"><strong>${escapeHtml(password)}</strong></td></tr>
            </table>
          </div>
          <p style="margin:0 0 16px 0;">Use the button below to sign in. For security, we recommend changing your password after your first login.</p>
          <div style="text-align:center;margin:20px 0 28px 0;">
            <a href="${loginUrl}" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#0b5fff;color:#fff;text-decoration:none;font-weight:600;">Go to Login</a>
          </div>
          <p style="margin:0 0 6px 0;color:#6b7280;font-size:12px;">If you did not request this account, please contact the HR team immediately.</p>
          <p style="margin:0;color:#6b7280;font-size:12px;">Warm regards,<br/><strong>${companyName} — HR Department</strong></p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</div>
  </div>`;
}

function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

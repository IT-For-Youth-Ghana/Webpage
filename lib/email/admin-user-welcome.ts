import nodemailer from "nodemailer";

import type { UserPayload } from "@/lib/utils/validators";

type EmailDeliveryResult = {
  configured: boolean;
  delivered: boolean;
  error?: string;
};

type AdminWelcomeEmailPayload = {
  user: UserPayload;
  temporaryPassword: string;
};

const providerHosts: Record<string, string> = {
  brevo: "smtp-relay.brevo.com",
  smtp: "",
};

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function getLoginUrl() {
  return `${getAppUrl()}/admin-login`;
}

function getFileServerUrl() {
  return (
    process.env.FILE_SERVER_URL ??
    process.env.NEXT_PUBLIC_FILE_SERVER_URL ??
    getLoginUrl()
  ).replace(/\/$/, "");
}

function getAccessLabel(role: UserPayload["role"]) {
  return role === "file-server-only" ? "file server" : "website CMS";
}

function getAccessUrl(role: UserPayload["role"]) {
  return role === "file-server-only" ? getFileServerUrl() : getLoginUrl();
}

function getSmtpConfig() {
  const provider = (process.env.EMAIL_PROVIDER ?? "smtp").toLowerCase();
  const host = process.env.EMAIL_HOST ?? providerHosts[provider];
  const port = Number(process.env.EMAIL_PORT ?? (provider === "brevo" ? 587 : 465));
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const fromName = process.env.EMAIL_FROM_NAME ?? "IT For Youth Ghana";

  if (!host || !port || !user || !pass || !fromAddress) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    from: `"${fromName.replace(/"/g, "'")}" <${fromAddress}>`,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRoleLabel(role: UserPayload["role"]) {
  if (role === "super-admin") return "Super admin";
  if (role === "file-server-only") return "File server only";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function buildWelcomeText({ user, temporaryPassword }: AdminWelcomeEmailPayload) {
  const accessLabel = getAccessLabel(user.role);

  return [
    `Hello ${user.name},`,
    "",
    `An account has been created for you on the IT For Youth Ghana ${accessLabel}.`,
    "",
    `Login URL: ${getAccessUrl(user.role)}`,
    `Email: ${user.email.toLowerCase()}`,
    `Temporary password: ${temporaryPassword}`,
    `Role: ${getRoleLabel(user.role)}`,
    "",
    "Please sign in with this temporary password and change it after your first login.",
    "",
    "IT For Youth Ghana",
  ].join("\n");
}

function buildWelcomeHtml({ user, temporaryPassword }: AdminWelcomeEmailPayload) {
  const loginUrl = getAccessUrl(user.role);
  const accessLabel = getAccessLabel(user.role);

  return `
    <html>
      <body style="margin:0; padding:0; background:#F7F9FC; color:#1A1A1A; font-family:Inter, Arial, sans-serif;">
        <div style="max-width:640px; margin:0 auto; padding:32px 20px;">
          <div style="background:#ffffff; border:1px solid #E2E8F0; border-radius:8px; padding:28px;">
            <p style="margin:0 0 12px; color:#D70B52; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;">IT For Youth Ghana</p>
            <h1 style="margin:0 0 16px; color:#1A1A1A; font-family:Poppins, Arial, sans-serif; font-size:26px; line-height:1.25;">Your account is ready</h1>
            <p style="margin:0 0 20px; line-height:1.6;">Hello ${escapeHtml(user.name)}, an account has been created for you on the IT For Youth Ghana ${escapeHtml(accessLabel)}.</p>
            <table style="border-collapse:collapse; width:100%; margin:0 0 22px;">
              <tbody>
                <tr>
                  <th style="border:1px solid #E2E8F0; padding:10px; text-align:left; background:#F7F9FC; width:180px;">Email</th>
                  <td style="border:1px solid #E2E8F0; padding:10px;">${escapeHtml(user.email.toLowerCase())}</td>
                </tr>
                <tr>
                  <th style="border:1px solid #E2E8F0; padding:10px; text-align:left; background:#F7F9FC;">Temporary password</th>
                  <td style="border:1px solid #E2E8F0; padding:10px; font-family:Consolas, Monaco, monospace; font-weight:700;">${escapeHtml(temporaryPassword)}</td>
                </tr>
                <tr>
                  <th style="border:1px solid #E2E8F0; padding:10px; text-align:left; background:#F7F9FC;">Role</th>
                  <td style="border:1px solid #E2E8F0; padding:10px;">${escapeHtml(getRoleLabel(user.role))}</td>
                </tr>
              </tbody>
            </table>
            <p style="margin:0 0 22px; line-height:1.6;">Please sign in with this temporary password and change it after your first login.</p>
            <a href="${escapeHtml(loginUrl)}" style="display:inline-block; background:#D70B52; color:#ffffff; padding:12px 18px; border-radius:6px; text-decoration:none; font-weight:700;">Sign in</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendAdminUserWelcomeEmail(
  payload: AdminWelcomeEmailPayload,
): Promise<EmailDeliveryResult> {
  const config = getSmtpConfig();

  if (!config) {
    return { configured: false, delivered: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    await transporter.sendMail({
      from: config.from,
      to: {
        name: payload.user.name,
        address: payload.user.email.toLowerCase(),
      },
      subject:
        payload.user.role === "file-server-only"
          ? "Your IT For Youth Ghana file server account"
          : "Your IT For Youth Ghana CMS account",
      text: buildWelcomeText(payload),
      html: buildWelcomeHtml(payload),
    });

    return { configured: true, delivered: true };
  } catch (error) {
    console.error("Admin welcome email failed", error);
    return {
      configured: true,
      delivered: false,
      error: error instanceof Error ? error.message : "Unknown email delivery error",
    };
  }
}

export function isAdminUserWelcomeEmailConfigured() {
  return Boolean(getSmtpConfig());
}

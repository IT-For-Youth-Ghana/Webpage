import { NextResponse } from "next/server";

import { persistContactMessage } from "@/lib/cms/persistence";
import {
  contactSchema,
  type ContactPayload,
} from "@/lib/utils/validators";

const BREVO_TRANSACTIONAL_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

const enquiryLabels: Record<ContactPayload["enquiryType"], string> = {
  training: "Training or courses",
  organisation: "For organisations",
  partnership: "Partnership",
  donation: "Donation or sponsorship",
  media: "Media request",
  volunteering: "Volunteering",
  general: "General enquiry",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildNotificationHtml(payload: ContactPayload) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone ?? "Not provided"],
    ["Organisation", payload.organisation ?? "Not provided"],
    ["Enquiry type", enquiryLabels[payload.enquiryType]],
    ["Preferred contact", payload.preferredContact],
  ];

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #1a1a2e; line-height: 1.6;">
        <h1 style="margin: 0 0 16px;">New website enquiry</h1>
        <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
          <tbody>
            ${rows
              .map(
                ([label, value]) => `
                  <tr>
                    <th style="border: 1px solid #e8eaf0; padding: 10px; text-align: left; width: 180px; background: #f4f5f8;">${escapeHtml(label)}</th>
                    <td style="border: 1px solid #e8eaf0; padding: 10px;">${escapeHtml(value)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
        <h2 style="margin: 24px 0 8px;">Message</h2>
        <p style="white-space: pre-line;">${escapeHtml(payload.message)}</p>
      </body>
    </html>
  `;
}

function buildNotificationText(payload: ContactPayload) {
  return [
    "New website enquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone ?? "Not provided"}`,
    `Organisation: ${payload.organisation ?? "Not provided"}`,
    `Enquiry type: ${enquiryLabels[payload.enquiryType]}`,
    `Preferred contact: ${payload.preferredContact}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

async function sendBrevoNotification(payload: ContactPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? notificationEmail;
  const senderName = process.env.BREVO_SENDER_NAME ?? "ITFY Website";

  if (!apiKey || !notificationEmail || !senderEmail) {
    return {
      configured: false,
      delivered: false,
    };
  }

  const response = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: [
        {
          email: notificationEmail,
          name: "ITFY Team",
        },
      ],
      replyTo: {
        email: payload.email,
        name: payload.name,
      },
      subject: `Website enquiry: ${enquiryLabels[payload.enquiryType]}`,
      htmlContent: buildNotificationHtml(payload),
      textContent: buildNotificationText(payload),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "Unknown Brevo error");
    console.error("Brevo contact notification failed", details);

    return {
      configured: true,
      delivered: false,
    };
  }

  return {
    configured: true,
    delivered: true,
  };
}

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request: Request) {
  const payload = await parsePayload(request);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const persistence = await persistContactMessage(parsed.data).catch((error) => {
    console.error("Contact message persistence failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
    };
  });
  const notification = await sendBrevoNotification(parsed.data);

  if (notification.configured && !notification.delivered) {
    return NextResponse.json(
      {
        success: false,
        message: "The message was valid, but the email notification could not be sent. Please try again or email the team directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: notification.delivered
      ? "Thanks for reaching out. Your message has been sent to the ITFY team."
      : "Thanks for reaching out. Your message is validated locally; Brevo delivery will activate when production email settings are configured.",
    delivery: notification.delivered ? "brevo" : "not-configured",
    persistence: persistence.written
      ? "firestore"
      : persistence.configured
        ? "failed"
        : "not-configured",
    id: persistence.id,
    data: parsed.data,
  });
}

import { Resend } from "resend";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  console.warn("[notifications] NEXT_PUBLIC_RESEND_API_KEY is not set — notification emails will be skipped.");
}
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const FROM_EMAIL = "web@nuvexainternational.com";

/**
 * Fetch all notification recipient emails from Firestore.
 */
async function getRecipientEmails() {
  const snap = await getDocs(collection(db, "notification-emails"));
  return snap.docs.map((d) => d.data().email).filter(Boolean);
}

/**
 * Build a premium HTML email for inquiry/quote notifications.
 */
function buildEmailHtml({ type, data }) {
  const isQuote = type === "quote";
  const title = isQuote ? "New Quote Request" : "New Contact Inquiry";
  const subtitle = isQuote
    ? "A customer has submitted a product quote request"
    : "A customer has submitted a contact inquiry";

  // Build detail rows
  const rows = [];
  rows.push({ label: "Name", value: data.name });
  rows.push({ label: "Email", value: data.email });
  if (data.phone) rows.push({ label: "Phone", value: data.phone });
  if (data.company) rows.push({ label: "Company", value: data.company });
  if (data.country) rows.push({ label: "Country", value: data.country });
  if (data.destination) rows.push({ label: "Destination", value: data.destination });
  if (data.productName) rows.push({ label: isQuote ? "Product(s)" : "Product", value: data.productName });

  const detailRows = rows
    .map(
      (r) => `
      <tr>
        <td style="padding: 10px 16px; font-size: 13px; color: #737373; width: 120px; vertical-align: top; border-bottom: 1px solid #f3f4f6;">${r.label}</td>
        <td style="padding: 10px 16px; font-size: 14px; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(r.value)}</td>
      </tr>`
    )
    .join("");

  // Product list for bulk quotes
  let productListHtml = "";
  if (data.isBulk && Array.isArray(data.products) && data.products.length > 0) {
    const productRows = data.products
      .map(
        (p) => `
        <tr>
          <td style="padding: 8px 16px; font-size: 13px; color: #111827; border-bottom: 1px solid #f3f4f6;">${escapeHtml(p.name)}</td>
          <td style="padding: 8px 16px; font-size: 13px; color: #737373; text-align: center; border-bottom: 1px solid #f3f4f6;">${p.quantity || 1}</td>
          <td style="padding: 8px 16px; font-size: 13px; color: #737373; border-bottom: 1px solid #f3f4f6;">${escapeHtml(p.category || "—")}</td>
        </tr>`
      )
      .join("");

    productListHtml = `
      <div style="margin-top: 24px;">
        <p style="font-size: 12px; font-weight: 600; color: #737373; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Requested Products</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 10px 16px; font-size: 12px; color: #737373; text-align: left; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Product</th>
              <th style="padding: 10px 16px; font-size: 12px; color: #737373; text-align: center; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Qty</th>
              <th style="padding: 10px 16px; font-size: 12px; color: #737373; text-align: left; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Category</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
      </div>`;
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #083865 0%, #1361A9 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.3px;">${title}</h1>
              <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0;">${subtitle}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">

              <!-- Contact details -->
              <p style="font-size: 12px; font-weight: 600; color: #737373; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Contact Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tbody>${detailRows}</tbody>
              </table>

              ${productListHtml}

              <!-- Message -->
              <div style="margin-top: 24px;">
                <p style="font-size: 12px; font-weight: 600; color: #737373; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Message</p>
                <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                  <p style="font-size: 14px; color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message || "No message provided.")}</p>
                </div>
              </div>

              <!-- CTA -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="https://nuvexainternational.com/admin/${isQuote ? "quotes" : "inquiries"}" style="display: inline-block; background-color: #083865; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 10px;">View in Dashboard</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 20px 40px; text-align: center;">
              <p style="font-size: 12px; color: #737373; margin: 0;">Nuvexa International — Automated Notification</p>
              <p style="font-size: 11px; color: #9ca3af; margin: 6px 0 0 0;">You are receiving this because your email is on the notification list.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send notification emails to all registered recipients.
 * @param {"inquiry" | "quote"} type
 * @param {object} data — the inquiry/quote data from the form submission
 */
export async function sendNotificationEmails(type, data) {
  if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) return;
  try {
    const recipients = await getRecipientEmails();
    if (recipients.length === 0) return;

    const isQuote = type === "quote";
    const subject = isQuote
      ? `New Quote Request from ${data.name}`
      : `New Inquiry from ${data.name}`;

    await resend.emails.send({
      from: `Nuvexa International <${FROM_EMAIL}>`,
      to: recipients,
      subject,
      html: buildEmailHtml({ type, data }),
    });
  } catch (err) {
    // Log but don't throw — notification failure shouldn't block the form submission
    console.error("Failed to send notification emails:", err);
  }
}

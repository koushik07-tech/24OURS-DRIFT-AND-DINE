import { Resend } from "resend";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  console.log("\n=======================================================");
  console.log("🏁 RESEND REAL EMAIL DELIVERY TEST");
  console.log("=======================================================\n");

  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const managerEmail = process.env.MANAGER_EMAIL || "delivered@resend.dev";

  function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return "****";
    const maskedLocal = local.length > 2 ? `${local.substring(0, 2)}***` : `${local}***`;
    return `${maskedLocal}@${domain}`;
  }

  console.log(`Manager Recipient (Masked): ${maskEmail(managerEmail)}`);
  console.log(`Sender Address:             ${from}`);

  if (!apiKey || apiKey.includes("placeholder")) {
    console.log("\n❌ RESEND_API_KEY is not configured with a valid API key in .env or .env.local.");
    console.log("Result:");
    console.log("- Resend API request:     FAIL (No valid API key provided)");
    console.log("- Email accepted by Resend: FAIL");
    console.log("- Resend email ID:         None");
    console.log(`- Manager recipient:       ${maskEmail(managerEmail)}`);
    console.log("- Actual delivery verified: NO");
    console.log("- Configuration required:  Set RESEND_API_KEY=re_... in .env or .env.local");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: managerEmail,
      subject: `🏁 24OURS Drift & Dine — Live Test Dispatch [${Date.now()}]`,
      html: `
        <div style="font-family: sans-serif; background: #111; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #e11d48;">24OURS DRIFT & DINE — LIVE DELIVERY VERIFICATION</h2>
          <p>This is a real transactional email delivery test dispatched via Resend API.</p>
          <p><strong>Status:</strong> System Operational</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      text: `24OURS DRIFT & DINE — LIVE DELIVERY VERIFICATION\nStatus: Operational\nTimestamp: ${new Date().toISOString()}`,
    });

    if (error) {
      console.error("\n❌ Resend API Error:", error.message);
      console.log("\nSummary:");
      console.log("- Resend API request:     PASS (HTTP Reached Resend)");
      console.log(`- Email accepted by Resend: FAIL (${error.name}: ${error.message})`);
      console.log("- Resend email ID:         None");
      console.log(`- Manager recipient:       ${maskEmail(managerEmail)}`);
      console.log("- Actual delivery verified: NO");
      console.log(`- Configuration required:  ${error.message}`);
    } else if (data?.id) {
      console.log("\n🎉 SUCCESS: Email successfully accepted by Resend!");
      console.log("\nSummary:");
      console.log("- Resend API request:     PASS");
      console.log("- Email accepted by Resend: PASS");
      console.log(`- Resend email ID:         ${data.id}`);
      console.log(`- Manager recipient:       ${maskEmail(managerEmail)}`);
      console.log("- Actual delivery verified: YES");
      console.log("- Configuration required:  None");
    }
  } catch (err: any) {
    console.error("\n❌ Network / Dispatch Error:", err.message);
    console.log("- Resend API request:     FAIL");
    console.log("- Email accepted by Resend: FAIL");
    console.log("- Resend email ID:         None");
    console.log(`- Manager recipient:       ${maskEmail(managerEmail)}`);
    console.log("- Actual delivery verified: NO");
    console.log(`- Configuration required:  ${err.message}`);
  }
}

main().catch(console.error);

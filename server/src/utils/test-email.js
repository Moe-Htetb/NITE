// test-email.js
require("dotenv").config();

async function testEmail() {
  const nodemailer = require("nodemailer");

  console.log("Testing Email Configuration:");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("FROM_EMAIL:", process.env.FROM_EMAIL);
  console.log("FROM_NAME:", process.env.FROM_NAME);

  // Create test transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Verify connection
    console.log("\nVerifying SMTP connection...");
    await transporter.verify();
    console.log("✓ SMTP connection verified successfully!");

    // Send test email
    console.log("\nSending test email...");
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: "your-test-email@gmail.com", // Change this to your test email
      subject: "Test Email from NITE.COM",
      html: "<h1>Test Email</h1><p>This is a test email from NITE.COM</p>",
      text: "This is a test email from NITE.COM",
    });

    console.log("✓ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error("Full error:", error);
  }
}

testEmail();

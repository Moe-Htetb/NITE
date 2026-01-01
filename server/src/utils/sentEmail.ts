// import nodemailer from "nodemailer";
// import SMTPTransport from "nodemailer/lib/smtp-transport";

// interface Options {
//   reciver_mail: string;
//   subject: string;
//   body: string;
// }

// export const sendEmail = async ({ reciver_mail, subject, body }: Options) => {
//   var transport = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   } as SMTPTransport.Options);

//   const mail = {
//     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//     to: reciver_mail,
//     subject,
//     html: body,
//   };

//   await transport.sendMail(mail);
// };

import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface Options {
  reciver_mail: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({ reciver_mail, subject, body }: Options) => {
  try {
    // Debug: Log environment variables (hide sensitive info in production)
    // if (process.env.NODE_ENV === "development") {
    //   console.log("Email Config Check:", {
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     user: process.env.SMTP_USER?.slice(0, 3) + "...", // Show only first 3 chars
    //     fromEmail: process.env.FROM_EMAIL,
    //     fromName: process.env.FROM_NAME,
    //   });
    // }

    // Validate environment variables
    // const requiredEnvVars = [
    //   "SMTP_HOST",
    //   "SMTP_PORT",
    //   "SMTP_USER",
    //   "SMTP_PASS",
    //   "FROM_EMAIL",
    //   "FROM_NAME",
    // ];
    // const missingVars = requiredEnvVars.filter(
    //   (varName) => !process.env[varName]
    // );

    // if (missingVars.length > 0) {
    //   console.error("Missing environment variables:", missingVars);
    //   throw new Error(`Missing email configuration: ${missingVars.join(", ")}`);
    // }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT!),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      tls: {
        rejectUnauthorized: false, // For self-signed certificates (be careful in production)
      },
    } as SMTPTransport.Options);

    // Verify connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: reciver_mail,
      subject,
      html: body,
      // Optional: Add text version for email clients that don't support HTML
      // text: body.replace(/<[^>]*>/g, ""),
    };

    // console.log(`Attempting to send email to: ${reciver_mail}`);

    const info = await transporter.sendMail(mailOptions);

    // console.log(`Email sent successfully! Message ID: ${info.messageId}`);
    // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return info;
  } catch (error: any) {
    console.error("Email sending failed:", {
      error: error.message,
      code: error.code,
      command: error.command,
      recipient: reciver_mail,
    });

    // Re-throw with more descriptive error
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

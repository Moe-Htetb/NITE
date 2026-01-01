export const otpEmailTemplate = (
  otpCode: string,
  url: string
) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Account Verification Code</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background-color: #f5f7fa;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      padding: 40px 24px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 16px;
      opacity: 0.9;
    }

    /* Content */
    .content {
      padding: 32px 24px;
      text-align: center;
    }

    .content p {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 24px;
    }

    .otp-label {
      font-size: 14px;
      color: #718096;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .otp-box {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .otp-digit {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .expiry {
      font-size: 14px;
      color: #e53e3e;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .highlight {
      font-weight: 600;
      color: #007bff;
    }

    /* Footer */
    .footer {
      padding: 32px 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .footer p {
      font-size: 14px;
      color: #718096;
      margin-bottom: 20px;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
    }

    .disclaimer {
      font-size: 12px;
      color: #a0aec0;
      margin-top: 24px;
      max-width: 420px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .otp-digit {
        width: 48px;
        height: 48px;
        font-size: 24px;
      }

      .button {
        width: 100%;
        max-width: 280px;
      }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a202c;
      }

      .container {
        background: #2d3748;
        border-color: #4a5568;
      }

      .content p,
      .footer p,
      .otp-label {
        color: #cbd5e0;
      }

      .otp-digit {
        background: #4a5568;
        border-color: #718096;
        color: #f7fafc;
      }

      .footer {
        background: #1a202c;
        border-color: #4a5568;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Account</h1>
      <p>Use the code below to continue</p>
    </div>

    <div class="content">
      <p>
        To protect your account, please enter the following
        <span class="highlight">one-time verification code</span> in the app:
      </p>

      <div class="otp-label">Your 6-digit code</div>

      <div class="otp-box" aria-label="Verification code: ${otpCode}">
        ${otpCode
          .split("")
          .map((digit) => `<div class="otp-digit">${digit}</div>`)
          .join("")}
      </div>

      <div class="expiry">⏱️ This code expires in 60 seconds</div>

      <p>
        If the code expires, please request a new one from the application.
      </p>
    </div>

    <div class="footer">
      <p>Or continue directly on our website:</p>
      <a
        href="${url}"
        class="button"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Website
      </a>

      <div class="disclaimer">
        If you did not request this code, you can safely ignore this email.
        Never share your verification code with anyone.
      </div>
    </div>
  </div>
</body>
</html>`;

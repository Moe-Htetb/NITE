export const otpEmailTemplate = (
  otpCode: string,
  url: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9ff;
        margin: 0;
        padding: 0;
        color: #333;
      }

      .container {
        max-width: 600px;
        background: #ffffff;
        margin: 40px auto;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header {
        text-align: center;
        padding: 40px 20px 10px;
      }

      .header img {
        width: 120px;
      }

      .title {
        font-size: 24px;
        font-weight: 600;
        color: #111;
        margin-top: 20px;
      }

      .message {
        text-align: center;
        padding: 0 20px;
        font-size: 16px;
        color: #555;
      }

      .otp-box {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 30px 0;
      }

      .otp-digit {
        background-color: #f0f4ff;
        border: 2px solid #007bff;
        border-radius: 8px;
        font-size: 24px;
        font-weight: bold;
        color: #007bff;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .footer {
        text-align: center;
        padding: 20px 30px 40px;
        font-size: 14px;
        color: #777;
      }

      .footer a {
        display: inline-block;
        margin-top: 15px;
        text-decoration: none;
        color: white;
        background-color: #007bff;
        padding: 10px 20px;
        border-radius: 25px;
      }

      @media (max-width: 480px) {
        .otp-digit {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://iili.io/FBKrsee.png" alt="Logo" />
        <h2 class="title">Your One-Time Password (OTP)</h2>
      </div>

      <div class="message">
        <p>Please use the following 6-digit code to complete your verification. This code will expire in <strong>1 minute</strong>.</p>
      </div>

      <div class="otp-box">
        ${otpCode
          .split("")
          .map((digit) => `<div class="otp-digit">${digit}</div>`)
          .join("")}
      </div>

      <div class="footer">
        <p>If you didn't request this, you can safely ignore this email.</p>
        <a href="${url}" target="_blank">Go to Website</a>
      </div>
    </div>
  </body>
</html>`;

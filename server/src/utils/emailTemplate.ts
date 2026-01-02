export const otpEmailTemplate = (otpCode: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Verification Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: #007bff;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 10px;
      color: #007bff;
      margin: 20px 0;
      font-family: monospace;
    }
    .expiry {
      color: #dc3545;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      padding: 20px;
      background: #f8f9fa;
      border-top: 1px solid #eee;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #007bff;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 10px 0;
    }
    .disclaimer {
      font-size: 12px;
      color: #666;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Account</h1>
    </div>
    
    <div class="content">
      <p>Use this one-time verification code to continue:</p>
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">⏱️ Expires in 5 minutes</div>
      <p>If the code expires, request a new one from the app.</p>
    </div>
    
    <div class="footer">
      <p>Or continue directly on our website:</p>
      <a href="${url}" class="button">Open Website</a>
      <div class="disclaimer">
        If you didn't request this code, ignore this email.<br>
        Never share your verification code with anyone.
      </div>
    </div>
  </div>
</body>
</html>`;

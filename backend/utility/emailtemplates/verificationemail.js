const html = (userDetails) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - SFK Groups</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #218838; color: #ffffff;">
              <div style="font-size: 30px; font-weight: bold; margin-bottom: 7px; font-family: Arial, sans-serif;">SFK Groups</div>
              <div style="font-family: Arial, sans-serif; font-size: 16px; margin-bottom: 15px;">Thanks for signing up!</div>
              <div style="font-size: 20px; letter-spacing: 2px; margin-top: 15px; font-family: Arial, sans-serif;">Please Verify Your Email Address</div>
              <div style="margin-top: 15px; font-size: 30px;">📧</div> <!-- Use emoji instead of Font Awesome -->
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <h2 style="margin: 0 0 15px; font-size: 24px; color: #333333; font-family: Arial, sans-serif;">Hello, ${userDetails.firstName}</h2>
              <p style="margin: 15px 0; font-size: 16px; color: #555555; line-height: 1.5;">
                Thank you for signing up with SFK Groups! To complete your registration, please verify your email address by clicking the button below:
              </p>

              <!-- Button as table for email compatibility -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 20px auto;">
                <tr>
                  <td align="center" bgcolor="#bbc0c8" style="border-radius: 6px;">
                    <a href="${userDetails.verifyLink}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: Arial, sans-serif;">Verify Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 15px 0; font-size: 14px; color: #555555;">
                <strong>Verify Now:</strong> If the button above doesn’t work, copy and paste the following link into your browser:
              </p>
              <p style="margin: 10px 0; font-size: 14px; color: #218838; word-break: break-all;">
                <a href="${userDetails.verifyLink}" target="_blank" style="color: #218838; text-decoration: underline;">${userDetails.verifyLink}</a>
              </p>

              <p style="margin: 15px 0; font-size: 14px; color: #777777;">
                This link will expire in 24 hours, so please verify your email soon.
              </p>
              <p style="margin: 15px 0; font-size: 14px; color: #777777;">
                If you did not create an account using this email address, please ignore this message.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; color: #6c757d; font-size: 14px; font-family: Arial, sans-serif;">
              <p style="margin: 0;">Thank you,<br><strong>The SFK Groups Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export { html };
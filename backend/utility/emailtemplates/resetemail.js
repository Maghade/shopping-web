import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (user, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.KEY,
    },
  });

  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Hello ${user.name || "User"},</h3>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <br /><br />
      <p>If you did not request this, please ignore this email.</p>
      <p>– The Support Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

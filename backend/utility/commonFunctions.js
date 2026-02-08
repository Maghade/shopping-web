



import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { html as htmlTemplate } from "../utility/emailtemplates/verificationemail.js"; // Import your HTML template

export async function sendEmail(user, html = htmlTemplate, subject = "Verify your email") {
  try {
    // Real Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.KEY,   
      },
    });

    const emailOptions = {
      from: `"Verification Team" <${process.env.EMAIL}>`,
      to: user.email,
      subject,
      html: typeof html === "function" ? html(user) : html, // Use HTML template
    };

    const info = await transporter.sendMail(emailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
}

























export function generateJWT(user) {
  return jwt.sign(user, process.env.JWT_SECRET);
}

export function generateUnique10DigitNumber() {
  const timestamp = Date.now().toString();
  const randomPart = Math.floor(Math.random() * 1000);
  const uniqueNumber = timestamp.slice(-7) + randomPart;
  return uniqueNumber.slice(0, 10);
}

export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

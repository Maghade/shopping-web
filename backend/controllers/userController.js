

import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import { sendEmail, generateJWT } from '../utility/commonFunctions.js'
import { html } from '../utility/emailtemplates/verificationemail.js'
import { sendResetPasswordEmail } from "../utility/emailtemplates/resetemail.js";
import RequestModel from "../models/requestModel.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });



const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (not verified yet)
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    // Generate verification token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    // Send verification email
    await sendEmail({ email, firstName: name, verifyLink }, html, "Verify your email - SFK Groups");

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for verification.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------- Login User ---------------------
const loginUser = async (req, res) => {
  try {
    const { email, password, cartItems } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // 🚫 Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Optional: Sync cart if needed
    if (cartItems && Object.keys(cartItems).length > 0) {
      user.cart = { ...user.cart, ...cartItems };
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// --------------------- Admin Login ---------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Admin email from .env
    const adminEmail = process.env.ADMIN_EMAIL
    const hashedPassword = process.env.ADMIN_PASSWORD // Should be a hashed password

    if (email === adminEmail) {
      const passwordMatch = await bcrypt.compare(password, hashedPassword)

      if (passwordMatch) {
        const token = jwt.sign(email + hashedPassword, process.env.JWT_SECRET)
        return res.json({ success: true, token })
      }
    }

    res.json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// --------------------- Generate Hash (for admin password) ---------------------

const generateHash = async () => {
  const password = "Xp!T7^Q@9W#ZL2&YB$m3V64d%C";
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, await bcrypt.genSalt(saltRounds));
};
// --------------------- Verify Email ---------------------
generateHash();
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(400).json({ success: false, message: "Invalid link" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    user.isVerified = true;
    await user.save();

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Invalid or expired link" });
  }
};


// --------------------- Forgot Password ---------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await sendResetPasswordEmail(user, token);

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    res.status(500).json({ success: false, message: "Failed to send password reset link" });
  }
};

// --------------------- Reset Password ---------------------
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Verify token and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
};
// --------------------- Request Functions ---------------------


 const createRequest = async (req, res) => {
  try {
    const { userId, productId, message, size } = req.body;

    const request = await RequestModel.create({
      userId,
      productId,
      message,
      size, // 👈 SAVE SIZE
      images: req.files?.map(f => f.path) || [],
      email: req.body.email || "",
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

 const userList = async (req, res) => {
  try {
    const users = await userModel.find() 
      .sort({ createdAt: -1 });
    // ✅ Format the response to include only required details
    return res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, generateHash, verifyEmail, forgotPassword, resetPassword, createRequest, userList };



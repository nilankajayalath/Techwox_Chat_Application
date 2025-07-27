// backend/routes/friends.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Friend = require("../models/Friend"); // ✅ Your Friend model

// ✅ Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ✅ POST /api/friends/invite — Send Invite + Save as "pending"
router.post("/invite", authenticateToken, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const friend = await User.findOne({ email });
    if (!friend) return res.status(404).json({ message: "Friend user not found" });

    const existing = await Friend.findOne({
      user: user._id,
      friend: friend._id,
    });
    if (existing) return res.status(400).json({ message: "Already invited or friends" });

    const newFriend = new Friend({
      user: user._id,
      friend: friend._id,
      status: "pending",
    });
    await newFriend.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Chatme - ${user.username}" <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: user.email,
      subject: `${user.username} invited you to Chatme!`,
      html: `
        <p>${user.username} (${user.email}) invited you to join Chatme 🚀</p>
        <p>Click the link below to register:</p>
        <a href="http://localhost:3000/register">Join Chatme</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: `Invite sent to ${email} and saved to DB` });
  } catch (error) {
    console.error("Invite error:", error);
    return res.status(500).json({ message: "Failed to send invite" });
  }
});

// ✅ PUT /api/friends/accept — Accept Invitation
router.put("/accept", authenticateToken, async (req, res) => {
  const { fromUserId } = req.body;

  if (!fromUserId) {
    return res.status(400).json({ message: "fromUserId is required" });
  }

  try {
    const currentUserId = req.user.userId;

    const friendRequest = await Friend.findOneAndUpdate(
      { user: fromUserId, friend: currentUserId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Create reciprocal record if it doesn’t already exist
    const alreadyExists = await Friend.findOne({
      user: currentUserId,
      friend: fromUserId,
    });

    if (!alreadyExists) {
      await new Friend({
        user: currentUserId,
        friend: fromUserId,
        status: "accepted",
      }).save();
    }

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Accept friend error:", err);
    return res.status(500).json({ message: "Failed to accept friend request" });
  }
});

module.exports = router;

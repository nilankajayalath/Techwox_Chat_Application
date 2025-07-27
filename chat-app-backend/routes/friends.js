const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Friend = require("../models/Friend");

// Middleware to authenticate JWT token
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

// 📩 SEND FRIEND INVITE & SAVE TO DB
router.post("/invite", authenticateToken, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const sender = await User.findById(req.user.userId);
    const receiver = await User.findOne({ email });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User or receiver not found" });
    }

    // Prevent self-invite
    if (sender._id.equals(receiver._id)) {
      return res.status(400).json({ message: "You cannot invite yourself." });
    }

    // Prevent duplicate or already accepted invites
    const existing = await Friend.findOne({
      user: sender._id,
      friend: receiver._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already invited or friends" });
    }

    // Save the pending friend request to MongoDB
    const friendInvite = new Friend({
      user: sender._id,
      friend: receiver._id,
      status: "pending",
    });

    await friendInvite.save();

    // OPTIONAL: Send invitation email
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
      from: `"Chatme - ${sender.username}" <${process.env.SMTP_USER}>`,
      to: receiver.email,
      subject: `${sender.username} invited you to Chatme!`,
      html: `
        <h3>You've got a new friend invite on Chatme!</h3>
        <p><strong>Sender:</strong> ${sender.username} (${sender.email})</p>
        ${
          sender.fullName
            ? `<p><strong>Full Name:</strong> ${sender.fullName}</p>`
            : ""
        }
        <p>Click below to register and connect:</p>
        <a href="http://localhost:3000/register">Join Chatme</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Invite sent and saved to DB",
      sender: {
        id: sender._id,
        username: sender.username,
        email: sender.email,
        fullName: sender.fullName || null,
      },
    });
  } catch (error) {
    console.error("Error sending invite:", error);
    return res.status(500).json({ message: "Failed to send invite" });
  }
});

// ✅ ACCEPT FRIEND INVITE
router.put("/accept", authenticateToken, async (req, res) => {
  const { fromUserId } = req.body;
  if (!fromUserId) {
    return res.status(400).json({ message: "fromUserId is required" });
  }

  try {
    const currentUserId = req.user.userId;

    // Update invite to accepted
    const updated = await Friend.findOneAndUpdate(
      { user: fromUserId, friend: currentUserId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "No pending invite found" });
    }

    // Add reciprocal friendship if not already
    const reciprocal = await Friend.findOne({
      user: currentUserId,
      friend: fromUserId,
    });

    if (!reciprocal) {
      await new Friend({
        user: currentUserId,
        friend: fromUserId,
        status: "accepted",
      }).save();
    }

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting invite:", err);
    return res.status(500).json({ message: "Failed to accept invite" });
  }
});

// ✅ GET ACCEPTED FRIENDS LIST
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const friends = await Friend.find({ user: userId, status: "accepted" })
      .populate("friend", "username email profileImage");

    return res.status(200).json({ friends });
  } catch (err) {
    console.error("Error fetching friends:", err);
    return res.status(500).json({ message: "Failed to fetch friends" });
  }
});

module.exports = router;

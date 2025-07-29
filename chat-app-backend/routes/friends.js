const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Friend = require('../models/Friend');

// ✅ Gmail SMTP configuration from environment variables
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER, // Your chat app Gmail (e.g., chatme.app@gmail.com)
    pass: process.env.SMTP_PASS, // App Password from Google
  },
});

// ✅ Middleware to verify JWT token (optional if protected route)
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

// ✅ Invite via email
router.post('/invite-email', async (req, res) => {
  const { toEmail, senderName, senderEmail } = req.body;

  if (!toEmail || !senderName || !senderEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: `"Chatme" <${process.env.SMTP_USER}>`, // From app email
      to: toEmail,
      subject: `${senderName} invited you to Chatme! 🎉`,
      text: `Hi there,

Your friend ${senderName} (${senderEmail}) has invited you to join Chatme — a fast and fun way to chat with friends.

Click below to join:
https://yourchatmewebsite.com

See you soon!
– The Chatme Team`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Invitation email sent successfully' });
  } catch (error) {
    console.error('Error sending invite email:', error);
    res.status(500).json({ message: 'Failed to send invitation email' });
  }
});

// ✅ Invite registered users to chat (optional: WebSocket or database invite)
router.post('/invite', authenticateToken, async (req, res) => {
  const { email, senderEmail, senderName } = req.body;

  if (!email || !senderEmail || !senderName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const recipient = await User.findOne({ email });
    const sender = await User.findOne({ email: senderEmail });

    if (!recipient || !sender) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally: Store invite or notify with Socket.IO elsewhere
    return res.json({ message: 'Chat invite logic handled (via socket or DB)' });
  } catch (err) {
    console.error('Chat invite error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Accept friend invite (triggered on client accept)
router.put('/accept', authenticateToken, async (req, res) => {
  const { fromUserId } = req.body;
  const toUserId = req.user.id;

  try {
    // Avoid duplicates
    const alreadyFriends = await Friend.findOne({
      $or: [
        { user1: fromUserId, user2: toUserId },
        { user1: toUserId, user2: fromUserId },
      ],
    });

    if (alreadyFriends) {
      return res.status(400).json({ message: 'Already friends' });
    }

    const newFriend = new Friend({ user1: fromUserId, user2: toUserId });
    await newFriend.save();

    res.json({ message: 'Friend added' });
  } catch (err) {
    console.error('Accept invite error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all friends of a user
router.get('/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const friendships = await Friend.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate(['user1', 'user2']);

    const friends = friendships.map((friendship) =>
      friendship.user1._id.toString() === userId
        ? friendship.user2
        : friendship.user1
    );

    res.json({ friends });
  } catch (err) {
    console.error('Fetch friends error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

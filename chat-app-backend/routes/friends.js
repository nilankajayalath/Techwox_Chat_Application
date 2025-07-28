// In your backend express route file e.g. routes/friends.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Make sure you have environment variables for SMTP credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or other SMTP provider
  auth: {
    user: process.env.SMTP_USER, // your email account
    pass: process.env.SMTP_PASS, // your email password or app password
  },
});

router.post('/invite-email', async (req, res) => {
  const { toEmail, senderName, senderEmail } = req.body;

  if (!toEmail || !senderName || !senderEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: senderEmail, // Or a fixed verified sender email if your SMTP provider requires it
      to: toEmail,
      subject: `${senderName} invites you to join Chatme!`,
      text: `Hi!

Your friend ${senderName} (${senderEmail}) invites you to join Chatme — the awesome chat app.

Click here to join: https://yourchatmewebsite.com

Looking forward to chatting with you!`,
      // You can also add html content if you want
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Invitation email sent successfully' });
  } catch (error) {
    console.error('Error sending invite email:', error);
    res.status(500).json({ message: 'Failed to send invitation email' });
  }
});

module.exports = router;

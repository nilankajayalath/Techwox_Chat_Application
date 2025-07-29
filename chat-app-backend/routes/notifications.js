const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: req.user.id }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.sendStatus(200);
  } catch {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['invite'], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

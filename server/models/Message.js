const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  // === YEH NAYA FIELD HAI ===
  isRead: {
    type: Boolean,
    default: false, // Jab bhi naya message banega, woh by default 'unread' (false) hoga
  },
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
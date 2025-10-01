const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // participants array me dono users (seller aur buyer) ki ID hogi
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // messages array me saare messages ki ID hongi
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: [],
  }],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
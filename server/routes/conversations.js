const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message'); // Message model ko import karo

// @route   GET api/conversations
// @desc    Get all conversations for a user with unread count
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Step 1: User ki saari conversations dhoondo
    let conversations = await Conversation.find({
      participants: req.user.id,
    })
    .sort({ updatedAt: -1 }) // Sabse nayi chat sabse upar
    .populate({
      path: 'participants',
      select: 'name',
    })
    .populate({
      path: 'messages',
      options: {
        sort: { createdAt: -1 },
        limit: 1
      }
    })
    .lean(); // .lean() Mongoose documents ko plain JavaScript objects me convert karta hai

    // Step 2: Har conversation ke liye unread count calculate karo
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (convo) => {
        // Doosre user ko dhoondo
        const otherParticipant = convo.participants.find(p => p._id.toString() !== req.user.id);
        
        if (!otherParticipant) {
            return { ...convo, unreadCount: 0 };
        }

        // Unread messages count karo
        const unreadCount = await Message.countDocuments({
          senderId: otherParticipant._id,
          receiverId: req.user.id,
          isRead: false
        });
        
        // Conversation object ke saath unreadCount ko jod do
        return { ...convo, unreadCount };
      })
    );

    res.json(conversationsWithUnreadCount);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
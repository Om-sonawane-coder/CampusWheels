// ====== IMPORTS ======
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
const auth = require('./middleware/auth');

// Models
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// ====== APP INITIALIZATION ======
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"]
  }
});

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== DATABASE CONNECTION ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// ====== API ROUTES ======
app.get('/', (req, res) => res.send('CampusWheels Server is running!'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/conversations', require('./routes/conversations'));

// === API ROUTES FOR MESSAGES ===
// Get total unread message count
app.get('/api/messages/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiverId: req.user.id, isRead: false });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error.message);
    res.status(500).send('Server Error');
  }
});

// Mark messages as read from a specific sender
app.put('/api/messages/read/:senderId', auth, async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { senderId } = req.params;

    const conversation = await Conversation.findOne({ 
        participants: { $all: [senderId, receiverId] }
    });
    if (!conversation) {
        return res.status(404).json({ msg: 'Conversation not found' });
    }

    await Message.updateMany(
      { senderId: senderId, receiverId: receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    
    // NAYI LINE: Bhejne waale ko batao ki message padh liya gaya hai
    io.to(senderId).emit('messages_read', { conversationPartnerId: receiverId });

    res.json({ msg: 'Messages marked as read' });
  } catch (error) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).send('Server Error');
  }
});

// ====== SOCKET.IO CONNECTION LOGIC ======
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if(userId) {
    socket.join(userId);
    console.log(`User Connected: ${socket.id} and joined room: ${userId}`);
  } else {
    console.log(`User Connected: ${socket.id} (no userId provided)`);
  }
  
  socket.on('get_chat_history', async ({ senderId, receiverId }) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      }).populate('messages');
      
      if(conversation){
        socket.emit('chat_history', conversation.messages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      
      const newMessage = new Message({ senderId, receiverId, message });
      
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });
      if(!conversation){
        conversation = await Conversation.create({ participants: [senderId, receiverId] });
      }

      conversation.messages.push(newMessage._id);
      
      await Promise.all([conversation.save(), newMessage.save()]);

      io.to(receiverId).emit('receive_message', newMessage);
      io.to(senderId).emit('receive_message', newMessage);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// ====== SERVER LISTENER ======
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
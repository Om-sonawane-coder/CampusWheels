// server/index.js

// ====== IMPORTS ======
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// ====== APP INITIALIZATION ======
const app = express();
const PORT = process.env.PORT || 3000; // Tumhara port 3000

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== DATABASE CONNECTION ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// ====== API ROUTES ======

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('CampusWheels Server is running!');
});

// --- Auth Routes ---
app.use('/api/auth', require('./routes/auth'));

// --- Vehicle Routes ---
app.use('/api/vehicles', require('./routes/vehicles')); // <-- Yahan par naye routes use ho rahe hain

// ====== SERVER LISTENER ======
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
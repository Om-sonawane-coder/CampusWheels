// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check karo ki user pehle se exist karta hai ya nahi
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Naya user object banao
    user = new User({
      name,
      email,
      password,
    });

    // 3. Password ko hash karo
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. User ko database me save karo
    await user.save();

    res.status(201).json({ msg: 'User registered successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// server/routes/auth.js (Add this code)

const jwt = require('jsonwebtoken');

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check karo ki user exist karta hai ya nahi
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Password ko compare karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' }); // Dono error me same message taaki attacker ko hint na mile
    }

    // 3. Agar sab sahi hai, toh JWT Token banao
    const payload = {
      user: {
        id: user.id, // Hum token me user ki ID save kar rahe hain
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token 1 ghante me expire ho jaayega
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Token ko response me bhej do
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
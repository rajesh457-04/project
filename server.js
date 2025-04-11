require('dotenv').config();
const express = require('express');
const User = require('./model');
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const Registeruser = require('./model');
const Guide = require('./work/Guide');
const authMiddleware = require('./middleware');
const touristRoutes = require('./work/Touristroute');
const guideRoutes = require('./work/Guideroute');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connection established'))
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/register', async (req, res) => {
  try {
    let { username, email, password, confirmpassword } = req.body;

    username = username.trim();
    email = email.toLowerCase().trim();
    password = password.trim();
    confirmpassword = confirmpassword.trim();

    if (!username || !email || !password || !confirmpassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const newUser = new Registeruser({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await Registeruser.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.'
    });
  }
});

function generateDefaultAvatar(username) {
  const colors = ['FF6633', 'FFB399', 'FF33FF', 'FFFF99', '00B3E6'];
  const char = username.charAt(0).toUpperCase();
  const color = colors[char.charCodeAt(0) % colors.length];
  return `https://ui-avatars.com/api/?name=${char}&background=${color}&color=fff&size=128`;
}

app.use('/api/tourist', touristRoutes);
app.use('/api/guide', guideRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

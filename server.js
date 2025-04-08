// Load environment variables
require('dotenv').config();

const express = require('express');
const User = require('./model');
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const Registeruser = require('./model'); // User model
const Guide = require('./work/Guide'); // Guide model
const middleware = require('./middleware'); // Authentication middleware
const touristRoutes = require('./work/Touristroute'); // Tourist routes
const guideRoutes = require('./work/Guideroute'); // Guide routes

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connection established'))
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1); // Exit the app if the database connection fails
  });

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: '*' })); // Enable CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Generate unique filename
  },
});

const upload = multer({ storage });



// Enhanced Registration Route
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

    // No need to hash manually — the pre-save hook handles it
    const newUser = new Registeruser({
      username,
      email,
      password, // raw password here
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


// Enhanced Login Route
app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Trim and normalize inputs
    email = email.toLowerCase().trim();
    password = password.trim();

    console.log('Login attempt:', {
      email,
      passwordLength: password.length
    });

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with password field
    const user = await Registeruser.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', user.email);
    console.log('Stored hash:', user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      // Additional debug: test with newly generated hash
      const testHash = await bcrypt.hash(password, 10);
      console.log('Test hash comparison:', {
        inputPassword: password,
        testHash,
        storedHash: user.password,
        matchesStored: testHash === user.password,
        matchesTest: await bcrypt.compare(password, testHash)
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', email);
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


app.get('/api/user/profile', middleware, async (req, res) => {
  try {
    const user = await Registeruser.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json(user);  // Send the user data with profile picture URL
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile.', error: err.message });
  }
});

// Update User Profile
app.put('/api/user/profile', middleware, upload.single('profilePicture'), async (req, res) => {
  try {
      const { username, email, bio, location } = req.body;
      const updateData = { username, email, bio, location };

      // Update the profile picture if a new file is uploaded
      if (req.file) {
          updateData.profilePicture = `http://localhost:5000/uploads/${req.file.filename}`; // Store image URL in database
      }

      const user = await Registeruser.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found.' });

      res.json(user); // Send back the updated user data
  } catch (err) {
      res.status(500).json({ message: 'Error updating profile.', error: err.message });
  }
});
// Use Tourist and Guide Routes
app.use('/api/tourist', touristRoutes);
app.use('/api/guide', guideRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
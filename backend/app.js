const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
// const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
require('dotenv').config();

// const jwt = require('jsonwebtoken');
// const secretKey = require('SECRET_KEY');

app.use(express.static('public'));
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Define a user schema
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);

// Registration route
app.post('/sinup', async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ fullname, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    // Authentication successful
    res.status(200).json({ message: 'Login successful', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

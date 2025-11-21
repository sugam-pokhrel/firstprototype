const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const createTestUser = async () => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Email: test@example.com');
      console.log('Password: test123');
      process.exit(0);
    }

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      password: 'test123',
    });

    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('User ID:', user._id);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();


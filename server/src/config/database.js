const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support both MONGODB_URI and DATABASE_URL environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found. Please set MONGODB_URI or DATABASE_URL in .env file');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


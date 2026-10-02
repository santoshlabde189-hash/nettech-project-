const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for Windows router compatibility
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

/**
 * Connect to MongoDB using MONGO_URI from environment variables.
 * Note: Never hardcode, log, or commit the connection string.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('Error: MONGO_URI is not defined in environment variables.');
    console.error('Please create a .env file with your MongoDB connection string (MONGO_URI).');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please check your MONGO_URI in .env and ensure your IP address is whitelisted in MongoDB Atlas if using Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;

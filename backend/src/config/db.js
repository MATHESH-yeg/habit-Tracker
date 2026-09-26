const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If already connected, reuse existing connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not call process.exit(1) in serverless environments as it kills the function runtime
    throw error;
  }
};

module.exports = connectDB;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Allowed origins for CORS (local, configured client, or vercel preview/production)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins or any vercel.app deployment
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to allow connection
  },
  credentials: true,
}));

app.use(express.json());

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Root & Health Check Routes
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Habit Tracker API is running on Vercel' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AI Habit Tracker API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Only listen locally or when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
}

module.exports = app;

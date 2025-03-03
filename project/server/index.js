import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import MLService from './ml-integration.js';

// Routes
import authRoutes from './routes/auth.js';
import locationsRoutes from './routes/locations.js';
import userProfileRoutes from './routes/userProfile.js';
import reviewsRoutes from './routes/reviews.js';
import mlRoutes from './routes/ml.js';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = pg;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'thrive'
});

// Middleware
app.use(cors());
app.use(express.json());

// Make the pool available to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/ml', mlRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Initialize ML environment
MLService.initialize()
  .then(success => {
    if (success) {
      console.log('ML environment initialized successfully');
    } else {
      console.warn('ML environment initialization failed');
    }
  })
  .catch(err => {
    console.error('Error initializing ML environment:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
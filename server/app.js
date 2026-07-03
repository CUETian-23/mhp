const express = require('express');
const cors = require('./config/cors');
const helmet = require('helmet');
const connectDatabase = require('./config/database');
const config = require('./config/environment');
const { generalLimiter } = require('./middleware/rateLimiter');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors);

// Rate limiting
app.use(generalLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/webauthn', require('./routes/webauthnRoutes'));
app.use('/api/mental-health', require('./routes/mentalHealthRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/ai', require('./routes/aiRoutes'));
// app.use('/api/crisis', require('./routes/crisisRoutes'));
// app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 handler
app.all('*', notFound);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;

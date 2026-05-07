const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./errorHandler');
const { PORT }     = require('./env');
const connectDB    = require('./db');

const app = express();

// Connect to MongoDB for serverless environments (like Vercel)
// Mongoose will buffer queries until the connection is established.
connectDB();

// ── CORS ───────────────────────────────────────────────────────────────────
// Allow the frontend (any origin in dev, lock down in prod)
app.use(cors({
  origin: '*', // For production, you should replace '*' with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logger (lightweight — no morgan dependency) ───────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms) [srv:${PORT}]`);
  });
  next();
});

// ── Health check ───────────────────────────────────────────────────────────
// Nginx uses this to detect if a server is alive.
// JMeter hits this first to warm up.
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    server:    `server-${PORT}`,
    timestamp: new Date().toISOString(),
    uptime:    Math.floor(process.uptime()) + 's',
  });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./auth'));
app.use('/api/quizzes', require('./quiz'));
app.use('/api',         require('./result')); // /api/quiz/submit + /api/results

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ──────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;

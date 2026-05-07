/**
 * server.js — Stateless entry point
 *
 * DS Concept: This file reads PORT from the environment variable.
 * Run three times on different ports → three independent, stateless instances:
 *
 *   PORT=3001 node server.js   (terminal 1)
 *   PORT=3002 node server.js   (terminal 2)
 *   PORT=3003 node server.js   (terminal 3)
 *
 * All three connect to the SAME MongoDB replica set.
 * All three share the SAME JWT_SECRET → any server can verify any token.
 * No shared in-memory state. This is horizontal scaling.
 */

const app       = require('./app');
const connectDB = require('./db');
const { PORT }  = require('./env');

const start = async () => {
  try {
    console.log('[Server] Starting node in ' + (process.env.NODE_ENV || 'development') + ' mode...');
    
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║  QuizOS Server  →  Listening on Port ${PORT}  ║
╚══════════════════════════════════════════╝
      `);
    });

    // 3. Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n[${PORT}] Received ${signal}. Shutting down gracefully…`);
      server.close(() => {
        console.log(`[${PORT}] HTTP server closed.`);
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

  } catch (err) {
    console.error('[FATAL ERROR] Server failed to start:', err);
    process.exit(1);
  }
};

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
  process.exit(1);
});

start();

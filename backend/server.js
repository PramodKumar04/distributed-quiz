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
  // 1. Connect to MongoDB (replica set or standalone)
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║  QuizOS Server  →  http://localhost:${PORT}  ║
╚══════════════════════════════════════════╝
    `);
  });

  // 3. Graceful shutdown — let in-flight requests finish before exiting
  //    Important when Nginx detects a server is down and removes it from rotation
  const shutdown = (signal) => {
    console.log(`\n[${PORT}] Received ${signal}. Shutting down gracefully…`);
    server.close(() => {
      console.log(`[${PORT}] HTTP server closed.`);
      process.exit(0);
    });
    // Force exit after 10s if server hasn't closed
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

start();

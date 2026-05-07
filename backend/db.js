const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');

const connectDB = async () => {
  try {
    const options = {
      // ── Replica set / connection pool ──────────────────────────────────
      // Each stateless server maintains its own connection pool.
      // With 3 app servers × 5 connections = 15 total connections to MongoDB.
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // ── Read preference ────────────────────────────────────────────────
      // 'primaryPreferred' → reads go to primary normally,
      // but fall back to a secondary if primary is unavailable.
      // This is how we get fault-tolerant reads from the replica set.
      readPreference: 'primaryPreferred',
    };

    const conn = await mongoose.connect(MONGO_URI, options);

    const { host, port, name } = conn.connection;
    console.log(`[DB] Connected → ${host}:${port}/${name}`);

    // Log replica set info when available
    if (conn.connection.db) {
      const adminDb = conn.connection.db.admin();
      try {
        const status = await adminDb.command({ replSetGetStatus: 1 });
        const members = status.members.map(m => `${m.name}(${m.stateStr})`).join(', ');
        console.log(`[DB] Replica set: ${status.set} → [${members}]`);
      } catch {
        // Not a replica set in dev — that's fine
        console.log('[DB] Running in standalone mode (no replica set)');
      }
    }
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1); // Let the process manager (PM2 / Docker) restart it
  }
};

// Graceful disconnect on app shutdown
mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('[DB] Reconnected to MongoDB');
});

module.exports = connectDB;

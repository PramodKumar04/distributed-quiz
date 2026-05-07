const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./env');

// ── Stateless authentication ───────────────────────────────────────────────
// No DB lookup. No session store. The JWT itself carries the user identity.
// Any of the 3 app servers can verify any token independently — this is the
// core property that makes horizontal scaling work.
//
// Token payload: { userId, username, role, iat, exp }

const protect = (req, res, next) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please login.',
    });
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify signature + expiry — purely cryptographic, zero DB cost
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, username, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ── Role guard (admin only routes) ────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

module.exports = { protect, adminOnly };

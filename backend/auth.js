const router = require('express').Router();
const { register, login, getMe } = require('./authController');
const { protect } = require('./authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET  /api/auth/me   (protected — needs valid JWT)
router.get('/me', protect, getMe);

module.exports = router;

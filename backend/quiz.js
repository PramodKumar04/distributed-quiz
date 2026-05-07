const router = require('express').Router();
const { listQuizzes, getQuiz, createQuiz } = require('./quizController');
const { protect, adminOnly } = require('./authMiddleware');

// GET  /api/quizzes          — list all active quizzes (protected)
router.get('/', protect, listQuizzes);

// GET  /api/quizzes/:id      — get one quiz without answers (protected)
router.get('/:id', protect, getQuiz);

// POST /api/quizzes          — create a quiz (admin only)
router.post('/', protect, adminOnly, createQuiz);

module.exports = router;

const router = require('express').Router();
const { submitQuiz, getMyResults, getResult } = require('./resultController');
const { protect } = require('./authMiddleware');

// POST /api/quiz/submit      — submit answers + calculate score
router.post('/submit', protect, submitQuiz);

// GET  /api/results/me       — all results for the logged-in user
router.get('/me', protect, getMyResults);

// GET  /api/results/:id      — single result detail
router.get('/:id', protect, getResult);

module.exports = router;

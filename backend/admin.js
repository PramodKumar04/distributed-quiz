const express = require('express');
const { getLiveStatus, updateQuizSettings, deleteUser } = require('./adminController');
const { protect, adminOnly } = require('./authMiddleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/status', getLiveStatus);
router.put('/quizzes/:id/settings', updateQuizSettings);
router.delete('/users/:id', deleteUser);

module.exports = router;

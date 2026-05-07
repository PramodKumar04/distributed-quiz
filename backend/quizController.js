const Quiz = require('./quizModel');
const User = require('./User');

// ── GET /api/quizzes ───────────────────────────────────────────────────────
// List all active quizzes (no questions, just metadata)
const listQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('title description timeLimit createdAt')
      .sort('-createdAt')
      .lean();

    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/quizzes/:id ───────────────────────────────────────────────────
// Return quiz WITH questions but WITHOUT correct answers
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // toSafeObject() strips correctIndex from every question
    const safeQuiz = quiz.toSafeObject();
    
    // Shuffle and pick N questions for this user's session
    const limit = quiz.numberOfQuestions || 10;
    const shuffled = safeQuiz.questions.sort(() => 0.5 - Math.random());
    safeQuiz.questions = shuffled.slice(0, limit);

    // Update user's live status
    await User.findByIdAndUpdate(req.user.userId, {
      liveStatus: 'in_progress',
      lastActiveAt: new Date()
    });

    res.json({ success: true, quiz: safeQuiz });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/quizzes (admin only) ────────────────────────────────────────
const createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

module.exports = { listQuizzes, getQuiz, createQuiz };

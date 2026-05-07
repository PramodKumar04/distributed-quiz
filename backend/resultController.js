const Quiz   = require('./quizModel');
const Result = require('./resultModel');
const { PORT } = require('./env');

// ── POST /api/quiz/submit ──────────────────────────────────────────────────
// Body: { quizId, answers: [{ questionId, selectedIndex }], timeTaken }
//
// Score calculation happens SERVER-SIDE — we fetch the quiz with correct
// answers from MongoDB and compare. The client never sees correctIndex.
const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'quizId and answers[] are required.' });
    }

    // 1. Fetch quiz WITH correct answers (internal use only)
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // 2. Build a lookup map: questionId → question
    const questionMap = {};
    quiz.questions.forEach(q => { questionMap[q._id.toString()] = q; });

    // Calculate expected number of questions
    const expectedLength = Math.min(5, quiz.questions.length);
    if (answers.length !== expectedLength) {
       return res.status(400).json({ success: false, message: `Expected ${expectedLength} answers, got ${answers.length}.` });
    }

    // 3. Score each submitted answer
    let score = 0;
    let totalMarks = 0;
    const scoredAnswers = answers.map(({ questionId, selectedIndex }) => {
      const question = questionMap[questionId];
      if (!question) return null;

      const isCorrect = (selectedIndex != null) && (selectedIndex === question.correctIndex);
      const marksAwarded = isCorrect ? question.marks : 0;
      score += marksAwarded;
      totalMarks += question.marks;

      return {
        questionId,
        selectedIndex: selectedIndex ?? null,
        isCorrect,
        marksAwarded,
      };
    }).filter(Boolean);

    if (scoredAnswers.length !== expectedLength) {
      return res.status(400).json({ success: false, message: 'Invalid question IDs submitted.' });
    }

    const percentage = Math.round((score / totalMarks) * 100);
    const passed     = percentage >= 50;

    // 4. Persist result to MongoDB (replicates to secondaries via oplog)
    const result = await Result.create({
      userId:     req.user.userId,
      quizId,
      answers:    scoredAnswers,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken:  timeTaken || 0,
      serverNode: `server-${PORT}`, // tracks which node handled the request — useful for DS demo
    });

    // 5. Send result — include per-question breakdown for instant display
    res.status(201).json({
      success: true,
      result: {
        id:         result._id,
        score,
        totalMarks,
        percentage,
        passed,
        timeTaken,
        serverNode: result.serverNode, // show students which server graded them
        answers:    scoredAnswers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/results/me ────────────────────────────────────────────────────
// All results for the logged-in user
const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ userId: req.user.userId })
      .populate('quizId', 'title')
      .sort('-createdAt')
      .lean();

    res.json({ success: true, count: results.length, results });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/results/:id ───────────────────────────────────────────────────
const getResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title questions')
      .lean();

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found.' });
    }

    // Only the owner can view their result
    if (result.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitQuiz, getMyResults, getResult };

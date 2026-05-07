const User = require('./User');
const Quiz = require('./quizModel');
const Result = require('./resultModel');

// ── GET /api/admin/status ──────────────────────────────────────────────────
// Fetch live status of all non-admin users
const getLiveStatus = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('username email liveStatus lastActiveAt')
      .sort('-createdAt')
      .lean();
      
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/admin/quizzes/:id/settings ────────────────────────────────────
// Update quiz settings (e.g. numberOfQuestions)
const updateQuizSettings = async (req, res, next) => {
  try {
    const { numberOfQuestions } = req.body;
    
    if (!numberOfQuestions || typeof numberOfQuestions !== 'number') {
      return res.status(400).json({ success: false, message: 'Valid numberOfQuestions is required.' });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { numberOfQuestions },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/admin/users/:id ────────────────────────────────────────────
// Remove a user and their quiz results
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Optional: Prevent deleting other admins or themselves?
    // For now, just allow deleting if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await User.findByIdAndDelete(userId);
    await Result.deleteMany({ userId: userId });

    res.json({ success: true, message: 'User removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLiveStatus, updateQuizSettings, deleteUser };

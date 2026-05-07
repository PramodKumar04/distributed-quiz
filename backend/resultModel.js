const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number },
  passed: { type: Boolean },
  timeTaken: { type: Number },
  serverNode: { type: String },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedIndex: { type: Number, default: null }, // Null if skipped
    isCorrect: { type: Boolean },
    marksAwarded: { type: Number }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);

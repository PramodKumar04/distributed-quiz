const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimit: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  numberOfQuestions: { type: Number, default: 10 },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

quizSchema.methods.toSafeObject = function() {
  const quizObj = this.toObject();
  if (quizObj.questions) {
    quizObj.questions.forEach(q => delete q.correctIndex);
  }
  return quizObj;
};

module.exports = mongoose.model('Quiz', quizSchema);

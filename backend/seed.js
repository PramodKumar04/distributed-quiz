/**
 * seed.js — Populate MongoDB with a sample quiz + admin user
 * Run once: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { MONGO_URI } = require('./env');

const User   = require('./User');
const Quiz   = require('./quizModel');
const Result = require('./resultModel');

const ALL_QUESTIONS = require('./questions_data');

const SAMPLE_QUIZ = {
  title:       'Distributed Systems & Cloud Computing — Comprehensive Exam',
  description: 'Covers: CAP theorem, microservices, Docker, Kubernetes, consistency models, and more.',
  timeLimit:   3600, // 60 minutes
  isActive:    true,
  questions:   ALL_QUESTIONS,
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[seed] Connected to MongoDB');

    // Wipe existing data
    await Promise.all([User.deleteMany(), Quiz.deleteMany(), Result.deleteMany()]);
    console.log('[seed] Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username:     'admin',
      email:        'admin@quizos.dev',
      passwordHash: 'admin1234',  // hashed by pre-save hook
      role:         'admin',
    });
    console.log('[seed] Admin user → admin@quizos.dev / admin1234');

    // Create student user
    await User.create({
      username:     'student1',
      email:        'student@quizos.dev',
      passwordHash: 'student1234',
      role:         'student',
    });
    console.log('[seed] Student user → student@quizos.dev / student1234');

    // Create quiz
    const quiz = await Quiz.create({ ...SAMPLE_QUIZ, createdBy: admin._id });
    console.log(`[seed] Quiz created with ${quiz.questions.length} questions → ID: ${quiz._id}`);
    console.log('\n[seed] ✓ Done! Database populated with 60+ questions.\n');

    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err.message);
    process.exit(1);
  }
};

seed();


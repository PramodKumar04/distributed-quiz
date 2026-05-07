require('dotenv').config();

module.exports = {
  PORT:           process.env.PORT || 3001,
  MONGO_URI:      process.env.MONGO_URI || 'mongodb://localhost:27017/quizdb',
  JWT_SECRET:     process.env.JWT_SECRET || 'fallback_secret_change_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV:       process.env.NODE_ENV || 'development',
};

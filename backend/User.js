const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true,
      trim: true, minlength: 3, maxlength: 30,
    },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String, required: true,
    },
    role: {
      type: String, enum: ['student', 'admin'], default: 'student',
    },
    liveStatus: {
      type: String, enum: ['idle', 'in_progress', 'completed'], default: 'idle',
    },
    lastActiveAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 4);
  next();
});

// ── Instance method: compare password ─────────────────────────────────────
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// ── Never send passwordHash in JSON responses ──────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

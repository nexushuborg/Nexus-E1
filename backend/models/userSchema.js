import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  githubId: {
    type: String,
    unique: true,
    required: true,
  },
  githubRepo: {
    type: String
  },
  apiKey: {
    type: String
  },
  leetcodeUsername: String,
  gfgUsername: String,
  hackerrankUsername: String,
  currentStreak: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Indexes for better query performance
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ githubId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;
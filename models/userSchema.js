import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  githubToken: String,

  leetcodeUsername: String,
  gfgUsername: String,
  hackerrankUsername: String,

  submissions: [submissionSchema]
});

module.exports = mongoose.model('User', userSchema);
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  platform: String,
  difficulty: String,
  language: String,
  timestamp: Date,
  githubPath: String,
  synced: Boolean,
  code: String,
  problemUrl: String
});

module.exports = mongoose.model('Submission', submissionSchema);

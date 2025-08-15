import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  activityType: {
    type: String,
    enum: ['problem_solved', 'code_uploaded', 'streak_updated', 'ai_analysis'],
    required: true
  },
  problemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Problem'
  },
  submissionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Submission'
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  streakCount: {
    type: Number,
    default: 0
  },
  filters: {
    platform: [String],
    difficulty: [String],
    topic: [String],
    dateRange: {
      start: Date,
      end: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ activityType: 1 });
activitySchema.index({ userId: 1, activityType: 1 });

export default mongoose.model('Activity', activitySchema);
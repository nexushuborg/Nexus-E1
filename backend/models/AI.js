import mongoose from 'mongoose';

const aiSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  problemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Problem', 
    required: true 
  },
  aiResponse: { 
    type: String, 
    required: true 
  },
  analysisType: {
    type: String,
    enum: ['visualization', 'explanation', 'optimization', 'similar_problems'],
    default: 'explanation'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

// Indexes for better query performance
aiSchema.index({ userId: 1, problemId: 1 });
aiSchema.index({ problemId: 1 });

export default mongoose.model('AI', aiSchema);
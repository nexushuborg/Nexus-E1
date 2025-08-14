import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  platform: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  language: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  githubPath: String,
  synced: { type: Boolean, default: false },
  code: { type: String, required: true },
  problemUrl: String,
  tags: [String],
  notes: String,

  // AI-related fields (extensible for hybrid system)
  aiAnalysis: String,
  aiAnalysisDate: Date,
  aiVisualization: mongoose.Schema.Types.Mixed,
  aiStudyNotes: String,
  aiSimilarProblems: mongoose.Schema.Types.Mixed,
  
  // Future: for hybrid AI system
  aiProvider: { type: String, enum: ['gemini', 'ollama', 'anthropic'], default: 'gemini' },
  aiModel: String,
  
  // Additional metadata
  timeComplexity: String,
  spaceComplexity: String,
  approach: String
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ userId: 1, timestamp: -1 });
submissionSchema.index({ platform: 1, difficulty: 1 });
submissionSchema.index({ tags: 1 });

export default mongoose.model('Submission', submissionSchema);

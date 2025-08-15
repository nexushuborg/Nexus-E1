import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
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

  // Enhanced metadata for better code tracking
  codeVersion: { type: Number, default: 1 },
  isOptimized: { type: Boolean, default: false },
  executionTime: String,
  memoryUsage: String,
  testCasesPassed: Number,
  totalTestCases: Number,

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
  approach: String,
  
  // Related metadata as mentioned in requirements
  relatedSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  parentSubmission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }
}, {
  timestamps: true
});

// Enhanced indexes for better query performance
submissionSchema.index({ userId: 1, timestamp: -1 });
submissionSchema.index({ platform: 1, difficulty: 1 });
submissionSchema.index({ tags: 1 });
submissionSchema.index({ problemId: 1 });
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ language: 1 });

export default mongoose.model('Submission', submissionSchema);

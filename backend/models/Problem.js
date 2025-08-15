import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  problemId: { 
    type: String, 
    required: true,
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  example: { 
    type: String 
  },
  platform: { 
    type: String, 
    enum: ['leetcode', 'hackerrank', 'gfg'], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'easy', 'medium', 'hard'], 
    required: true 
  },
  topic: { 
    type: String, 
    enum: ['Dynamic Prog', 'Trees', 'Graph', 'Array', 'String', 'LinkedList', 'Stack', 'Queue', 'Heap', 'Hash', 'Math', 'Greedy', 'Backtracking', 'DFS', 'BFS'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'progress', 'completed'], 
    default: 'pending' 
  },
  tag: [{ 
    type: String 
  }],
  date: { 
    type: Date, 
    default: Date.now 
  },
  code: { 
    type: String 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
problemSchema.index({ userId: 1, status: 1 });
problemSchema.index({ platform: 1, difficulty: 1 });
problemSchema.index({ topic: 1 });
problemSchema.index({ problemId: 1 }, { unique: true });

export default mongoose.model('Problem', problemSchema);
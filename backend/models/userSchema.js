import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // GitHub profile information
  githubId: { 
    type: String, 
    required: true,
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: false,
    trim: true,
    unique: true,
    sparse: true 
  },
  
  // User profile information
  avatar: { 
    type: String, 
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  
  // User engagement and stats
  streakCount: { 
    type: Number, 
    default: 0 
  },
  lastProblemSolvedDate: {
    type: Date
  },
  
  // User settings and preferences
  preferredLanguage: {
    type: String,
    default: 'javascript'
  },
  
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ githubId: 1 });

export default mongoose.model('User', userSchema);
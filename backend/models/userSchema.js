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
  githubId: {
    type: String,
    unique: true,
    required: true,
  },
  leetcodeUsername: String,
  gfgUsername: String,
  hackerrankUsername: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
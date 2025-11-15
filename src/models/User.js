import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true, index: true, required: true },
  email: { type: String, unique: true, index: true, required: true, lowercase: true, trim: true },
  name:  { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  photoFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },

  // NEW: role field
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  postAppliedFor: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export const User = mongoose.model('User', UserSchema);

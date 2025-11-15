import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  tokenId: { type: String, unique: true, index: true, required: true },
  secretHash: { type: String, required: true },
  userAgent: { type: String },
  ip: { type: String },
  active: { type: Boolean, default: true },
  lastUsedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Session = mongoose.model('Session', SessionSchema);

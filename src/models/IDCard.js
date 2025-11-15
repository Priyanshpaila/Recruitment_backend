import mongoose from 'mongoose';

/**
 * IDCard Schema
 * Represents the personal details printed on an employee's ID Card.
 * Linked to a User via `userId` reference.
 */
const IDCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  bloodGroup: {
    type: String,
    required: true,
    uppercase: true,
    enum: [
      'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 
      'UNKNOWN' // fallback for missing info
    ],
    default: 'UNKNOWN'
  },

  residenceAddress: {
    type: String,
    required: true,
    trim: true
  },

  emergencyContactNo: {
    type: String,
    required: true,
    match: [/^[0-9]{7,15}$/, 'Enter a valid contact number']
  },

  signatureFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files',
    default: null
  },

  photoFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files',
    default: null
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

export const IDCard = mongoose.model('IDCard', IDCardSchema);

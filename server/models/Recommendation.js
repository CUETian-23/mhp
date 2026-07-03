const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['resource', 'activity', 'therapy', 'meditation', 'exercise', 'social'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  url: {
    type: String,
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  aiGenerated: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

recommendationSchema.index({ user: 1, createdAt: -1 });
recommendationSchema.index({ user: 1, isCompleted: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);

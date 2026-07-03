const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  mood: {
    type: String,
    enum: ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPrivate: {
    type: Boolean,
    default: true,
  },
  sentimentAnalysis: {
    score: Number,
    label: String,
    confidence: Number,
  },
  riskAssessment: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    indicators: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, mood: 1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);

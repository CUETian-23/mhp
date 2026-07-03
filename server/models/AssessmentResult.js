const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessmentType: {
    type: String,
    enum: ['phq-9', 'gad-7', 'custom'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'severe'],
  },
  responses: [{
    question: String,
    answer: Number,
  }],
  aiAnalysis: {
    riskLevel: String,
    recommendations: [String],
    confidence: Number,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

assessmentResultSchema.index({ user: 1, completedAt: -1 });
assessmentResultSchema.index({ user: 1, assessmentType: 1 });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);

const mongoose = require('mongoose');

const crisisAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  source: {
    type: String,
    enum: ['journal', 'chat', 'assessment', 'manual'],
    required: true,
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  indicators: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'escalated', 'resolved', 'false-positive'],
    default: 'active',
  },
  escalationContacts: [{
    type: String, // email or phone
  }],
  escalationSent: {
    type: Boolean,
    default: false,
  },
  escalationTime: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

crisisAlertSchema.index({ user: 1, createdAt: -1 });
crisisAlertSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('CrisisAlert', crisisAlertSchema);

const mongoose = require('mongoose');

const moodRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'],
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
  },
  factors: [{
    type: String,
    trim: true,
  }],
  activities: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    maxlength: 500,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

moodRecordSchema.index({ user: 1, createdAt: -1 });
moodRecordSchema.index({ user: 1, mood: 1 });

module.exports = mongoose.model('MoodRecord', moodRecordSchema);

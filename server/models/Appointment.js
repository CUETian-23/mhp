const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'in-person'],
    default: 'video',
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  reminderSent: {
    type: Boolean,
    default: false,
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

appointmentSchema.index({ user: 1, scheduledDate: -1 });
appointmentSchema.index({ professional: 1, scheduledDate: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

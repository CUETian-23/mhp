const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  credentialID: {
    type: String,
    required: true,
    unique: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    default: 0,
  },
  transports: {
    type: [String],
    default: [],
  },
  deviceType: {
    type: String,
    enum: ['singleDevice', 'multiDevice'],
    default: 'singleDevice',
  },
  backedUp: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsed: {
    type: Date,
  },
});

module.exports = mongoose.model('Credential', credentialSchema);

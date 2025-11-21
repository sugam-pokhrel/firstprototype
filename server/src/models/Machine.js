const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  machineType: {
    type: String,
    required: [true, 'Please provide machine type'],
    enum: ['Washer', 'Dryer', 'Washer & Dryer'],
  },
  machineCount: {
    type: Number,
    required: [true, 'Please provide number of machines'],
    min: 1,
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Please provide price per hour'],
    min: 0,
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
  },
  latitude: {
    type: Number,
    required: [true, 'Please provide latitude'],
  },
  longitude: {
    type: Number,
    required: [true, 'Please provide longitude'],
  },
  description: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Machine', machineSchema);


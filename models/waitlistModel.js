const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  date: {
    type: String, // Using MongoDB Date format
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  icpAddress: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Waitlist', waitlistSchema);

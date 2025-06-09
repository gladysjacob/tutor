const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  progress: [{
    weekId: {
      type: Number,
      required: true
    },
    topics: [{
      name: String,
      completed: {
        type: Boolean,
        default: false
      },
      ixlLink: String
    }],
    practice: [{
      description: String,
      completed: {
        type: Boolean,
        default: false
      },
      ixlLink: String
    }]
  }]
});

module.exports = mongoose.model('Student', studentSchema); 
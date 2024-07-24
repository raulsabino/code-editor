const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  html: {
    type: String,
    default: ''
  },
  css: {
    type: String,
    default: ''
  },
  js: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Project', projectSchema);
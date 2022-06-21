const mongoose = require('mongoose');
const clubSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
    trim: true,
  },

  shortCode: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});
const Club = mongoose.model('CLUB', clubSchema);

module.exports = Club;

const mongoose = require('mongoose');
const validator = require('validator');
const playerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  playerType: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

playerSchema.statics.isEmailTaken = async function (email, excludePlayerId) {
  const player = await this.findOne({ email, _id: { $ne: excludeplayerId } });
  return !!player;
};

playerSchema.statics.isNotExist = async function (mongoId) {
  const player = await this.findById(mongoId);
  return !player;
};

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;

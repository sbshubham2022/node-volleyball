const mongoose = require('mongoose');
const teamSchema = mongoose.Schema({
  clubId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  clubName: {
    type: String,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  coOwner: {
    type: String,
    required: false,
    trim: true,
    default: '',
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

teamSchema.statics.isNameTaken = async function (name, excludeTeamId) {
  const team = await this.findOne({ name: new RegExp(`^${name.trim()}$`, 'i'), _id: { $ne: excludeTeamId } });
  return !!team;
};
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

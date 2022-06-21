const mongoose = require('mongoose');
const tournamentSchema = mongoose.Schema({
  clubId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

tournamentSchema.statics.isNameTaken = async function (name, excludeTournamentId) {
  const tournament = await this.findOne({ name: new RegExp(`^${name.trim()}$`, 'i'), _id: { $ne: excludeTournamentId } });
  return !!tournament;
};
const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;

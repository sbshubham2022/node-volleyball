const mongoose = require('mongoose');
const tournamentTeamsSchema = mongoose.Schema({
  tournamentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Tournament',
  },
  teamId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Team',
  },
});
tournamentTeamsSchema.statics.isTeamTaken = async function (tournamentId, teamId) {
  const team = await this.findOne({ tournamentId, teamId });
  return !!team;
};
const TournamentTeams = mongoose.model('TOURNAMENTTEAM', tournamentTeamsSchema);
module.exports = TournamentTeams;

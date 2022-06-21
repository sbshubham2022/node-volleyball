const mongoose = require('mongoose');
const teamPlayersSchema = mongoose.Schema({
  playerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Player',
  },
  teamId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Team',
  },
  tournamentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Tournament',
  },
});

teamPlayersSchema.statics.isPlayerTaken = async function (tournamentId, playerId) {
  const player = await this.findOne({ tournamentId, playerId });
  console.log(player);
  return !!player;
};

const TeamPlayers = mongoose.model('teamPlayers', teamPlayersSchema);

module.exports = TeamPlayers;

const httpStatus = require('http-status');
const { TeamPlayers, TournamentTeams } = require('../models');
const ApiError = require('../utils/ApiError');

const createTeamPlayers = async (addPlayersInfo) => {
  const { tournamentId, teamId, playerIds } = addPlayersInfo;
  const players = playerIds.map((value) => {
    return {
      tournamentId,
      teamId,
      playerId: value,
    };
  });
  const p = await Promise.all(
    players.map(async (obj) => {
      const result = await TeamPlayers.isPlayerTaken(obj.tournamentId, obj.playerId);
      if (result) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Player already taken');
      }
      return result;
    })
  );

  return await TeamPlayers.insertMany(players);
};
const queryTeamPlayers = async (filter, options) => {
  const { limit = 10, page = 1, search } = options;
  let where = { name: new RegExp(search, 'gi') };

  const Players = await TeamPlayers.find(filter)
    .populate('playerId', '-__v')
    .limit(limit)
    .skip((page - 1) * limit);
  const playersInTeam = Players.map((playerObj) => {
    return playerObj.playerId;
  });
  const totalPlayers = await TeamPlayers.find(filter).countDocuments();
  const data = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalPlayers / limit),
    totalResult: totalPlayers,
    players: playersInTeam,
  };
  return data;
};

const deleteTeamPlayerById = async (deletePlayerInfo) => {
  const { tournamentId, teamId, playerId } = deletePlayerInfo;
  const teamPlayer = await TeamPlayers.findOne({ tournamentId, teamId, playerId });
  if (!teamPlayer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player not found');
  }
  await teamPlayer.remove();
  return teamPlayer;
};

module.exports = {
  createTeamPlayers,
  queryTeamPlayers,
  deleteTeamPlayerById,
};

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const { Player, TeamPlayers } = require('../models');
const { findOneAndDelete } = require('../models/token.model');
const ApiError = require('../utils/ApiError');

const createPlayer = async (playerBody) => {
  return Player.create(playerBody);
};

const queryPlayers = async (options) => {
  const { sortBy = 'name', orderBy = 'ASC', limit = 10, page = 1, search } = options;
  let where = { name: new RegExp(search, 'gi') };
  const sortCriteria = {};
  sortCriteria[sortBy] = orderBy;

  const totalPlayers = await Player.find(where).countDocuments();
  const Players = await Player.find(where)
    .limit(limit)
    .skip((page - 1) * limit)
    .collation({ locale: 'en' })
    .sort(sortCriteria);

  const playersList = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalPlayers / limit),
    totalResult: totalPlayers,
    result: Players,
  };
  return playersList;
};

const queryUnSelectedPlayers = async (options) => {
  const { tournamentId, teamId, sortBy = 'name', orderBy = 'ASC', limit = 10, page = 1, search, clubId } = options;
  let where = { name: new RegExp(search, 'gi') };
  const sortCriteria = {};
  sortCriteria[sortBy] = orderBy;
  const selectedTournamentplayersRelation = await TeamPlayers.find({ tournamentId: tournamentId });

  let selectedPlayerIds = selectedTournamentplayersRelation.map((playerObj) => {
    return playerObj.playerId;
  });

  const unSelectedPlayers = await Player.find({ _id: { $nin: selectedPlayerIds } }).sort(sortCriteria);
  const totalUnSelectedPlayers = await Player.find({ _id: { $nin: selectedPlayerIds } }).countDocuments();

  const selectedPlayers = await TeamPlayers.find({
    teamId: teamId,
    tournamentId: tournamentId,
  })
    .sort(sortCriteria)
    .populate('playerId');
  const selectedPlayersInTeam = selectedPlayers.map((playerObj) => {
    return playerObj.playerId;
  });
  const totalSelectedPlayers = await TeamPlayers.find({
    teamId: teamId,
    tournamentId: tournamentId,
  }).countDocuments();
  const result = { totalUnSelectedPlayers, totalSelectedPlayers, unSelectedPlayers, selectedPlayersInTeam };
  return result;
};

const getPlayerById = async (playerId) => {
  const player = await Player.findById(playerId);
  if (!player) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player does not exist');
  }
  return player;
};

const getPlayerInTeam = async (id) => {
  return TeamPlayers.findOne(id);
};

const updatePlayerById = async (updateInfo) => {
  const { playerId } = updateInfo;
  const playerToBeUpdated = await getPlayerById(playerId);
  if (!playerToBeUpdated) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player does not exist');
  }
  const playerUpdateInfo = pick(updateInfo, ['name', 'playerType', 'phoneNumber', 'photo']);
  Object.assign(playerToBeUpdated, playerUpdateInfo);
  await playerToBeUpdated.save();
  return playerToBeUpdated;
};

const deletePlayerById = async (playerId) => {
  const playerInTeam = await getPlayerInTeam({ playerId: playerId });
  if (!!playerInTeam) {
    throw new ApiError(httpStatus.NOT_FOUND, `Player participated in team can't be deleted`);
  }
  const playerToBeDeleted = await Player.findOneAndDelete({ _id: playerId });
  if (!playerToBeDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player does not exist');
  }
  return playerToBeDeleted;
};

module.exports = {
  createPlayer,
  queryPlayers,
  queryUnSelectedPlayers,
  getPlayerById,
  updatePlayerById,
  deletePlayerById,
};

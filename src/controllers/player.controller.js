const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { playerService, tournamentService } = require('../services');

const createPlayer = catchAsync(async (req, res) => {
  //req.body.photo = process.env.IMAGE_BASE_URL + req.body.photo;
  const createdPlayer = await playerService.createPlayer(req.body);
  res.sendJSONResponse(201, true, 'Player created successfully');
});

const listPlayers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'orderBy', 'limit', 'page', 'search']);
  const playersInfo = await playerService.queryPlayers(options);
  res.sendJSONResponse(200, true, 'List of all players given successfully', playersInfo);
});

const getPlayer = catchAsync(async (req, res) => {
  const playerId = req.params.playerId;
  const playerInfo = await playerService.getPlayerById(playerId);
  res.sendJSONResponse(200, true, 'Player information given successfully', playerInfo);
});

const updatePlayer = catchAsync(async (req, res) => {
  const updateInfo = pick(req.body, ['name', 'playerType', 'phoneNumber', 'photo']);
  updateInfo.playerId = req.params.playerId;
  const updatedPlayer = await playerService.updatePlayerById(updateInfo);
  res.sendJSONResponse(200, true, 'Player updated successfully');
});

const deletePlayer = catchAsync(async (req, res) => {
  const { playerId } = req.params;
  const deletedPlayer = await playerService.deletePlayerById(playerId);
  res.sendJSONResponse(200, true, 'Player deleted permanently');
});

const listUnSelectedPlayers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'orderBy', 'limit', 'page', 'search']);
  options.tournamentId = req.params.tournamentId;
  options.teamId = req.params.teamId;
  const filter = { _id: req.params.tournamentId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(filter);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournament does not exist');
  }
  const unSlectedPlayersInfo = await playerService.queryUnSelectedPlayers(options);
  res.sendJSONResponse(200, true, 'List of all unselected or selected players given successfully', unSlectedPlayersInfo);
});

module.exports = {
  createPlayer,
  listPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  listUnSelectedPlayers,
};

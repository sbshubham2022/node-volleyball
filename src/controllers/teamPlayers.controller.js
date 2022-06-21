const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { playerService, teamService, tournamentService, tournamentTeamsService, teamPlayersService } = require('../services');

const createTeamPlayers = catchAsync(async (req, res) => {
  const { tournamentId, teamId } = req.params;
  const { playerIds } = req.body;
  const checkTournament = { _id: tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }

  const teamExistInTournament = await tournamentTeamsService.getTournamentTeam({ tournamentId, teamId });
  if (!teamExistInTournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team does not exist');
  }

  for (let j = 0; j < playerIds.length; j++) {
    const checkPlayer = {};
    checkPlayer._id = playerIds[j];
    const player = await playerService.getPlayerById(checkPlayer);
    if (!player) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Player does not exist');
    }
  }
  const ptt = await teamPlayersService.createTeamPlayers({ tournamentId, teamId, playerIds });
  res.sendJSONResponse(201, true, 'Players Participated in Team');
});

const listTeamPlayers = catchAsync(async (req, res) => {
  const { tournamentId, teamId } = req.params;
  const checkTournament = { _id: tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }
  const checkTeam = { _id: teamId };
  if (req.user.role === 'club') {
    checkTeam.clubId = req.user._id;
  }
  const team = await teamService.getTeam(checkTeam);
  if (!team) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team does not exist');
  }
  const filter = pick(req.params, ['tournamentId', 'teamId']);
  const options = pick(req.body, ['sortBy', 'limit', 'page', 'search']);
  const result = await teamPlayersService.queryTeamPlayers(filter, options);
  res.sendJSONResponse(200, true, 'Team players listed successfully', result);
});

const deleteTeamPlayer = catchAsync(async (req, res) => {
  const { tournamentId, teamId, playerId } = req.params;

  const checkTournament = { _id: tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }

  const checkTeam = { _id: teamId };
  if (req.user.role === 'club') {
    checkTeam.clubId = req.user._id;
  }
  const team = await teamService.getTeam(checkTeam);
  if (!team) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team does not exist');
  }

  const player = await playerService.getPlayerById(playerId);
  if (!player) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Player does not exist');
  }

  await teamPlayersService.deleteTeamPlayerById({ tournamentId, teamId, playerId });
  res.sendJSONResponse(200, true, 'Player is removed from team successfully');
});

module.exports = {
  createTeamPlayers,
  listTeamPlayers,
  deleteTeamPlayer,
};

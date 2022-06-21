const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { tournamentTeamsService, tournamentService, teamService } = require('../services');
const { Team } = require('../models');
const { serveWithOptions } = require('swagger-ui-express');

const createTournamentTeams = catchAsync(async (req, res) => {
  const checkTournament = { _id: req.params.tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }
  const { teamIds } = req.body;
  const tournamentId = req.params.tournamentId;
  for (let j = 0; j < teamIds.length; j++) {
    const checkTeam = {};
    if (req.user.role === 'club') {
      checkTeam.clubId = req.user._id;
      checkTeam._id = teamIds[j];
    }
    const team = await teamService.getTeam(checkTeam);
    if (!team) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Team does not exist');
    }
    const ptt = await tournamentTeamsService.createTournamentTeams({ teamId: teamIds[j], tournamentId });
    res.sendJSONResponse(201, true, 'Teams participated to tournament sucessfully');
  }

  // const tournamentId = req.params.tournamentId;
  const teamId = req.body.teamId;

  // const ptt = await tournamentTeamsService.createTournamentTeams({ teamId, tournamentId });
  // res.sendJSONResponse(201, true, 'Team participated to tournament sucessfully');
});

const listTournamentTeams = catchAsync(async (req, res) => {
  const checkTournament = { _id: req.params.tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }
  const filter = pick(req.params, ['tournamentId']);
  const options = pick(req.body, ['sortBy', 'limit', 'page', 'search']);
  const result = await tournamentTeamsService.queryTournamentTeams(filter, options);

  res.sendJSONResponse(201, true, 'Team participated in tournament listed sucessfully', result);
});

const deleteTournamentTeam = catchAsync(async (req, res) => {
  const checkTournament = { _id: req.params.tournamentId };
  if (req.user.role === 'club') {
    checkTournament.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(checkTournament);
  if (!tournament) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament does not exist');
  }
  const checkTeam = { _id: req.params.teamId };
  if (req.user.role === 'club') {
    checkTeam.clubId = req.user._id;
  }
  const team = await teamService.getTeam(checkTeam);
  if (!team) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team does not exist');
  }
  const tournamentId = req.params.tournamentId;
  const teamId = req.params.teamId;
  await tournamentTeamsService.deleteTournamentTeamById({ tournamentId, teamId });
  res.sendJSONResponse(201, true, 'Team deleted from tournament sucessfully');
});

module.exports = {
  createTournamentTeams,
  listTournamentTeams,
  deleteTournamentTeam,
};

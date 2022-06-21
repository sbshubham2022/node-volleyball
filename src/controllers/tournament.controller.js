const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tournamentService } = require('../services');

const createTournament = catchAsync(async (req, res) => {
  req.body.clubId = req.user._id;
  //req.body.logo = process.env.IMAGE_BASE_URL + req.body.logo;
  const tournament = await tournamentService.createTournament(req.body);
  res.sendJSONResponse(201, true, 'Tournament created sucessfully');
});

const listTournaments = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'orderBy', 'limit', 'page', 'search']);
  if (req.user.role === 'club') {
    options.clubId = req.user._id;
  }
  const ListTournaments = await tournamentService.queryTournaments(options);
  res.sendJSONResponse(200, true, 'Tournaments listed sucessfully', ListTournaments);
});

const getTournament = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const filter = { _id: tournamentId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const tournament = await tournamentService.getTournament(filter);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournament does not exist');
  }
  res.sendJSONResponse(200, true, 'Tournament listed successfully', tournament);
});

const updateTournament = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const filter = { _id: tournamentId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const tournament = await tournamentService.updateTournamentById(filter, req.body);
  res.sendJSONResponse(200, true, 'Tournament updated successfully');
});

const deleteTournament = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const filter = { _id: tournamentId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const tournament = await tournamentService.deleteTournamentById(filter);
  res.sendJSONResponse(200, true, 'Tournament deleted successfully');
});

module.exports = {
  createTournament,
  listTournaments,
  getTournament,
  updateTournament,
  deleteTournament,
};

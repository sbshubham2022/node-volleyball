const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { teamService } = require('../services');

const createTeam = catchAsync(async (req, res) => {
  req.body.clubId = req.user._id;
  //req.body.logo = process.env.IMAGE_BASE_URL + req.body.logo;
  const team = await teamService.createTeam(req.body);
  res.sendJSONResponse(201, true, 'Team created sucessfully');
});

const listTeams = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'orderBy', 'limit', 'page', 'search']);
  if (req.user.role === 'club') {
    options.clubId = req.user._id;
  }
  const ListTeams = await teamService.queryTeams(options);
  res.sendJSONResponse(200, true, 'Team listed sucessfully', ListTeams);
});

const getTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const filter = { _id: teamId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const team = await teamService.getTeam(filter);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team does not exist');
  }
  res.sendJSONResponse(200, true, 'Team listed successfully', team);
});

const updateTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const filter = { _id: teamId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const team = await teamService.updateTeamById(filter, req.body);
  res.sendJSONResponse(200, true, 'Team updated successfully');
});

const deleteTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const filter = { _id: teamId };
  if (req.user.role === 'club') {
    filter.clubId = req.user._id;
  }
  const team = await teamService.deleteTeamById(filter);
  res.sendJSONResponse(200, true, 'Team deleted successfully');
});

module.exports = {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};

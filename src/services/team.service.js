const httpStatus = require('http-status');
const { Team, TournamentTeams } = require('../models');
const ApiError = require('../utils/ApiError');

const createTeam = async (teamBody) => {
  if (await Team.isNameTaken(teamBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team Name is already taken');
  }
  return Team.create(teamBody);
};

const queryTeams = async (options) => {
  const { sortBy = 'name', orderBy = 'ASC', limit = 10, page = 1, search, clubId } = options;
  let where = { name: new RegExp(search, 'gi'), ...(clubId && { clubId: clubId }) };
  const totalTeams = await Team.find(where).countDocuments();
  const sortCriteria = {};
  sortCriteria[sortBy] = orderBy;
  const Teams = await Team.find(where)
    .populate('clubId', 'name')
    .limit(limit)
    .skip((page - 1) * limit)
    .collation({ locale: 'en' })
    .sort(sortCriteria);
  const teamsList = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalTeams / limit),
    totalResult: totalTeams,
    result: Teams,
  };
  return teamsList;
};
const getTeam = async (filter) => {
  return Team.findOne(filter);
};

const getTeamById = async (id) => {
  return Team.findById(id);
};

const getTeamIdFromTournament = async (id) => {
  return TournamentTeams.findOne(id);
};

const updateTeamById = async (filter, updateBody) => {
  const team = await getTeam(filter);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team does not exits');
  }
  if (updateBody.name) {
    if (await Team.isNameTaken(updateBody.name, filter._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Team Name is already taken');
    }
  }

  Object.assign(team, updateBody);
  await team.save();
  return team;
};

const deleteTeamById = async (filter) => {
  const teamInTournament = await getTeamIdFromTournament({ teamId: filter._id });
  console.log(teamInTournament);
  if (!!teamInTournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team participated in tournament cant be deleted');
  }
  const team = await getTeam(filter);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team does not exits');
  }
  await team.remove();
  return team;
};
module.exports = {
  createTeam,
  queryTeams,
  getTeam,
  getTeamById,
  updateTeamById,
  deleteTeamById,
};

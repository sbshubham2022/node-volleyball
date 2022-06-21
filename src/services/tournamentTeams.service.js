const httpStatus = require('http-status');
const { TournamentTeams } = require('../models');
const ApiError = require('../utils/ApiError');

const createTournamentTeams = async (addTournamentTeamBody) => {
  const { tournamentId, teamId } = addTournamentTeamBody;
  if (await TournamentTeams.isTeamTaken(tournamentId, teamId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team already participated in tournament');
  }
  return TournamentTeams.create(addTournamentTeamBody);
};

const getTournamentTeam = async (tournamentIdAndTeamId) => {
  return await TournamentTeams.findOne(tournamentIdAndTeamId);
};

const queryTournamentTeams = async (filter, options) => {
  const { limit = 10, page = 1, search } = options;
  let where = { name: new RegExp(search, 'gi') };
  const Teams = await TournamentTeams.find(filter)
    .populate('teamId', '-clubId -__v')
    .limit(limit)
    .skip((page - 1) * limit);
  const teamsInTournament = Teams.map((teamObj) => {
    return teamObj.teamId;
  });
  const totalTeams = await TournamentTeams.find(filter).countDocuments();
  const data = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalTeams / limit),
    totalResult: totalTeams,
    teams: teamsInTournament,
  };
  return data;
};

const deleteTournamentTeamById = async ({ tournamentId, teamId }) => {
  const tournamentTeam = await TournamentTeams.findOne({ teamId: teamId, tournamentId: tournamentId });
  console.log(tournamentTeam);
  if (!tournamentTeam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found in tournament');
  }
  await tournamentTeam.remove();
  return tournamentTeam;
};
module.exports = {
  createTournamentTeams,
  getTournamentTeam,
  queryTournamentTeams,
  deleteTournamentTeamById,
};

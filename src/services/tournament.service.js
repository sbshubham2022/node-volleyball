const httpStatus = require('http-status');
const { Tournament } = require('../models');
const ApiError = require('../utils/ApiError');

const createTournament = async (tournamentBody) => {
  if (await Tournament.isNameTaken(tournamentBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament Name is already registered');
  }
  return Tournament.create(tournamentBody);
};

const queryTournaments = async (options) => {
  const { sortBy = 'name', orderBy = 'ASC', limit = 10, page = 1, search, clubId } = options;
  let where = { name: new RegExp(search, 'gi'), ...(clubId && { clubId: clubId }) };
  const totalTournaments = await Tournament.find(where).countDocuments();
  const sortCriteria = {};
  sortCriteria[sortBy] = orderBy;
  const Tournaments = await Tournament.find(where)
    .populate('clubId', 'name')
    .limit(limit)
    .skip((page - 1) * limit)
    .collation({ locale: 'en' })
    .sort(sortCriteria);
  const tournamentList = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalTournaments / limit),
    totalResult: totalTournaments,
    result: Tournaments,
  };
  return tournamentList;
};

const getTournament = async (tournamentIdAndClubId) => {
  const tournament = await Tournament.findOne(tournamentIdAndClubId).populate('clubId', 'name');
  return tournament;
};

const getTournamentById = async (id) => {
  return Tournament.findById(id);
};

const updateTournamentById = async (filter, updateBody) => {
  const tournament = await getTournament(filter);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournament does not exits');
  }
  if (updateBody.name) {
    if (await Tournament.isNameTaken(updateBody.name, filter._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tournament Name is already taken');
    }
  }
  Object.assign(tournament, updateBody);
  await tournament.save();
  return tournament;
};

const deleteTournamentById = async (filter) => {
  const tournament = await getTournament(filter);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournament does not exist');
  }
  await tournament.remove();
  return tournament;
};

module.exports = {
  createTournament,
  queryTournaments,
  getTournamentById,
  getTournament,
  updateTournamentById,
  deleteTournamentById,
};

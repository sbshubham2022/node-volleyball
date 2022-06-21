const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTournamentTeams = {
  params: Joi.object().keys({
    tournamentId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    teamIds: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const listTournamentTeams = {
  params: Joi.object().keys({
    tournamentId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteTournamentTeam = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
    teamId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTournamentTeams,
  listTournamentTeams,
  deleteTournamentTeam,
};

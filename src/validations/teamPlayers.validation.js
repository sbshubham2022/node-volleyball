const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTeamPlayers = {
  params: Joi.object().keys({
    tournamentId: Joi.required().custom(objectId),
    teamId: Joi.required().custom(objectId),
  }),

  body: Joi.object().keys({
    playerIds: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const listTeamPlayers = {
  params: Joi.object().keys({
    tournamentId: Joi.required().custom(objectId),
    teamId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteTeamPlayer = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
    teamId: Joi.string().custom(objectId),
    playerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTeamPlayers,
  listTeamPlayers,
  deleteTeamPlayer,
};

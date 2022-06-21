const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createTournament = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.date().required().greater(new Date()),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    venue: Joi.string().required(),
    logo: Joi.string().required(),
  }),
};

const listTournaments = {
  query: Joi.object().keys({
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
    orderBy: Joi.string().valid('ASC', 'DESC'),
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

const getTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
  }),
};

const updateTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      startDate: Joi.date().greater(new Date()),
      endDate: Joi.date().greater(Joi.ref('startDate')),
      venue: Joi.string(),
      logo: Joi.string(),
    })
    .min(1),
};

const deleteTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTournament,
  listTournaments,
  getTournament,
  updateTournament,
  deleteTournament,
};

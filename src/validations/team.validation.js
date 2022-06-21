const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createTeam = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    owner: Joi.string().required(),
    coOwner: Joi.string().allow(null, ''),
    shortCode: Joi.string().required(),
    logo: Joi.string().required(),
  }),
};

const listTeams = {
  query: Joi.object().keys({
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
    orderBy: Joi.string().valid('ASC', 'DESC'),
  }),
};

const getTeam = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
  }),
};

const updateTeam = {
  params: Joi.object().keys({
    teamId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      owner: Joi.string(),
      coOwner: Joi.string().allow(null, ''),
      shortCode: Joi.string(),
      logo: Joi.string(),
    })
    .min(1),
};

const deleteTeam = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};

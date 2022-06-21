const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createPlayer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    playerType: Joi.string().required().valid('SIDE', 'THIRD', 'CENTER', 'NET'),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/),
    photo: Joi.string().required(),
  }),
};

const listPlayers = {
  query: Joi.object().keys({
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
    orderBy: Joi.string().valid('ASC', 'DESC'),
  }),
};

const listUnSelectedPlayers = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
    teamId: Joi.string().custom(objectId),
  }),
};

const getPlayer = {
  params: Joi.object().keys({
    playerId: Joi.string().custom(objectId),
  }),
};

const updatePlayer = {
  params: Joi.object().keys({
    playerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      playerType: Joi.string().valid('SIDE', 'THIRD', 'CENTER', 'NET'),
      //email: Joi.string().email(),
      phoneNumber: Joi.string(),
      photo: Joi.string(),
    })
    .min(1),
};

const deletePlayer = {
  params: Joi.object().keys({
    playerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPlayer,
  listPlayers,
  listUnSelectedPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
};

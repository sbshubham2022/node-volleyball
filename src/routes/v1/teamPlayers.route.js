const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teamPlayersValidation = require('../../validations/teamPlayers.validation');
const teamPlayersController = require('../../controllers/teamPlayers.controller');

const router = express.Router();

router
  .route('/:tournamentId/:teamId')
  .post(auth(), validate(teamPlayersValidation.createTeamPlayers), teamPlayersController.createTeamPlayers)
  .get(auth(), validate(teamPlayersValidation.listTeamPlayers), teamPlayersController.listTeamPlayers);
router
  .route('/:tournamentId/:teamId/:playerId')
  .delete(auth(), validate(teamPlayersValidation.deleteTeamPlayer), teamPlayersController.deleteTeamPlayer);
module.exports = router;

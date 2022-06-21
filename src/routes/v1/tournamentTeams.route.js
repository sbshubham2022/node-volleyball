const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tournamentTeamsValidation = require('../../validations/tournamentTeams.validation');
const tournamentTeamsController = require('../../controllers/tournamentTeams.controller');

const router = express.Router();

router
  .route('/:tournamentId')
  .post(auth(), validate(tournamentTeamsValidation.createTournamentTeams), tournamentTeamsController.createTournamentTeams)
  .get(auth(), validate(tournamentTeamsValidation.listTournamentTeams), tournamentTeamsController.listTournamentTeams);
router
  .route('/:tournamentId/:teamId')
  .delete(auth(), validate(tournamentTeamsValidation.deleteTournamentTeam), tournamentTeamsController.deleteTournamentTeam);
module.exports = router;

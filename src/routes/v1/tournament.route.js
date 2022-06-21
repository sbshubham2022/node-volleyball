const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tournamentValidation = require('../../validations/tournament.validation');
const tournamentController = require('../../controllers/tournament.controller');

const router = express.Router();

router
  .route('/add')
  .post(auth('manageTournament'), validate(tournamentValidation.createTournament), tournamentController.createTournament);
router
  .route('/list')
  .get(auth('manageTournament'), validate(tournamentValidation.listTournaments), tournamentController.listTournaments);

router
  .route('/:tournamentId')
  .get(auth('manageTournament'), validate(tournamentValidation.getTournament), tournamentController.getTournament)
  .put(auth('manageTournament'), validate(tournamentValidation.updateTournament), tournamentController.updateTournament)
  .delete(auth('deleteTournament'), validate(tournamentValidation.deleteTournament), tournamentController.deleteTournament);
module.exports = router;

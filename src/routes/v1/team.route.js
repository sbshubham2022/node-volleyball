const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teamValidation = require('../../validations/team.validation');
const teamController = require('../../controllers/team.controller');

const router = express.Router();

router.route('/add').post(auth('manageTeam'), validate(teamValidation.createTeam), teamController.createTeam);
router.route('/list').get(auth('manageTeam'), validate(teamValidation.listTeams), teamController.listTeams);

router
  .route('/:teamId')
  .get(auth('manageTeam'), validate(teamValidation.getTeam), teamController.getTeam)
  .put(auth('manageTeam'), validate(teamValidation.updateTeam), teamController.updateTeam)
  .delete(auth('manageTeam'), validate(teamValidation.deleteTeam), teamController.deleteTeam);
module.exports = router;

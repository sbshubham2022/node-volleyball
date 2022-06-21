const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const clubValidation = require('../../validations/club.validation');
const clubController = require('../../controllers/club.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(clubValidation.createClub), clubController.createClub)
  .get(auth('getUsers'), validate(clubValidation.getClubs), clubController.getClubs);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(clubValidation.getClub), clubController.getClub)
  .patch(auth('manageUsers'), validate(clubValidation.updateClub), clubController.updateClub)
  .delete(auth('manageUsers'), validate(clubValidation.deleteClub), clubController.deleteClub);

module.exports = router;

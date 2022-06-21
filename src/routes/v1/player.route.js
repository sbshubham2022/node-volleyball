const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const playerValidation = require('../../validations/player.validation');
const playerController = require('../../controllers/player.controller');

const router = express.Router();

router.route('/add').post(auth(), validate(playerValidation.createPlayer), playerController.createPlayer);
router.route('/list').get(auth(), validate(playerValidation.listPlayers), playerController.listPlayers);
router
  .route('/listUnSelected/:tournamentId/:teamId')
  .get(auth(), validate(playerValidation.listUnSelectedPlayers), playerController.listUnSelectedPlayers);
router
  .route('/:playerId')
  .get(auth(), validate(playerValidation.getPlayer), playerController.getPlayer)
  .put(auth(), validate(playerValidation.updatePlayer), playerController.updatePlayer)
  .delete(auth('deletePlayer'), validate(playerValidation.deletePlayer), playerController.deletePlayer);
module.exports = router;

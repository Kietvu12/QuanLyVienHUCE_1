const express = require('express');
const router = express.Router();
const chiPhiController = require('../controllers/chiPhiController');

router.get('/', chiPhiController.getAllChiPhi);
router.get('/:id', chiPhiController.getChiPhiById);
router.post('/', chiPhiController.createChiPhi);
router.put('/:id', chiPhiController.updateChiPhi);
router.delete('/:id', chiPhiController.deleteChiPhi);

module.exports = router;


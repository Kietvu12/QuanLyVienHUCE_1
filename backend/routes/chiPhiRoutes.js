const express = require('express');
const router = express.Router();
const chiPhiController = require('../controllers/chiPhiController');
const uploadMediaChiPhi = require('../middleware/uploadMediaChiPhi');

router.get('/', chiPhiController.getAllChiPhi);
router.get('/:id', chiPhiController.getChiPhiById);
router.post('/', chiPhiController.createChiPhi);
router.put('/:id', chiPhiController.updateChiPhi);
router.delete('/:id', chiPhiController.deleteChiPhi);

// Media routes
router.post('/:id/media', uploadMediaChiPhi.array('files', 10), chiPhiController.uploadMediaChiPhi);
router.delete('/:id/media/:mediaId', chiPhiController.removeMediaChiPhi);

module.exports = router;


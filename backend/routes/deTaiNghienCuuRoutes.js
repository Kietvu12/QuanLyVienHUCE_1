const express = require('express');
const router = express.Router();
const deTaiNghienCuuController = require('../controllers/deTaiNghienCuuController');

router.get('/', deTaiNghienCuuController.getAllDeTaiNghienCuu);
router.get('/:id', deTaiNghienCuuController.getDeTaiNghienCuuById);
router.post('/', deTaiNghienCuuController.createDeTaiNghienCuu);
router.put('/:id', deTaiNghienCuuController.updateDeTaiNghienCuu);
router.delete('/:id', deTaiNghienCuuController.deleteDeTaiNghienCuu);

module.exports = router;


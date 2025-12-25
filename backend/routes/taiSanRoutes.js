const express = require('express');
const router = express.Router();
const taiSanController = require('../controllers/taiSanController');

router.get('/', taiSanController.getAllTaiSan);
router.get('/:id', taiSanController.getTaiSanById);
router.post('/', taiSanController.createTaiSan);
router.put('/:id', taiSanController.updateTaiSan);
router.delete('/:id', taiSanController.deleteTaiSan);

module.exports = router;


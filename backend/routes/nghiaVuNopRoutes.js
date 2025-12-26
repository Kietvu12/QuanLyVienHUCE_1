const express = require('express');
const router = express.Router();
const nghiaVuNopController = require('../controllers/nghiaVuNopController');
const { authorizeMinRole } = require('../middleware/authMiddleware');

router.get('/', authorizeMinRole('vien_truong'), nghiaVuNopController.getAllNghiaVuNop);
router.get('/statistics', authorizeMinRole('vien_truong'), nghiaVuNopController.getCongNoStatistics);
router.get('/:id', authorizeMinRole('vien_truong'), nghiaVuNopController.getNghiaVuNopById);
router.post('/thanh-toan', authorizeMinRole('vien_truong'), nghiaVuNopController.thanhToanCongNo);

module.exports = router;


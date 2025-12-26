const express = require('express');
const router = express.Router();
const loaiHopDongController = require('../controllers/loaiHopDongController');
const { authenticate } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

router.get('/', loaiHopDongController.getAllLoaiHopDong);
router.get('/:id', loaiHopDongController.getLoaiHopDongById);

module.exports = router;


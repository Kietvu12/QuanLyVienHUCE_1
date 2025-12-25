const express = require('express');
const router = express.Router();
const hopDongLaoDongController = require('../controllers/hopDongLaoDongController');
const hopDongStatisticsController = require('../controllers/hopDongStatisticsController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

// Thống kê hợp đồng
router.get('/statistics', hopDongStatisticsController.getHopDongStatistics);

// Lấy tất cả hợp đồng lao động
router.get('/', hopDongLaoDongController.getAllHopDongLaoDong);

// Lấy hợp đồng lao động theo ID
router.get('/:id', hopDongLaoDongController.getHopDongLaoDongById);

// Tạo hợp đồng lao động mới
router.post('/', hopDongLaoDongController.createHopDongLaoDong);

// Cập nhật hợp đồng lao động
router.put('/:id', hopDongLaoDongController.updateHopDongLaoDong);

// Xóa hợp đồng lao động
router.delete('/:id', hopDongLaoDongController.deleteHopDongLaoDong);

module.exports = router;


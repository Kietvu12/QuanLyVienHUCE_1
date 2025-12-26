const express = require('express');
const router = express.Router();
const doanhThuController = require('../controllers/doanhThuController');
const uploadMediaDoanhThu = require('../middleware/uploadMediaDoanhThu');

router.get('/', doanhThuController.getAllDoanhThu);
router.get('/statistics', doanhThuController.getRevenueExpenseStatistics);
router.get('/:id', doanhThuController.getDoanhThuById);
router.post('/', doanhThuController.createDoanhThu);
router.put('/:id', doanhThuController.updateDoanhThu);
router.delete('/:id', doanhThuController.deleteDoanhThu);

// Media routes
router.post('/:id/media', uploadMediaDoanhThu.array('files', 10), doanhThuController.uploadMediaDoanhThu);
router.delete('/:id/media/:mediaId', doanhThuController.removeMediaDoanhThu);

module.exports = router;


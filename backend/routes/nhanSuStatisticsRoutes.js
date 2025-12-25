const express = require('express');
const router = express.Router();
const nhanSuStatisticsController = require('../controllers/nhanSuStatisticsController');
const { authenticate, authorizeMinRole } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Thống kê tổng quan nhân sự
router.get('/summary', nhanSuStatisticsController.getNhanSuStatistics);

// Phân bố theo phòng ban
router.get('/distribution/phong-ban', nhanSuStatisticsController.getDistributionByPhongBan);

// Phân bố theo chức vụ
router.get('/distribution/chuc-vu', nhanSuStatisticsController.getDistributionByChucVu);

// Phân bố theo nhóm tuổi
router.get('/distribution/nhom-tuoi', nhanSuStatisticsController.getDistributionByAgeGroup);

module.exports = router;


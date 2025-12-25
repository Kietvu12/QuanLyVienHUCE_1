const express = require('express');
const router = express.Router();
const deTaiNghienCuuStatisticsController = require('../controllers/deTaiNghienCuuStatisticsController');

router.get('/statistics', deTaiNghienCuuStatisticsController.getStatistics);
router.get('/distribution-by-status', deTaiNghienCuuStatisticsController.getDistributionByStatus);
router.get('/distribution-by-year', deTaiNghienCuuStatisticsController.getDistributionByYear);
router.get('/distribution-by-field', deTaiNghienCuuStatisticsController.getDistributionByField);

module.exports = router;


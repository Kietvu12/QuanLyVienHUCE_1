const express = require('express');
const router = express.Router();
const doanhThuController = require('../controllers/doanhThuController');

router.get('/', doanhThuController.getAllDoanhThu);
router.get('/:id', doanhThuController.getDoanhThuById);
router.post('/', doanhThuController.createDoanhThu);
router.put('/:id', doanhThuController.updateDoanhThu);
router.delete('/:id', doanhThuController.deleteDoanhThu);

module.exports = router;


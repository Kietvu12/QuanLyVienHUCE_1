const express = require('express');
const router = express.Router();
const nhanSuController = require('../controllers/nhanSuController');

// Lấy tất cả nhân sự
router.get('/', nhanSuController.getAllNhanSu);

// Lấy nhân sự theo ID
router.get('/:id', nhanSuController.getNhanSuById);

// Tạo nhân sự mới
router.post('/', nhanSuController.createNhanSu);

// Cập nhật nhân sự
router.put('/:id', nhanSuController.updateNhanSu);

// Xóa nhân sự
router.delete('/:id', nhanSuController.deleteNhanSu);

module.exports = router;


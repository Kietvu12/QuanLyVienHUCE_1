const express = require('express');
const router = express.Router();
const bangLuongController = require('../controllers/bangLuongController');

// Lấy tất cả bảng lương
router.get('/', bangLuongController.getAllBangLuong);

// Lấy bảng lương theo ID
router.get('/:id', bangLuongController.getBangLuongById);

// Tạo bảng lương mới
router.post('/', bangLuongController.createBangLuong);

// Cập nhật bảng lương
router.put('/:id', bangLuongController.updateBangLuong);

// Xóa bảng lương
router.delete('/:id', bangLuongController.deleteBangLuong);

module.exports = router;


const express = require('express');
const router = express.Router();
const nhanSuController = require('../controllers/nhanSuController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

// Lấy tất cả nhân sự
router.get('/', nhanSuController.getAllNhanSu);

// Lấy nhân sự theo ID
router.get('/:id', nhanSuController.getNhanSuById);

// Tạo nhân sự mới - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.post('/', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nhanSuController.createNhanSu);

// Cập nhật nhân sự - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.put('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nhanSuController.updateNhanSu);

// Xóa nhân sự - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.delete('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), nhanSuController.deleteNhanSu);

module.exports = router;


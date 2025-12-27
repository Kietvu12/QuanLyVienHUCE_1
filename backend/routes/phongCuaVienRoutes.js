const express = require('express');
const router = express.Router();
const phongCuaVienController = require('../controllers/phongCuaVienController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

router.get('/', phongCuaVienController.getAllPhongCuaVien);
router.get('/:id', phongCuaVienController.getPhongCuaVienById);

// Tạo phòng mới - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.post('/', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), phongCuaVienController.createPhongCuaVien);

// Cập nhật phòng - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.put('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), phongCuaVienController.updatePhongCuaVien);

// Xóa phòng - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.delete('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), phongCuaVienController.deletePhongCuaVien);

module.exports = router;


const express = require('express');
const router = express.Router();
const taiSanController = require('../controllers/taiSanController');
const uploadMediaTaiSan = require('../middleware/uploadMediaTaiSan');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

// GET routes - cho phép tất cả user đã đăng nhập
router.get('/', taiSanController.getAllTaiSan);
router.get('/statistics', taiSanController.getTaiSanStatistics);
router.get('/:id', taiSanController.getTaiSanById);

// POST, PUT, DELETE - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.post('/', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), taiSanController.createTaiSan);
router.put('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), taiSanController.updateTaiSan);
router.delete('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), taiSanController.deleteTaiSan);
router.post('/:id/media', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), uploadMediaTaiSan.fields([
  { name: 'anh_phieu_nhan', maxCount: 1 },
  { name: 'anh_tai_san', maxCount: 1 },
  { name: 'anh_phieu_ban_giao', maxCount: 1 }
]), taiSanController.uploadMediaTaiSan);
router.delete('/:id/media/:mediaId', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), taiSanController.removeMediaTaiSan);

module.exports = router;


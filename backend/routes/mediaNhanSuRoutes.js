const express = require('express');
const router = express.Router();
const mediaNhanSuController = require('../controllers/mediaNhanSuController');
const { authenticate, authorizeMinRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Lấy media nhân sự theo ID nhân sự
router.get('/nhan-su/:id_nhan_su', mediaNhanSuController.getMediaNhanSuByNhanSuId);

// Tạo hoặc cập nhật media nhân sự
router.post('/nhan-su/:id_nhan_su', authorizeMinRole('vien_truong'), mediaNhanSuController.upsertMediaNhanSu);
router.put('/nhan-su/:id_nhan_su', authorizeMinRole('vien_truong'), mediaNhanSuController.upsertMediaNhanSu);

// Upload file (hỗ trợ cả multer và base64)
// Multer: sử dụng field name 'files' và cho phép nhiều file
router.post('/upload', 
  authorizeMinRole('vien_truong'), 
  upload.array('files', 10), // Cho phép tối đa 10 file
  mediaNhanSuController.uploadFile
);

module.exports = router;


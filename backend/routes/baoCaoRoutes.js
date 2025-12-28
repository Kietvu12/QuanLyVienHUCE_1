const express = require('express');
const router = express.Router();
const baoCaoController = require('../controllers/baoCaoController');
const uploadBaoCao = require('../middleware/uploadBaoCao');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

router.get('/', baoCaoController.getAllBaoCao);
router.get('/:id', baoCaoController.getBaoCaoById);

// Tạo báo cáo mới - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.post('/', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.createBaoCao);
router.post('/upload', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), uploadBaoCao.single('file'), baoCaoController.uploadFileBaoCao);

// Cập nhật báo cáo - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.put('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.updateBaoCao);

// Xóa báo cáo - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.delete('/:id', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.deleteBaoCao);

// Gửi báo cáo - cho phép ke_toan_vien, vien_truong, cap_phong, hieu_truong
router.post('/:id/gui', authorize('ke_toan_vien', 'vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.guiBaoCao);
// Gửi lên cấp phòng - chỉ cho phép vien_truong
router.post('/:id/gui-len-cap-phong', authorize('vien_truong'), baoCaoController.guiLenCapPhong);
// Phê duyệt, từ chối - chỉ cho phép vien_truong, cap_phong, hieu_truong
router.post('/:id/phe-duyet', authorize('vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.pheDuyetBaoCao);
router.post('/:id/tu-choi', authorize('vien_truong', 'cap_phong', 'hieu_truong'), baoCaoController.tuChoiBaoCao);

module.exports = router;


const express = require('express');
const router = express.Router();
const deTaiNghienCuuController = require('../controllers/deTaiNghienCuuController');
const uploadTaiLieu = require('../middleware/uploadTaiLieu');

router.get('/', deTaiNghienCuuController.getAllDeTaiNghienCuu);
router.get('/:id', deTaiNghienCuuController.getDeTaiNghienCuuById);
router.post('/', deTaiNghienCuuController.createDeTaiNghienCuu);
router.put('/:id', deTaiNghienCuuController.updateDeTaiNghienCuu);
router.delete('/:id', deTaiNghienCuuController.deleteDeTaiNghienCuu);

// Thêm nhân sự vào đề tài
router.post('/:id/nhan-su', deTaiNghienCuuController.addNhanSuToDeTai);

// Xóa nhân sự khỏi đề tài
router.delete('/:id/nhan-su/:nhanSuDeTaiId', deTaiNghienCuuController.removeNhanSuFromDeTai);

// Cập nhật nhân sự trong đề tài
router.put('/:id/nhan-su/:nhanSuDeTaiId', deTaiNghienCuuController.updateNhanSuInDeTai);

// Upload tài liệu cho đề tài
router.post('/:id/tai-lieu', uploadTaiLieu.array('files', 10), deTaiNghienCuuController.uploadTaiLieu);

// Xóa tài liệu khỏi đề tài
router.delete('/:id/tai-lieu/:taiLieuId', deTaiNghienCuuController.removeTaiLieuFromDeTai);

module.exports = router;


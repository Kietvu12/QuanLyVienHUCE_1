const express = require('express');
const router = express.Router();
const taiSanController = require('../controllers/taiSanController');
const uploadMediaTaiSan = require('../middleware/uploadMediaTaiSan');

router.get('/', taiSanController.getAllTaiSan);
router.get('/statistics', taiSanController.getTaiSanStatistics);
router.get('/:id', taiSanController.getTaiSanById);
router.post('/', taiSanController.createTaiSan);
router.put('/:id', taiSanController.updateTaiSan);
router.delete('/:id', taiSanController.deleteTaiSan);
router.post('/:id/media', uploadMediaTaiSan.fields([
  { name: 'anh_phieu_nhan', maxCount: 1 },
  { name: 'anh_tai_san', maxCount: 1 }
]), taiSanController.uploadMediaTaiSan);
router.delete('/:id/media/:mediaId', taiSanController.removeMediaTaiSan);

module.exports = router;


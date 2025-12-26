const express = require('express');
const router = express.Router();
const baoCaoController = require('../controllers/baoCaoController');
const uploadBaoCao = require('../middleware/uploadBaoCao');

router.get('/', baoCaoController.getAllBaoCao);
router.get('/:id', baoCaoController.getBaoCaoById);
router.post('/', baoCaoController.createBaoCao);
router.post('/upload', uploadBaoCao.single('file'), baoCaoController.uploadFileBaoCao);
router.put('/:id', baoCaoController.updateBaoCao);
router.delete('/:id', baoCaoController.deleteBaoCao);
router.post('/:id/gui', baoCaoController.guiBaoCao);
router.post('/:id/phe-duyet', baoCaoController.pheDuyetBaoCao);
router.post('/:id/tu-choi', baoCaoController.tuChoiBaoCao);

module.exports = router;


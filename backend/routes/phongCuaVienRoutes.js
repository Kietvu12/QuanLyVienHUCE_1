const express = require('express');
const router = express.Router();
const phongCuaVienController = require('../controllers/phongCuaVienController');

router.get('/', phongCuaVienController.getAllPhongCuaVien);
router.get('/:id', phongCuaVienController.getPhongCuaVienById);
router.post('/', phongCuaVienController.createPhongCuaVien);
router.put('/:id', phongCuaVienController.updatePhongCuaVien);
router.delete('/:id', phongCuaVienController.deletePhongCuaVien);

module.exports = router;


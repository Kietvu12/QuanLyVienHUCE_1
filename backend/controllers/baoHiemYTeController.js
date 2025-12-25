const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả bảo hiểm y tế (có thể filter theo id_nhan_su)
const getAllBaoHiemYTe = async (req, res) => {
  try {
    const { id_nhan_su, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_nhan_su) where.id_nhan_su = id_nhan_su;

    const { count, rows } = await db.BaoHiemYTe.findAndCountAll({
      where,
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bảo hiểm y tế:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bảo hiểm y tế',
      error: error.message
    });
  }
};

// Lấy bảo hiểm y tế theo ID
const getBaoHiemYTeById = async (req, res) => {
  try {
    const { id } = req.params;

    const baoHiemYTe = await db.BaoHiemYTe.findByPk(id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'email']
        }
      ]
    });

    if (!baoHiemYTe) {
      return res.status(404).json({
        success: false,
        message: 'Bảo hiểm y tế không tồn tại'
      });
    }

    res.json({
      success: true,
      data: baoHiemYTe
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bảo hiểm y tế:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin bảo hiểm y tế',
      error: error.message
    });
  }
};

// Tạo bảo hiểm y tế mới
const createBaoHiemYTe = async (req, res) => {
  try {
    const { id_nhan_su, so_the_bhyt, noi_dang_ki_kham_chua_benh_ban_dau, ngay_het_han } = req.body;

    // Validation
    if (!id_nhan_su) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_nhan_su'
      });
    }

    // Kiểm tra nhân sự tồn tại
    const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
    if (!nhanSu) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự không tồn tại'
      });
    }

    // Kiểm tra xem nhân sự đã có bảo hiểm y tế chưa (mỗi nhân sự chỉ có 1 bảo hiểm y tế)
    const existingBHYT = await db.BaoHiemYTe.findOne({
      where: { id_nhan_su }
    });

    if (existingBHYT) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự này đã có bảo hiểm y tế. Vui lòng cập nhật thông tin hiện có.'
      });
    }

    const baoHiemYTe = await db.BaoHiemYTe.create({
      id_nhan_su,
      so_the_bhyt: so_the_bhyt || null,
      noi_dang_ki_kham_chua_benh_ban_dau: noi_dang_ki_kham_chua_benh_ban_dau || null,
      ngay_het_han: ngay_het_han || null
    });

    const baoHiemYTeWithRelations = await db.BaoHiemYTe.findByPk(baoHiemYTe.id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bảo hiểm y tế thành công',
      data: baoHiemYTeWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo bảo hiểm y tế:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bảo hiểm y tế',
      error: error.message
    });
  }
};

// Cập nhật bảo hiểm y tế
const updateBaoHiemYTe = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_the_bhyt, noi_dang_ki_kham_chua_benh_ban_dau, ngay_het_han } = req.body;

    const baoHiemYTe = await db.BaoHiemYTe.findByPk(id);
    if (!baoHiemYTe) {
      return res.status(404).json({
        success: false,
        message: 'Bảo hiểm y tế không tồn tại'
      });
    }

    await baoHiemYTe.update({
      so_the_bhyt: so_the_bhyt !== undefined ? so_the_bhyt : baoHiemYTe.so_the_bhyt,
      noi_dang_ki_kham_chua_benh_ban_dau: noi_dang_ki_kham_chua_benh_ban_dau !== undefined ? noi_dang_ki_kham_chua_benh_ban_dau : baoHiemYTe.noi_dang_ki_kham_chua_benh_ban_dau,
      ngay_het_han: ngay_het_han !== undefined ? ngay_het_han : baoHiemYTe.ngay_het_han
    });

    const updatedBHYT = await db.BaoHiemYTe.findByPk(id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật bảo hiểm y tế thành công',
      data: updatedBHYT
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật bảo hiểm y tế:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bảo hiểm y tế',
      error: error.message
    });
  }
};

// Xóa bảo hiểm y tế
const deleteBaoHiemYTe = async (req, res) => {
  try {
    const { id } = req.params;

    const baoHiemYTe = await db.BaoHiemYTe.findByPk(id);
    if (!baoHiemYTe) {
      return res.status(404).json({
        success: false,
        message: 'Bảo hiểm y tế không tồn tại'
      });
    }

    await baoHiemYTe.destroy();

    res.json({
      success: true,
      message: 'Xóa bảo hiểm y tế thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa bảo hiểm y tế:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bảo hiểm y tế',
      error: error.message
    });
  }
};

module.exports = {
  getAllBaoHiemYTe,
  getBaoHiemYTeById,
  createBaoHiemYTe,
  updateBaoHiemYTe,
  deleteBaoHiemYTe
};


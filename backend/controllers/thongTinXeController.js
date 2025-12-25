const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả thông tin xe (có thể filter theo id_nhan_su)
const getAllThongTinXe = async (req, res) => {
  try {
    const { id_nhan_su, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_nhan_su) where.id_nhan_su = id_nhan_su;

    const { count, rows } = await db.ThongTinXe.findAndCountAll({
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
    console.error('Lỗi khi lấy danh sách thông tin xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách thông tin xe',
      error: error.message
    });
  }
};

// Lấy thông tin xe theo ID
const getThongTinXeById = async (req, res) => {
  try {
    const { id } = req.params;

    const thongTinXe = await db.ThongTinXe.findByPk(id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'email']
        }
      ]
    });

    if (!thongTinXe) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin xe không tồn tại'
      });
    }

    res.json({
      success: true,
      data: thongTinXe
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin xe',
      error: error.message
    });
  }
};

// Tạo thông tin xe mới
const createThongTinXe = async (req, res) => {
  try {
    const { id_nhan_su, ten_xe, loai_xe, bien_so_xe, so_dang_ki_xe, ngay_het_han } = req.body;

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

    const thongTinXe = await db.ThongTinXe.create({
      id_nhan_su,
      ten_xe: ten_xe || null,
      loai_xe: loai_xe || null,
      bien_so_xe: bien_so_xe || null,
      so_dang_ki_xe: so_dang_ki_xe || null,
      ngay_het_han: ngay_het_han || null
    });

    const thongTinXeWithRelations = await db.ThongTinXe.findByPk(thongTinXe.id, {
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
      message: 'Tạo thông tin xe thành công',
      data: thongTinXeWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo thông tin xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo thông tin xe',
      error: error.message
    });
  }
};

// Cập nhật thông tin xe
const updateThongTinXe = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_xe, loai_xe, bien_so_xe, so_dang_ki_xe, ngay_het_han } = req.body;

    const thongTinXe = await db.ThongTinXe.findByPk(id);
    if (!thongTinXe) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin xe không tồn tại'
      });
    }

    await thongTinXe.update({
      ten_xe: ten_xe !== undefined ? ten_xe : thongTinXe.ten_xe,
      loai_xe: loai_xe !== undefined ? loai_xe : thongTinXe.loai_xe,
      bien_so_xe: bien_so_xe !== undefined ? bien_so_xe : thongTinXe.bien_so_xe,
      so_dang_ki_xe: so_dang_ki_xe !== undefined ? so_dang_ki_xe : thongTinXe.so_dang_ki_xe,
      ngay_het_han: ngay_het_han !== undefined ? ngay_het_han : thongTinXe.ngay_het_han
    });

    const updatedXe = await db.ThongTinXe.findByPk(id, {
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
      message: 'Cập nhật thông tin xe thành công',
      data: updatedXe
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin xe',
      error: error.message
    });
  }
};

// Xóa thông tin xe
const deleteThongTinXe = async (req, res) => {
  try {
    const { id } = req.params;

    const thongTinXe = await db.ThongTinXe.findByPk(id);
    if (!thongTinXe) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin xe không tồn tại'
      });
    }

    await thongTinXe.destroy();

    res.json({
      success: true,
      message: 'Xóa thông tin xe thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa thông tin xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông tin xe',
      error: error.message
    });
  }
};

module.exports = {
  getAllThongTinXe,
  getThongTinXeById,
  createThongTinXe,
  updateThongTinXe,
  deleteThongTinXe
};


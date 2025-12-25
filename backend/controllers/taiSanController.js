const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả tài sản (có thể filter theo id_vien, id_phong, tinh_trang)
const getAllTaiSan = async (req, res) => {
  try {
    const { id_vien, id_phong, tinh_trang, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (id_phong) where.id_phong = id_phong;
    if (tinh_trang) where.tinh_trang = tinh_trang;

    const { count, rows } = await db.TaiSan.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongCuaVien,
          as: 'phong',
          attributes: ['id', 'ten_toa', 'so_tang', 'so_phong'],
          required: false
        },
        {
          model: db.MediaTaiSan,
          as: 'mediaTaiSan',
          required: false
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
    console.error('Lỗi khi lấy danh sách tài sản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tài sản',
      error: error.message
    });
  }
};

// Lấy tài sản theo ID (bao gồm lịch sử thay đổi vị trí)
const getTaiSanById = async (req, res) => {
  try {
    const { id } = req.params;

    const taiSan = await db.TaiSan.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongCuaVien,
          as: 'phong',
          attributes: ['id', 'ten_toa', 'so_tang', 'so_phong', 'trang_thai'],
          required: false
        },
        {
          model: db.MediaTaiSan,
          as: 'mediaTaiSan',
          required: false
        }
      ]
    });

    if (!taiSan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài sản'
      });
    }

    // Lấy lịch sử thay đổi vị trí (dựa vào ngay_cap_nhat và id_phong)
    // Note: Có thể cần tạo bảng riêng để lưu lịch sử nếu cần chi tiết hơn
    // Ở đây chỉ trả về thông tin hiện tại

    res.json({
      success: true,
      data: taiSan
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tài sản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tài sản',
      error: error.message
    });
  }
};

// Tạo tài sản mới
const createTaiSan = async (req, res) => {
  try {
    const {
      id_vien,
      id_phong,
      ten_tai_san,
      tinh_trang,
      ngay_nhan_tai_san,
      ngay_ban_giao_tai_san
    } = req.body;

    // Kiểm tra viện tồn tại
    const vien = await db.Vien.findByPk(id_vien);
    if (!vien) {
      return res.status(400).json({
        success: false,
        message: 'Viện không tồn tại'
      });
    }

    // Kiểm tra phòng nếu có
    if (id_phong) {
      const phong = await db.PhongCuaVien.findByPk(id_phong);
      if (!phong) {
        return res.status(400).json({
          success: false,
          message: 'Phòng không tồn tại'
        });
      }
    }

    const taiSan = await db.TaiSan.create({
      id_vien,
      id_phong: id_phong || null,
      ten_tai_san,
      tinh_trang: tinh_trang || 'tot',
      ngay_nhan_tai_san: ngay_nhan_tai_san || null,
      ngay_ban_giao_tai_san: ngay_ban_giao_tai_san || null
    });

    const taiSanWithRelations = await db.TaiSan.findByPk(taiSan.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongCuaVien,
          as: 'phong',
          attributes: ['id', 'ten_toa', 'so_tang', 'so_phong'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài sản thành công',
      data: taiSanWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo tài sản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tài sản',
      error: error.message
    });
  }
};

// Cập nhật tài sản (bao gồm thay đổi vị trí)
const updateTaiSan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vien,
      id_phong,
      ten_tai_san,
      tinh_trang,
      ngay_nhan_tai_san,
      ngay_ban_giao_tai_san
    } = req.body;

    const taiSan = await db.TaiSan.findByPk(id);
    if (!taiSan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài sản'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien && id_vien !== taiSan.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Kiểm tra phòng nếu có thay đổi
    if (id_phong !== undefined && id_phong !== taiSan.id_phong) {
      if (id_phong) {
        const phong = await db.PhongCuaVien.findByPk(id_phong);
        if (!phong) {
          return res.status(400).json({
            success: false,
            message: 'Phòng không tồn tại'
          });
        }
      }
    }

    await taiSan.update({
      id_vien: id_vien !== undefined ? id_vien : taiSan.id_vien,
      id_phong: id_phong !== undefined ? id_phong : taiSan.id_phong,
      ten_tai_san: ten_tai_san !== undefined ? ten_tai_san : taiSan.ten_tai_san,
      tinh_trang: tinh_trang !== undefined ? tinh_trang : taiSan.tinh_trang,
      ngay_nhan_tai_san: ngay_nhan_tai_san !== undefined ? ngay_nhan_tai_san : taiSan.ngay_nhan_tai_san,
      ngay_ban_giao_tai_san: ngay_ban_giao_tai_san !== undefined ? ngay_ban_giao_tai_san : taiSan.ngay_ban_giao_tai_san
    });

    const updatedTaiSan = await db.TaiSan.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongCuaVien,
          as: 'phong',
          attributes: ['id', 'ten_toa', 'so_tang', 'so_phong'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật tài sản thành công',
      data: updatedTaiSan
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tài sản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tài sản',
      error: error.message
    });
  }
};

// Xóa tài sản
const deleteTaiSan = async (req, res) => {
  try {
    const { id } = req.params;

    const taiSan = await db.TaiSan.findByPk(id);
    if (!taiSan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài sản'
      });
    }

    await taiSan.destroy();

    res.json({
      success: true,
      message: 'Xóa tài sản thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa tài sản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tài sản',
      error: error.message
    });
  }
};

module.exports = {
  getAllTaiSan,
  getTaiSanById,
  createTaiSan,
  updateTaiSan,
  deleteTaiSan
};


const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả phòng của viện (có thể filter theo id_vien, id_phong_ban, trang_thai)
const getAllPhongCuaVien = async (req, res) => {
  try {
    const { id_vien, id_phong_ban, trang_thai, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (id_phong_ban) where.id_phong_ban = id_phong_ban;
    if (trang_thai) where.trang_thai = trang_thai;

    const { count, rows } = await db.PhongCuaVien.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban'],
          required: false
        },
        {
          model: db.TaiSan,
          as: 'taiSans',
          required: false,
          attributes: ['id', 'ten_tai_san', 'tinh_trang']
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
    console.error('Lỗi khi lấy danh sách phòng của viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phòng của viện',
      error: error.message
    });
  }
};

// Lấy phòng của viện theo ID
const getPhongCuaVienById = async (req, res) => {
  try {
    const { id } = req.params;

    const phong = await db.PhongCuaVien.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban'],
          required: false
        },
        {
          model: db.TaiSan,
          as: 'taiSans',
          required: false
        }
      ]
    });

    if (!phong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      data: phong
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin phòng',
      error: error.message
    });
  }
};

// Tạo phòng của viện mới
const createPhongCuaVien = async (req, res) => {
  try {
    const {
      id_vien,
      id_phong_ban,
      ten_toa,
      so_tang,
      so_phong,
      dien_tich,
      trang_thai
    } = req.body;

    // Kiểm tra viện tồn tại
    const vien = await db.Vien.findByPk(id_vien);
    if (!vien) {
      return res.status(400).json({
        success: false,
        message: 'Viện không tồn tại'
      });
    }

    // Kiểm tra phòng ban nếu có
    if (id_phong_ban) {
      const phongBan = await db.PhongBan.findByPk(id_phong_ban);
      if (!phongBan) {
        return res.status(400).json({
          success: false,
          message: 'Phòng ban không tồn tại'
        });
      }
    }

    const phong = await db.PhongCuaVien.create({
      id_vien,
      id_phong_ban: id_phong_ban || null,
      ten_toa: ten_toa || null,
      so_tang: so_tang || null,
      so_phong: so_phong || null,
      dien_tich: dien_tich ? parseFloat(dien_tich) : null,
      trang_thai: trang_thai || 'trong'
    });

    const phongWithRelations = await db.PhongCuaVien.findByPk(phong.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo phòng thành công',
      data: phongWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo phòng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo phòng',
      error: error.message
    });
  }
};

// Cập nhật phòng của viện
const updatePhongCuaVien = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vien,
      id_phong_ban,
      ten_toa,
      so_tang,
      so_phong,
      dien_tich,
      trang_thai
    } = req.body;

    const phong = await db.PhongCuaVien.findByPk(id);
    if (!phong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien && id_vien !== phong.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Kiểm tra phòng ban nếu có thay đổi
    if (id_phong_ban !== undefined && id_phong_ban !== phong.id_phong_ban) {
      if (id_phong_ban) {
        const phongBan = await db.PhongBan.findByPk(id_phong_ban);
        if (!phongBan) {
          return res.status(400).json({
            success: false,
            message: 'Phòng ban không tồn tại'
          });
        }
      }
    }

    await phong.update({
      id_vien: id_vien !== undefined ? id_vien : phong.id_vien,
      id_phong_ban: id_phong_ban !== undefined ? id_phong_ban : phong.id_phong_ban,
      ten_toa: ten_toa !== undefined ? ten_toa : phong.ten_toa,
      so_tang: so_tang !== undefined ? so_tang : phong.so_tang,
      so_phong: so_phong !== undefined ? so_phong : phong.so_phong,
      dien_tich: dien_tich !== undefined ? (dien_tich ? parseFloat(dien_tich) : null) : phong.dien_tich,
      trang_thai: trang_thai !== undefined ? trang_thai : phong.trang_thai
    });

    const updatedPhong = await db.PhongCuaVien.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật phòng thành công',
      data: updatedPhong
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật phòng',
      error: error.message
    });
  }
};

// Xóa phòng của viện
const deletePhongCuaVien = async (req, res) => {
  try {
    const { id } = req.params;

    const phong = await db.PhongCuaVien.findByPk(id);
    if (!phong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    await phong.destroy();

    res.json({
      success: true,
      message: 'Xóa phòng thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa phòng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa phòng',
      error: error.message
    });
  }
};

module.exports = {
  getAllPhongCuaVien,
  getPhongCuaVienById,
  createPhongCuaVien,
  updatePhongCuaVien,
  deletePhongCuaVien
};


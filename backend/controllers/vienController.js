const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả viện
const getAllVien = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.ten_vien = {
        [Op.like]: `%${search}%`
      };
    }

    const { count, rows } = await db.Vien.findAndCountAll({
      where,
      include: [
        {
          model: db.PhongBan,
          as: 'phongBans',
          required: false,
          attributes: ['id', 'ten_phong_ban']
        },
        {
          model: db.TaiKhoan,
          as: 'taiKhoans',
          required: false,
          attributes: ['id', 'username', 'ho_ten'],
          include: [{
            model: db.Quyen,
            as: 'quyen',
            attributes: ['id', 'ten_quyen']
          }]
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
    console.error('Lỗi khi lấy danh sách viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách viện',
      error: error.message
    });
  }
};

// Lấy viện theo ID
const getVienById = async (req, res) => {
  try {
    const { id } = req.params;

    const vien = await db.Vien.findByPk(id, {
      include: [
        {
          model: db.PhongBan,
          as: 'phongBans',
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'taiKhoans',
          required: false,
          include: [{
            model: db.Quyen,
            as: 'quyen',
            attributes: ['id', 'ten_quyen', 'mo_ta']
          }]
        },
        {
          model: db.DeTaiNghienCuu,
          as: 'deTaiNghienCuus',
          required: false
        },
        {
          model: db.PhongCuaVien,
          as: 'phongCuaViens',
          required: false
        },
        {
          model: db.TaiSan,
          as: 'taiSans',
          required: false
        }
      ]
    });

    if (!vien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy viện'
      });
    }

    res.json({
      success: true,
      data: vien
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin viện',
      error: error.message
    });
  }
};

// Tạo viện mới
const createVien = async (req, res) => {
  try {
    const { ten_vien } = req.body;

    if (!ten_vien) {
      return res.status(400).json({
        success: false,
        message: 'Tên viện không được để trống'
      });
    }

    // Kiểm tra tên viện đã tồn tại chưa
    const existingVien = await db.Vien.findOne({
      where: { ten_vien }
    });

    if (existingVien) {
      return res.status(400).json({
        success: false,
        message: 'Tên viện đã tồn tại'
      });
    }

    const vien = await db.Vien.create({
      ten_vien
    });

    const vienWithRelations = await db.Vien.findByPk(vien.id, {
      include: [
        {
          model: db.PhongBan,
          as: 'phongBans',
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo viện thành công',
      data: vienWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo viện',
      error: error.message
    });
  }
};

// Cập nhật viện
const updateVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_vien } = req.body;

    const vien = await db.Vien.findByPk(id);
    if (!vien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy viện'
      });
    }

    // Kiểm tra tên viện đã tồn tại chưa (nếu có thay đổi)
    if (ten_vien && ten_vien !== vien.ten_vien) {
      const existingVien = await db.Vien.findOne({
        where: { ten_vien }
      });

      if (existingVien) {
        return res.status(400).json({
          success: false,
          message: 'Tên viện đã tồn tại'
        });
      }
    }

    await vien.update({
      ten_vien: ten_vien !== undefined ? ten_vien : vien.ten_vien
    });

    const updatedVien = await db.Vien.findByPk(id, {
      include: [
        {
          model: db.PhongBan,
          as: 'phongBans',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật viện thành công',
      data: updatedVien
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật viện',
      error: error.message
    });
  }
};

// Xóa viện
const deleteVien = async (req, res) => {
  try {
    const { id } = req.params;

    const vien = await db.Vien.findByPk(id);
    if (!vien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy viện'
      });
    }

    // Kiểm tra xem viện có dữ liệu liên quan không (có thể thêm validation nếu cần)
    // Cascade delete sẽ tự động xóa các bảng liên quan

    await vien.destroy();

    res.json({
      success: true,
      message: 'Xóa viện thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa viện:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa viện',
      error: error.message
    });
  }
};

module.exports = {
  getAllVien,
  getVienById,
  createVien,
  updateVien,
  deleteVien
};


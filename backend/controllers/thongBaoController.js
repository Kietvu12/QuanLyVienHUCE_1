const db = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// Lấy danh sách thông báo của user
const getAllThongBao = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, da_doc = null } = req.query;

    const where = {
      id_nguoi_nhan: userId
    };

    if (da_doc !== null) {
      where.da_doc = da_doc === 'true';
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await db.ThongBao.findAndCountAll({
      where,
      include: [
        {
          model: db.TaiKhoan,
          as: 'nguoiGui',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ],
      order: [[sequelize.literal('created_at'), 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thông báo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Đếm số thông báo chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await db.ThongBao.count({
      where: {
        id_nguoi_nhan: userId,
        da_doc: false
      }
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Lỗi khi đếm thông báo chưa đọc:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đếm thông báo chưa đọc',
      error: error.message
    });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const thongBao = await db.ThongBao.findOne({
      where: {
        id,
        id_nguoi_nhan: userId
      }
    });

    if (!thongBao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    await thongBao.update({ da_doc: true });

    res.json({
      success: true,
      message: 'Đã đánh dấu thông báo đã đọc',
      data: thongBao
    });
  } catch (error) {
    console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu thông báo đã đọc',
      error: error.message
    });
  }
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.ThongBao.update(
      { da_doc: true },
      {
        where: {
          id_nguoi_nhan: userId,
          da_doc: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Đã đánh dấu tất cả thông báo đã đọc'
    });
  } catch (error) {
    console.error('Lỗi khi đánh dấu tất cả thông báo đã đọc:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu tất cả thông báo đã đọc',
      error: error.message
    });
  }
};

// Xóa thông báo
const deleteThongBao = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const thongBao = await db.ThongBao.findOne({
      where: {
        id,
        id_nguoi_nhan: userId
      }
    });

    if (!thongBao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    await thongBao.destroy();

    res.json({
      success: true,
      message: 'Đã xóa thông báo'
    });
  } catch (error) {
    console.error('Lỗi khi xóa thông báo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông báo',
      error: error.message
    });
  }
};

module.exports = {
  getAllThongBao,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteThongBao
};


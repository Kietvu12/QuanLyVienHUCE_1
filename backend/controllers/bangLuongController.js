const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả bảng lương (có thể filter theo id_nhan_su)
const getAllBangLuong = async (req, res) => {
  try {
    const { id_nhan_su, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_nhan_su) {
      where.id_nhan_su = id_nhan_su;
    }

    const { count, rows } = await db.BangLuong.findAndCountAll({
      where,
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'cccd'],
          include: [{
            model: db.PhongBan,
            as: 'phongBan',
            attributes: ['id', 'ten_phong_ban'],
            include: [{
              model: db.Vien,
              as: 'vien',
              attributes: ['id', 'ten_vien']
            }]
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
    console.error('Lỗi khi lấy danh sách bảng lương:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bảng lương',
      error: error.message
    });
  }
};

// Lấy bảng lương theo ID
const getBangLuongById = async (req, res) => {
  try {
    const { id } = req.params;

    const bangLuong = await db.BangLuong.findByPk(id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten', 'cccd', 'so_dien_thoai', 'email'],
          include: [{
            model: db.PhongBan,
            as: 'phongBan',
            attributes: ['id', 'ten_phong_ban'],
            include: [{
              model: db.Vien,
              as: 'vien',
              attributes: ['id', 'ten_vien']
            }]
          }]
        }
      ]
    });

    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bảng lương'
      });
    }

    res.json({
      success: true,
      data: bangLuong
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bảng lương:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin bảng lương',
      error: error.message
    });
  }
};

// Tạo bảng lương mới
const createBangLuong = async (req, res) => {
  try {
    const {
      id_nhan_su,
      luong_thuc_nhan,
      thuong,
      phat,
      thuc_nhan
    } = req.body;

    // Kiểm tra nhân sự tồn tại
    const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
    if (!nhanSu) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự không tồn tại'
      });
    }

    // Tính toán thực nhận nếu không được cung cấp
    const calculatedThucNhan = thuc_nhan !== undefined 
      ? parseFloat(thuc_nhan) 
      : (parseFloat(luong_thuc_nhan || 0) + parseFloat(thuong || 0) - parseFloat(phat || 0));

    const bangLuong = await db.BangLuong.create({
      id_nhan_su,
      luong_thuc_nhan: parseFloat(luong_thuc_nhan || 0),
      thuong: parseFloat(thuong || 0),
      phat: parseFloat(phat || 0),
      thuc_nhan: calculatedThucNhan
    });

    const bangLuongWithNhanSu = await db.BangLuong.findByPk(bangLuong.id, {
      include: [{
        model: db.NhanSu,
        as: 'nhanSu',
        attributes: ['id', 'ho_ten', 'cccd']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bảng lương thành công',
      data: bangLuongWithNhanSu
    });
  } catch (error) {
    console.error('Lỗi khi tạo bảng lương:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bảng lương',
      error: error.message
    });
  }
};

// Cập nhật bảng lương
const updateBangLuong = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_nhan_su,
      luong_thuc_nhan,
      thuong,
      phat,
      thuc_nhan
    } = req.body;

    const bangLuong = await db.BangLuong.findByPk(id);
    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bảng lương'
      });
    }

    // Kiểm tra nhân sự nếu có thay đổi
    if (id_nhan_su && id_nhan_su !== bangLuong.id_nhan_su) {
      const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
      if (!nhanSu) {
        return res.status(400).json({
          success: false,
          message: 'Nhân sự không tồn tại'
        });
      }
    }

    // Tính toán thực nhận nếu không được cung cấp
    const finalLuongThucNhan = luong_thuc_nhan !== undefined ? parseFloat(luong_thuc_nhan) : bangLuong.luong_thuc_nhan;
    const finalThuong = thuong !== undefined ? parseFloat(thuong) : bangLuong.thuong;
    const finalPhat = phat !== undefined ? parseFloat(phat) : bangLuong.phat;
    const calculatedThucNhan = thuc_nhan !== undefined 
      ? parseFloat(thuc_nhan) 
      : (finalLuongThucNhan + finalThuong - finalPhat);

    await bangLuong.update({
      id_nhan_su: id_nhan_su !== undefined ? id_nhan_su : bangLuong.id_nhan_su,
      luong_thuc_nhan: finalLuongThucNhan,
      thuong: finalThuong,
      phat: finalPhat,
      thuc_nhan: calculatedThucNhan
    });

    const updatedBangLuong = await db.BangLuong.findByPk(id, {
      include: [{
        model: db.NhanSu,
        as: 'nhanSu',
        attributes: ['id', 'ho_ten', 'cccd']
      }]
    });

    res.json({
      success: true,
      message: 'Cập nhật bảng lương thành công',
      data: updatedBangLuong
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật bảng lương:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bảng lương',
      error: error.message
    });
  }
};

// Xóa bảng lương
const deleteBangLuong = async (req, res) => {
  try {
    const { id } = req.params;

    const bangLuong = await db.BangLuong.findByPk(id);
    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bảng lương'
      });
    }

    await bangLuong.destroy();

    res.json({
      success: true,
      message: 'Xóa bảng lương thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa bảng lương:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bảng lương',
      error: error.message
    });
  }
};

module.exports = {
  getAllBangLuong,
  getBangLuongById,
  createBangLuong,
  updateBangLuong,
  deleteBangLuong
};


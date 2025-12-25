const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả hợp đồng lao động (có thể filter theo id_nhan_su)
const getAllHopDongLaoDong = async (req, res) => {
  try {
    const { id_nhan_su, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_nhan_su) {
      where.id_nhan_su = id_nhan_su;
    }

    const { count, rows } = await db.HopDongLaoDong.findAndCountAll({
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
    console.error('Lỗi khi lấy danh sách hợp đồng lao động:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hợp đồng lao động',
      error: error.message
    });
  }
};

// Lấy hợp đồng lao động theo ID
const getHopDongLaoDongById = async (req, res) => {
  try {
    const { id } = req.params;

    const hopDong = await db.HopDongLaoDong.findByPk(id, {
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

    if (!hopDong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng lao động'
      });
    }

    res.json({
      success: true,
      data: hopDong
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin hợp đồng lao động:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin hợp đồng lao động',
      error: error.message
    });
  }
};

// Tạo hợp đồng lao động mới
const createHopDongLaoDong = async (req, res) => {
  try {
    const {
      id_nhan_su,
      ma_hop_dong,
      ngay_tao_hop_dong_lao_dong,
      luong_theo_hop_dong,
      ngay_ki_hop_dong,
      ngay_ket_thuc_hop_dong_lao_dong,
      duong_dan_tai_lieu
    } = req.body;

    // Kiểm tra nhân sự tồn tại
    const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
    if (!nhanSu) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự không tồn tại'
      });
    }

    // Kiểm tra mã hợp đồng đã tồn tại chưa
    const existingHopDong = await db.HopDongLaoDong.findOne({
      where: { ma_hop_dong }
    });

    if (existingHopDong) {
      return res.status(400).json({
        success: false,
        message: 'Mã hợp đồng đã tồn tại'
      });
    }

    const hopDong = await db.HopDongLaoDong.create({
      id_nhan_su,
      ma_hop_dong,
      ngay_tao_hop_dong_lao_dong,
      luong_theo_hop_dong,
      ngay_ki_hop_dong,
      ngay_ket_thuc_hop_dong_lao_dong: ngay_ket_thuc_hop_dong_lao_dong || null
    });

    const hopDongWithNhanSu = await db.HopDongLaoDong.findByPk(hopDong.id, {
      include: [{
        model: db.NhanSu,
        as: 'nhanSu',
        attributes: ['id', 'ho_ten', 'cccd']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo hợp đồng lao động thành công',
      data: hopDongWithNhanSu
    });
  } catch (error) {
    console.error('Lỗi khi tạo hợp đồng lao động:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo hợp đồng lao động',
      error: error.message
    });
  }
};

// Cập nhật hợp đồng lao động
const updateHopDongLaoDong = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_nhan_su,
      ma_hop_dong,
      ngay_tao_hop_dong_lao_dong,
      luong_theo_hop_dong,
      ngay_ki_hop_dong,
      ngay_ket_thuc_hop_dong_lao_dong
    } = req.body;

    const hopDong = await db.HopDongLaoDong.findByPk(id);
    if (!hopDong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng lao động'
      });
    }

    // Kiểm tra nhân sự nếu có thay đổi
    if (id_nhan_su && id_nhan_su !== hopDong.id_nhan_su) {
      const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
      if (!nhanSu) {
        return res.status(400).json({
          success: false,
          message: 'Nhân sự không tồn tại'
        });
      }
    }

    // Kiểm tra mã hợp đồng nếu có thay đổi
    if (ma_hop_dong && ma_hop_dong !== hopDong.ma_hop_dong) {
      const existingHopDong = await db.HopDongLaoDong.findOne({
        where: { ma_hop_dong }
      });

      if (existingHopDong) {
        return res.status(400).json({
          success: false,
          message: 'Mã hợp đồng đã tồn tại'
        });
      }
    }

    await hopDong.update({
      id_nhan_su: id_nhan_su !== undefined ? id_nhan_su : hopDong.id_nhan_su,
      ma_hop_dong: ma_hop_dong !== undefined ? ma_hop_dong : hopDong.ma_hop_dong,
      ngay_tao_hop_dong_lao_dong: ngay_tao_hop_dong_lao_dong !== undefined ? ngay_tao_hop_dong_lao_dong : hopDong.ngay_tao_hop_dong_lao_dong,
      luong_theo_hop_dong: luong_theo_hop_dong !== undefined ? luong_theo_hop_dong : hopDong.luong_theo_hop_dong,
      ngay_ki_hop_dong: ngay_ki_hop_dong !== undefined ? ngay_ki_hop_dong : hopDong.ngay_ki_hop_dong,
      ngay_ket_thuc_hop_dong_lao_dong: ngay_ket_thuc_hop_dong_lao_dong !== undefined ? ngay_ket_thuc_hop_dong_lao_dong : hopDong.ngay_ket_thuc_hop_dong_lao_dong
    });

    const updatedHopDong = await db.HopDongLaoDong.findByPk(id, {
      include: [{
        model: db.NhanSu,
        as: 'nhanSu',
        attributes: ['id', 'ho_ten', 'cccd']
      }]
    });

    res.json({
      success: true,
      message: 'Cập nhật hợp đồng lao động thành công',
      data: updatedHopDong
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật hợp đồng lao động:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật hợp đồng lao động',
      error: error.message
    });
  }
};

// Xóa hợp đồng lao động
const deleteHopDongLaoDong = async (req, res) => {
  try {
    const { id } = req.params;

    const hopDong = await db.HopDongLaoDong.findByPk(id);
    if (!hopDong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng lao động'
      });
    }

    await hopDong.destroy();

    res.json({
      success: true,
      message: 'Xóa hợp đồng lao động thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa hợp đồng lao động:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa hợp đồng lao động',
      error: error.message
    });
  }
};

module.exports = {
  getAllHopDongLaoDong,
  getHopDongLaoDongById,
  createHopDongLaoDong,
  updateHopDongLaoDong,
  deleteHopDongLaoDong
};


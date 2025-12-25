const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả đề tài nghiên cứu (có thể filter theo id_vien, trang_thai)
const getAllDeTaiNghienCuu = async (req, res) => {
  try {
    const { id_vien, trang_thai, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (trang_thai) where.trang_thai = trang_thai;

    const { count, rows } = await db.DeTaiNghienCuu.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.NhanSuDeTai,
          as: 'nhanSuDeTais',
          required: false,
          include: [{
            model: db.NhanSu,
            as: 'nhanSu',
            attributes: ['id', 'ho_ten'],
            required: false
          }]
        },
        {
          model: db.TaiLieuDeTai,
          as: 'taiLieuDeTais',
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
    console.error('Lỗi khi lấy danh sách đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đề tài nghiên cứu',
      error: error.message
    });
  }
};

// Lấy đề tài nghiên cứu theo ID
const getDeTaiNghienCuuById = async (req, res) => {
  try {
    const { id } = req.params;

    const deTai = await db.DeTaiNghienCuu.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.NhanSuDeTai,
          as: 'nhanSuDeTais',
          required: false,
          include: [{
            model: db.NhanSu,
            as: 'nhanSu',
            attributes: ['id', 'ho_ten', 'cccd'],
            required: false
          }]
        },
        {
          model: db.TaiLieuDeTai,
          as: 'taiLieuDeTais',
          required: false
        },
        {
          model: db.DoanhThu,
          as: 'doanhThus',
          required: false
        },
        {
          model: db.ChiPhi,
          as: 'chiPhis',
          required: false
        }
      ]
    });

    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    res.json({
      success: true,
      data: deTai
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đề tài nghiên cứu',
      error: error.message
    });
  }
};

// Tạo đề tài nghiên cứu mới
const createDeTaiNghienCuu = async (req, res) => {
  try {
    const {
      id_vien,
      ten_de_tai,
      linh_vuc,
      so_tien,
      trang_thai,
      tien_do,
      ngay_bat_dau,
      ngay_hoan_thanh,
      danh_gia
    } = req.body;

    // Kiểm tra viện tồn tại
    const vien = await db.Vien.findByPk(id_vien);
    if (!vien) {
      return res.status(400).json({
        success: false,
        message: 'Viện không tồn tại'
      });
    }

    const deTai = await db.DeTaiNghienCuu.create({
      id_vien,
      ten_de_tai,
      linh_vuc: linh_vuc || null,
      so_tien: parseFloat(so_tien || 0),
      trang_thai: trang_thai || 'dang_thuc_hien',
      tien_do: tien_do !== undefined ? parseInt(tien_do) : 0,
      ngay_bat_dau: ngay_bat_dau || null,
      ngay_hoan_thanh: ngay_hoan_thanh || null,
      danh_gia: danh_gia || null
    });

    const deTaiWithRelations = await db.DeTaiNghienCuu.findByPk(deTai.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo đề tài nghiên cứu thành công',
      data: deTaiWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đề tài nghiên cứu',
      error: error.message
    });
  }
};

// Cập nhật đề tài nghiên cứu
const updateDeTaiNghienCuu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vien,
      ten_de_tai,
      linh_vuc,
      so_tien,
      trang_thai,
      tien_do,
      ngay_bat_dau,
      ngay_hoan_thanh,
      danh_gia
    } = req.body;

    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    // Kiểm tra: Khi cập nhật trạng thái sang hoàn thành, tiến độ phải đạt 100%
    if (trang_thai === 'hoan_thanh') {
      const finalTienDo = tien_do !== undefined ? parseInt(tien_do) : deTai.tien_do;
      if (finalTienDo !== 100) {
        return res.status(400).json({
          success: false,
          message: 'Khi cập nhật trạng thái sang hoàn thành, tiến độ phải đạt 100%'
        });
      }
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien && id_vien !== deTai.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    await deTai.update({
      id_vien: id_vien !== undefined ? id_vien : deTai.id_vien,
      ten_de_tai: ten_de_tai !== undefined ? ten_de_tai : deTai.ten_de_tai,
      linh_vuc: linh_vuc !== undefined ? linh_vuc : deTai.linh_vuc,
      so_tien: so_tien !== undefined ? parseFloat(so_tien) : deTai.so_tien,
      trang_thai: trang_thai !== undefined ? trang_thai : deTai.trang_thai,
      tien_do: tien_do !== undefined ? parseInt(tien_do) : deTai.tien_do,
      ngay_bat_dau: ngay_bat_dau !== undefined ? ngay_bat_dau : deTai.ngay_bat_dau,
      ngay_hoan_thanh: ngay_hoan_thanh !== undefined ? ngay_hoan_thanh : deTai.ngay_hoan_thanh,
      danh_gia: danh_gia !== undefined ? danh_gia : deTai.danh_gia
    });

    const updatedDeTai = await db.DeTaiNghienCuu.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật đề tài nghiên cứu thành công',
      data: updatedDeTai
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật đề tài nghiên cứu',
      error: error.message
    });
  }
};

// Xóa đề tài nghiên cứu
const deleteDeTaiNghienCuu = async (req, res) => {
  try {
    const { id } = req.params;

    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    await deTai.destroy();

    res.json({
      success: true,
      message: 'Xóa đề tài nghiên cứu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa đề tài nghiên cứu',
      error: error.message
    });
  }
};

module.exports = {
  getAllDeTaiNghienCuu,
  getDeTaiNghienCuuById,
  createDeTaiNghienCuu,
  updateDeTaiNghienCuu,
  deleteDeTaiNghienCuu
};


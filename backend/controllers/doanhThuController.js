const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả doanh thu (có thể filter theo id_vien, id_de_tai, trang_thai)
const getAllDoanhThu = async (req, res) => {
  try {
    const { id_vien, id_de_tai, trang_thai, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (id_de_tai) where.id_de_tai = id_de_tai;
    if (trang_thai) where.trang_thai = trang_thai;

    const { count, rows } = await db.DoanhThu.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.DeTaiNghienCuu,
          as: 'deTaiNghienCuu',
          attributes: ['id', 'ten_de_tai'],
          required: false
        },
        {
          model: db.MediaDoanhThu,
          as: 'mediaDoanhThus',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['ngay_tao', 'DESC']]
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
    console.error('Lỗi khi lấy danh sách doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách doanh thu',
      error: error.message
    });
  }
};

// Lấy doanh thu theo ID
const getDoanhThuById = async (req, res) => {
  try {
    const { id } = req.params;

    const doanhThu = await db.DoanhThu.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.DeTaiNghienCuu,
          as: 'deTaiNghienCuu',
          attributes: ['id', 'ten_de_tai'],
          required: false
        },
        {
          model: db.MediaDoanhThu,
          as: 'mediaDoanhThus',
          required: false
        }
      ]
    });

    if (!doanhThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy doanh thu'
      });
    }

    res.json({
      success: true,
      data: doanhThu
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin doanh thu',
      error: error.message
    });
  }
};

// Tạo doanh thu mới
const createDoanhThu = async (req, res) => {
  try {
    const {
      id_vien,
      tieu_de,
      noi_dung,
      so_tien,
      id_de_tai,
      trang_thai,
      ngay_nhan_tien
    } = req.body;

    // Kiểm tra viện tồn tại
    const vien = await db.Vien.findByPk(id_vien);
    if (!vien) {
      return res.status(400).json({
        success: false,
        message: 'Viện không tồn tại'
      });
    }

    // Kiểm tra đề tài nếu có
    if (id_de_tai) {
      const deTai = await db.DeTaiNghienCuu.findByPk(id_de_tai);
      if (!deTai) {
        return res.status(400).json({
          success: false,
          message: 'Đề tài không tồn tại'
        });
      }
    }

    const doanhThu = await db.DoanhThu.create({
      id_vien,
      tieu_de,
      noi_dung: noi_dung || null,
      so_tien: parseFloat(so_tien),
      id_de_tai: id_de_tai || null,
      trang_thai: trang_thai || 'chua_nhan',
      ngay_nhan_tien: ngay_nhan_tien || null
    });

    const doanhThuWithRelations = await db.DoanhThu.findByPk(doanhThu.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.DeTaiNghienCuu,
          as: 'deTaiNghienCuu',
          attributes: ['id', 'ten_de_tai'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo doanh thu thành công',
      data: doanhThuWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo doanh thu',
      error: error.message
    });
  }
};

// Cập nhật doanh thu
const updateDoanhThu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vien,
      tieu_de,
      noi_dung,
      so_tien,
      id_de_tai,
      trang_thai,
      ngay_nhan_tien
    } = req.body;

    const doanhThu = await db.DoanhThu.findByPk(id);
    if (!doanhThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy doanh thu'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien && id_vien !== doanhThu.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Kiểm tra đề tài nếu có thay đổi
    if (id_de_tai !== undefined && id_de_tai !== doanhThu.id_de_tai) {
      if (id_de_tai) {
        const deTai = await db.DeTaiNghienCuu.findByPk(id_de_tai);
        if (!deTai) {
          return res.status(400).json({
            success: false,
            message: 'Đề tài không tồn tại'
          });
        }
      }
    }

    await doanhThu.update({
      id_vien: id_vien !== undefined ? id_vien : doanhThu.id_vien,
      tieu_de: tieu_de !== undefined ? tieu_de : doanhThu.tieu_de,
      noi_dung: noi_dung !== undefined ? noi_dung : doanhThu.noi_dung,
      so_tien: so_tien !== undefined ? parseFloat(so_tien) : doanhThu.so_tien,
      id_de_tai: id_de_tai !== undefined ? id_de_tai : doanhThu.id_de_tai,
      trang_thai: trang_thai !== undefined ? trang_thai : doanhThu.trang_thai,
      ngay_nhan_tien: ngay_nhan_tien !== undefined ? ngay_nhan_tien : doanhThu.ngay_nhan_tien
    });

    const updatedDoanhThu = await db.DoanhThu.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.DeTaiNghienCuu,
          as: 'deTaiNghienCuu',
          attributes: ['id', 'ten_de_tai'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật doanh thu thành công',
      data: updatedDoanhThu
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật doanh thu',
      error: error.message
    });
  }
};

// Xóa doanh thu
const deleteDoanhThu = async (req, res) => {
  try {
    const { id } = req.params;

    const doanhThu = await db.DoanhThu.findByPk(id);
    if (!doanhThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy doanh thu'
      });
    }

    await doanhThu.destroy();

    res.json({
      success: true,
      message: 'Xóa doanh thu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa doanh thu',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoanhThu,
  getDoanhThuById,
  createDoanhThu,
  updateDoanhThu,
  deleteDoanhThu
};


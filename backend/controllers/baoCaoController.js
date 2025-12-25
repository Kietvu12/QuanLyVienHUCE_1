const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả báo cáo (có thể filter theo id_vien, trang_thai, id_nguoi_tao)
const getAllBaoCao = async (req, res) => {
  try {
    const { id_vien, trang_thai, id_nguoi_tao, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (trang_thai) where.trang_thai = trang_thai;
    if (id_nguoi_tao) where.id_nguoi_tao = id_nguoi_tao;

    const { count, rows } = await db.BaoCao.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
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
    console.error('Lỗi khi lấy danh sách báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách báo cáo',
      error: error.message
    });
  }
};

// Lấy báo cáo theo ID
const getBaoCaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const baoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten', 'email'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten', 'email'],
          required: false
        }
      ]
    });

    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    res.json({
      success: true,
      data: baoCao
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin báo cáo',
      error: error.message
    });
  }
};

// Tạo báo cáo mới
const createBaoCao = async (req, res) => {
  try {
    const {
      tieu_de,
      id_vien,
      id_nguoi_tao,
      duong_dan_tai_lieu
    } = req.body;

    // Kiểm tra người tạo tồn tại
    const nguoiTao = await db.TaiKhoan.findByPk(id_nguoi_tao);
    if (!nguoiTao) {
      return res.status(400).json({
        success: false,
        message: 'Người tạo không tồn tại'
      });
    }

    // Kiểm tra viện nếu có
    if (id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    const baoCao = await db.BaoCao.create({
      tieu_de,
      id_vien: id_vien || null,
      id_nguoi_tao,
      id_nguoi_phe_duyet: null,
      duong_dan_tai_lieu: duong_dan_tai_lieu || null,
      trang_thai: 'cho_phe_duyet',
      ngay_gui: null
    });

    const baoCaoWithRelations = await db.BaoCao.findByPk(baoCao.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo báo cáo thành công',
      data: baoCaoWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo báo cáo',
      error: error.message
    });
  }
};

// Cập nhật báo cáo
const updateBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tieu_de,
      id_vien,
      duong_dan_tai_lieu
    } = req.body;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Chỉ cho phép sửa khi chưa được phê duyệt
    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Không thể sửa báo cáo đã được phê duyệt hoặc từ chối'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien !== undefined && id_vien !== baoCao.id_vien) {
      if (id_vien) {
        const vien = await db.Vien.findByPk(id_vien);
        if (!vien) {
          return res.status(400).json({
            success: false,
            message: 'Viện không tồn tại'
          });
        }
      }
    }

    await baoCao.update({
      tieu_de: tieu_de !== undefined ? tieu_de : baoCao.tieu_de,
      id_vien: id_vien !== undefined ? id_vien : baoCao.id_vien,
      duong_dan_tai_lieu: duong_dan_tai_lieu !== undefined ? duong_dan_tai_lieu : baoCao.duong_dan_tai_lieu
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật báo cáo',
      error: error.message
    });
  }
};

// Xóa báo cáo
const deleteBaoCao = async (req, res) => {
  try {
    const { id } = req.params;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Chỉ cho phép xóa khi chưa được phê duyệt
    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa báo cáo đã được phê duyệt hoặc từ chối'
      });
    }

    await baoCao.destroy();

    res.json({
      success: true,
      message: 'Xóa báo cáo thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa báo cáo',
      error: error.message
    });
  }
};

// Gửi báo cáo (cập nhật ngay_gui và giữ nguyên trạng thái cho_phe_duyet)
const guiBaoCao = async (req, res) => {
  try {
    const { id } = req.params;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Báo cáo đã được gửi hoặc xử lý rồi'
      });
    }

    await baoCao.update({
      ngay_gui: new Date()
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Gửi báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi báo cáo',
      error: error.message
    });
  }
};

// Phê duyệt báo cáo
const pheDuyetBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nguoi_phe_duyet } = req.body;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Báo cáo không ở trạng thái chờ phê duyệt'
      });
    }

    // Kiểm tra người phê duyệt
    const nguoiPheDuyet = await db.TaiKhoan.findByPk(id_nguoi_phe_duyet);
    if (!nguoiPheDuyet) {
      return res.status(400).json({
        success: false,
        message: 'Người phê duyệt không tồn tại'
      });
    }

    await baoCao.update({
      trang_thai: 'da_phe_duyet',
      id_nguoi_phe_duyet: id_nguoi_phe_duyet
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Phê duyệt báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi phê duyệt báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi phê duyệt báo cáo',
      error: error.message
    });
  }
};

// Từ chối báo cáo
const tuChoiBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nguoi_phe_duyet } = req.body;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Báo cáo không ở trạng thái chờ phê duyệt'
      });
    }

    // Kiểm tra người từ chối
    const nguoiTuChoi = await db.TaiKhoan.findByPk(id_nguoi_phe_duyet);
    if (!nguoiTuChoi) {
      return res.status(400).json({
        success: false,
        message: 'Người từ chối không tồn tại'
      });
    }

    await baoCao.update({
      trang_thai: 'tu_choi',
      id_nguoi_phe_duyet: id_nguoi_phe_duyet
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Từ chối báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi từ chối báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi từ chối báo cáo',
      error: error.message
    });
  }
};

module.exports = {
  getAllBaoCao,
  getBaoCaoById,
  createBaoCao,
  updateBaoCao,
  deleteBaoCao,
  guiBaoCao,
  pheDuyetBaoCao,
  tuChoiBaoCao
};


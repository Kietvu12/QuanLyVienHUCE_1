const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả chi phí (có thể filter theo id_vien, id_de_tai, trang_thai)
const getAllChiPhi = async (req, res) => {
  try {
    const { id_vien, id_de_tai, trang_thai, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (id_de_tai) where.id_de_tai = id_de_tai;
    if (trang_thai) where.trang_thai = trang_thai;

    const { count, rows } = await db.ChiPhi.findAndCountAll({
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
          model: db.MediaChiPhi,
          as: 'mediaChiPhis',
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
    console.error('Lỗi khi lấy danh sách chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách chi phí',
      error: error.message
    });
  }
};

// Lấy chi phí theo ID
const getChiPhiById = async (req, res) => {
  try {
    const { id } = req.params;

    const chiPhi = await db.ChiPhi.findByPk(id, {
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
          model: db.MediaChiPhi,
          as: 'mediaChiPhis',
          required: false
        }
      ]
    });

    if (!chiPhi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    res.json({
      success: true,
      data: chiPhi
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin chi phí',
      error: error.message
    });
  }
};

// Tạo chi phí mới
const createChiPhi = async (req, res) => {
  try {
    const {
      id_vien,
      tieu_de,
      noi_dung,
      so_tien,
      id_de_tai,
      trang_thai,
      ngay_tat_toan
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

    const chiPhi = await db.ChiPhi.create({
      id_vien,
      tieu_de,
      noi_dung: noi_dung || null,
      so_tien: parseFloat(so_tien),
      id_de_tai: id_de_tai || null,
      trang_thai: trang_thai || 'chua_tat_toan',
      ngay_tat_toan: ngay_tat_toan || null
    });

    const chiPhiWithRelations = await db.ChiPhi.findByPk(chiPhi.id, {
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
      message: 'Tạo chi phí thành công',
      data: chiPhiWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo chi phí',
      error: error.message
    });
  }
};

// Cập nhật chi phí
const updateChiPhi = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vien,
      tieu_de,
      noi_dung,
      so_tien,
      id_de_tai,
      trang_thai,
      ngay_tat_toan
    } = req.body;

    const chiPhi = await db.ChiPhi.findByPk(id);
    if (!chiPhi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien && id_vien !== chiPhi.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Kiểm tra đề tài nếu có thay đổi
    if (id_de_tai !== undefined && id_de_tai !== chiPhi.id_de_tai) {
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

    await chiPhi.update({
      id_vien: id_vien !== undefined ? id_vien : chiPhi.id_vien,
      tieu_de: tieu_de !== undefined ? tieu_de : chiPhi.tieu_de,
      noi_dung: noi_dung !== undefined ? noi_dung : chiPhi.noi_dung,
      so_tien: so_tien !== undefined ? parseFloat(so_tien) : chiPhi.so_tien,
      id_de_tai: id_de_tai !== undefined ? id_de_tai : chiPhi.id_de_tai,
      trang_thai: trang_thai !== undefined ? trang_thai : chiPhi.trang_thai,
      ngay_tat_toan: ngay_tat_toan !== undefined ? ngay_tat_toan : chiPhi.ngay_tat_toan
    });

    const updatedChiPhi = await db.ChiPhi.findByPk(id, {
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
      message: 'Cập nhật chi phí thành công',
      data: updatedChiPhi
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật chi phí',
      error: error.message
    });
  }
};

// Xóa chi phí
const deleteChiPhi = async (req, res) => {
  try {
    const { id } = req.params;

    const chiPhi = await db.ChiPhi.findByPk(id);
    if (!chiPhi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    await chiPhi.destroy();

    res.json({
      success: true,
      message: 'Xóa chi phí thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa chi phí',
      error: error.message
    });
  }
};

// Upload media cho chi phí
const uploadMediaChiPhi = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    // Kiểm tra chi phí tồn tại
    const chiPhi = await db.ChiPhi.findByPk(id);
    if (!chiPhi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất một file'
      });
    }

    const mediaChiPhis = [];
    for (const file of files) {
      const media = await db.MediaChiPhi.create({
        id_chi_phi: id,
        duong_dan_tai_lieu: `/uploads/media-chi-phi/${file.filename}`
      });
      mediaChiPhis.push(media);
    }

    res.status(201).json({
      success: true,
      message: 'Upload media thành công',
      data: mediaChiPhis
    });
  } catch (error) {
    console.error('Lỗi khi upload media chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload media chi phí',
      error: error.message
    });
  }
};

// Xóa media chi phí
const removeMediaChiPhi = async (req, res) => {
  try {
    const { id, mediaId } = req.params;

    // Kiểm tra chi phí tồn tại
    const chiPhi = await db.ChiPhi.findByPk(id);
    if (!chiPhi) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    // Kiểm tra media tồn tại
    const media = await db.MediaChiPhi.findByPk(mediaId);
    if (!media || media.id_chi_phi !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy media'
      });
    }

    // Xóa file vật lý nếu có
    if (media.duong_dan_tai_lieu) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', media.duong_dan_tai_lieu);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await media.destroy();

    res.json({
      success: true,
      message: 'Xóa media thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa media chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa media chi phí',
      error: error.message
    });
  }
};

module.exports = {
  getAllChiPhi,
  getChiPhiById,
  createChiPhi,
  updateChiPhi,
  deleteChiPhi,
  uploadMediaChiPhi,
  removeMediaChiPhi
};


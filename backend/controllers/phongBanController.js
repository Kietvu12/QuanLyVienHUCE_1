const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả phòng ban (có thể filter theo id_vien)
const getAllPhongBan = async (req, res) => {
  try {
    const { id_vien, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (search) {
      where.ten_phong_ban = {
        [Op.like]: `%${search}%`
      };
    }

    const { count, rows } = await db.PhongBan.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.NhanSu,
          as: 'nhanSus',
          attributes: ['id'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Đếm số nhân sự cho mỗi phòng ban
    const phongBansWithCount = rows.map(phongBan => {
      const phongBanData = phongBan.toJSON();
      phongBanData.so_nhan_su = phongBanData.nhanSus ? phongBanData.nhanSus.length : 0;
      delete phongBanData.nhanSus; // Xóa mảng nhanSus để giảm dữ liệu
      return phongBanData;
    });

    res.json({
      success: true,
      data: phongBansWithCount,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phòng ban',
      error: error.message
    });
  }
};

// Lấy phòng ban theo ID
const getPhongBanById = async (req, res) => {
  try {
    const { id } = req.params;

    const phongBan = await db.PhongBan.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.NhanSu,
          as: 'nhanSus',
          attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai'],
          required: false
        },
        {
          model: db.PhongCuaVien,
          as: 'phongCuaViens',
          attributes: ['id', 'ten_toa', 'so_tang', 'so_phong'],
          required: false
        }
      ]
    });

    if (!phongBan) {
      return res.status(404).json({
        success: false,
        message: 'Phòng ban không tồn tại'
      });
    }

    res.json({
      success: true,
      data: phongBan
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin phòng ban',
      error: error.message
    });
  }
};

// Tạo phòng ban mới
const createPhongBan = async (req, res) => {
  try {
    const { id_vien, ten_phong_ban } = req.body;

    // Validation
    if (!id_vien || !ten_phong_ban) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin (id_vien, ten_phong_ban)'
      });
    }

    // Kiểm tra viện tồn tại
    const vien = await db.Vien.findByPk(id_vien);
    if (!vien) {
      return res.status(400).json({
        success: false,
        message: 'Viện không tồn tại'
      });
    }

    // Kiểm tra tên phòng ban đã tồn tại trong viện chưa
    const existingPhongBan = await db.PhongBan.findOne({
      where: {
        id_vien,
        ten_phong_ban
      }
    });

    if (existingPhongBan) {
      return res.status(400).json({
        success: false,
        message: 'Tên phòng ban đã tồn tại trong viện này'
      });
    }

    const phongBan = await db.PhongBan.create({
      id_vien,
      ten_phong_ban
    });

    const phongBanWithRelations = await db.PhongBan.findByPk(phongBan.id, {
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
      message: 'Tạo phòng ban thành công',
      data: phongBanWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo phòng ban',
      error: error.message
    });
  }
};

// Cập nhật phòng ban
const updatePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_vien, ten_phong_ban } = req.body;

    const phongBan = await db.PhongBan.findByPk(id);
    if (!phongBan) {
      return res.status(404).json({
        success: false,
        message: 'Phòng ban không tồn tại'
      });
    }

    // Nếu thay đổi id_vien, kiểm tra viện tồn tại
    if (id_vien && id_vien !== phongBan.id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Nếu thay đổi tên phòng ban, kiểm tra trùng lặp
    if (ten_phong_ban && ten_phong_ban !== phongBan.ten_phong_ban) {
      const finalIdVien = id_vien || phongBan.id_vien;
      const existingPhongBan = await db.PhongBan.findOne({
        where: {
          id_vien: finalIdVien,
          ten_phong_ban,
          id: { [Op.ne]: id }
        }
      });

      if (existingPhongBan) {
        return res.status(400).json({
          success: false,
          message: 'Tên phòng ban đã tồn tại trong viện này'
        });
      }
    }

    await phongBan.update({
      id_vien: id_vien || phongBan.id_vien,
      ten_phong_ban: ten_phong_ban || phongBan.ten_phong_ban
    });

    const updatedPhongBan = await db.PhongBan.findByPk(id, {
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
      message: 'Cập nhật phòng ban thành công',
      data: updatedPhongBan
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật phòng ban',
      error: error.message
    });
  }
};

// Xóa phòng ban
const deletePhongBan = async (req, res) => {
  try {
    const { id } = req.params;

    const phongBan = await db.PhongBan.findByPk(id);
    if (!phongBan) {
      return res.status(404).json({
        success: false,
        message: 'Phòng ban không tồn tại'
      });
    }

    // Kiểm tra xem phòng ban có nhân sự không
    const nhanSuCount = await db.NhanSu.count({
      where: { id_phong_ban: id }
    });

    if (nhanSuCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa phòng ban vì còn ${nhanSuCount} nhân sự. Vui lòng chuyển nhân sự sang phòng ban khác trước.`
      });
    }

    await phongBan.destroy();

    res.json({
      success: true,
      message: 'Xóa phòng ban thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa phòng ban',
      error: error.message
    });
  }
};

module.exports = {
  getAllPhongBan,
  getPhongBanById,
  createPhongBan,
  updatePhongBan,
  deletePhongBan
};


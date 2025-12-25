const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả nhân sự (có thể filter theo id_vien, id_phong_ban)
const getAllNhanSu = async (req, res) => {
  try {
    const { id_vien, id_phong_ban, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_phong_ban) {
      where.id_phong_ban = id_phong_ban;
    }

    // Nếu có id_vien, lấy danh sách phòng ban thuộc viện trước
    if (id_vien) {
      const phongBans = await db.PhongBan.findAll({
        where: { id_vien },
        attributes: ['id']
      });
      const phongBanIds = phongBans.map(pb => pb.id);
      if (phongBanIds.length === 0) {
        // Nếu không có phòng ban nào, trả về danh sách rỗng
        return res.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 0
          }
        });
      }
      // Filter nhân sự theo danh sách phòng ban
      where.id_phong_ban = { [Op.in]: phongBanIds };
    }

    const include = [
      {
        model: db.PhongBan,
        as: 'phongBan',
        attributes: ['id', 'ten_phong_ban'],
        include: [{
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        }]
      },
      {
        model: db.BaoHiemYTe,
        as: 'baoHiemYTe',
        required: false
      },
      {
        model: db.ThongTinXe,
        as: 'thongTinXes',
        required: false
      },
      {
        model: db.MediaNhanSu,
        as: 'mediaNhanSu',
        required: false
      },
      {
        model: db.HopDongLaoDong,
        as: 'hopDongLaoDongs',
        required: false,
        order: [['created_at', 'DESC']]
      },
      {
        model: db.BangLuong,
        as: 'bangLuongs',
        required: false
      }
    ];

    const { count, rows } = await db.NhanSu.findAndCountAll({
      where,
      include,
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
    console.error('Lỗi khi lấy danh sách nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nhân sự',
      error: error.message
    });
  }
};

// Lấy nhân sự theo ID (với tất cả thông tin liên quan)
const getNhanSuById = async (req, res) => {
  try {
    const { id } = req.params;

    const nhanSu = await db.NhanSu.findByPk(id, {
      include: [
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban'],
          include: [{
            model: db.Vien,
            as: 'vien',
            attributes: ['id', 'ten_vien']
          }]
        },
        {
          model: db.BaoHiemYTe,
          as: 'baoHiemYTe',
          required: false
        },
        {
          model: db.ThongTinXe,
          as: 'thongTinXes',
          required: false
        },
        {
          model: db.MediaNhanSu,
          as: 'mediaNhanSu',
          required: false
        },
        {
          model: db.HopDongLaoDong,
          as: 'hopDongLaoDongs',
          required: false,
          order: [['created_at', 'DESC']]
        },
        {
          model: db.BangLuong,
          as: 'bangLuongs',
          required: false,
          order: [['created_at', 'DESC']]
        },
        {
          model: db.NhanSuDeTai,
          as: 'nhanSuDeTais',
          required: false,
          include: [{
            model: db.DeTaiNghienCuu,
            as: 'deTaiNghienCuu',
            attributes: ['id', 'ten_de_tai']
          }]
        }
      ]
    });

    if (!nhanSu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân sự'
      });
    }

    res.json({
      success: true,
      data: nhanSu
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin nhân sự',
      error: error.message
    });
  }
};

// Tạo nhân sự mới
const createNhanSu = async (req, res) => {
  try {
    const {
      id_phong_ban,
      ho_ten,
      dia_chi_tam_tru,
      dia_chi_thuong_tru,
      cccd,
      bang_cap,
      so_dien_thoai,
      email,
      nguoi_than_lien_he,
      ngay_bat_dau_lam,
      ngay_ket_thuc_lam_viec
    } = req.body;

    // Kiểm tra phòng ban tồn tại
    const phongBan = await db.PhongBan.findByPk(id_phong_ban);
    if (!phongBan) {
      return res.status(400).json({
        success: false,
        message: 'Phòng ban không tồn tại'
      });
    }

    const nhanSu = await db.NhanSu.create({
      id_phong_ban,
      ho_ten,
      ngay_sinh: ngay_sinh || null,
      chuc_vu: chuc_vu || null,
      dia_chi_tam_tru: dia_chi_tam_tru || null,
      dia_chi_thuong_tru: dia_chi_thuong_tru || null,
      cccd: cccd || null,
      bang_cap: bang_cap || null,
      so_dien_thoai: so_dien_thoai || null,
      email: email || null,
      nguoi_than_lien_he: nguoi_than_lien_he || null,
      ngay_bat_dau_lam: ngay_bat_dau_lam || null,
      ngay_ket_thuc_lam_viec: ngay_ket_thuc_lam_viec || null
    });

    res.status(201).json({
      success: true,
      message: 'Tạo nhân sự thành công',
      data: nhanSu
    });
  } catch (error) {
    console.error('Lỗi khi tạo nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo nhân sự',
      error: error.message
    });
  }
};

// Cập nhật nhân sự
const updateNhanSu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_phong_ban,
      ho_ten,
      ngay_sinh,
      chuc_vu,
      dia_chi_tam_tru,
      dia_chi_thuong_tru,
      cccd,
      bang_cap,
      so_dien_thoai,
      email,
      nguoi_than_lien_he,
      ngay_bat_dau_lam,
      ngay_ket_thuc_lam_viec
    } = req.body;

    const nhanSu = await db.NhanSu.findByPk(id);
    if (!nhanSu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân sự'
      });
    }

    // Kiểm tra phòng ban nếu có thay đổi
    if (id_phong_ban && id_phong_ban !== nhanSu.id_phong_ban) {
      const phongBan = await db.PhongBan.findByPk(id_phong_ban);
      if (!phongBan) {
        return res.status(400).json({
          success: false,
          message: 'Phòng ban không tồn tại'
        });
      }
    }

    await nhanSu.update({
      id_phong_ban: id_phong_ban !== undefined ? id_phong_ban : nhanSu.id_phong_ban,
      ho_ten: ho_ten !== undefined ? ho_ten : nhanSu.ho_ten,
      ngay_sinh: ngay_sinh !== undefined ? ngay_sinh : nhanSu.ngay_sinh,
      chuc_vu: chuc_vu !== undefined ? chuc_vu : nhanSu.chuc_vu,
      dia_chi_tam_tru: dia_chi_tam_tru !== undefined ? dia_chi_tam_tru : nhanSu.dia_chi_tam_tru,
      dia_chi_thuong_tru: dia_chi_thuong_tru !== undefined ? dia_chi_thuong_tru : nhanSu.dia_chi_thuong_tru,
      cccd: cccd !== undefined ? cccd : nhanSu.cccd,
      bang_cap: bang_cap !== undefined ? bang_cap : nhanSu.bang_cap,
      so_dien_thoai: so_dien_thoai !== undefined ? so_dien_thoai : nhanSu.so_dien_thoai,
      email: email !== undefined ? email : nhanSu.email,
      nguoi_than_lien_he: nguoi_than_lien_he !== undefined ? nguoi_than_lien_he : nhanSu.nguoi_than_lien_he,
      ngay_bat_dau_lam: ngay_bat_dau_lam !== undefined ? ngay_bat_dau_lam : nhanSu.ngay_bat_dau_lam,
      ngay_ket_thuc_lam_viec: ngay_ket_thuc_lam_viec !== undefined ? ngay_ket_thuc_lam_viec : nhanSu.ngay_ket_thuc_lam_viec
    });

    const updatedNhanSu = await db.NhanSu.findByPk(id, {
      include: [
        {
          model: db.PhongBan,
          as: 'phongBan',
          attributes: ['id', 'ten_phong_ban']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật nhân sự thành công',
      data: updatedNhanSu
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật nhân sự',
      error: error.message
    });
  }
};

// Xóa nhân sự
const deleteNhanSu = async (req, res) => {
  try {
    const { id } = req.params;

    const nhanSu = await db.NhanSu.findByPk(id);
    if (!nhanSu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân sự'
      });
    }

    // Xóa nhân sự (cascade sẽ xóa các bảng liên quan)
    await nhanSu.destroy();

    res.json({
      success: true,
      message: 'Xóa nhân sự thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa nhân sự',
      error: error.message
    });
  }
};

module.exports = {
  getAllNhanSu,
  getNhanSuById,
  createNhanSu,
  updateNhanSu,
  deleteNhanSu
};


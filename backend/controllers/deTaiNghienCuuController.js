const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả đề tài nghiên cứu (có thể filter theo id_vien, trang_thai, linh_vuc, search)
const getAllDeTaiNghienCuu = async (req, res) => {
  try {
    const { id_vien, trang_thai, linh_vuc, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (trang_thai) where.trang_thai = trang_thai;
    if (linh_vuc) where.linh_vuc = linh_vuc;
    
    // Search by ten_de_tai
    if (search) {
      where.ten_de_tai = { [Op.like]: `%${search}%` };
    }

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

    // Tự động đồng bộ tiến độ và trạng thái
    let finalTienDo = tien_do !== undefined ? parseInt(tien_do) : deTai.tien_do;
    let finalTrangThai = trang_thai !== undefined ? trang_thai : deTai.trang_thai;

    // Nếu cập nhật trạng thái sang hoàn thành, tự động set tiến độ = 100%
    if (trang_thai === 'hoan_thanh') {
      finalTienDo = 100;
    }
    
    // Nếu cập nhật tiến độ = 100%, tự động set trạng thái = hoàn thành
    if (tien_do !== undefined && parseInt(tien_do) === 100) {
      finalTrangThai = 'hoan_thanh';
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
      trang_thai: finalTrangThai,
      tien_do: finalTienDo,
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

// Thêm nhân sự vào đề tài
const addNhanSuToDeTai = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nhan_su, ten_nhan_su, chuyen_mon, vai_tro } = req.body;

    // Kiểm tra đề tài tồn tại
    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    // Kiểm tra nhân sự nếu có id_nhan_su
    if (id_nhan_su) {
      const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
      if (!nhanSu) {
        return res.status(400).json({
          success: false,
          message: 'Nhân sự không tồn tại'
        });
      }
    }

    const nhanSuDeTai = await db.NhanSuDeTai.create({
      id_de_tai: id,
      id_nhan_su: id_nhan_su || null,
      ten_nhan_su: ten_nhan_su || null,
      chuyen_mon: chuyen_mon || null,
      vai_tro: vai_tro || 'thanh_vien'
    });

    const nhanSuDeTaiWithRelations = await db.NhanSuDeTai.findByPk(nhanSuDeTai.id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Thêm nhân sự vào đề tài thành công',
      data: nhanSuDeTaiWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi thêm nhân sự vào đề tài:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm nhân sự vào đề tài',
      error: error.message
    });
  }
};

// Upload tài liệu cho đề tài
const uploadTaiLieu = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    // Kiểm tra đề tài tồn tại
    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất một file'
      });
    }

    const taiLieuDeTais = [];
    for (const file of files) {
      const taiLieu = await db.TaiLieuDeTai.create({
        id_de_tai: id,
        ten_tai_lieu: file.originalname,
        duong_dan_tai_lieu: `/uploads/tai-lieu-de-tai/${file.filename}`
      });
      taiLieuDeTais.push(taiLieu);
    }

    res.status(201).json({
      success: true,
      message: 'Upload tài liệu thành công',
      data: taiLieuDeTais
    });
  } catch (error) {
    console.error('Lỗi khi upload tài liệu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload tài liệu',
      error: error.message
    });
  }
};

// Xóa nhân sự khỏi đề tài
const removeNhanSuFromDeTai = async (req, res) => {
  try {
    const { id, nhanSuDeTaiId } = req.params;

    // Kiểm tra đề tài tồn tại
    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    // Kiểm tra nhân sự đề tài tồn tại và thuộc về đề tài này
    const nhanSuDeTai = await db.NhanSuDeTai.findByPk(nhanSuDeTaiId);
    if (!nhanSuDeTai || nhanSuDeTai.id_de_tai !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân sự trong đề tài'
      });
    }

    await nhanSuDeTai.destroy();

    res.json({
      success: true,
      message: 'Xóa nhân sự khỏi đề tài thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa nhân sự khỏi đề tài:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa nhân sự khỏi đề tài',
      error: error.message
    });
  }
};

// Cập nhật nhân sự trong đề tài
const updateNhanSuInDeTai = async (req, res) => {
  try {
    const { id, nhanSuDeTaiId } = req.params;
    const { chuyen_mon, vai_tro } = req.body;

    // Kiểm tra đề tài tồn tại
    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    // Kiểm tra nhân sự đề tài tồn tại và thuộc về đề tài này
    const nhanSuDeTai = await db.NhanSuDeTai.findByPk(nhanSuDeTaiId);
    if (!nhanSuDeTai || nhanSuDeTai.id_de_tai !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân sự trong đề tài'
      });
    }

    await nhanSuDeTai.update({
      chuyen_mon: chuyen_mon !== undefined ? chuyen_mon : nhanSuDeTai.chuyen_mon,
      vai_tro: vai_tro !== undefined ? vai_tro : nhanSuDeTai.vai_tro
    });

    const updatedNhanSuDeTai = await db.NhanSuDeTai.findByPk(nhanSuDeTaiId, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật nhân sự thành công',
      data: updatedNhanSuDeTai
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

// Xóa tài liệu khỏi đề tài
const removeTaiLieuFromDeTai = async (req, res) => {
  try {
    const { id, taiLieuId } = req.params;

    // Kiểm tra đề tài tồn tại
    const deTai = await db.DeTaiNghienCuu.findByPk(id);
    if (!deTai) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đề tài nghiên cứu'
      });
    }

    // Kiểm tra tài liệu tồn tại và thuộc về đề tài này
    const taiLieu = await db.TaiLieuDeTai.findByPk(taiLieuId);
    if (!taiLieu || taiLieu.id_de_tai !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài liệu'
      });
    }

    await taiLieu.destroy();

    res.json({
      success: true,
      message: 'Xóa tài liệu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tài liệu',
      error: error.message
    });
  }
};

module.exports = {
  getAllDeTaiNghienCuu,
  getDeTaiNghienCuuById,
  createDeTaiNghienCuu,
  updateDeTaiNghienCuu,
  deleteDeTaiNghienCuu,
  addNhanSuToDeTai,
  uploadTaiLieu,
  removeNhanSuFromDeTai,
  updateNhanSuInDeTai,
  removeTaiLieuFromDeTai
};


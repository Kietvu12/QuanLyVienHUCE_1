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

// Upload media cho doanh thu
const uploadMediaDoanhThu = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    // Kiểm tra doanh thu tồn tại
    const doanhThu = await db.DoanhThu.findByPk(id);
    if (!doanhThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy doanh thu'
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất một file'
      });
    }

    const mediaDoanhThus = [];
    for (const file of files) {
      const media = await db.MediaDoanhThu.create({
        id_doanh_thu: id,
        duong_dan_tai_lieu: `/uploads/media-doanh-thu/${file.filename}`
      });
      mediaDoanhThus.push(media);
    }

    res.status(201).json({
      success: true,
      message: 'Upload media thành công',
      data: mediaDoanhThus
    });
  } catch (error) {
    console.error('Lỗi khi upload media doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload media doanh thu',
      error: error.message
    });
  }
};

// Xóa media doanh thu
const removeMediaDoanhThu = async (req, res) => {
  try {
    const { id, mediaId } = req.params;

    // Kiểm tra doanh thu tồn tại
    const doanhThu = await db.DoanhThu.findByPk(id);
    if (!doanhThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy doanh thu'
      });
    }

    // Kiểm tra media tồn tại
    const media = await db.MediaDoanhThu.findByPk(mediaId);
    if (!media || media.id_doanh_thu !== parseInt(id)) {
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
    console.error('Lỗi khi xóa media doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa media doanh thu',
      error: error.message
    });
  }
};

// Thống kê doanh thu và chi phí tổng quan
const getRevenueExpenseStatistics = async (req, res) => {
  try {
    const { id_vien, tu_ngay, den_ngay, thang, nam } = req.query;

    const whereDoanhThu = {};
    const whereChiPhi = {};
    if (id_vien) {
      whereDoanhThu.id_vien = id_vien;
      whereChiPhi.id_vien = id_vien;
    }

    // Filter theo ngày
    if (tu_ngay || den_ngay) {
      const dateFilter = {};
      if (tu_ngay) dateFilter[Op.gte] = new Date(tu_ngay);
      if (den_ngay) dateFilter[Op.lte] = new Date(den_ngay);
      
      whereDoanhThu[Op.or] = [
        { ngay_nhan_tien: dateFilter },
        { ngay_tao: dateFilter }
      ];
      whereChiPhi[Op.or] = [
        { ngay_tat_toan: dateFilter },
        { ngay_tao: dateFilter }
      ];
    }

    // Filter theo tháng/năm
    if (thang && nam) {
      const startDate = new Date(nam, thang - 1, 1);
      const endDate = new Date(nam, thang, 0, 23, 59, 59);
      whereDoanhThu[Op.or] = [
        { ngay_nhan_tien: { [Op.between]: [startDate, endDate] } },
        { ngay_tao: { [Op.between]: [startDate, endDate] } }
      ];
      whereChiPhi[Op.or] = [
        { ngay_tat_toan: { [Op.between]: [startDate, endDate] } },
        { ngay_tao: { [Op.between]: [startDate, endDate] } }
      ];
    }

    // Tổng doanh thu (đã nhận)
    const tongDoanhThu = await db.DoanhThu.sum('so_tien', {
      where: {
        ...whereDoanhThu,
        trang_thai: 'da_nhan'
      }
    }) || 0;

    // Tổng chi phí (đã tất toán)
    const tongChiPhi = await db.ChiPhi.sum('so_tien', {
      where: {
        ...whereChiPhi,
        trang_thai: 'da_tat_toan'
      }
    }) || 0;

    // Lợi nhuận
    const loiNhuan = tongDoanhThu - tongChiPhi;

    // Thống kê theo tháng (12 tháng gần nhất)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthThu = await db.DoanhThu.sum('so_tien', {
        where: {
          ...whereDoanhThu,
          trang_thai: 'da_nhan',
          [Op.or]: [
            { ngay_nhan_tien: { [Op.between]: [monthDate, nextMonthDate] } },
            { ngay_tao: { [Op.between]: [monthDate, nextMonthDate] } }
          ]
        }
      }) || 0;

      const monthChi = await db.ChiPhi.sum('so_tien', {
        where: {
          ...whereChiPhi,
          trang_thai: 'da_tat_toan',
          [Op.or]: [
            { ngay_tat_toan: { [Op.between]: [monthDate, nextMonthDate] } },
            { ngay_tao: { [Op.between]: [monthDate, nextMonthDate] } }
          ]
        }
      }) || 0;

      monthlyData.push({
        month: String(monthDate.getMonth() + 1).padStart(2, '0'),
        value: Math.round(monthThu / 1000000) // Chuyển thành triệu đồng
      });
    }

    // Thống kê thu chi theo tháng (12 tháng)
    const incomeExpenseData = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthThu = await db.DoanhThu.sum('so_tien', {
        where: {
          ...whereDoanhThu,
          trang_thai: 'da_nhan',
          [Op.or]: [
            { ngay_nhan_tien: { [Op.between]: [monthDate, nextMonthDate] } },
            { ngay_tao: { [Op.between]: [monthDate, nextMonthDate] } }
          ]
        }
      }) || 0;

      const monthChi = await db.ChiPhi.sum('so_tien', {
        where: {
          ...whereChiPhi,
          trang_thai: 'da_tat_toan',
          [Op.or]: [
            { ngay_tat_toan: { [Op.between]: [monthDate, nextMonthDate] } },
            { ngay_tao: { [Op.between]: [monthDate, nextMonthDate] } }
          ]
        }
      }) || 0;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      incomeExpenseData.push({
        month: monthNames[monthDate.getMonth()],
        thu: Math.round(monthThu / 1000000),
        chi: Math.round(monthChi / 1000000)
      });
    }

    res.json({
      success: true,
      data: {
        tong_doanh_thu: tongDoanhThu,
        tong_chi_phi: tongChiPhi,
        loi_nhuan: loiNhuan,
        monthly_revenue_data: monthlyData,
        income_expense_data: incomeExpenseData
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê doanh thu chi phí:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê doanh thu chi phí',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoanhThu,
  getDoanhThuById,
  createDoanhThu,
  updateDoanhThu,
  deleteDoanhThu,
  uploadMediaDoanhThu,
  removeMediaDoanhThu,
  getRevenueExpenseStatistics
};


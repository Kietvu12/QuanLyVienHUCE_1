const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả nghĩa vụ nộp (có thể filter theo id_vien, trang_thai)
const getAllNghiaVuNop = async (req, res) => {
  try {
    const { id_vien, trang_thai, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    if (trang_thai) where.trang_thai = trang_thai;

    const { count, rows } = await db.NghiaVuNop.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.CongNo,
          as: 'congNo',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['han_nop', 'ASC']]
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
    console.error('Lỗi khi lấy danh sách nghĩa vụ nộp:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nghĩa vụ nộp',
      error: error.message
    });
  }
};

// Lấy nghĩa vụ nộp theo ID
const getNghiaVuNopById = async (req, res) => {
  try {
    const { id } = req.params;

    const nghiaVuNop = await db.NghiaVuNop.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.CongNo,
          as: 'congNo',
          required: false
        }
      ]
    });

    if (!nghiaVuNop) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nghĩa vụ nộp'
      });
    }

    res.json({
      success: true,
      data: nghiaVuNop
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nghĩa vụ nộp:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin nghĩa vụ nộp',
      error: error.message
    });
  }
};

// Thanh toán công nợ
const thanhToanCongNo = async (req, res) => {
  try {
    const { id_nghia_vu, so_tien_thanh_toan, id_vien } = req.body;

    if (!id_nghia_vu || !so_tien_thanh_toan || so_tien_thanh_toan <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin (id_nghia_vu, so_tien_thanh_toan > 0)'
      });
    }

    // Kiểm tra nghĩa vụ nộp tồn tại
    const nghiaVuNop = await db.NghiaVuNop.findByPk(id_nghia_vu, {
      include: [
        {
          model: db.CongNo,
          as: 'congNo',
          required: false
        }
      ]
    });

    if (!nghiaVuNop) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nghĩa vụ nộp'
      });
    }

    // Tìm hoặc tạo công nợ
    let congNo = await db.CongNo.findOne({
      where: { id_nghia_vu }
    });

    const soTienThanhToan = parseFloat(so_tien_thanh_toan);
    const soTienDaNopHienTai = congNo ? parseFloat(congNo.so_tien_da_nop) : 0;
    const congNoHienTai = congNo ? parseFloat(congNo.cong_no) : 0;

    // Tính toán số tiền đã nộp mới và công nợ mới
    const soTienDaNopMoi = soTienDaNopHienTai + soTienThanhToan;
    const congNoMoi = Math.max(0, congNoHienTai - soTienThanhToan);

    // Cập nhật hoặc tạo công nợ
    if (congNo) {
      await congNo.update({
        so_tien_da_nop: soTienDaNopMoi,
        cong_no: congNoMoi,
        thoi_gian_cap_nhat_lan_cuoi: new Date()
      });
    } else {
      // Tạo công nợ mới (giả sử công nợ ban đầu = số tiền cần nộp)
      // Cần có trường tong_tien trong nghia_vu_nop hoặc tính từ nguồn khác
      // Tạm thời set công nợ = 0 nếu chưa có
      congNo = await db.CongNo.create({
        id_nghia_vu,
        so_tien_da_nop: soTienDaNopMoi,
        cong_no: congNoMoi,
        thoi_gian_cap_nhat_lan_cuoi: new Date()
      });
    }

    // Cập nhật trạng thái nghĩa vụ nộp
    let trangThaiMoi = nghiaVuNop.trang_thai;
    if (congNoMoi === 0) {
      trangThaiMoi = 'da_nop';
    } else {
      const today = new Date();
      const hanNop = new Date(nghiaVuNop.han_nop);
      if (hanNop < today) {
        trangThaiMoi = 'qua_han';
      } else {
        trangThaiMoi = 'chua_nop';
      }
    }

    await nghiaVuNop.update({
      trang_thai: trangThaiMoi
    });

    // Tạo chi phí để ghi nhận khoản thanh toán
    const chiPhi = await db.ChiPhi.create({
      id_vien: id_vien || nghiaVuNop.id_vien,
      tieu_de: `Thanh toán công nợ - Nghĩa vụ nộp #${id_nghia_vu}`,
      noi_dung: `Thanh toán công nợ cho nghĩa vụ nộp. Hạn nộp: ${nghiaVuNop.han_nop}`,
      so_tien: soTienThanhToan,
      id_de_tai: null,
      trang_thai: 'da_tat_toan',
      ngay_tat_toan: new Date().toISOString().split('T')[0]
    });

    const updatedNghiaVuNop = await db.NghiaVuNop.findByPk(id_nghia_vu, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien']
        },
        {
          model: db.CongNo,
          as: 'congNo',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Thanh toán công nợ thành công',
      data: {
        nghiaVuNop: updatedNghiaVuNop,
        chiPhi: chiPhi
      }
    });
  } catch (error) {
    console.error('Lỗi khi thanh toán công nợ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thanh toán công nợ',
      error: error.message
    });
  }
};

// Thống kê công nợ
const getCongNoStatistics = async (req, res) => {
  try {
    const { id_vien, tu_ngay, den_ngay } = req.query;

    const where = {};
    if (id_vien) where.id_vien = id_vien;

    // Lấy tất cả nghĩa vụ nộp trong khoảng thời gian
    const whereDate = {};
    if (tu_ngay) {
      whereDate[Op.gte] = new Date(tu_ngay);
    }
    if (den_ngay) {
      whereDate[Op.lte] = new Date(den_ngay);
    }
    if (Object.keys(whereDate).length > 0) {
      where.han_nop = whereDate;
    }

    const nghiaVuNops = await db.NghiaVuNop.findAll({
      where,
      include: [
        {
          model: db.CongNo,
          as: 'congNo',
          required: false
        }
      ]
    });

    // Tính tổng nghĩa vụ phải nộp, đã nộp, công nợ
    let tongNghiaVu = 0;
    let tongDaNop = 0;
    let tongCongNo = 0;

    nghiaVuNops.forEach(nv => {
      const congNo = nv.congNo;
      
      // Sử dụng trường so_tien_phai_nop nếu có, nếu không thì tính từ công nợ
      let nghiaVuPhaiNop = 0;
      if (nv.so_tien_phai_nop) {
        nghiaVuPhaiNop = parseFloat(nv.so_tien_phai_nop);
      } else if (congNo) {
        // Nếu chưa có so_tien_phai_nop, tính từ công nợ + đã nộp
        nghiaVuPhaiNop = parseFloat(congNo.cong_no || 0) + parseFloat(congNo.so_tien_da_nop || 0);
      }
      
      tongNghiaVu += nghiaVuPhaiNop;
      
      if (congNo) {
        tongDaNop += parseFloat(congNo.so_tien_da_nop || 0);
        tongCongNo += parseFloat(congNo.cong_no || 0);
      } else {
        // Nếu chưa có công nợ, nghĩa vụ phải nộp = công nợ
        tongCongNo += nghiaVuPhaiNop;
      }
    });

    // Thống kê theo tháng (12 tháng gần nhất)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthNghiaVu = await db.NghiaVuNop.count({
        where: {
          ...where,
          thoi_gian_tao: {
            [Op.gte]: monthDate,
            [Op.lt]: nextMonthDate
          }
        }
      });

      // Tính đã nộp trong tháng này
      const monthCongNo = await db.CongNo.findAll({
        include: [
          {
            model: db.NghiaVuNop,
            as: 'nghiaVuNop',
            where: {
              ...where,
              thoi_gian_tao: {
                [Op.gte]: monthDate,
                [Op.lt]: nextMonthDate
              }
            },
            required: true
          }
        ]
      });

      let monthDaNop = 0;
      monthCongNo.forEach(cn => {
        monthDaNop += parseFloat(cn.so_tien_da_nop);
      });

      monthlyData.push({
        month: String(monthDate.getMonth() + 1).padStart(2, '0'),
        nghiaVu: monthNghiaVu,
        daNop: Math.round(monthDaNop / 1000000) // Chuyển thành triệu đồng
      });
    }

    res.json({
      success: true,
      data: {
        tong_nghia_vu_phai_nop: tongNghiaVu,
        tong_da_nop: tongDaNop,
        tong_cong_no: tongCongNo,
        monthly_data: monthlyData
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê công nợ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê công nợ',
      error: error.message
    });
  }
};

module.exports = {
  getAllNghiaVuNop,
  getNghiaVuNopById,
  thanhToanCongNo,
  getCongNoStatistics
};


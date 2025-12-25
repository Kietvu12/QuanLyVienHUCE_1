const db = require('../models');
const { Op } = require('sequelize');

// Thống kê xe
const getXeStatistics = async (req, res) => {
  try {
    const { id_vien } = req.query;

    // Xây dựng where clause cho nhân sự
    let nhanSuWhere = {};
    if (id_vien) {
      const phongBans = await db.PhongBan.findAll({
        where: { id_vien },
        attributes: ['id']
      });
      const phongBanIds = phongBans.map(pb => pb.id);
      if (phongBanIds.length > 0) {
        nhanSuWhere.id_phong_ban = { [Op.in]: phongBanIds };
      } else {
        return res.json({
          success: true,
          data: {
            tong_so_xe: 0,
            xe_da_dang_ky: 0,
            xe_chua_dang_ky: 0,
            dang_bao_tri: 0,
            change: {
              tong_so_xe: 0,
              xe_da_dang_ky: 0,
              xe_chua_dang_ky: 0,
              dang_bao_tri: 0
            }
          }
        });
      }
    }

    // Lấy danh sách nhân sự
    const nhanSus = await db.NhanSu.findAll({
      where: nhanSuWhere,
      attributes: ['id']
    });
    const nhanSuIds = nhanSus.map(ns => ns.id);

    if (nhanSuIds.length === 0) {
      return res.json({
        success: true,
        data: {
          tong_so_xe: 0,
          xe_da_dang_ky: 0,
          xe_chua_dang_ky: 0,
          dang_bao_tri: 0,
          change: {
            tong_so_xe: 0,
            xe_da_dang_ky: 0,
            xe_chua_dang_ky: 0,
            dang_bao_tri: 0
          }
        }
      });
    }

    // Tổng số xe
    const tongSoXe = await db.ThongTinXe.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds }
      }
    });

    // Xe đã đăng ký (có id_nhan_su và có thông tin đầy đủ)
    const xeDaDangKy = await db.ThongTinXe.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        bien_so_xe: { [Op.ne]: null }
      }
    });

    // Xe chưa đăng ký (không có bien_so_xe hoặc id_nhan_su = null)
    // Trong trường hợp này, tất cả xe đều có id_nhan_su, nên xe chưa đăng ký = tổng - đã đăng ký
    const xeChuaDangKy = tongSoXe - xeDaDangKy;

    // Đang bảo trì (có thể thêm trường tinh_trang vào bảng thong_tin_xe nếu cần)
    // Tạm thời coi như 0 vì không có trường này
    const dangBaoTri = 0;

    // Tính thay đổi so với tháng trước
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tongSoXeThangTruoc = await db.ThongTinXe.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        created_at: { [Op.lt]: thirtyDaysAgo }
      }
    });

    const xeDaDangKyThangTruoc = await db.ThongTinXe.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        bien_so_xe: { [Op.ne]: null },
        created_at: { [Op.lt]: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      data: {
        tong_so_xe: tongSoXe,
        xe_da_dang_ky: xeDaDangKy,
        xe_chua_dang_ky: xeChuaDangKy,
        dang_bao_tri: dangBaoTri,
        change: {
          tong_so_xe: tongSoXe - tongSoXeThangTruoc,
          xe_da_dang_ky: xeDaDangKy - xeDaDangKyThangTruoc,
          xe_chua_dang_ky: xeChuaDangKy - (tongSoXeThangTruoc - xeDaDangKyThangTruoc),
          dang_bao_tri: 0
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê xe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê xe',
      error: error.message
    });
  }
};

module.exports = {
  getXeStatistics
};


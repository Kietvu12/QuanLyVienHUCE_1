const db = require('../models');
const { Op } = require('sequelize');

// Thống kê hợp đồng lao động
const getHopDongStatistics = async (req, res) => {
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
            tong_hop_dong: 0,
            sap_het_han: 0,
            ty_le_tang_truong: 0
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
          tong_hop_dong: 0,
          sap_het_han: 0,
          ty_le_tang_truong: 0
        }
      });
    }

    // Tổng hợp đồng
    const tongHopDong = await db.HopDongLaoDong.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds }
      }
    });

    // Hợp đồng sắp hết hạn (trong 30 ngày tới)
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const sapHetHan = await db.HopDongLaoDong.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        ngay_ket_thuc_hop_dong_lao_dong: {
          [Op.gte]: today,
          [Op.lte]: thirtyDaysLater
        }
      }
    });

    // Tính tỷ lệ tăng trưởng (so với tháng trước)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const hopDongThangNay = await db.HopDongLaoDong.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        created_at: { [Op.gte]: thirtyDaysAgo }
      }
    });

    const hopDongThangTruoc = await db.HopDongLaoDong.count({
      where: {
        id_nhan_su: { [Op.in]: nhanSuIds },
        created_at: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo }
      }
    });

    let tyLeTangTruong = 0;
    if (hopDongThangTruoc > 0) {
      tyLeTangTruong = ((hopDongThangNay - hopDongThangTruoc) / hopDongThangTruoc) * 100;
    } else if (hopDongThangNay > 0) {
      tyLeTangTruong = 100; // Tăng 100% nếu tháng trước = 0 và tháng này > 0
    }

    res.json({
      success: true,
      data: {
        tong_hop_dong: tongHopDong,
        sap_het_han: sapHetHan,
        ty_le_tang_truong: parseFloat(tyLeTangTruong.toFixed(1))
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê hợp đồng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê hợp đồng',
      error: error.message
    });
  }
};

module.exports = {
  getHopDongStatistics
};


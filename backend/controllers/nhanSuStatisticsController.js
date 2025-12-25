const db = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Thống kê tổng quan nhân sự
const getNhanSuStatistics = async (req, res) => {
  try {
    const { id_vien } = req.query;

    // Xây dựng where clause
    let where = {};
    if (id_vien) {
      // Lấy danh sách phòng ban thuộc viện
      const phongBans = await db.PhongBan.findAll({
        where: { id_vien },
        attributes: ['id']
      });
      const phongBanIds = phongBans.map(pb => pb.id);
      if (phongBanIds.length > 0) {
        where.id_phong_ban = { [Op.in]: phongBanIds };
      } else {
        // Nếu không có phòng ban nào, trả về 0
        return res.json({
          success: true,
          data: {
            tong_nhan_su: 0,
            dang_lam_viec: 0,
            nhan_su_moi: 0,
            nghi_viec: 0,
            change: {
              tong_nhan_su: 0,
              dang_lam_viec: 0,
              nhan_su_moi: 0,
              nghi_viec: 0
            }
          }
        });
      }
    }

    // Tổng nhân sự
    const tongNhanSu = await db.NhanSu.count({ where });

    // Đang làm việc (không có ngay_ket_thuc_lam_viec hoặc ngay_ket_thuc_lam_viec > hôm nay)
    const dangLamViec = await db.NhanSu.count({
      where: {
        ...where,
        [Op.or]: [
          { ngay_ket_thuc_lam_viec: null },
          { ngay_ket_thuc_lam_viec: { [Op.gte]: new Date() } }
        ]
      }
    });

    // Nhân sự mới (tạo trong 30 ngày gần đây)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const nhanSuMoi = await db.NhanSu.count({
      where: {
        ...where,
        created_at: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Nghỉ việc (có ngay_ket_thuc_lam_viec và < hôm nay)
    const nghiViec = await db.NhanSu.count({
      where: {
        ...where,
        ngay_ket_thuc_lam_viec: { [Op.lt]: new Date() }
      }
    });

    // Tính thay đổi so với tháng trước (30-60 ngày trước)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const tongNhanSuThangTruoc = await db.NhanSu.count({
      where: {
        ...where,
        created_at: { [Op.lt]: thirtyDaysAgo, [Op.gte]: sixtyDaysAgo }
      }
    });

    const dangLamViecThangTruoc = await db.NhanSu.count({
      where: {
        ...where,
        created_at: { [Op.lt]: thirtyDaysAgo, [Op.gte]: sixtyDaysAgo },
        [Op.or]: [
          { ngay_ket_thuc_lam_viec: null },
          { ngay_ket_thuc_lam_viec: { [Op.gte]: new Date() } }
        ]
      }
    });

    const nhanSuMoiThangTruoc = await db.NhanSu.count({
      where: {
        ...where,
        created_at: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo }
      }
    });

    const nghiViecThangTruoc = await db.NhanSu.count({
      where: {
        ...where,
        created_at: { [Op.lt]: thirtyDaysAgo, [Op.gte]: sixtyDaysAgo },
        ngay_ket_thuc_lam_viec: { [Op.lt]: new Date() }
      }
    });

    res.json({
      success: true,
      data: {
        tong_nhan_su: tongNhanSu,
        dang_lam_viec: dangLamViec,
        nhan_su_moi: nhanSuMoi,
        nghi_viec: nghiViec,
        change: {
          tong_nhan_su: tongNhanSu - tongNhanSuThangTruoc,
          dang_lam_viec: dangLamViec - dangLamViecThangTruoc,
          nhan_su_moi: nhanSuMoi - nhanSuMoiThangTruoc,
          nghi_viec: nghiViec - nghiViecThangTruoc
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê nhân sự',
      error: error.message
    });
  }
};

// Thống kê phân bố theo phòng ban
const getDistributionByPhongBan = async (req, res) => {
  try {
    const { id_vien } = req.query;

    let where = {};
    if (id_vien) {
      where.id_vien = id_vien;
    }

    const phongBans = await db.PhongBan.findAll({
      where,
      attributes: ['id', 'ten_phong_ban'],
      include: [{
        model: db.NhanSu,
        as: 'nhanSus',
        attributes: ['id'],
        required: false
      }]
    });

    const distribution = phongBans.map(pb => {
      const phongBanData = pb.toJSON();
      const count = phongBanData.nhanSus ? phongBanData.nhanSus.length : 0;
      return {
        department: phongBanData.ten_phong_ban.substring(0, 10), // Rút gọn tên
        fullDepartment: phongBanData.ten_phong_ban,
        count: count
      };
    }).filter(item => item.count > 0); // Chỉ lấy phòng ban có nhân sự

    res.json({
      success: true,
      data: distribution,
      total: distribution.reduce((sum, item) => sum + item.count, 0)
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo phòng ban:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo phòng ban',
      error: error.message
    });
  }
};

// Thống kê phân bố theo chức vụ
const getDistributionByChucVu = async (req, res) => {
  try {
    const { id_vien } = req.query;

    let where = {};
    if (id_vien) {
      const phongBans = await db.PhongBan.findAll({
        where: { id_vien },
        attributes: ['id']
      });
      const phongBanIds = phongBans.map(pb => pb.id);
      if (phongBanIds.length > 0) {
        where.id_phong_ban = { [Op.in]: phongBanIds };
      } else {
        return res.json({
          success: true,
          data: [],
          total: 0
        });
      }
    }

    const distribution = await db.NhanSu.findAll({
      where,
      attributes: [
        'chuc_vu',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['chuc_vu'],
      raw: true
    });

    const result = distribution
      .filter(item => item.chuc_vu) // Chỉ lấy những người có chức vụ
      .map(item => ({
        position: item.chuc_vu,
        count: parseInt(item.count)
      }))
      .sort((a, b) => b.count - a.count); // Sắp xếp theo số lượng giảm dần

    res.json({
      success: true,
      data: result,
      total: result.reduce((sum, item) => sum + item.count, 0)
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo chức vụ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo chức vụ',
      error: error.message
    });
  }
};

// Hàm tính tuổi từ ngày sinh
const calculateAge = (ngaySinh) => {
  if (!ngaySinh) return null;
  const today = new Date();
  const birthDate = new Date(ngaySinh);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Thống kê phân bố theo nhóm tuổi (tính từ ngày sinh)
const getDistributionByAgeGroup = async (req, res) => {
  try {
    const { id_vien } = req.query;

    let where = {};
    if (id_vien) {
      const phongBans = await db.PhongBan.findAll({
        where: { id_vien },
        attributes: ['id']
      });
      const phongBanIds = phongBans.map(pb => pb.id);
      if (phongBanIds.length > 0) {
        where.id_phong_ban = { [Op.in]: phongBanIds };
      } else {
        return res.json({
          success: true,
          data: [
            { name: '20-30', value: 0, color: '#3b82f6' },
            { name: '31-40', value: 0, color: '#10b981' },
            { name: '41-50', value: 0, color: '#f59e0b' },
            { name: '51+', value: 0, color: '#8b5cf6' }
          ],
          total: 0
        });
      }
    }

    // Lấy tất cả nhân sự có ngày sinh
    const nhanSus = await db.NhanSu.findAll({
      where: {
        ...where,
        ngay_sinh: { [Op.ne]: null }
      },
      attributes: ['id', 'ngay_sinh']
    });

    // Phân loại theo nhóm tuổi
    const ageGroups = {
      '20-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51+': 0
    };

    nhanSus.forEach(ns => {
      const age = calculateAge(ns.ngay_sinh);
      if (age !== null) {
        if (age >= 20 && age <= 30) {
          ageGroups['20-30']++;
        } else if (age >= 31 && age <= 40) {
          ageGroups['31-40']++;
        } else if (age >= 41 && age <= 50) {
          ageGroups['41-50']++;
        } else if (age >= 51) {
          ageGroups['51+']++;
        }
      }
    });

    const total = Object.values(ageGroups).reduce((sum, count) => sum + count, 0);

    res.json({
      success: true,
      data: [
        { name: '20-30', value: ageGroups['20-30'], color: '#3b82f6' },
        { name: '31-40', value: ageGroups['31-40'], color: '#10b981' },
        { name: '41-50', value: ageGroups['41-50'], color: '#f59e0b' },
        { name: '51+', value: ageGroups['51+'], color: '#8b5cf6' }
      ],
      total: total
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo nhóm tuổi:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo nhóm tuổi',
      error: error.message
    });
  }
};

module.exports = {
  getNhanSuStatistics,
  getDistributionByPhongBan,
  getDistributionByChucVu,
  getDistributionByAgeGroup
};


const db = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

// Thống kê tổng quan đề tài nghiên cứu
const getStatistics = async (req, res) => {
  try {
    const { id_vien } = req.query;

    const where = {};
    if (id_vien) where.id_vien = id_vien;

    // Tổng số đề tài
    const tongDeTai = await db.DeTaiNghienCuu.count({ where });

    // Đã hoàn thành
    const daHoanThanh = await db.DeTaiNghienCuu.count({
      where: { ...where, trang_thai: 'hoan_thanh' }
    });

    // Đang thực hiện
    const dangThucHien = await db.DeTaiNghienCuu.count({
      where: { ...where, trang_thai: 'dang_thuc_hien' }
    });

    // Chậm tiến độ (đang thực hiện nhưng đã quá ngày hoàn thành dự kiến)
    const now = new Date();
    const chamTienDo = await db.DeTaiNghienCuu.count({
      where: {
        ...where,
        trang_thai: 'dang_thuc_hien',
        ngay_hoan_thanh: {
          [Op.lt]: now
        }
      }
    });

    // Tính thay đổi so với tháng trước (giả lập)
    const change = {
      tong_de_tai: 0,
      da_hoan_thanh: 0,
      dang_thuc_hien: 0,
      cham_tien_do: 0
    };

    res.json({
      success: true,
      data: {
        tong_de_tai: tongDeTai,
        da_hoan_thanh: daHoanThanh,
        dang_thuc_hien: dangThucHien,
        cham_tien_do: chamTienDo,
        change
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê đề tài nghiên cứu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê đề tài nghiên cứu',
      error: error.message
    });
  }
};

// Phân bố theo trạng thái
const getDistributionByStatus = async (req, res) => {
  try {
    const { id_vien } = req.query;

    const where = {};
    if (id_vien) where.id_vien = id_vien;

    const distribution = await db.DeTaiNghienCuu.findAll({
      where,
      attributes: [
        'trang_thai',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['trang_thai'],
      raw: true
    });

    const statusMap = {
      'dang_thuc_hien': { name: 'Đang thực hiện', color: '#3b82f6' },
      'hoan_thanh': { name: 'Đã hoàn thành', color: '#10b981' },
      'huy_bo': { name: 'Hủy bỏ', color: '#ef4444' }
    };

    const result = distribution.map(item => ({
      name: statusMap[item.trang_thai]?.name || item.trang_thai,
      value: parseInt(item.count),
      color: statusMap[item.trang_thai]?.color || '#6b7280'
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo trạng thái:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo trạng thái',
      error: error.message
    });
  }
};

// Phân bố theo năm
const getDistributionByYear = async (req, res) => {
  try {
    const { id_vien, years = 6 } = req.query;

    const where = {};
    if (id_vien) where.id_vien = id_vien;

    // Lấy các năm gần nhất
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = parseInt(years) - 1; i >= 0; i--) {
      yearList.push(currentYear - i);
    }

    const distribution = await db.DeTaiNghienCuu.findAll({
      where,
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('created_at')), 'year'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: [Sequelize.fn('YEAR', Sequelize.col('created_at'))],
      raw: true
    });

    // Map kết quả
    const result = yearList.map(year => {
      const found = distribution.find(d => parseInt(d.year) === year);
      return {
        year: year.toString(),
        count: found ? parseInt(found.count) : 0
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo năm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo năm',
      error: error.message
    });
  }
};

// Phân bố theo lĩnh vực
const getDistributionByField = async (req, res) => {
  try {
    const { id_vien } = req.query;

    const where = {};
    if (id_vien) where.id_vien = id_vien;
    where.linh_vuc = { [Op.ne]: null };

    const distribution = await db.DeTaiNghienCuu.findAll({
      where,
      attributes: [
        'linh_vuc',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['linh_vuc'],
      raw: true,
      order: [[Sequelize.literal('count'), 'DESC']]
    });

    const result = distribution.map(item => {
      const linhVuc = item.linh_vuc || 'Khác';
      // Rút gọn tên lĩnh vực
      let field = linhVuc;
      if (linhVuc.includes('Công nghệ thông tin') || linhVuc.includes('CNTT')) {
        field = 'CNTT';
      } else if (linhVuc.includes('Xây dựng')) {
        field = 'Xây dựng';
      } else if (linhVuc.includes('Kỹ thuật')) {
        field = 'Kỹ thuật';
      } else if (linhVuc.includes('Khoa học')) {
        field = 'Khoa học';
      }

      return {
        field,
        fullField: linhVuc,
        count: parseInt(item.count)
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi khi lấy phân bố theo lĩnh vực:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy phân bố theo lĩnh vực',
      error: error.message
    });
  }
};

module.exports = {
  getStatistics,
  getDistributionByStatus,
  getDistributionByYear,
  getDistributionByField
};


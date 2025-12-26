const db = require('../models');

// Lấy tất cả loại hợp đồng
const getAllLoaiHopDong = async (req, res) => {
  try {
    const loaiHopDongs = await db.LoaiHopDong.findAll({
      order: [['ten_loai', 'ASC']]
    });

    res.json({
      success: true,
      data: loaiHopDongs
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại hợp đồng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách loại hợp đồng',
      error: error.message
    });
  }
};

// Lấy loại hợp đồng theo ID
const getLoaiHopDongById = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiHopDong = await db.LoaiHopDong.findByPk(id);

    if (!loaiHopDong) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại hợp đồng'
      });
    }

    res.json({
      success: true,
      data: loaiHopDong
    });
  } catch (error) {
    console.error('Lỗi khi lấy loại hợp đồng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy loại hợp đồng',
      error: error.message
    });
  }
};

module.exports = {
  getAllLoaiHopDong,
  getLoaiHopDongById
};


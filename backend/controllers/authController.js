const db = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký tài khoản mới (chỉ dành cho admin)
const register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      ho_ten,
      id_quyen,
      id_vien
    } = req.body;

    // Kiểm tra username đã tồn tại
    const existingUser = await db.TaiKhoan.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã tồn tại'
      });
    }

    // Kiểm tra quyền tồn tại
    const quyen = await db.Quyen.findByPk(id_quyen);
    if (!quyen) {
      return res.status(400).json({
        success: false,
        message: 'Quyền không tồn tại'
      });
    }

    // Kiểm tra viện nếu có
    if (id_vien) {
      const vien = await db.Vien.findByPk(id_vien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản
    const taiKhoan = await db.TaiKhoan.create({
      username,
      password: hashedPassword,
      email: email || null,
      ho_ten: ho_ten || null,
      id_quyen,
      id_vien: id_vien || null,
      trang_thai: 1
    });

    const taiKhoanWithRelations = await db.TaiKhoan.findByPk(taiKhoan.id, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen', 'mo_ta']
        },
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        }
      ],
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: taiKhoanWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký',
      error: error.message
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
      });
    }

    // Tìm tài khoản
    const taiKhoan = await db.TaiKhoan.findOne({
      where: { username },
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen', 'mo_ta']
        },
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        }
      ]
    });

    if (!taiKhoan) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (taiKhoan.trang_thai === 0) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, taiKhoan.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: taiKhoan.id,
        username: taiKhoan.username,
        id_quyen: taiKhoan.id_quyen,
        ten_quyen: taiKhoan.quyen.ten_quyen,
        id_vien: taiKhoan.id_vien
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Loại bỏ password khỏi response
    const userData = {
      id: taiKhoan.id,
      username: taiKhoan.username,
      email: taiKhoan.email,
      ho_ten: taiKhoan.ho_ten,
      id_quyen: taiKhoan.id_quyen,
      id_vien: taiKhoan.id_vien,
      trang_thai: taiKhoan.trang_thai,
      quyen: taiKhoan.quyen,
      vien: taiKhoan.vien
    };

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng nhập',
      error: error.message
    });
  }
};

// Lấy thông tin tài khoản hiện tại
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const taiKhoan = await db.TaiKhoan.findByPk(userId, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen', 'mo_ta']
        },
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    res.json({
      success: true,
      data: taiKhoan
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tài khoản',
      error: error.message
    });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới'
      });
    }

    const taiKhoan = await db.TaiKhoan.findByPk(userId);
    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(oldPassword, taiKhoan.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await taiKhoan.update({
      password: hashedPassword
    });

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu',
      error: error.message
    });
  }
};

// Lấy danh sách tài khoản (theo viện nếu là viện trưởng)
const getAllTaiKhoan = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, id_quyen, trang_thai } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    // Nếu là viện trưởng, chỉ lấy tài khoản của viện đó
    if (req.user.ten_quyen === 'vien_truong' && req.user.id_vien) {
      where.id_vien = req.user.id_vien;
    }

    // Filter theo quyền
    if (id_quyen) {
      where.id_quyen = id_quyen;
    }

    // Filter theo trạng thái
    if (trang_thai !== undefined) {
      where.trang_thai = trang_thai === '1' || trang_thai === 1 ? 1 : 0;
    }

    // Search
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { ho_ten: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await db.TaiKhoan.findAndCountAll({
      where,
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen', 'mo_ta']
        },
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        }
      ],
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tài khoản',
      error: error.message
    });
  }
};

// Cập nhật tài khoản
const updateTaiKhoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { ho_ten, email, id_quyen, id_vien, trang_thai } = req.body;

    const taiKhoan = await db.TaiKhoan.findByPk(id);
    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Kiểm tra quyền nếu có thay đổi
    if (id_quyen) {
      const quyen = await db.Quyen.findByPk(id_quyen);
      if (!quyen) {
        return res.status(400).json({
          success: false,
          message: 'Quyền không tồn tại'
        });
      }
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien !== undefined) {
      if (id_vien) {
        const vien = await db.Vien.findByPk(id_vien);
        if (!vien) {
          return res.status(400).json({
            success: false,
            message: 'Viện không tồn tại'
          });
        }
      }
    }

    await taiKhoan.update({
      ho_ten: ho_ten !== undefined ? ho_ten : taiKhoan.ho_ten,
      email: email !== undefined ? email : taiKhoan.email,
      id_quyen: id_quyen !== undefined ? id_quyen : taiKhoan.id_quyen,
      id_vien: id_vien !== undefined ? id_vien : taiKhoan.id_vien,
      trang_thai: trang_thai !== undefined ? trang_thai : taiKhoan.trang_thai
    });

    const updatedTaiKhoan = await db.TaiKhoan.findByPk(id, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen', 'mo_ta']
        },
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        }
      ],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Cập nhật tài khoản thành công',
      data: updatedTaiKhoan
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tài khoản',
      error: error.message
    });
  }
};

// Xóa tài khoản
const deleteTaiKhoan = async (req, res) => {
  try {
    const { id } = req.params;

    const taiKhoan = await db.TaiKhoan.findByPk(id);
    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    await taiKhoan.destroy();

    res.json({
      success: true,
      message: 'Xóa tài khoản thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tài khoản',
      error: error.message
    });
  }
};

// Toggle trạng thái tài khoản
const toggleTaiKhoanStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const taiKhoan = await db.TaiKhoan.findByPk(id);
    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    await taiKhoan.update({
      trang_thai: taiKhoan.trang_thai === 1 ? 0 : 1
    });

    res.json({
      success: true,
      message: taiKhoan.trang_thai === 1 ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công',
      data: {
        id: taiKhoan.id,
        trang_thai: taiKhoan.trang_thai === 1 ? 0 : 1
      }
    });
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thay đổi trạng thái tài khoản',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  getAllTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
  toggleTaiKhoanStatus
};


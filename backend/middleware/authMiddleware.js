const jwt = require('jsonwebtoken');
const db = require('../models');

// Middleware xác thực token
const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    // Kiểm tra tài khoản còn tồn tại và active
    const taiKhoan = await db.TaiKhoan.findByPk(decoded.id, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen']
        }
      ]
    });

    if (!taiKhoan) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    if (taiKhoan.trang_thai === 0) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Lưu thông tin user vào request
    req.user = {
      id: taiKhoan.id,
      username: taiKhoan.username,
      id_quyen: taiKhoan.id_quyen,
      ten_quyen: taiKhoan.quyen.ten_quyen,
      id_vien: taiKhoan.id_vien
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }
    console.error('Lỗi xác thực:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    });
  }
};

// Middleware phân quyền
// Các quyền theo thứ tự: ke_toan_vien < vien_truong < cap_phong < hieu_truong
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    const userRole = req.user.ten_quyen;

    // Kiểm tra quyền
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập'
    });
  };
};

// Middleware kiểm tra quyền tối thiểu (role hierarchy)
const authorizeMinRole = (minRole) => {
  const roleHierarchy = {
    'ke_toan_vien': 1,
    'vien_truong': 2,
    'cap_phong': 3,
    'hieu_truong': 4
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    const userRole = req.user.ten_quyen;
    const userLevel = roleHierarchy[userRole] || 0;
    const minLevel = roleHierarchy[minRole] || 0;

    if (userLevel >= minLevel) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập'
    });
  };
};

// Middleware kiểm tra quyền truy cập viện
// Cho phép nếu: user là hieu_truong, cap_phong, hoặc vien_truong của viện đó
const authorizeVien = (req, res, next) => {
  const userRole = req.user.ten_quyen;
  const userIdVien = req.user.id_vien;

  // Hiệu trưởng và cấp phòng có quyền xem tất cả
  if (userRole === 'hieu_truong' || userRole === 'cap_phong') {
    return next();
  }

  // Viện trưởng chỉ có quyền với viện của mình
  if (userRole === 'vien_truong') {
    const requestedVienId = req.params.id_vien || req.body.id_vien || req.query.id_vien;
    
    if (requestedVienId && parseInt(requestedVienId) !== userIdVien) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập viện này'
      });
    }
    
    return next();
  }

  // Kế toán viên chỉ có quyền với viện của mình
  if (userRole === 'ke_toan_vien') {
    const requestedVienId = req.params.id_vien || req.body.id_vien || req.query.id_vien;
    
    if (requestedVienId && parseInt(requestedVienId) !== userIdVien) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập viện này'
      });
    }
    
    return next();
  }

  res.status(403).json({
    success: false,
    message: 'Không có quyền truy cập'
  });
};

module.exports = {
  authenticate,
  authorize,
  authorizeMinRole,
  authorizeVien
};


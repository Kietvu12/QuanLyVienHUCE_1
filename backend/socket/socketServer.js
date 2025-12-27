const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../models');

// Lưu trữ mapping userId -> socketId
const userSockets = new Map();

// Middleware xác thực Socket
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Không có token xác thực'));
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    // Kiểm tra tài khoản
    const taiKhoan = await db.TaiKhoan.findByPk(decoded.id, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen']
        }
      ]
    });

    if (!taiKhoan || taiKhoan.trang_thai === 0) {
      return next(new Error('Tài khoản không hợp lệ'));
    }

    // Lưu thông tin user vào socket
    socket.user = {
      id: taiKhoan.id,
      username: taiKhoan.username,
      id_quyen: taiKhoan.id_quyen,
      ten_quyen: taiKhoan.quyen.ten_quyen,
      id_vien: taiKhoan.id_vien
    };

    next();
  } catch (error) {
    console.error('Lỗi xác thực socket:', error);
    next(new Error('Token không hợp lệ'));
  }
};

// Khởi tạo Socket.IO server
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Xác thực khi kết nối
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    const userRole = socket.user.ten_quyen;

    console.log(`✅ User ${userId} (${userRole}) đã kết nối socket: ${socket.id}`);

    // Lưu mapping userId -> socketId
    if (!userSockets.has(userId)) {
      userSockets.set(userId, []);
    }
    userSockets.get(userId).push(socket.id);

    // Join room theo userId để gửi thông báo riêng
    socket.join(`user_${userId}`);

    // Join room theo viện để gửi thông báo cho tất cả trong viện
    if (socket.user.id_vien) {
      socket.join(`vien_${socket.user.id_vien}`);
    }

    // Xử lý disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} đã ngắt kết nối socket: ${socket.id}`);
      
      // Xóa socketId khỏi mapping
      const sockets = userSockets.get(userId);
      if (sockets) {
        const index = sockets.indexOf(socket.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          userSockets.delete(userId);
        }
      }
    });

    // Xử lý đánh dấu đã đọc thông báo
    socket.on('mark_notification_read', async (data) => {
      try {
        const { notificationId } = data;
        await db.ThongBao.update(
          { da_doc: true },
          { where: { id: notificationId, id_nguoi_nhan: userId } }
        );
        
        // Gửi lại danh sách thông báo đã cập nhật
        socket.emit('notification_updated', { notificationId, da_doc: true });
      } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
      }
    });
  });

  return io;
};

// Hàm gửi thông báo cho user cụ thể
const sendNotificationToUser = async (io, userId, notificationData) => {
  try {
    // Lưu thông báo vào database
    const thongBao = await db.ThongBao.create({
      id_nguoi_nhan: userId,
      id_nguoi_gui: notificationData.id_nguoi_gui || null,
      tieu_de: notificationData.tieu_de,
      noi_dung: notificationData.noi_dung,
      loai: notificationData.loai || 'thong_bao',
      loai_du_lieu: notificationData.loai_du_lieu || null,
      id_du_lieu: notificationData.id_du_lieu || null,
      da_doc: false
    });

    // Lấy thông báo với relations
    const thongBaoWithRelations = await db.ThongBao.findByPk(thongBao.id, {
      include: [
        {
          model: db.TaiKhoan,
          as: 'nguoiGui',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ]
    });

    // Gửi thông báo qua socket
    io.to(`user_${userId}`).emit('new_notification', {
      success: true,
      data: thongBaoWithRelations
    });

    return thongBaoWithRelations;
  } catch (error) {
    console.error('Lỗi khi gửi thông báo:', error);
    throw error;
  }
};

// Hàm gửi thông báo cho tất cả user trong viện (trừ người gửi)
const sendNotificationToVien = async (io, idVien, notificationData, excludeUserId = null) => {
  try {
    // Lấy danh sách user trong viện
    const users = await db.TaiKhoan.findAll({
      where: {
        id_vien: idVien,
        trang_thai: 1,
        ...(excludeUserId && { id: { [db.Sequelize.Op.ne]: excludeUserId } })
      },
      attributes: ['id']
    });

    // Gửi thông báo cho từng user
    const notifications = [];
    for (const user of users) {
      const thongBao = await sendNotificationToUser(io, user.id, {
        ...notificationData,
        id_nguoi_gui: excludeUserId
      });
      notifications.push(thongBao);
    }

    return notifications;
  } catch (error) {
    console.error('Lỗi khi gửi thông báo cho viện:', error);
    throw error;
  }
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  sendNotificationToVien,
  userSockets
};


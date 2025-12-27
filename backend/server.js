const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const db = require('./models');
const sequelize = require('./config/database');
const { initializeSocket } = require('./socket/socketServer');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Khởi tạo Socket.IO
const io = initializeSocket(server);
// Export io để sử dụng trong controllers
app.set('io', io);

// Middleware
app.use(cors());
// Tăng giới hạn payload để hỗ trợ upload ảnh base64 (50MB) - tương thích ngược
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files từ thư mục uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const vienRoutes = require('./routes/vienRoutes');
const nhanSuRoutes = require('./routes/nhanSuRoutes');
const hopDongLaoDongRoutes = require('./routes/hopDongLaoDongRoutes');
const loaiHopDongRoutes = require('./routes/loaiHopDongRoutes');
const bangLuongRoutes = require('./routes/bangLuongRoutes');
const doanhThuRoutes = require('./routes/doanhThuRoutes');
const chiPhiRoutes = require('./routes/chiPhiRoutes');
const baoCaoRoutes = require('./routes/baoCaoRoutes');
const deTaiNghienCuuRoutes = require('./routes/deTaiNghienCuuRoutes');
const deTaiNghienCuuStatisticsRoutes = require('./routes/deTaiNghienCuuStatisticsRoutes');
const taiSanRoutes = require('./routes/taiSanRoutes');
const phongCuaVienRoutes = require('./routes/phongCuaVienRoutes');
const phongBanRoutes = require('./routes/phongBanRoutes');
const baoHiemYTeRoutes = require('./routes/baoHiemYTeRoutes');
const thongTinXeRoutes = require('./routes/thongTinXeRoutes');
const mediaNhanSuRoutes = require('./routes/mediaNhanSuRoutes');
const nhanSuStatisticsRoutes = require('./routes/nhanSuStatisticsRoutes');
const nghiaVuNopRoutes = require('./routes/nghiaVuNopRoutes');
const thongBaoRoutes = require('./routes/thongBaoRoutes');

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/vien', vienRoutes);
app.use('/api/nhan-su', nhanSuRoutes);
app.use('/api/hop-dong-lao-dong', hopDongLaoDongRoutes);
app.use('/api/loai-hop-dong', loaiHopDongRoutes);
app.use('/api/bang-luong', bangLuongRoutes);
app.use('/api/doanh-thu', doanhThuRoutes);
app.use('/api/chi-phi', chiPhiRoutes);
app.use('/api/bao-cao', baoCaoRoutes);
app.use('/api/de-tai-nghien-cuu', deTaiNghienCuuRoutes);
app.use('/api/de-tai-nghien-cuu-statistics', deTaiNghienCuuStatisticsRoutes);
app.use('/api/tai-san', taiSanRoutes);
app.use('/api/phong-cua-vien', phongCuaVienRoutes);
app.use('/api/phong-ban', phongBanRoutes);
app.use('/api/bao-hiem-y-te', baoHiemYTeRoutes);
app.use('/api/thong-tin-xe', thongTinXeRoutes);
app.use('/api/media-nhan-su', mediaNhanSuRoutes);
app.use('/api/nhan-su-statistics', nhanSuStatisticsRoutes);
app.use('/api/nghia-vu-nop', nghiaVuNopRoutes);
app.use('/api/thong-bao', thongBaoRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend Quản Lý Viện API đang hoạt động!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test kết nối database
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
    
    // Test query một bảng
    const vienCount = await db.Vien.count();
    const quyenCount = await db.Quyen.count();
    
    res.json({
      message: 'Kết nối database thành công!',
      database: sequelize.config.database,
      host: sequelize.config.host,
      port: sequelize.config.port,
      stats: {
        vien: vienCount,
        quyen: quyenCount
      },
      models: Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize')
    });
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
    res.status(500).json({
      message: 'Lỗi kết nối database',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Có lỗi xảy ra',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route không tồn tại'
  });
});

// Khởi động server
const startServer = async () => {
  try {
    // Test kết nối database trước khi start server
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
    console.log(`📊 Database: ${sequelize.config.database}`);
    console.log(`🌐 Host: ${sequelize.config.host}:${sequelize.config.port}`);
    
    // Sync database (chỉ trong development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Đang đồng bộ database...');
      // Không force sync để tránh mất dữ liệu
      // await sequelize.sync({ alter: true });
      console.log('✅ Database đã sẵn sàng!');
    }
    
    // Start server với Socket.IO
    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
      console.log(`🔔 Socket.IO đã sẵn sàng!`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    console.error('💡 Vui lòng kiểm tra:');
    console.error('   1. Database đã được tạo chưa?');
    console.error('   2. Thông tin kết nối trong .env có đúng không?');
    console.error('   3. MySQL service đang chạy chưa?');
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

module.exports = app;




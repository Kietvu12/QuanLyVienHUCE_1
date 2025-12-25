const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
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




const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;
  try {
    // Tạo kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quanlyvien',
      multipleStatements: true
    });

    console.log('Đang kết nối database...');

    // Đọc file migration
    const migrationPath = path.join(__dirname, '../migrations/013_add_ngay_cap_phong_duyet_to_bao_cao.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Đang chạy migration 013...');
    
    // Chạy migration
    await connection.query(migrationSQL);
    
    console.log('✅ Migration 013 đã chạy thành công!');
    console.log('Đã thêm cột ngay_cap_phong_duyet vào bảng bao_cao');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  Cột ngay_cap_phong_duyet đã tồn tại, bỏ qua migration');
    } else {
      console.error('❌ Lỗi khi chạy migration:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Đã đóng kết nối database');
    }
  }
}

runMigration();


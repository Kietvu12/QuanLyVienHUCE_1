# Backend Quản Lý Viện

Backend API cho hệ thống quản lý viện sử dụng Node.js, Express và Sequelize.

## Cấu trúc dự án

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối database
├── models/                   # Các model Sequelize
│   ├── Vien.js
│   ├── PhongBan.js
│   ├── Quyen.js
│   ├── TaiKhoan.js
│   ├── NhanSu.js
│   ├── BaoHiemYTe.js
│   ├── ThongTinXe.js
│   ├── MediaNhanSu.js
│   ├── DeTaiNghienCuu.js
│   ├── NhanSuDeTai.js
│   ├── TaiLieuDeTai.js
│   ├── PhongCuaVien.js
│   ├── TaiSan.js
│   ├── MediaTaiSan.js
│   ├── DoanhThu.js
│   ├── MediaDoanhThu.js
│   ├── ChiPhi.js
│   ├── MediaChiPhi.js
│   ├── BaoCao.js
│   └── index.js              # Load tất cả models và associations
├── schema_db/
│   └── sql.sql              # Schema database SQL
├── server.js                 # File khởi chạy server
├── package.json
└── README.md
```

## Yêu cầu

- Node.js >= 14.x
- MySQL >= 5.7 hoặc MariaDB >= 10.2
- pnpm (hoặc npm/yarn)

## Cài đặt

1. **Cài đặt dependencies:**
```bash
pnpm install
```

2. **Tạo file .env:**
Tạo file `.env` trong thư mục `backend/` với nội dung:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quan_ly_vien
DB_USER=root
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development
```

3. **Tạo database:**
Chạy file SQL trong `schema_db/sql.sql` để tạo database và các bảng:
```bash
mysql -u root -p < schema_db/sql.sql
```

Hoặc import vào MySQL:
```sql
CREATE DATABASE quan_ly_vien CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_vien;
SOURCE schema_db/sql.sql;
```

## Chạy ứng dụng

**Development mode:**
```bash
pnpm run dev
```

**Production mode:**
```bash
pnpm start
```

Server sẽ chạy tại: `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /` - Trang chủ
- `GET /health` - Kiểm tra trạng thái server và database
- `GET /test-db` - Test kết nối database và hiển thị thông tin

## Models

Tất cả models được định nghĩa theo hướng đối tượng hóa dữ liệu, chỉ chứa các thuộc tính (attributes) và associations, không có phương thức xử lý dữ liệu.

### Danh sách Models:
1. **Vien** - Bảng viện
2. **PhongBan** - Bảng phòng ban
3. **Quyen** - Bảng quyền
4. **TaiKhoan** - Bảng tài khoản
5. **NhanSu** - Bảng nhân sự
6. **BaoHiemYTe** - Bảng bảo hiểm y tế
7. **ThongTinXe** - Bảng thông tin xe
8. **MediaNhanSu** - Bảng media nhân sự
9. **DeTaiNghienCuu** - Bảng đề tài nghiên cứu
10. **NhanSuDeTai** - Bảng nhân sự đề tài
11. **TaiLieuDeTai** - Bảng tài liệu đề tài
12. **PhongCuaVien** - Bảng phòng của viện
13. **TaiSan** - Bảng tài sản
14. **MediaTaiSan** - Bảng media tài sản
15. **DoanhThu** - Bảng doanh thu
16. **MediaDoanhThu** - Bảng media doanh thu
17. **ChiPhi** - Bảng chi phí
18. **MediaChiPhi** - Bảng media chi phí
19. **BaoCao** - Bảng báo cáo

## Quyền trong hệ thống

- **hieu_truong** - Quyền hiệu trưởng (quyền cao nhất)
- **cap_phong** - Quyền cấp phòng (cấp trên của Viện)
- **vien_truong** - Quyền viện trưởng (quản lý một Viện)
- **ke_toan_vien** - Quyền kế toán Viện (quản lý tài chính)

## Lưu ý

- Tất cả tên trường trong database sử dụng tiếng Việt không dấu
- Models sử dụng Sequelize ORM với MySQL
- Tất cả foreign keys đã được thiết lập với associations
- Timestamps được tự động quản lý bởi Sequelize




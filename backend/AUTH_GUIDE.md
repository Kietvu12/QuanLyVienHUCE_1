# Hướng dẫn Authentication & Authorization

## Cài đặt

Các package đã được cài đặt:
- `jsonwebtoken`: Tạo và verify JWT tokens
- `bcryptjs`: Hash và verify passwords

## Cấu hình

Thêm vào file `.env`:
```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

## API Endpoints

### 1. Đăng nhập
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "ho_ten": "Admin User",
      "id_quyen": 1,
      "id_vien": null,
      "trang_thai": 1,
      "quyen": {
        "id": 1,
        "ten_quyen": "hieu_truong",
        "mo_ta": "..."
      },
      "vien": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Đăng ký (Chỉ dành cho Hiệu trưởng)
**POST** `/api/auth/register`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "ho_ten": "New User",
  "id_quyen": 2,
  "id_vien": 1
}
```

### 3. Lấy thông tin profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "ho_ten": "Admin User",
    "quyen": {...},
    "vien": {...}
  }
}
```

### 4. Đổi mật khẩu
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Middleware

### 1. Authentication Middleware
Xác thực token JWT:

```javascript
const { authenticate } = require('./middleware/authMiddleware');

router.get('/protected-route', authenticate, controller.handler);
```

### 2. Authorization Middleware
Kiểm tra quyền cụ thể:

```javascript
const { authorize } = require('./middleware/authMiddleware');

// Chỉ cho phép các quyền được chỉ định
router.get('/admin-route', authenticate, authorize('hieu_truong', 'cap_phong'), controller.handler);
```

### 3. Minimum Role Middleware
Kiểm tra quyền tối thiểu (theo hierarchy):

```javascript
const { authorizeMinRole } = require('./middleware/authMiddleware');

// Cho phép vien_truong trở lên
router.get('/vien-truong-route', authenticate, authorizeMinRole('vien_truong'), controller.handler);
```

### 4. Vien Access Middleware
Kiểm tra quyền truy cập viện:

```javascript
const { authorizeVien } = require('./middleware/authMiddleware');

// Kiểm tra user có quyền truy cập viện trong request
router.get('/vien-data', authenticate, authorizeVien, controller.handler);
```

## Phân quyền

### Hierarchy (từ thấp đến cao):
1. **ke_toan_vien** - Kế toán viên (cấp thấp nhất)
2. **vien_truong** - Viện trưởng
3. **cap_phong** - Cấp phòng
4. **hieu_truong** - Hiệu trưởng (cấp cao nhất)

### Quyền truy cập:

#### Kế toán viên (ke_toan_vien):
- Chỉ có quyền với viện của mình (id_vien)
- CRUD: Báo cáo, Doanh thu, Chi phí, Nhân sự, Tài sản
- Xem: Phòng của viện, Đề tài nghiên cứu

#### Viện trưởng (vien_truong):
- Có quyền với tất cả dữ liệu trong viện của mình
- Phê duyệt/từ chối báo cáo
- Thay đổi quyền tài khoản trong viện

#### Cấp phòng (cap_phong):
- Xem tất cả dữ liệu của tất cả viện
- Phê duyệt/từ chối báo cáo từ các viện
- Tạo báo cáo tổng quan

#### Hiệu trưởng (hieu_truong):
- Xem tất cả dữ liệu của tất cả viện
- Thao tác với tất cả tài khoản
- Tạo viện mới
- Xem tất cả báo cáo

## Sử dụng trong Controllers

Ví dụ bảo vệ route với authentication:

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const controller = require('../controllers/exampleController');

// Route cần đăng nhập
router.get('/', authenticate, controller.getAll);

// Route cần đăng nhập và quyền cụ thể
router.post('/', authenticate, authorize('vien_truong', 'hieu_truong'), controller.create);

// Route cần quyền tối thiểu
router.delete('/:id', authenticate, authorizeMinRole('vien_truong'), controller.delete);
```

## Lưu ý

1. **JWT Secret**: Phải thay đổi `JWT_SECRET` trong production
2. **Token Expiry**: Mặc định 24h, có thể cấu hình trong `.env`
3. **Password**: Được hash bằng bcrypt với salt rounds = 10
4. **Token Format**: `Bearer <token>` trong header Authorization
5. **User Info**: Sau khi authenticate, thông tin user có trong `req.user`

## Ví dụ sử dụng trong Frontend

```javascript
// Đăng nhập
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});
const { data } = await response.json();
const token = data.token;

// Lưu token
localStorage.setItem('token', token);

// Sử dụng token cho các request
const protectedResponse = await fetch('/api/nhan-su', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```


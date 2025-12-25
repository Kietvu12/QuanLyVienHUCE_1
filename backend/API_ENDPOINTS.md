# API Endpoints - Quản Lý Viện

## 1. Nhân Sự (`/api/nhan-su`)

### GET `/api/nhan-su`
Lấy danh sách nhân sự (có phân trang và filter)

**Query Parameters:**
- `id_vien` (optional): Filter theo ID viện
- `id_phong_ban` (optional): Filter theo ID phòng ban
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số bản ghi mỗi trang

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Includes:** Phòng ban, Viện, Bảo hiểm y tế, Thông tin xe, Media, Hợp đồng lao động, Bảng lương

---

### GET `/api/nhan-su/:id`
Lấy thông tin chi tiết nhân sự theo ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ho_ten": "...",
    ...
  }
}
```

**Includes:** Tất cả thông tin liên quan (phòng ban, viện, bảo hiểm, xe, media, hợp đồng, bảng lương, đề tài)

---

### POST `/api/nhan-su`
Tạo nhân sự mới

**Request Body:**
```json
{
  "id_phong_ban": 1,
  "ho_ten": "Nguyễn Văn A",
  "dia_chi_tam_tru": null,
  "dia_chi_thuong_tru": null,
  "cccd": null,
  "bang_cap": null,
  "so_dien_thoai": null,
  "email": null,
  "nguoi_than_lien_he": null,
  "ngay_bat_dau_lam": null,
  "ngay_ket_thuc_lam_viec": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo nhân sự thành công",
  "data": {...}
}
```

---

### PUT `/api/nhan-su/:id`
Cập nhật thông tin nhân sự

**Request Body:** (tương tự POST, tất cả fields đều optional)

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật nhân sự thành công",
  "data": {...}
}
```

---

### DELETE `/api/nhan-su/:id`
Xóa nhân sự (cascade xóa các bảng liên quan)

**Response:**
```json
{
  "success": true,
  "message": "Xóa nhân sự thành công"
}
```

---

## 2. Hợp Đồng Lao Động (`/api/hop-dong-lao-dong`)

### GET `/api/hop-dong-lao-dong`
Lấy danh sách hợp đồng lao động

**Query Parameters:**
- `id_nhan_su` (optional): Filter theo ID nhân sự
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

**Includes:** Thông tin nhân sự, phòng ban, viện

---

### GET `/api/hop-dong-lao-dong/:id`
Lấy thông tin chi tiết hợp đồng lao động

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

### POST `/api/hop-dong-lao-dong`
Tạo hợp đồng lao động mới

**Request Body:**
```json
{
  "id_nhan_su": 1,
  "ma_hop_dong": "HD001",
  "ngay_tao_hop_dong_lao_dong": "2024-01-01",
  "luong_theo_hop_dong": 10000000,
  "ngay_ki_hop_dong": "2024-01-01",
  "ngay_ket_thuc_hop_dong_lao_dong": null,
  "duong_dan_tai_lieu": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo hợp đồng lao động thành công",
  "data": {...}
}
```

---

### PUT `/api/hop-dong-lao-dong/:id`
Cập nhật hợp đồng lao động

**Request Body:** (tất cả fields đều optional)

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật hợp đồng lao động thành công",
  "data": {...}
}
```

---

### DELETE `/api/hop-dong-lao-dong/:id`
Xóa hợp đồng lao động

**Response:**
```json
{
  "success": true,
  "message": "Xóa hợp đồng lao động thành công"
}
```

---

## 3. Bảng Lương (`/api/bang-luong`)

### GET `/api/bang-luong`
Lấy danh sách bảng lương

**Query Parameters:**
- `id_nhan_su` (optional): Filter theo ID nhân sự
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

**Includes:** Thông tin nhân sự, phòng ban, viện

---

### GET `/api/bang-luong/:id`
Lấy thông tin chi tiết bảng lương

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

### POST `/api/bang-luong`
Tạo bảng lương mới

**Request Body:**
```json
{
  "id_nhan_su": 1,
  "luong_thuc_nhan": 10000000,
  "thuong": 500000,
  "phat": 200000,
  "thuc_nhan": 10300000
}
```

**Note:** Nếu không cung cấp `thuc_nhan`, hệ thống sẽ tự động tính: `luong_thuc_nhan + thuong - phat`

**Response:**
```json
{
  "success": true,
  "message": "Tạo bảng lương thành công",
  "data": {...}
}
```

---

### PUT `/api/bang-luong/:id`
Cập nhật bảng lương

**Request Body:** (tất cả fields đều optional)

**Note:** Nếu không cung cấp `thuc_nhan`, hệ thống sẽ tự động tính lại

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật bảng lương thành công",
  "data": {...}
}
```

---

### DELETE `/api/bang-luong/:id`
Xóa bảng lương

**Response:**
```json
{
  "success": true,
  "message": "Xóa bảng lương thành công"
}
```

---

## Lưu ý

1. Tất cả các trường có thể nhận giá trị `null` (trừ các trường bắt buộc)
2. Tất cả các API đều trả về format JSON với `success` và `message`/`data`
3. Lỗi sẽ trả về status code tương ứng (400, 404, 500) với message chi tiết
4. Pagination mặc định: page=1, limit=10
5. Tất cả các dates sử dụng format: `YYYY-MM-DD`


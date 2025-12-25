# Hướng dẫn sử dụng API Service

## Cấu hình

Thêm vào file `.env` hoặc `.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
```

## Import API Services

```javascript
import { 
  authAPI, 
  nhanSuAPI, 
  hopDongLaoDongAPI,
  bangLuongAPI,
  doanhThuAPI,
  chiPhiAPI,
  baoCaoAPI,
  deTaiNghienCuuAPI,
  taiSanAPI,
  phongCuaVienAPI
} from '../services/api';

// Hoặc import default
import api from '../services/api';
// Sử dụng: api.auth.login(), api.nhanSu.getAll(), etc.
```

## Authentication

### Đăng nhập
```javascript
import { authAPI } from '../services/api';

const handleLogin = async (username, password) => {
  try {
    const response = await authAPI.login(username, password);
    if (response.success) {
      // Token đã được lưu tự động trong localStorage
      const user = response.data.user;
      console.log('Đăng nhập thành công:', user);
    } else {
      console.error('Đăng nhập thất bại:', response.message);
    }
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
};
```

### Sử dụng với AuthContext
```javascript
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      // Redirect to dashboard
    }
  };
}
```

### Lấy thông tin profile
```javascript
import { authAPI } from '../services/api';

const getProfile = async () => {
  try {
    const response = await authAPI.getProfile();
    if (response.success) {
      console.log('User profile:', response.data);
    }
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
};
```

### Đổi mật khẩu
```javascript
import { authAPI } from '../services/api';

const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await authAPI.changePassword(oldPassword, newPassword);
    if (response.success) {
      console.log('Đổi mật khẩu thành công');
    }
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
};
```

## Nhân Sự API

### Lấy danh sách nhân sự
```javascript
import { nhanSuAPI } from '../services/api';

// Lấy tất cả
const getAll = async () => {
  const response = await nhanSuAPI.getAll();
  console.log(response.data); // Array of nhân sự
  console.log(response.pagination); // Pagination info
};

// Lấy với filter và pagination
const getFiltered = async () => {
  const response = await nhanSuAPI.getAll({
    id_vien: 1,
    id_phong_ban: 2,
    page: 1,
    limit: 20
  });
};
```

### Lấy chi tiết nhân sự
```javascript
const getDetail = async (id) => {
  const response = await nhanSuAPI.getById(id);
  console.log(response.data); // Chi tiết nhân sự với tất cả relations
};
```

### Tạo nhân sự mới
```javascript
const createNhanSu = async () => {
  const data = {
    id_phong_ban: 1,
    ho_ten: 'Nguyễn Văn A',
    cccd: '123456789012',
    so_dien_thoai: '0123456789',
    email: 'nguyenvana@example.com',
    ngay_bat_dau_lam: '2024-01-01'
  };
  
  const response = await nhanSuAPI.create(data);
  if (response.success) {
    console.log('Tạo thành công:', response.data);
  }
};
```

### Cập nhật nhân sự
```javascript
const updateNhanSu = async (id) => {
  const data = {
    ho_ten: 'Nguyễn Văn B',
    so_dien_thoai: '0987654321'
  };
  
  const response = await nhanSuAPI.update(id, data);
  if (response.success) {
    console.log('Cập nhật thành công:', response.data);
  }
};
```

### Xóa nhân sự
```javascript
const deleteNhanSu = async (id) => {
  const response = await nhanSuAPI.delete(id);
  if (response.success) {
    console.log('Xóa thành công');
  }
};
```

## Hợp Đồng Lao Động API

```javascript
import { hopDongLaoDongAPI } from '../services/api';

// Lấy danh sách
const contracts = await hopDongLaoDongAPI.getAll({ id_nhan_su: 1 });

// Lấy chi tiết
const contract = await hopDongLaoDongAPI.getById(1);

// Tạo mới
const newContract = await hopDongLaoDongAPI.create({
  id_nhan_su: 1,
  ma_hop_dong: 'HD001',
  ngay_tao_hop_dong_lao_dong: '2024-01-01',
  luong_theo_hop_dong: 10000000,
  ngay_ki_hop_dong: '2024-01-01'
});

// Cập nhật
await hopDongLaoDongAPI.update(1, { luong_theo_hop_dong: 12000000 });

// Xóa
await hopDongLaoDongAPI.delete(1);
```

## Bảng Lương API

```javascript
import { bangLuongAPI } from '../services/api';

// Tạo bảng lương (thực nhận sẽ tự tính nếu không cung cấp)
const salary = await bangLuongAPI.create({
  id_nhan_su: 1,
  luong_thuc_nhan: 10000000,
  thuong: 500000,
  phat: 200000
  // thuc_nhan sẽ tự động = 10000000 + 500000 - 200000 = 10300000
});
```

## Báo Cáo API

```javascript
import { baoCaoAPI } from '../services/api';

// Gửi báo cáo
await baoCaoAPI.gui(baoCaoId);

// Phê duyệt báo cáo
await baoCaoAPI.pheDuyet(baoCaoId, nguoiPheDuyetId);

// Từ chối báo cáo
await baoCaoAPI.tuChoi(baoCaoId, nguoiPheDuyetId);
```

## Doanh Thu & Chi Phí API

```javascript
import { doanhThuAPI, chiPhiAPI } from '../services/api';

// Doanh thu
const revenues = await doanhThuAPI.getAll({ 
  id_vien: 1, 
  trang_thai: 'da_nhan' 
});

// Chi phí
const expenses = await chiPhiAPI.getAll({ 
  id_vien: 1, 
  trang_thai: 'chua_tat_toan' 
});
```

## Đề Tài Nghiên Cứu API

```javascript
import { deTaiNghienCuuAPI } from '../services/api';

// Cập nhật đề tài (validation: nếu trang_thai = 'hoan_thanh' thì tien_do phải = 100)
await deTaiNghienCuuAPI.update(id, {
  tien_do: 100,
  trang_thai: 'hoan_thanh'
});
```

## Tài Sản & Phòng Của Viện API

```javascript
import { taiSanAPI, phongCuaVienAPI } from '../services/api';

// Lấy danh sách tài sản
const assets = await taiSanAPI.getAll({ id_vien: 1, tinh_trang: 'tot' });

// Lấy danh sách phòng
const rooms = await phongCuaVienAPI.getAll({ id_vien: 1, trang_thai: 'trong' });
```

## Error Handling

Tất cả các API functions đều throw error nếu có lỗi. Nên wrap trong try-catch:

```javascript
try {
  const response = await nhanSuAPI.getAll();
  if (response.success) {
    // Handle success
  }
} catch (error) {
  console.error('API Error:', error.message);
  // Show error to user
}
```

## Pagination

Tất cả các API `getAll` đều hỗ trợ pagination:

```javascript
const response = await nhanSuAPI.getAll({
  page: 1,
  limit: 20
});

// Response structure:
// {
//   success: true,
//   data: [...],
//   pagination: {
//     total: 100,
//     page: 1,
//     limit: 20,
//     totalPages: 5
//   }
// }
```

## Query Parameters

Tất cả các query parameters được tự động encode:

```javascript
// Filter theo nhiều điều kiện
const response = await nhanSuAPI.getAll({
  id_vien: 1,
  id_phong_ban: 2,
  page: 1,
  limit: 10
});
// URL: /api/nhan-su?id_vien=1&id_phong_ban=2&page=1&limit=10
```

## Lưu ý

1. **Token tự động**: Token được tự động lấy từ localStorage và thêm vào header Authorization
2. **Error handling**: Tất cả errors đều được log ra console, bạn có thể customize trong `apiRequest` function
3. **Date format**: Tất cả dates sử dụng format `YYYY-MM-DD`
4. **Null values**: Các trường có thể null, có thể truyền `null` hoặc không truyền


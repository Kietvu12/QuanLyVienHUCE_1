// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getToken = () => {
  // Try to get token from localStorage directly
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }
  
  // Fallback: try to get from user object
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Base fetch function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  login: async (username, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response;
  },

  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  getProfile: async () => {
    const response = await apiRequest('/auth/profile');
    return response;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response;
  },
};

// ==================== NHAN SU API ====================

export const nhanSuAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/nhan-su${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/nhan-su/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/nhan-su', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/nhan-su/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/nhan-su/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== HOP DONG LAO DONG API ====================

export const hopDongLaoDongAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/hop-dong-lao-dong${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/hop-dong-lao-dong/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/hop-dong-lao-dong', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/hop-dong-lao-dong/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/hop-dong-lao-dong/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== BANG LUONG API ====================

export const bangLuongAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/bang-luong${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/bang-luong/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/bang-luong', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/bang-luong/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/bang-luong/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== DOANH THU API ====================

export const doanhThuAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/doanh-thu${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/doanh-thu/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/doanh-thu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/doanh-thu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/doanh-thu/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== CHI PHI API ====================

export const chiPhiAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/chi-phi${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/chi-phi/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/chi-phi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/chi-phi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/chi-phi/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== BAO CAO API ====================

export const baoCaoAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/bao-cao${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/bao-cao/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/bao-cao', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/bao-cao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/bao-cao/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  gui: async (id) => {
    const response = await apiRequest(`/bao-cao/${id}/gui`, {
      method: 'POST',
    });
    return response;
  },

  pheDuyet: async (id, id_nguoi_phe_duyet) => {
    const response = await apiRequest(`/bao-cao/${id}/phe-duyet`, {
      method: 'POST',
      body: JSON.stringify({ id_nguoi_phe_duyet }),
    });
    return response;
  },

  tuChoi: async (id, id_nguoi_phe_duyet) => {
    const response = await apiRequest(`/bao-cao/${id}/tu-choi`, {
      method: 'POST',
      body: JSON.stringify({ id_nguoi_phe_duyet }),
    });
    return response;
  },
};

// ==================== DE TAI NGHIEN CUU API ====================

export const deTaiNghienCuuAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/de-tai-nghien-cuu${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/de-tai-nghien-cuu/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/de-tai-nghien-cuu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/de-tai-nghien-cuu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/de-tai-nghien-cuu/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== TAI SAN API ====================

export const taiSanAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/tai-san${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/tai-san/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/tai-san', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/tai-san/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/tai-san/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== PHONG CUA VIEN API ====================

export const phongCuaVienAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/phong-cua-vien${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/phong-cua-vien/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/phong-cua-vien', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/phong-cua-vien/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/phong-cua-vien/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== VIEN API ====================

export const vienAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/vien${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/vien/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/vien', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/vien/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/vien/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== PHONG BAN API ====================

export const phongBanAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/phong-ban${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/phong-ban/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/phong-ban', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/phong-ban/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/phong-ban/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== BAO HIEM Y TE API ====================

export const baoHiemYTeAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/bao-hiem-y-te${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/bao-hiem-y-te/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/bao-hiem-y-te', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/bao-hiem-y-te/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/bao-hiem-y-te/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== THONG TIN XE API ====================

export const thongTinXeAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/thong-tin-xe${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },

  getById: async (id) => {
    const response = await apiRequest(`/thong-tin-xe/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiRequest('/thong-tin-xe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id, data) => {
    const response = await apiRequest(`/thong-tin-xe/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id) => {
    const response = await apiRequest(`/thong-tin-xe/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ==================== MEDIA NHAN SU API ====================

export const mediaNhanSuAPI = {
  getByNhanSuId: async (id_nhan_su) => {
    const response = await apiRequest(`/media-nhan-su/nhan-su/${id_nhan_su}`);
    return response;
  },

  upsert: async (id_nhan_su, data) => {
    const response = await apiRequest(`/media-nhan-su/nhan-su/${id_nhan_su}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  // Upload file - hỗ trợ cả FormData (file) và base64
  uploadFile: async (id_nhan_su, file_type, files) => {
    const token = localStorage.getItem('token');
    
    // Nếu files là FileList hoặc File[], sử dụng FormData
    if (files && (files instanceof FileList || (Array.isArray(files) && files[0] instanceof File))) {
      const formData = new FormData();
      formData.append('id_nhan_su', id_nhan_su);
      formData.append('file_type', file_type);
      
      // Thêm tất cả files vào FormData
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_BASE_URL}/media-nhan-su/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } 
    // Tương thích ngược: nếu là base64
    else {
      const response = await apiRequest('/media-nhan-su/upload', {
        method: 'POST',
        body: JSON.stringify({ 
          id_nhan_su, 
          file_type, 
          file_data: files, // single base64
          files_data: Array.isArray(files) ? files : [files] // array of base64
        }),
      });
      return response;
    }
  },
};

// ==================== NHAN SU STATISTICS API ====================

export const nhanSuStatisticsAPI = {
  getSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/nhan-su-statistics/summary${queryString ? `?${queryString}` : ''}`);
    return response;
  },

  getDistributionByPhongBan: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/nhan-su-statistics/distribution/phong-ban${queryString ? `?${queryString}` : ''}`);
    return response;
  },

  getDistributionByChucVu: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/nhan-su-statistics/distribution/chuc-vu${queryString ? `?${queryString}` : ''}`);
    return response;
  },

  getDistributionByAgeGroup: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/nhan-su-statistics/distribution/nhom-tuoi${queryString ? `?${queryString}` : ''}`);
    return response;
  },
};

// ==================== HOP DONG STATISTICS API ====================

export const hopDongStatisticsAPI = {
  getStatistics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/hop-dong-lao-dong/statistics${queryString ? `?${queryString}` : ''}`);
    return response;
  },
};

// ==================== XE STATISTICS API ====================

export const xeStatisticsAPI = {
  getStatistics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/thong-tin-xe/statistics${queryString ? `?${queryString}` : ''}`);
    return response;
  },
};

// Export default API object
export default {
  auth: authAPI,
  vien: vienAPI,
  nhanSu: nhanSuAPI,
  hopDongLaoDong: hopDongLaoDongAPI,
  bangLuong: bangLuongAPI,
  doanhThu: doanhThuAPI,
  chiPhi: chiPhiAPI,
  baoCao: baoCaoAPI,
  deTaiNghienCuu: deTaiNghienCuuAPI,
  taiSan: taiSanAPI,
  phongCuaVien: phongCuaVienAPI,
  phongBan: phongBanAPI,
  baoHiemYTe: baoHiemYTeAPI,
  thongTinXe: thongTinXeAPI,
  mediaNhanSu: mediaNhanSuAPI,
  nhanSuStatistics: nhanSuStatisticsAPI,
  hopDongStatistics: hopDongStatisticsAPI,
  xeStatistics: xeStatisticsAPI,
};


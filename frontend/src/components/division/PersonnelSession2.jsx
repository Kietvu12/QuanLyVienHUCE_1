import { FaSearch, FaBuilding, FaEye, FaTimes, FaFile, FaCar, FaUserTie, FaImage } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { nhanSuAPI, vienAPI, phongBanAPI, hopDongLaoDongAPI, thongTinXeAPI, mediaNhanSuAPI, loaiHopDongAPI } from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatCurrency = (value) => {
  if (!value) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value)) + ' đ';
};

const PersonnelSession2 = () => {
  const [loading, setLoading] = useState(true);
  const [personnelData, setPersonnelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viens, setViens] = useState([]);
  const [phongBans, setPhongBans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVien, setSelectedVien] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState('');
  const [selectedChucVu, setSelectedChucVu] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modal chi tiết state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelDetail, setPersonnelDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailTab, setDetailTab] = useState('info'); // info, media, contract, vehicle
  const [hopDongs, setHopDongs] = useState([]);
  const [thongTinXe, setThongTinXe] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loaiHopDongs, setLoaiHopDongs] = useState([]);

  useEffect(() => {
    fetchViens();
    fetchPersonnelData();
  }, []);

  useEffect(() => {
    fetchPhongBans();
  }, [selectedVien]);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (searchTerm || selectedVien || selectedPhongBan || selectedChucVu) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchTerm, selectedVien, selectedPhongBan, selectedChucVu]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedVien, selectedPhongBan, selectedChucVu, personnelData, pagination.page]);

  useEffect(() => {
    if (showDetailModal && selectedPersonnel) {
      fetchPersonnelDetail(selectedPersonnel.id);
    }
  }, [showDetailModal, selectedPersonnel]);

  const fetchViens = async () => {
    try {
      const response = await vienAPI.getAll({ limit: 100 });
      if (response.success) {
        setViens(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching viens:', err);
    }
  };

  const fetchPhongBans = async () => {
    try {
      const params = { limit: 100 };
      if (selectedVien) {
        params.id_vien = selectedVien;
      }
      const response = await phongBanAPI.getAll(params);
      if (response.success) {
        setPhongBans(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching phong bans:', err);
    }
  };

  const fetchPersonnelData = async () => {
    try {
      setLoading(true);
      // Cấp phòng lấy nhân sự từ tất cả viện (không filter id_vien)
      const response = await nhanSuAPI.getAll({
        limit: 1000, // Lấy tất cả để filter ở frontend
        page: 1
      });

      if (response.success) {
        const personnel = (response.data || []).map(item => ({
          id: item.id,
          code: `NV-${item.id}`,
          name: item.ho_ten || 'Chưa có tên',
          position: item.chuc_vu || '-',
          department: item.phongBan?.ten_phong_ban || '-',
          institute: item.vien?.ten_vien || 'Chưa xác định',
          id_vien: item.id_vien,
          id_phong_ban: item.id_phong_ban,
          email: item.email || '-',
          phone: item.so_dien_thoai || '-',
          startDate: item.ngay_vao_lam ? formatDate(item.ngay_vao_lam) : '-',
          salary: item.luong_co_ban ? formatCurrency(item.luong_co_ban) : '-',
          trang_thai: item.trang_thai || 'dang_lam_viec',
          rawData: item
        }));
        setPersonnelData(personnel);
        setPagination(prev => ({ ...prev, total: personnel.length }));
      }
    } catch (err) {
      console.error('Error fetching personnel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnelDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setDetailTab('info');
      
      // Fetch thông tin chi tiết nhân sự
      const [personnelRes, hopDongRes, xeRes, mediaRes, loaiHopDongRes] = await Promise.allSettled([
        nhanSuAPI.getById(id),
        hopDongLaoDongAPI.getAll({ id_nhan_su: id, limit: 100 }),
        thongTinXeAPI.getAll({ id_nhan_su: id, limit: 100 }),
        mediaNhanSuAPI.getByNhanSuId(id),
        loaiHopDongAPI.getAll({ limit: 100 })
      ]);

      if (personnelRes.status === 'fulfilled' && personnelRes.value.success) {
        setPersonnelDetail(personnelRes.value.data);
      }

      if (hopDongRes.status === 'fulfilled' && hopDongRes.value.success) {
        setHopDongs(hopDongRes.value.data || []);
      }

      if (xeRes.status === 'fulfilled' && xeRes.value.success) {
        setThongTinXe(xeRes.value.data || []);
      }

      if (mediaRes.status === 'fulfilled' && mediaRes.value.success) {
        if (mediaRes.value.data) {
          // Transform dữ liệu media từ format backend sang format hiển thị
          const mediaData = mediaRes.value.data;
          const allMediaFiles = [];
          
          // Hàm helper để thêm media vào danh sách
          const addMediaFiles = (fieldName, files) => {
            if (!files) return;
            
            // Nếu là array
            if (Array.isArray(files)) {
              files.forEach((filePath, index) => {
                if (filePath && typeof filePath === 'string' && filePath.trim()) {
                  allMediaFiles.push({
                    id: `${fieldName}-${index}`,
                    duong_dan: filePath.trim(),
                    ten_file: filePath.split('/').pop() || `${fieldName} ${index + 1}`,
                    loai: fieldName
                  });
                }
              });
            } 
            // Nếu là string
            else if (typeof files === 'string' && files.trim()) {
              // Kiểm tra xem có phải là JSON string không
              try {
                const parsed = JSON.parse(files.trim());
                if (Array.isArray(parsed)) {
                  parsed.forEach((filePath, index) => {
                    if (filePath && typeof filePath === 'string' && filePath.trim()) {
                      allMediaFiles.push({
                        id: `${fieldName}-${index}`,
                        duong_dan: filePath.trim(),
                        ten_file: filePath.split('/').pop() || `${fieldName} ${index + 1}`,
                        loai: fieldName
                      });
                    }
                  });
                } else {
                  allMediaFiles.push({
                    id: fieldName,
                    duong_dan: files.trim(),
                    ten_file: files.split('/').pop() || fieldName,
                    loai: fieldName
                  });
                }
              } catch (e) {
                // Không phải JSON, coi như string đơn
                allMediaFiles.push({
                  id: fieldName,
                  duong_dan: files.trim(),
                  ten_file: files.split('/').pop() || fieldName,
                  loai: fieldName
                });
              }
            }
          };
          
          // Lấy tất cả các loại ảnh
          addMediaFiles('anh_ho_so', mediaData.anh_ho_so);
          addMediaFiles('anh_bang_cap', mediaData.anh_bang_cap);
          addMediaFiles('anh_bhyt', mediaData.anh_bhyt);
          addMediaFiles('anh_hop_dong', mediaData.anh_hop_dong);
          addMediaFiles('anh_xe', mediaData.anh_xe);
          
          console.log('Media files transformed:', allMediaFiles);
          setMediaFiles(allMediaFiles);
        } else {
          console.log('No media data found');
          setMediaFiles([]);
        }
      } else {
        console.error('Error fetching media:', mediaRes.status === 'rejected' ? mediaRes.reason : mediaRes.value);
        setMediaFiles([]);
      }

      if (loaiHopDongRes.status === 'fulfilled' && loaiHopDongRes.value.success) {
        setLoaiHopDongs(loaiHopDongRes.value.data || []);
      }
    } catch (err) {
      console.error('Error fetching personnel detail:', err);
      alert(err.message || 'Lỗi khi tải thông tin nhân sự');
    } finally {
      setLoadingDetail(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...personnelData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected vien
    if (selectedVien) {
      filtered = filtered.filter(item => item.id_vien.toString() === selectedVien);
    }

    // Filter by selected phong ban
    if (selectedPhongBan) {
      filtered = filtered.filter(item => item.id_phong_ban?.toString() === selectedPhongBan);
    }

    // Filter by selected chuc vu
    if (selectedChucVu) {
      filtered = filtered.filter(item => item.position.toLowerCase().includes(selectedChucVu.toLowerCase()));
    }

    // Update total count after filtering
    const totalFiltered = filtered.length;
    setPagination(prev => ({ ...prev, total: totalFiltered }));

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    filtered = filtered.slice(startIndex, endIndex);

    setFilteredData(filtered);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewDetail = (person) => {
    setSelectedPersonnel(person);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPersonnel(null);
    setPersonnelDetail(null);
    setHopDongs([]);
    setThongTinXe([]);
    setMediaFiles([]);
    setDetailTab('info');
  };

  // Hàm lấy URL file đầy đủ (giống với component rector)
  const getFileUrl = (path) => {
    if (!path) return '#';
    
    // Nếu là base64 data URL, trả về nguyên
    if (path.startsWith('data:')) {
      return path;
    }
    
    // Nếu là URL (bắt đầu với /uploads)
    if (path.startsWith('/uploads')) {
      // Lấy baseURL từ API_BASE_URL và loại bỏ /api
      const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      // Loại bỏ /api nếu có, đảm bảo không có trailing slash
      let baseURL = apiBaseURL.replace(/\/api\/?$/, '');
      if (!baseURL) baseURL = 'http://localhost:3000';
      // Đảm bảo không có double slash
      const imagePath = path.startsWith('/') ? path : `/${path}`;
      return `${baseURL}${imagePath}`;
    }
    
    // Nếu đã là full URL (http:// hoặc https://)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Trả về nguyên bản nếu không phải cả hai
    return path;
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, pagination.total);

  // Lấy danh sách chức vụ unique từ dữ liệu
  const uniqueChucVus = [...new Set(personnelData.map(item => item.position))].filter(Boolean);

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách nhân sự tất cả các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem thông tin nhân sự của tất cả các Viện
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, mã nhân viên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select 
            value={selectedVien}
            onChange={(e) => {
              setSelectedVien(e.target.value);
              setSelectedPhongBan('');
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả Viện</option>
            {viens.map((vien) => (
              <option key={vien.id} value={vien.id.toString()}>
                {vien.ten_vien}
              </option>
            ))}
          </select>
          <select 
            value={selectedPhongBan}
            onChange={(e) => setSelectedPhongBan(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả phòng ban</option>
            {phongBans.map((pb) => (
              <option key={pb.id} value={pb.id.toString()}>
                {pb.ten_phong_ban}
              </option>
            ))}
          </select>
          <select 
            value={selectedChucVu}
            onChange={(e) => setSelectedChucVu(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả chức vụ</option>
            {uniqueChucVus.map((chucVu, index) => (
              <option key={index} value={chucVu}>
                {chucVu}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mã NV
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Chức vụ
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Viện
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày vào làm
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lương
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((person) => {
                  const initials = person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(-2);
                  
                  return (
                    <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-blue-600">{person.code}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs`}>
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{person.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{person.position}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {person.department}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">{person.institute}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-600">
                          <div>{person.email}</div>
                          <div className="text-gray-500">{person.phone}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{person.startDate}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {person.salary}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewDetail(person)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
          ) : (
            filteredData.map((person) => {
              const initials = person.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(-2);
              
              return (
                <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                        <span className="text-xs font-medium text-blue-600">{person.code}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600">{person.position}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {person.department}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">Viện:</span>
                      <span className="text-xs text-gray-900 font-medium">{person.institute}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="mb-1">
                        <span className="text-gray-500">Email: </span>
                        <span className="text-gray-900">{person.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Điện thoại: </span>
                        <span className="text-gray-900">{person.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-600">Ngày vào làm: </span>
                        <span className="text-xs text-gray-900 font-medium">{person.startDate}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Lương: </span>
                        <span className="text-sm font-semibold text-gray-900">{person.salary}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetail(person)}
                      className="w-full mt-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Hiển thị {startIndex + 1}-{endIndex} của {pagination.total} kết quả
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal chi tiết nhân sự */}
      {showDetailModal && selectedPersonnel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết nhân sự</h3>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {loadingDetail ? (
              <div className="p-6 text-center text-gray-500">Đang tải...</div>
            ) : (
              <div className="p-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setDetailTab('info')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      detailTab === 'info'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Thông tin
                  </button>
                  <button
                    onClick={() => setDetailTab('media')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      detailTab === 'media'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaImage className="inline w-4 h-4 mr-1" />
                    Media ({mediaFiles.length})
                  </button>
                  <button
                    onClick={() => setDetailTab('contract')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      detailTab === 'contract'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaUserTie className="inline w-4 h-4 mr-1" />
                    Hợp đồng ({hopDongs.length})
                  </button>
                  <button
                    onClick={() => setDetailTab('vehicle')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      detailTab === 'vehicle'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaCar className="inline w-4 h-4 mr-1" />
                    Xe ({thongTinXe.length})
                  </button>
                </div>

                {/* Tab Content */}
                {detailTab === 'info' && personnelDetail && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-600">Mã nhân viên:</span>
                        <p className="text-sm font-medium text-gray-900">NV-{personnelDetail.id}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Họ tên:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.ho_ten || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Chức vụ:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.chuc_vu || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Phòng ban:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.phongBan?.ten_phong_ban || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Viện:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.vien?.ten_vien || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Email:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.email || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Số điện thoại:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.so_dien_thoai || '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Ngày vào làm:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.ngay_vao_lam ? formatDate(personnelDetail.ngay_vao_lam) : '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Lương cơ bản:</span>
                        <p className="text-sm font-medium text-gray-900">{personnelDetail.luong_co_ban ? formatCurrency(personnelDetail.luong_co_ban) : '-'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Trạng thái:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {personnelDetail.trang_thai === 'dang_lam_viec' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'media' && (
                  <div>
                    {mediaFiles.length > 0 ? (
                      <div className="space-y-4">
                        {/* Nhóm theo loại */}
                        {['anh_ho_so', 'anh_bang_cap', 'anh_bhyt', 'anh_hop_dong', 'anh_xe'].map((loai) => {
                          const filesOfType = mediaFiles.filter(f => f.loai === loai);
                          if (filesOfType.length === 0) return null;
                          
                          const loaiLabels = {
                            'anh_ho_so': 'Ảnh hồ sơ',
                            'anh_bang_cap': 'Ảnh bằng cấp',
                            'anh_bhyt': 'Ảnh BHYT',
                            'anh_hop_dong': 'Ảnh hợp đồng',
                            'anh_xe': 'Ảnh xe'
                          };
                          
                          return (
                            <div key={loai} className="space-y-2">
                              <h5 className="text-sm font-semibold text-gray-700">{loaiLabels[loai] || loai}</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {filesOfType.map((media, index) => (
                                  <div key={media.id || index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                                    <img
                                      src={getFileUrl(media.duong_dan)}
                                      alt={media.ten_file || `${loai} ${index + 1}`}
                                      className="w-full h-32 object-cover"
                                      onError={(e) => {
                                        const computedUrl = getFileUrl(media.duong_dan);
                                        console.error('❌ Lỗi khi load ảnh:', {
                                          original: media.duong_dan,
                                          computed: computedUrl,
                                          loai: loai
                                        });
                                        // Fallback: thử load trực tiếp từ backend
                                        if (computedUrl !== media.duong_dan) {
                                          e.target.src = computedUrl;
                                        } else {
                                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EẢnh không tải được%3C/text%3E%3C/svg%3E';
                                        }
                                      }}
                                      onLoad={() => {
                                        console.log('✅ Ảnh load thành công:', getFileUrl(media.duong_dan));
                                      }}
                                    />
                                    <div className="p-2">
                                      <p className="text-xs text-gray-600 truncate">{media.ten_file || `${loai} ${index + 1}`}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">Chưa có media</p>
                    )}
                  </div>
                )}

                {detailTab === 'contract' && (
                  <div>
                    {hopDongs.length > 0 ? (
                      <div className="space-y-4">
                        {hopDongs.map((hopDong, index) => {
                          const loaiHopDong = loaiHopDongs.find(lhd => lhd.id === hopDong.id_loai_hop_dong);
                          return (
                            <div key={hopDong.id || index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {loaiHopDong?.ten_loai_hop_dong || 'Hợp đồng'}
                                  </h4>
                                  <p className="text-xs text-gray-600">Mã: HD-{hopDong.id}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  hopDong.trang_thai === 'dang_thuc_hien' 
                                    ? 'bg-green-100 text-green-800' 
                                    : hopDong.trang_thai === 'ket_thuc'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {hopDong.trang_thai === 'dang_thuc_hien' ? 'Đang thực hiện' : 
                                   hopDong.trang_thai === 'ket_thuc' ? 'Kết thúc' : 'Hủy bỏ'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                  <span className="text-gray-500">Ngày bắt đầu: </span>
                                  <span className="text-gray-900">{hopDong.ngay_bat_dau ? formatDate(hopDong.ngay_bat_dau) : '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Ngày kết thúc: </span>
                                  <span className="text-gray-900">{hopDong.ngay_ket_thuc ? formatDate(hopDong.ngay_ket_thuc) : '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Lương: </span>
                                  <span className="text-gray-900 font-medium">{hopDong.luong ? formatCurrency(hopDong.luong) : '-'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">Chưa có hợp đồng</p>
                    )}
                  </div>
                )}

                {detailTab === 'vehicle' && (
                  <div>
                    {thongTinXe.length > 0 ? (
                      <div className="space-y-4">
                        {thongTinXe.map((xe, index) => (
                          <div key={xe.id || index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                  <FaCar className="w-4 h-4 text-blue-500" />
                                  {xe.bien_so_xe || 'Chưa có biển số'}
                                </h4>
                                <p className="text-xs text-gray-600">Mã: XE-{xe.id}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="text-gray-500">Loại xe: </span>
                                <span className="text-gray-900">{xe.loai_xe || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Hãng xe: </span>
                                <span className="text-gray-900">{xe.hang_xe || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Màu sắc: </span>
                                <span className="text-gray-900">{xe.mau_sac || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Năm sản xuất: </span>
                                <span className="text-gray-900">{xe.nam_san_xuat || '-'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">Chưa có thông tin xe</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonnelSession2;

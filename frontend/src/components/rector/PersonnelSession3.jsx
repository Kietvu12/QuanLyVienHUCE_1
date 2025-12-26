import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaBuilding, FaFileContract, FaShieldAlt, FaCar, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { nhanSuAPI, phongBanAPI, hopDongLaoDongAPI, loaiHopDongAPI, baoHiemYTeAPI, thongTinXeAPI, mediaNhanSuAPI } from '../../services/api';
import React, { useState, useEffect } from 'react';

const formatCurrency = (value) => {
  if (!value) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Component quản lý phòng ban
const PhongBanTab = ({ user, isReadOnly }) => {
  const [phongBans, setPhongBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingPhongBan, setEditingPhongBan] = useState(null);
  const [formData, setFormData] = useState({ ten_phong_ban: '', id_vien: user?.id_vien || '' });

  useEffect(() => {
    fetchPhongBans();
  }, [pagination.page, searchTerm, user?.id_vien]);

  const fetchPhongBans = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        id_vien: user?.id_vien,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await phongBanAPI.getAll(params);
      if (response.success) {
        setPhongBans(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      } else {
        setError(response.message || 'Lỗi khi tải danh sách phòng ban');
      }
    } catch (err) {
      console.error('Error fetching phong ban:', err);
      setError(err.message || 'Lỗi khi tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPhongBan(null);
    setFormData({ ten_phong_ban: '', id_vien: user?.id_vien || '' });
    setShowModal(true);
  };

  const handleEdit = (phongBan) => {
    setEditingPhongBan(phongBan);
    setFormData({ ten_phong_ban: phongBan.ten_phong_ban, id_vien: phongBan.id_vien });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) return;
    try {
      const response = await phongBanAPI.delete(id);
      if (response.success) {
        fetchPhongBans();
      } else {
        alert(response.message || 'Lỗi khi xóa phòng ban');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa phòng ban');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPhongBan) {
        const response = await phongBanAPI.update(editingPhongBan.id, formData);
        if (response.success) {
          setShowModal(false);
          fetchPhongBans();
        } else {
          alert(response.message || 'Lỗi khi cập nhật phòng ban');
        }
      } else {
        const response = await phongBanAPI.create(formData);
        if (response.success) {
          setShowModal(false);
          fetchPhongBans();
        } else {
          alert(response.message || 'Lỗi khi tạo phòng ban');
        }
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu phòng ban');
    }
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
          <h3 className="text-lg font-bold text-gray-900">Danh sách phòng ban</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý phòng ban của Viện</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
          >
            <FaPlus className="w-4 h-4" />
            Thêm phòng ban
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng ban..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : phongBans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Không có phòng ban nào</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên phòng ban
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Viện
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số nhân sự
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {phongBans.map((phongBan) => (
                  <tr key={phongBan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <FaBuilding className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{phongBan.ten_phong_ban}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{phongBan.vien?.ten_vien || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{phongBan.so_nhan_su || 0}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {!isReadOnly && (
                          <>
                            <button
                              onClick={() => handleEdit(phongBan)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(phongBan.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
                  if (pageNum > pagination.totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal thêm/sửa phòng ban */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingPhongBan ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phòng ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_phong_ban}
                  onChange={(e) => setFormData({ ...formData, ten_phong_ban: e.target.value })}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  {editingPhongBan ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Component quản lý nhân sự
const NhanSuTab = ({ user, isReadOnly }) => {
  const [nhanSus, setNhanSus] = useState([]);
  const [phongBans, setPhongBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedNhanSu, setSelectedNhanSu] = useState(null);
  const [nhanSuDetail, setNhanSuDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [formData, setFormData] = useState({
    id_phong_ban: '',
    ho_ten: '',
    ngay_sinh: '',
    gioi_tinh: '',
    chuc_vu: '',
    dia_chi_tam_tru: '',
    dia_chi_thuong_tru: '',
    cccd: '',
    bang_cap: '',
    so_dien_thoai: '',
    email: '',
    nguoi_than_lien_he: '',
    ngay_bat_dau_lam: '',
    ngay_ket_thuc_lam_viec: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPhongBans();
  }, [user?.id_vien]);

  useEffect(() => {
    fetchNhanSus();
  }, [pagination.page, searchTerm, selectedPhongBan, user?.id_vien]);

  const fetchPhongBans = async () => {
    try {
      const response = await phongBanAPI.getAll({ id_vien: user?.id_vien, limit: 100 });
      if (response.success) {
        setPhongBans(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching phong bans:', err);
    }
  };

  const fetchNhanSus = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        id_vien: user?.id_vien,
      };
      if (selectedPhongBan) {
        params.id_phong_ban = selectedPhongBan;
      }
      const response = await nhanSuAPI.getAll(params);
      if (response.success) {
        let data = response.data || [];
        // Filter by search term if provided
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          data = data.filter(ns =>
            ns.ho_ten?.toLowerCase().includes(searchLower) ||
            ns.email?.toLowerCase().includes(searchLower) ||
            ns.so_dien_thoai?.includes(searchTerm)
          );
        }
        setNhanSus(data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      } else {
        setError(response.message || 'Lỗi khi tải danh sách nhân sự');
      }
    } catch (err) {
      console.error('Error fetching nhan su:', err);
      setError(err.message || 'Lỗi khi tải danh sách nhân sự');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedNhanSu(null);
    setFormData({
      id_phong_ban: '',
      ho_ten: '',
      ngay_sinh: '',
      gioi_tinh: '',
      chuc_vu: '',
      dia_chi_tam_tru: '',
      dia_chi_thuong_tru: '',
      cccd: '',
      bang_cap: '',
      so_dien_thoai: '',
      email: '',
      nguoi_than_lien_he: '',
      ngay_bat_dau_lam: '',
      ngay_ket_thuc_lam_viec: ''
    });
    setShowModal(true);
  };

  const handleEditNhanSu = async (person) => {
    try {
      setLoadingDetail(true);
      const response = await nhanSuAPI.getById(person.id);
      if (response.success) {
        const data = response.data;
        setSelectedNhanSu(data);
        setFormData({
          id_phong_ban: data.id_phong_ban || '',
          ho_ten: data.ho_ten || '',
          ngay_sinh: data.ngay_sinh ? data.ngay_sinh.split('T')[0] : '',
          gioi_tinh: data.gioi_tinh || '',
          chuc_vu: data.chuc_vu || '',
          dia_chi_tam_tru: data.dia_chi_tam_tru || '',
          dia_chi_thuong_tru: data.dia_chi_thuong_tru || '',
          cccd: data.cccd || '',
          bang_cap: data.bang_cap || '',
          so_dien_thoai: data.so_dien_thoai || '',
          email: data.email || '',
          nguoi_than_lien_he: data.nguoi_than_lien_he || '',
          ngay_bat_dau_lam: data.ngay_bat_dau_lam ? data.ngay_bat_dau_lam.split('T')[0] : '',
          ngay_ket_thuc_lam_viec: data.ngay_ket_thuc_lam_viec ? data.ngay_ket_thuc_lam_viec.split('T')[0] : ''
        });
        setShowModal(true);
      } else {
        alert(response.message || 'Lỗi khi tải thông tin nhân sự');
      }
    } catch (err) {
      console.error('Error fetching nhan su for edit:', err);
      alert(err.message || 'Lỗi khi tải thông tin nhân sự');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_phong_ban || !formData.ho_ten) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Phòng ban và Họ tên)');
      return;
    }
    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        id_phong_ban: parseInt(formData.id_phong_ban),
        ngay_sinh: formData.ngay_sinh || null,
        chuc_vu: formData.chuc_vu || null,
        dia_chi_tam_tru: formData.dia_chi_tam_tru || null,
        dia_chi_thuong_tru: formData.dia_chi_thuong_tru || null,
        cccd: formData.cccd || null,
        bang_cap: formData.bang_cap || null,
        so_dien_thoai: formData.so_dien_thoai || null,
        email: formData.email || null,
        nguoi_than_lien_he: formData.nguoi_than_lien_he || null,
        ngay_bat_dau_lam: formData.ngay_bat_dau_lam || null,
        ngay_ket_thuc_lam_viec: formData.ngay_ket_thuc_lam_viec || null
      };
      
      let response;
      if (selectedNhanSu) {
        // Cập nhật nhân sự
        response = await nhanSuAPI.update(selectedNhanSu.id, submitData);
      } else {
        // Tạo nhân sự mới
        response = await nhanSuAPI.create(submitData);
      }
      
      if (response.success) {
        setShowModal(false);
        setSelectedNhanSu(null);
        fetchNhanSus();
      } else {
        alert(response.message || (selectedNhanSu ? 'Lỗi khi cập nhật nhân sự' : 'Lỗi khi tạo nhân sự'));
      }
    } catch (err) {
      alert(err.message || (selectedNhanSu ? 'Lỗi khi cập nhật nhân sự' : 'Lỗi khi tạo nhân sự'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân sự này?')) return;
    try {
      const response = await nhanSuAPI.delete(id);
      if (response.success) {
        fetchNhanSus();
      } else {
        alert(response.message || 'Lỗi khi xóa nhân sự');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa nhân sự');
    }
  };

  // Lấy lương từ hợp đồng lao động mới nhất
  const getSalary = (nhanSu) => {
    if (nhanSu.hopDongLaoDongs && nhanSu.hopDongLaoDongs.length > 0) {
      const latestContract = nhanSu.hopDongLaoDongs[0];
      return latestContract.luong_theo_hop_dong || 0;
    }
    return 0;
  };

  // Xử lý xem chi tiết nhân sự
  const handleViewDetail = async (person) => {
    try {
      setLoadingDetail(true);
      setSelectedNhanSu(person);
      const response = await nhanSuAPI.getById(person.id);
      if (response.success) {
        setNhanSuDetail(response.data);
        setShowDetailModal(true);
      } else {
        alert(response.message || 'Lỗi khi tải thông tin chi tiết');
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
      alert(err.message || 'Lỗi khi tải thông tin chi tiết');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Xử lý xem hồ sơ nhân viên
  const handleViewProfile = async (person) => {
    try {
      setLoadingDetail(true);
      setSelectedNhanSu(person);
      const response = await nhanSuAPI.getById(person.id);
      if (response.success) {
        setNhanSuDetail(response.data);
        setShowProfileModal(true);
      } else {
        alert(response.message || 'Lỗi khi tải thông tin hồ sơ');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert(err.message || 'Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách nhân sự</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin nhân sự của Viện</p>
          </div>
          {!isReadOnly && (
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
            >
              <FaPlus className="w-4 h-4" />
              Thêm nhân sự
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
              placeholder="Tìm kiếm tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        <select
          value={selectedPhongBan}
          onChange={(e) => {
            setSelectedPhongBan(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">Tất cả phòng ban</option>
          {phongBans.map((pb) => (
            <option key={pb.id} value={pb.id}>
              {pb.ten_phong_ban}
            </option>
          ))}
          </select>
        </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : nhanSus.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Không có nhân sự nào</div>
      ) : (
        <>
        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giới tính
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phòng ban
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
                {nhanSus.map((person) => {
                  const initials = getInitials(person.ho_ten);
                return (
                  <tr
                    key={person.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetail(person)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{person.ho_ten || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{person.chuc_vu || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{person.gioi_tinh || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {person.phongBan?.ten_phong_ban || '-'}
                        </span>
                      </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-gray-600">
                          <div>{person.email || '-'}</div>
                          <div className="text-gray-500">{person.so_dien_thoai || '-'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{formatDate(person.ngay_bat_dau_lam)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(getSalary(person))}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetail(person)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {!isReadOnly && (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditNhanSu(person);
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                              <button
                                onClick={() => handleDelete(person.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
            {nhanSus.map((person) => {
              const initials = getInitials(person.ho_ten);
            return (
              <div
                key={person.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetail(person)}
              >
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{person.ho_ten || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {person.chuc_vu && (
                        <span className="text-xs text-gray-600">{person.chuc_vu}</span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {person.phongBan?.ten_phong_ban || '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="text-xs text-gray-600">
                    <div className="mb-1">
                      <span className="text-gray-500">Email: </span>
                        <span className="text-gray-900">{person.email || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Điện thoại: </span>
                        <span className="text-gray-900">{person.so_dien_thoai || '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-600">Ngày vào làm: </span>
                        <span className="text-xs text-gray-900 font-medium">{formatDate(person.ngay_bat_dau_lam)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Lương: </span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(getSalary(person))}</span>
                    </div>
                  </div>
                </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleViewDetail(person)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                  {!isReadOnly && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNhanSu(person);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                        title="Chỉnh sửa"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                        <button
                          onClick={() => handleDelete(person.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

          {pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
          </p>
          <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
              Trước
            </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
                  if (pageNum > pagination.totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
            </button>
                  );
                })}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
            </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal thêm/sửa nhân sự */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedNhanSu ? 'Chỉnh sửa thông tin nhân sự' : 'Thêm nhân sự mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.id_phong_ban}
                    onChange={(e) => setFormData({ ...formData, id_phong_ban: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn phòng ban</option>
                    {phongBans.map((pb) => (
                      <option key={pb.id} value={pb.id}>
                        {pb.ten_phong_ban}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.ngay_sinh}
                    onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <select
                    value={formData.gioi_tinh}
                    onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                  <select
                    value={formData.chuc_vu}
                    onChange={(e) => setFormData({ ...formData, chuc_vu: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn chức vụ</option>
                    <option value="Viện trưởng">Viện trưởng</option>
                    <option value="Kế toán">Kế toán</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="Nhân viên">Nhân viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số CCCD</label>
                  <input
                    type="text"
                    value={formData.cccd}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp</label>
                  <input
                    type="text"
                    value={formData.bang_cap}
                    onChange={(e) => setFormData({ ...formData, bang_cap: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu làm</label>
                  <input
                    type="date"
                    value={formData.ngay_bat_dau_lam}
                    onChange={(e) => setFormData({ ...formData, ngay_bat_dau_lam: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc làm việc</label>
                  <input
                    type="date"
                    value={formData.ngay_ket_thuc_lam_viec}
                    onChange={(e) => setFormData({ ...formData, ngay_ket_thuc_lam_viec: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ thường trú</label>
                  <textarea
                    value={formData.dia_chi_thuong_tru}
                    onChange={(e) => setFormData({ ...formData, dia_chi_thuong_tru: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ tạm trú</label>
                  <textarea
                    value={formData.dia_chi_tam_tru}
                    onChange={(e) => setFormData({ ...formData, dia_chi_tam_tru: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Người thân liên hệ</label>
                  <input
                    type="text"
                    value={formData.nguoi_than_lien_he}
                    onChange={(e) => setFormData({ ...formData, nguoi_than_lien_he: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedNhanSu(null);
                  }}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? (selectedNhanSu ? 'Đang cập nhật...' : 'Đang tạo...') 
                    : (selectedNhanSu ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chi tiết nhân sự */}
      {showDetailModal && nhanSuDetail && (
        <DetailModal
          nhanSu={nhanSuDetail}
          onClose={() => {
            setShowDetailModal(false);
            setNhanSuDetail(null);
          }}
          onViewProfile={() => {
            setShowDetailModal(false);
            setShowProfileModal(true);
          }}
          isReadOnly={isReadOnly}
        />
      )}

      {/* Modal hồ sơ nhân viên */}
      {showProfileModal && nhanSuDetail && (
        <ProfileModal
          nhanSu={nhanSuDetail}
          onClose={() => {
            setShowProfileModal(false);
            setNhanSuDetail(null);
          }}
          onRefresh={async () => {
            if (nhanSuDetail?.id) {
              const response = await nhanSuAPI.getById(nhanSuDetail.id);
              if (response.success) {
                setNhanSuDetail(response.data);
                fetchNhanSus();
              }
            }
          }}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
};

// Component Modal chi tiết nhân sự
const DetailModal = ({ nhanSu, onClose, onViewProfile, isReadOnly }) => {
  if (!nhanSu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Thông tin chi tiết nhân sự</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Họ tên</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.ho_ten || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
              <p className="text-base text-gray-900 mt-1">{formatDate(nhanSu.ngay_sinh)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Giới tính</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.gioi_tinh || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Chức vụ</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.chuc_vu || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phòng ban</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.phongBan?.ten_phong_ban || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Viện</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.phongBan?.vien?.ten_vien || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.so_dien_thoai || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số CCCD</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.cccd || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bằng cấp</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.bang_cap || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày bắt đầu làm</label>
              <p className="text-base text-gray-900 mt-1">{formatDate(nhanSu.ngay_bat_dau_lam)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày kết thúc làm việc</label>
              <p className="text-base text-gray-900 mt-1">{formatDate(nhanSu.ngay_ket_thuc_lam_viec)}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Địa chỉ thường trú</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.dia_chi_thuong_tru || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Địa chỉ tạm trú</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.dia_chi_tam_tru || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Người thân liên hệ</label>
              <p className="text-base text-gray-900 mt-1">{nhanSu.nguoi_than_lien_he || '-'}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onViewProfile}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Xem hồ sơ nhân viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Modal hồ sơ nhân viên
const ProfileModal = ({ nhanSu, onClose, onRefresh, isReadOnly }) => {
  const [activeTab, setActiveTab] = useState('hop-dong');
  const [hopDongs, setHopDongs] = useState([]);
  const [baoHiemYTe, setBaoHiemYTe] = useState(null);
  const [thongTinXes, setThongTinXes] = useState([]);
  const [mediaNhanSu, setMediaNhanSu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState(null); // 'hop-dong', 'bhyt', 'xe'
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (nhanSu) {
      loadProfileData();
    }
  }, [nhanSu]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      // Load hợp đồng
      const hopDongRes = await hopDongLaoDongAPI.getAll({ id_nhan_su: nhanSu.id, limit: 100 });
      if (hopDongRes.success) {
        setHopDongs(hopDongRes.data || []);
      }

      // Load bảo hiểm y tế
      const bhytRes = await baoHiemYTeAPI.getAll({ id_nhan_su: nhanSu.id, limit: 1 });
      if (bhytRes.success && bhytRes.data && bhytRes.data.length > 0) {
        setBaoHiemYTe(bhytRes.data[0]);
      }

      // Load thông tin xe
      const xeRes = await thongTinXeAPI.getAll({ id_nhan_su: nhanSu.id, limit: 100 });
      if (xeRes.success) {
        setThongTinXes(xeRes.data || []);
      }

      // Load media
      const mediaRes = await mediaNhanSuAPI.getByNhanSuId(nhanSu.id);
      if (mediaRes.success && mediaRes.data) {
        setMediaNhanSu(mediaRes.data);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type) => {
    setAddModalType(type);
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (type, item) => {
    setAddModalType(type);
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      let response;
      if (type === 'hop-dong') {
        response = await hopDongLaoDongAPI.delete(id);
      } else if (type === 'bhyt') {
        response = await baoHiemYTeAPI.delete(id);
      } else if (type === 'xe') {
        response = await thongTinXeAPI.delete(id);
      }

      if (response && response.success) {
        await loadProfileData();
        onRefresh();
      } else {
        alert(response?.message || 'Lỗi khi xóa');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa');
    }
  };

  const handleFileUpload = async (fileType, files) => {
    try {
      // Gửi file trực tiếp qua FormData (không cần convert sang base64)
      const fileArray = files instanceof FileList ? Array.from(files) : (Array.isArray(files) ? files : [files]);
      
      if (fileArray.length === 0) {
        alert('Vui lòng chọn ít nhất một file');
        return;
      }

      // Upload file trực tiếp (FormData)
      const response = await mediaNhanSuAPI.uploadFile(nhanSu.id, fileType, fileArray);
      
      if (response.success) {
        setMediaNhanSu(response.data);
        alert(`Upload ${fileArray.length} file thành công`);
        await loadProfileData();
      } else {
        alert(response.message || 'Lỗi khi upload file');
      }
    } catch (err) {
      console.error('Lỗi khi upload file:', err);
      alert(err.message || 'Lỗi khi upload file');
    }
  };

  if (!nhanSu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Hồ sơ nhân viên: {nhanSu.ho_ten}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('hop-dong')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'hop-dong'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaFileContract className="inline mr-2" />
              Hợp đồng
            </button>
            <button
              onClick={() => setActiveTab('bhyt')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'bhyt'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaShieldAlt className="inline mr-2" />
              Bảo hiểm y tế
            </button>
            <button
              onClick={() => setActiveTab('xe')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'xe'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaCar className="inline mr-2" />
              Xe
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : (
          <>
            {/* Tab Hợp đồng */}
            {activeTab === 'hop-dong' && (
              <HopDongTab
                hopDongs={hopDongs}
                nhanSuId={nhanSu.id}
                onAdd={() => handleAdd('hop-dong')}
                onEdit={(item) => handleEdit('hop-dong', item)}
                onDelete={(id) => handleDelete('hop-dong', id)}
                onRefresh={loadProfileData}
                mediaNhanSu={mediaNhanSu}
                onFileUpload={(files) => handleFileUpload('anh_hop_dong', files)}
                isReadOnly={isReadOnly}
              />
            )}

            {/* Tab Bảo hiểm y tế */}
            {activeTab === 'bhyt' && (
              <BHYTTab
                baoHiemYTe={baoHiemYTe}
                nhanSuId={nhanSu.id}
                onAdd={() => handleAdd('bhyt')}
                onEdit={() => handleEdit('bhyt', baoHiemYTe)}
                onDelete={() => baoHiemYTe && handleDelete('bhyt', baoHiemYTe.id)}
                onRefresh={loadProfileData}
                mediaNhanSu={mediaNhanSu}
                onFileUpload={(files) => handleFileUpload('anh_bhyt', files)}
                isReadOnly={isReadOnly}
              />
            )}

            {/* Tab Xe */}
            {activeTab === 'xe' && (
              <XeTab
                thongTinXes={thongTinXes}
                nhanSuId={nhanSu.id}
                onAdd={() => handleAdd('xe')}
                onEdit={(item) => handleEdit('xe', item)}
                onDelete={(id) => handleDelete('xe', id)}
                onRefresh={loadProfileData}
                mediaNhanSu={mediaNhanSu}
                onFileUpload={(files) => handleFileUpload('anh_xe', files)}
                isReadOnly={isReadOnly}
              />
            )}
          </>
        )}

        {/* Modal thêm/sửa */}
        {showAddModal && (
          <AddEditModal
            type={addModalType}
            nhanSuId={nhanSu.id}
            editingItem={editingItem}
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onSuccess={async () => {
              await loadProfileData();
              onRefresh();
              setShowAddModal(false);
              setEditingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Helper function để render nhiều ảnh
const renderMultipleImages = (imagesData, nhanSuId, fileType, onFileUpload, onRefresh, isReadOnly) => {
  let images = [];
  if (imagesData) {
    // Nếu đã là array, sử dụng trực tiếp
    if (Array.isArray(imagesData)) {
      images = imagesData;
    } 
    // Nếu là string, thử parse JSON
    else if (typeof imagesData === 'string') {
      try {
        // Kiểm tra xem có phải JSON string không (bắt đầu với [ hoặc {)
        const trimmed = imagesData.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          const parsed = JSON.parse(imagesData);
          images = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          // Nếu không phải JSON, coi như string đơn
          images = [imagesData];
        }
      } catch (e) {
        // Nếu parse lỗi, coi như string đơn
        console.warn('Không thể parse JSON:', e, 'imagesData:', imagesData);
        images = [imagesData];
      }
    } else {
      // Các trường hợp khác, chuyển thành array
      images = [imagesData];
    }
  }
  
  // Debug log
  if (images.length > 0) {
    console.log(`📸 Render ${images.length} ảnh cho ${fileType}:`, images);
  }

  // Helper: Lấy URL ảnh (hỗ trợ cả URL và base64)
  const getImageSrc = (img) => {
    if (!img) return '';
    // Nếu là base64 (bắt đầu với data:)
    if (img.startsWith('data:')) {
      return img;
    }
    // Nếu là URL (bắt đầu với /uploads)
    if (img.startsWith('/uploads')) {
      // Lấy baseURL từ API_BASE_URL và loại bỏ /api
      const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      // Loại bỏ /api nếu có, đảm bảo không có trailing slash
      let baseURL = apiBaseURL.replace(/\/api\/?$/, '');
      if (!baseURL) baseURL = 'http://localhost:3000';
      // Đảm bảo không có double slash
      const imagePath = img.startsWith('/') ? img : `/${img}`;
      return `${baseURL}${imagePath}`;
    }
    // Nếu đã là full URL (http:// hoặc https://)
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    // Trả về nguyên bản nếu không phải cả hai
    return img;
  };

  return images.length > 0 ? (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={getImageSrc(img)}
              alt={`Ảnh ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                // Log lỗi để debug
                console.error('Lỗi khi load ảnh:', {
                  original: img,
                  computed: getImageSrc(img),
                  error: e
                });
                // Fallback nếu ảnh không load được
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EẢnh lỗi%3C/text%3E%3C/svg%3E';
              }}
              onLoad={() => {
                console.log('✅ Ảnh load thành công:', getImageSrc(img));
              }}
            />
            {!isReadOnly && (
              <button
                onClick={async () => {
                  const newImages = images.filter((_, i) => i !== index);
                  if (newImages.length === 0) {
                    await mediaNhanSuAPI.upsert(nhanSuId, { [fileType]: null });
                  } else if (newImages.length === 1) {
                    await mediaNhanSuAPI.upsert(nhanSuId, { [fileType]: newImages[0] });
                  } else {
                    await mediaNhanSuAPI.upsert(nhanSuId, { [fileType]: JSON.stringify(newImages) });
                  }
                  onRefresh();
                }}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa ảnh"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      {!isReadOnly && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFileUpload(Array.from(e.target.files));
              }
            }}
            className="hidden"
            id={`upload-${fileType}`}
          />
          <label
            htmlFor={`upload-${fileType}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <FaUpload className="w-4 h-4" />
            Thêm ảnh
          </label>
        </div>
      )}
    </div>
  ) : (
    !isReadOnly && (
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileUpload(Array.from(e.target.files));
            }
          }}
          className="hidden"
          id={`upload-${fileType}-new`}
        />
        <label
          htmlFor={`upload-${fileType}-new`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FaUpload className="w-4 h-4" />
          Tải lên ảnh (có thể chọn nhiều ảnh)
        </label>
      </div>
    )
  );
};

// Component Tab Hợp đồng
const HopDongTab = ({ hopDongs, nhanSuId, onAdd, onEdit, onDelete, onRefresh, mediaNhanSu, onFileUpload, isReadOnly }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Danh sách hợp đồng lao động</h4>
        {!isReadOnly && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Thêm hợp đồng
          </button>
        )}
      </div>

      {hopDongs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có hợp đồng nào</div>
      ) : (
        <div className="space-y-3">
          {hopDongs.map((hd) => (
            <div key={hd.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">Mã hợp đồng: {hd.ma_hop_dong}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Ngày tạo: </span>
                      <span className="text-gray-900">{formatDate(hd.ngay_tao_hop_dong_lao_dong)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày ký: </span>
                      <span className="text-gray-900">{formatDate(hd.ngay_ki_hop_dong)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày kết thúc: </span>
                      <span className="text-gray-900">{formatDate(hd.ngay_ket_thuc_hop_dong_lao_dong)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Lương: </span>
                      <span className="text-gray-900 font-semibold">{formatCurrency(hd.luong_theo_hop_dong)}</span>
                    </div>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(hd)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(hd.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload ảnh hợp đồng */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh hợp đồng</label>
        {renderMultipleImages(mediaNhanSu?.anh_hop_dong, nhanSuId, 'anh_hop_dong', onFileUpload, onRefresh, isReadOnly)}
      </div>
    </div>
  );
};

// Component Tab Bảo hiểm y tế
const BHYTTab = ({ baoHiemYTe, nhanSuId, onAdd, onEdit, onDelete, onRefresh, mediaNhanSu, onFileUpload, isReadOnly }) => {
  const handleRefresh = async () => {
    await onRefresh();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Thông tin bảo hiểm y tế</h4>
        {!isReadOnly && (
          <button
            onClick={baoHiemYTe ? onEdit : onAdd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            {baoHiemYTe ? 'Chỉnh sửa' : 'Thêm bảo hiểm y tế'}
          </button>
        )}
      </div>

      {!baoHiemYTe ? (
        <div className="text-center py-8 text-gray-500">Chưa có thông tin bảo hiểm y tế</div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Số thẻ BHYT</label>
              <p className="text-base text-gray-900 mt-1">{baoHiemYTe.so_the_bhyt || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày hết hạn</label>
              <p className="text-base text-gray-900 mt-1">{formatDate(baoHiemYTe.ngay_het_han)}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Nơi đăng ký khám chữa bệnh ban đầu</label>
              <p className="text-base text-gray-900 mt-1">{baoHiemYTe.noi_dang_ki_kham_chua_benh_ban_dau || '-'}</p>
            </div>
          </div>
          {!isReadOnly && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FaEdit className="inline mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <FaTrash className="inline mr-2" />
                Xóa
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload ảnh BHYT */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh BHYT</label>
        {renderMultipleImages(mediaNhanSu?.anh_bhyt, nhanSuId, 'anh_bhyt', onFileUpload, handleRefresh, isReadOnly)}
      </div>
    </div>
  );
};

// Component Tab Xe
const XeTab = ({ thongTinXes, nhanSuId, onAdd, onEdit, onDelete, onRefresh, mediaNhanSu, onFileUpload, isReadOnly }) => {
  const handleRefresh = async () => {
    await onRefresh();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Danh sách thông tin xe</h4>
        {!isReadOnly && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Thêm xe
          </button>
        )}
      </div>

      {thongTinXes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có thông tin xe nào</div>
      ) : (
        <div className="space-y-3">
          {thongTinXes.map((xe) => (
            <div key={xe.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">{xe.ten_xe || 'Chưa có tên'}</span>
                    {xe.loai_xe && (
                      <span className="text-xs text-gray-500">({xe.loai_xe})</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Biển số: </span>
                      <span className="text-gray-900">{xe.bien_so_xe || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số đăng ký: </span>
                      <span className="text-gray-900">{xe.so_dang_ki_xe || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày hết hạn: </span>
                      <span className="text-gray-900">{formatDate(xe.ngay_het_han)}</span>
                    </div>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(xe)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(xe.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload ảnh xe */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh xe</label>
        {renderMultipleImages(mediaNhanSu?.anh_xe, nhanSuId, 'anh_xe', onFileUpload, handleRefresh, isReadOnly)}
      </div>
    </div>
  );
};

// Component Modal thêm/sửa
const AddEditModal = ({ type, nhanSuId, editingItem, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loaiHopDongs, setLoaiHopDongs] = useState([]);

  useEffect(() => {
    // Load loại hợp đồng nếu là form hợp đồng
    if (type === 'hop-dong') {
      const fetchLoaiHopDongs = async () => {
        try {
          const response = await loaiHopDongAPI.getAll();
          if (response.success) {
            setLoaiHopDongs(response.data || []);
          }
        } catch (err) {
          console.error('Error fetching loai hop dong:', err);
        }
      };
      fetchLoaiHopDongs();
    }
  }, [type]);

  useEffect(() => {
    if (editingItem) {
      // Nếu editingItem có loaiHopDong object, lấy id
      const formDataFromItem = {
        ...editingItem,
        id_loai_hop_dong: editingItem.id_loai_hop_dong || editingItem.loaiHopDong?.id || ''
      };
      setFormData(formDataFromItem);
    } else {
      // Reset form based on type
      if (type === 'hop-dong') {
        setFormData({
          id_nhan_su: nhanSuId,
          id_loai_hop_dong: '',
          ma_hop_dong: '',
          ngay_tao_hop_dong_lao_dong: '',
          luong_theo_hop_dong: '',
          ngay_ki_hop_dong: '',
          ngay_ket_thuc_hop_dong_lao_dong: ''
        });
      } else if (type === 'bhyt') {
        setFormData({
          id_nhan_su: nhanSuId,
          so_the_bhyt: '',
          noi_dang_ki_kham_chua_benh_ban_dau: '',
          ngay_het_han: ''
        });
      } else if (type === 'xe') {
        setFormData({
          id_nhan_su: nhanSuId,
          ten_xe: '',
          loai_xe: '',
          bien_so_xe: '',
          so_dang_ki_xe: '',
          ngay_het_han: ''
        });
      }
    }
  }, [type, nhanSuId, editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let response;

      if (type === 'hop-dong') {
        if (editingItem) {
          response = await hopDongLaoDongAPI.update(editingItem.id, formData);
        } else {
          response = await hopDongLaoDongAPI.create(formData);
        }
      } else if (type === 'bhyt') {
        if (editingItem) {
          response = await baoHiemYTeAPI.update(editingItem.id, formData);
        } else {
          response = await baoHiemYTeAPI.create(formData);
        }
      } else if (type === 'xe') {
        if (editingItem) {
          response = await thongTinXeAPI.update(editingItem.id, formData);
        } else {
          response = await thongTinXeAPI.create(formData);
        }
      }

      if (response && response.success) {
        onSuccess();
      } else {
        alert(response?.message || 'Lỗi khi lưu');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu');
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    if (type === 'hop-dong') return editingItem ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng mới';
    if (type === 'bhyt') return editingItem ? 'Chỉnh sửa bảo hiểm y tế' : 'Thêm bảo hiểm y tế';
    if (type === 'xe') return editingItem ? 'Chỉnh sửa thông tin xe' : 'Thêm thông tin xe';
    return 'Thêm mới';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'hop-dong' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại hợp đồng
                </label>
                <select
                  value={formData.id_loai_hop_dong || ''}
                  onChange={(e) => setFormData({ ...formData, id_loai_hop_dong: e.target.value || null })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn loại hợp đồng</option>
                  {loaiHopDongs.map((loai) => (
                    <option key={loai.id} value={loai.id}>
                      {loai.ten_loai}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã hợp đồng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ma_hop_dong || ''}
                  onChange={(e) => setFormData({ ...formData, ma_hop_dong: e.target.value })}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày tạo hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.ngay_tao_hop_dong_lao_dong || ''}
                    onChange={(e) => setFormData({ ...formData, ngay_tao_hop_dong_lao_dong: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày ký hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.ngay_ki_hop_dong || ''}
                    onChange={(e) => setFormData({ ...formData, ngay_ki_hop_dong: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.ngay_ket_thuc_hop_dong_lao_dong || ''}
                    onChange={(e) => setFormData({ ...formData, ngay_ket_thuc_hop_dong_lao_dong: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lương theo hợp đồng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.luong_theo_hop_dong || ''}
                    onChange={(e) => setFormData({ ...formData, luong_theo_hop_dong: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'bhyt' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ BHYT</label>
                <input
                  type="text"
                  value={formData.so_the_bhyt || ''}
                  onChange={(e) => setFormData({ ...formData, so_the_bhyt: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nơi đăng ký khám chữa bệnh ban đầu</label>
                <input
                  type="text"
                  value={formData.noi_dang_ki_kham_chua_benh_ban_dau || ''}
                  onChange={(e) => setFormData({ ...formData, noi_dang_ki_kham_chua_benh_ban_dau: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
                <input
                  type="date"
                  value={formData.ngay_het_han || ''}
                  onChange={(e) => setFormData({ ...formData, ngay_het_han: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {type === 'xe' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên xe</label>
                  <input
                    type="text"
                    value={formData.ten_xe || ''}
                    onChange={(e) => setFormData({ ...formData, ten_xe: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại xe</label>
                  <input
                    type="text"
                    value={formData.loai_xe || ''}
                    onChange={(e) => setFormData({ ...formData, loai_xe: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biển số xe</label>
                  <input
                    type="text"
                    value={formData.bien_so_xe || ''}
                    onChange={(e) => setFormData({ ...formData, bien_so_xe: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số đăng ký xe</label>
                  <input
                    type="text"
                    value={formData.so_dang_ki_xe || ''}
                    onChange={(e) => setFormData({ ...formData, so_dang_ki_xe: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
                  <input
                    type="date"
                    value={formData.ngay_het_han || ''}
                    onChange={(e) => setFormData({ ...formData, ngay_het_han: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang lưu...' : editingItem ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component chính
const PersonnelSession3 = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('nhan-su');
  const isReadOnly = user?.role === 'accountant';

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('nhan-su')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'nhan-su'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Quản lý nhân sự
            </button>
            <button
              onClick={() => setActiveTab('phong-ban')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'phong-ban'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Quản lý phòng ban
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'nhan-su' ? (
          <NhanSuTab user={user} isReadOnly={isReadOnly} />
        ) : (
          <PhongBanTab user={user} isReadOnly={isReadOnly} />
        )}
      </div>
    </section>
  );
};

export default PersonnelSession3;

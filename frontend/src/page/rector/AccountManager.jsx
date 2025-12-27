import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaLock, FaUnlock, FaUserShield, FaUser, FaUserTie, FaUserCog, FaTimes } from 'react-icons/fa';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const getRoleDisplayName = (roleCode) => {
  const roleMap = {
    'vien_truong': 'Viện trưởng',
    'hieu_truong': 'Hiệu trưởng',
    'cap_phong': 'Cấp phòng',
    'ke_toan_vien': 'Kế toán viên',
  };
  return roleMap[roleCode] || roleCode;
};

// Mapping từ ten_quyen sang id_quyen (cần lấy từ database, tạm thời hardcode)
// TODO: Tạo API để lấy danh sách quyền từ database
const roles = [
  { code: 'hieu_truong', name: 'Hiệu trưởng', icon: FaUserShield, color: 'bg-red-500', id_quyen: 1 },
  { code: 'vien_truong', name: 'Viện trưởng', icon: FaUserTie, color: 'bg-blue-500', id_quyen: 2 },
  { code: 'cap_phong', name: 'Cấp phòng', icon: FaUser, color: 'bg-green-500', id_quyen: 3 },
  { code: 'ke_toan_vien', name: 'Kế toán viên', icon: FaUserCog, color: 'bg-gray-500', id_quyen: 4 },
];

const getQuyenIdByCode = (code) => {
  const role = roles.find(r => r.code === code);
  return role?.id_quyen || '';
};

const AccountManager = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPermissions, setShowPermissions] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    username: '',
    ho_ten: '',
    email: '',
    id_quyen: '',
    id_vien: '',
    trang_thai: 1,
    password: '',
  });

  useEffect(() => {
    if (user?.id_vien) {
      fetchAccounts();
    }
  }, [user?.id_vien, pagination.page, searchTerm, selectedRole, selectedStatus]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (user?.id_vien) {
        // Backend sẽ tự động filter theo id_vien của user
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (selectedRole) {
        params.id_quyen = selectedRole;
      }
      if (selectedStatus) {
        params.trang_thai = selectedStatus === 'active' ? 1 : 0;
      }

      const response = await authAPI.getAllAccounts(params);
      if (response.success) {
        setAccounts(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài khoản:', error);
      alert('Có lỗi xảy ra khi lấy danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleCode) => {
    const role = roles.find((r) => r.code === roleCode);
    return role ? role.icon : FaUser;
  };

  const getRoleColor = (roleCode) => {
    const role = roles.find((r) => r.code === roleCode);
    return role ? role.color : 'bg-gray-500';
  };

  const getStatusColor = (trang_thai) => {
    return trang_thai === 1
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (trang_thai) => {
    return trang_thai === 1 ? 'Hoạt động' : 'Khóa';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(-2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      username: account.username || '',
      ho_ten: account.ho_ten || '',
      email: account.email || '',
      id_quyen: account.id_quyen || '',
      id_vien: account.id_vien || user?.id_vien || '',
      trang_thai: account.trang_thai !== undefined ? account.trang_thai : 1,
      password: '',
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedAccount(null);
    setFormData({
      username: '',
      ho_ten: '',
      email: '',
      id_quyen: '',
      id_vien: user?.id_vien || '',
      trang_thai: 1,
      password: '',
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleToggleStatus = async (accountId) => {
    try {
      const response = await authAPI.toggleAccountStatus(accountId);
      if (response.success) {
        alert(response.message || 'Thay đổi trạng thái thành công!');
        fetchAccounts();
      } else {
        alert(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái');
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      return;
    }
    try {
      const response = await authAPI.deleteAccount(accountId);
      if (response.success) {
        alert('Xóa tài khoản thành công!');
        fetchAccounts();
      } else {
        alert(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
      alert('Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isCreating) {
        // Tạo mới
        const response = await authAPI.register({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          ho_ten: formData.ho_ten,
          id_quyen: formData.id_quyen,
          id_vien: formData.id_vien || null,
        });
        if (response.success) {
          alert('Tạo tài khoản thành công!');
          setIsCreating(false);
          setFormData({
            username: '',
            ho_ten: '',
            email: '',
            id_quyen: '',
            id_vien: user?.id_vien || '',
            trang_thai: 1,
            password: '',
          });
          fetchAccounts();
        } else {
          alert(response.message || 'Có lỗi xảy ra');
        }
      } else if (isEditing && selectedAccount) {
        // Cập nhật
        const response = await authAPI.updateAccount(selectedAccount.id, {
          ho_ten: formData.ho_ten,
          email: formData.email,
          id_quyen: formData.id_quyen,
          id_vien: formData.id_vien || null,
          trang_thai: formData.trang_thai,
        });
        if (response.success) {
          alert('Cập nhật tài khoản thành công!');
          setIsEditing(false);
          setSelectedAccount(null);
          fetchAccounts();
        } else {
          alert(response.message || 'Có lỗi xảy ra');
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản:', error);
      alert('Có lỗi xảy ra khi lưu tài khoản');
    }
  };

  return (
    <div className="space-y-6 py-6 px-6">
      {/* Header */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và cấp quyền cho tài khoản người dùng
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tạo tài khoản mới
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, email, username..."
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
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.code} value={role.code}>
                {role.name}
              </option>
            ))}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Khóa</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    Không có tài khoản nào
                  </td>
                </tr>
              ) : (
                accounts.map((account) => {
                  const RoleIcon = getRoleIcon(account.quyen?.ten_quyen);
                  return (
                    <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm`}>
                            {getInitials(account.ho_ten || account.username)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.ho_ten || account.username}</p>
                            <p className="text-xs text-gray-500">TK-{account.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{account.username}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{account.email || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${getRoleColor(account.quyen?.ten_quyen)} flex items-center justify-center text-white`}>
                            <RoleIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-gray-700">{getRoleDisplayName(account.quyen?.ten_quyen)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{account.vien?.ten_vien || '-'}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.trang_thai)}`}>
                          {getStatusLabel(account.trang_thai)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{formatDate(account.updated_at)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(account.id)}
                            className={`p-1.5 rounded transition-colors ${
                              account.trang_thai === 1
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={account.trang_thai === 1 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {account.trang_thai === 1 ? (
                              <FaLock className="w-4 h-4" />
                            ) : (
                              <FaUnlock className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal/Form để tạo/sửa */}
      {(isEditing || isCreating) && (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {isCreating ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}
            </h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setIsCreating(false);
                setSelectedAccount(null);
                setFormData({
                  username: '',
                  ho_ten: '',
                  email: '',
                  id_quyen: '',
                  id_vien: user?.id_vien || '',
                  trang_thai: 1,
                  password: '',
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isEditing}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.ho_ten}
                  onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò *
                </label>
                <select
                  value={formData.id_quyen}
                  onChange={(e) => setFormData({ ...formData, id_quyen: parseInt(e.target.value) })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.code} value={role.id_quyen}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: parseInt(e.target.value) })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Khóa</option>
                </select>
              </div>

              {isCreating && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu"
                    required={isCreating}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setSelectedAccount(null);
                  setFormData({
                    username: '',
                    ho_ten: '',
                    email: '',
                    id_quyen: '',
                    id_vien: user?.id_vien || '',
                    trang_thai: 1,
                    password: '',
                  });
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                {isCreating ? 'Tạo tài khoản' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountManager;


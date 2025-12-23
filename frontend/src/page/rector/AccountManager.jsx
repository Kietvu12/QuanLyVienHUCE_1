import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaLock, FaUnlock, FaUserShield, FaUser, FaUserTie, FaUserCog } from 'react-icons/fa';
import React from 'react';
const accounts = [
  {
    id: 'ACC-001',
    username: 'admin',
    name: 'Nguyễn Văn A',
    email: 'admin@example.com',
    role: 'Quản trị viên',
    roleCode: 'admin',
    department: 'Công nghệ thông tin',
    status: 'Hoạt động',
    lastLogin: '15/12/2025 14:30',
    permissions: ['Tất cả quyền'],
    createdAt: '01/01/2020',
  },
  {
    id: 'ACC-002',
    username: 'manager01',
    name: 'Trần Thị B',
    email: 'manager01@example.com',
    role: 'Quản lý',
    roleCode: 'manager',
    department: 'Xây dựng',
    status: 'Hoạt động',
    lastLogin: '15/12/2025 10:15',
    permissions: ['Xem báo cáo', 'Duyệt báo cáo', 'Quản lý nhân sự'],
    createdAt: '15/03/2021',
  },
  {
    id: 'ACC-003',
    username: 'user001',
    name: 'Lê Văn C',
    email: 'user001@example.com',
    role: 'Người dùng',
    roleCode: 'user',
    department: 'Kỹ thuật',
    status: 'Hoạt động',
    lastLogin: '14/12/2025 16:45',
    permissions: ['Xem báo cáo', 'Tạo báo cáo'],
    createdAt: '10/06/2019',
  },
  {
    id: 'ACC-004',
    username: 'user002',
    name: 'Phạm Thị D',
    email: 'user002@example.com',
    role: 'Người dùng',
    roleCode: 'user',
    department: 'Công nghệ thông tin',
    status: 'Khóa',
    lastLogin: '10/12/2025 09:20',
    permissions: ['Xem báo cáo'],
    createdAt: '05/09/2022',
  },
  {
    id: 'ACC-005',
    username: 'manager02',
    name: 'Hoàng Văn E',
    email: 'manager02@example.com',
    role: 'Quản lý',
    roleCode: 'manager',
    department: 'Hành chính',
    status: 'Hoạt động',
    lastLogin: '15/12/2025 11:30',
    permissions: ['Xem báo cáo', 'Duyệt báo cáo', 'Quản lý tài sản'],
    createdAt: '12/11/2020',
  },
  {
    id: 'ACC-006',
    username: 'user003',
    name: 'Nguyễn Thị F',
    email: 'user003@example.com',
    role: 'Người dùng',
    roleCode: 'user',
    department: 'Xây dựng',
    status: 'Hoạt động',
    lastLogin: '13/12/2025 14:00',
    permissions: ['Xem báo cáo', 'Tạo báo cáo', 'Quản lý đề tài'],
    createdAt: '15/04/2021',
  },
];

const roles = [
  { code: 'admin', name: 'Quản trị viên', icon: FaUserShield, color: 'bg-red-500' },
  { code: 'manager', name: 'Quản lý', icon: FaUserTie, color: 'bg-blue-500' },
  { code: 'user', name: 'Người dùng', icon: FaUser, color: 'bg-green-500' },
  { code: 'viewer', name: 'Người xem', icon: FaUserCog, color: 'bg-gray-500' },
];

const allPermissions = [
  'Tất cả quyền',
  'Xem báo cáo',
  'Tạo báo cáo',
  'Duyệt báo cáo',
  'Quản lý nhân sự',
  'Quản lý tài sản',
  'Quản lý đề tài',
  'Quản lý doanh thu',
  'Quản lý tài khoản',
  'Xuất dữ liệu',
];

const AccountManager = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPermissions, setShowPermissions] = useState(null);

  const getRoleIcon = (roleCode) => {
    const role = roles.find((r) => r.code === roleCode);
    return role ? role.icon : FaUser;
  };

  const getRoleColor = (roleCode) => {
    const role = roles.find((r) => r.code === roleCode);
    return role ? role.color : 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    return status === 'Hoạt động'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-red-100 text-red-800';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(-2);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedAccount({
      id: '',
      username: '',
      name: '',
      email: '',
      role: 'Người dùng',
      roleCode: 'user',
      department: '',
      status: 'Hoạt động',
      permissions: [],
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleToggleStatus = (accountId) => {
    // Aquí se haría la llamada a la API
    console.log('Toggle status for:', accountId);
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
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="manager">Quản lý</option>
            <option value="user">Người dùng</option>
            <option value="viewer">Người xem</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Khóa</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả phòng ban</option>
            <option value="it">Công nghệ thông tin</option>
            <option value="construction">Xây dựng</option>
            <option value="engineering">Kỹ thuật</option>
            <option value="admin">Hành chính</option>
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
              {accounts.map((account) => {
                const RoleIcon = getRoleIcon(account.roleCode);
                return (
                  <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm`}>
                          {getInitials(account.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{account.name}</p>
                          <p className="text-xs text-gray-500">{account.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{account.username}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{account.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${getRoleColor(account.roleCode)} flex items-center justify-center text-white`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-700">{account.role}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{account.department}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{account.lastLogin}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowPermissions(showPermissions === account.id ? null : account.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem quyền"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
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
                            account.status === 'Hoạt động'
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={account.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {account.status === 'Hoạt động' ? (
                            <FaLock className="w-4 h-4" />
                          ) : (
                            <FaUnlock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Hiển thị quyền khi click vào icon mắt */}
        {showPermissions && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Quyền của {accounts.find((a) => a.id === showPermissions)?.name}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {accounts
                .find((a) => a.id === showPermissions)
                ?.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {permission}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị 1-6 của {accounts.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal/Form para crear/editar */}
      {(isEditing || isCreating) && selectedAccount && (
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
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                defaultValue={selectedAccount.username}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                defaultValue={selectedAccount.name}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                defaultValue={selectedAccount.email}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò *
              </label>
              <select
                defaultValue={selectedAccount.roleCode}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roles.map((role) => (
                  <option key={role.code} value={role.code}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phòng ban
              </label>
              <select
                defaultValue={selectedAccount.department}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn phòng ban</option>
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Xây dựng">Xây dựng</option>
                <option value="Kỹ thuật">Kỹ thuật</option>
                <option value="Hành chính">Hành chính</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                defaultValue={selectedAccount.status === 'Hoạt động' ? 'active' : 'locked'}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="locked">Khóa</option>
              </select>
            </div>

            {isCreating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            )}
          </div>

          {/* Quyền */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Phân quyền
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allPermissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={
                      selectedAccount.permissions.includes(permission) ||
                      selectedAccount.permissions.includes('Tất cả quyền')
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex items-center gap-3 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setIsCreating(false);
                setSelectedAccount(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                // Aquí se haría la llamada a la API
                setIsEditing(false);
                setIsCreating(false);
                setSelectedAccount(null);
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {isCreating ? 'Tạo tài khoản' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;


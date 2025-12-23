import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaCalendarAlt, FaLock, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Dữ liệu người dùng (trong production sẽ lấy từ API)
  const [userData, setUserData] = useState({
    name: user?.name || 'Trưởng bộ phận',
    email: user?.email || 'division@example.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    position: 'Trưởng bộ phận',
    department: 'Phòng Quản lý',
    employeeId: 'NV-2025-002',
    startDate: '10/06/2020',
    avatar: null,
  });

  const [formData, setFormData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = () => {
    setUserData({ ...formData });
    setIsEditing(false);
    // TODO: Gọi API để lưu thay đổi
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  const handleSavePassword = () => {
    // Validate mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    // TODO: Gọi API để đổi mật khẩu
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsEditingPassword(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(-2);
  };

  return (
    <div className="space-y-6 py-6 px-6">
      {/* Header */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <FaEdit className="w-4 h-4" />
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* Avatar và thông tin cơ bản */}
        <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                getInitials(userData.name)
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaEdit className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{userData.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{userData.position} - {userData.department}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-gray-400" />
                <span>{userData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{userData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{userData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900">{userData.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaBriefcase className="w-4 h-4 text-gray-400" />
              Chức vụ
            </label>
            <p className="text-sm text-gray-900">{userData.position}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaBuilding className="w-4 h-4 text-gray-400" />
              Phòng ban
            </label>
            <p className="text-sm text-gray-900">{userData.department}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaUser className="w-4 h-4 text-gray-400" />
              Mã nhân viên
            </label>
            <p className="text-sm text-gray-900">{userData.employeeId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-400" />
              Ngày vào làm
            </label>
            <p className="text-sm text-gray-900">{userData.startDate}</p>
          </div>
        </div>

        {/* Nút hành động */}
        {isEditing && (
          <div className="mt-6 flex items-center gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <FaSave className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>

      {/* Đổi mật khẩu */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaLock className="w-5 h-5" />
              Đổi mật khẩu
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Thay đổi mật khẩu của bạn để bảo mật tài khoản
            </p>
          </div>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Đổi mật khẩu
            </button>
          )}
        </div>

        {isEditingPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                Hủy
              </button>
              <button
                onClick={handleSavePassword}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <FaSave className="w-4 h-4" />
                Lưu mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;


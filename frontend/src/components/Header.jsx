import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiBell, HiLogout, HiMenu } from 'react-icons/hi';
import React from 'react';
const breadcrumbLabels = {
  dashboard: 'Dashboard',
  revenue: 'Doanh thu',
  research: 'Đề tài nghiên cứu',
  personnel: 'Quản lý nhân sự',
  asset: 'Quản lý tài sản',
  report: 'Quản lý báo cáo',
  profile: 'Hồ sơ cá nhân',
  accountmanager: 'Quản lý tài khoản',
  invoice: 'Hóa đơn',
};

const roleLabels = {
  rector: 'Viện trưởng',
  principal: 'Hiệu trưởng',
  division: 'Cấp phòng',
  accountant: 'Kế toán',
};

const formatLabel = (segment) => {
  if (!segment) return '';
  if (breadcrumbLabels[segment]) return breadcrumbLabels[segment];
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Obtener el rol de la ruta actual
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const role = pathSegments[0] || user.role;
  const segments = pathSegments.slice(1); // Remover el rol del path
  const displaySegments = segments.length ? segments : ['dashboard'];

  const breadcrumbs = displaySegments.map((segment, index) => {
    const path = `/${role}/${segments.slice(0, index + 1).join('/')}`;
    return {
      label: formatLabel(segment),
      path,
      isLast: index === displaySegments.length - 1,
    };
  });

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'U'; // Default initial if name is not available
    }
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'U';
    }
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    // Lấy chữ cái đầu của từ đầu và từ cuối
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Mở menu"
        >
          <HiMenu className="w-6 h-6" />
        </button>
        
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to={`/${role}/dashboard`} className="hover:text-blue-600 hidden sm:inline">
            Trang chủ
          </Link>
          {breadcrumbs.map((crumb) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <span className="hidden sm:inline">/</span>
              {crumb.isLast ? (
                <span className="text-gray-900 font-medium text-xs sm:text-sm">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-blue-600 hidden sm:inline text-xs sm:text-sm">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 justify-end">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs sm:text-base">
          {getInitials(user.ho_ten || user.name || user.username || '')}
        </div>
        <div className="text-right hidden md:block">
          <p className="text-base font-semibold text-gray-900 whitespace-nowrap">
            {user.ho_ten || user.name || user.username || 'Người dùng'}
          </p>
          <p className="text-sm text-gray-500">
            {roleLabels[user.role] || user.quyen?.mo_ta || user.position || 'Người dùng'}
          </p>
        </div>
        <button
          type="button"
          className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-gray-200 text-gray-600 hover:bg-blue-50 transition-colors"
          aria-label="Thông báo"
        >
          <HiBell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 block w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
          aria-label="Đăng xuất"
        >
          <HiLogout className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

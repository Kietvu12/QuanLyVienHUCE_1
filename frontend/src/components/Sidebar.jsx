import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiHome, 
  HiUser,
  HiLogout,
  HiChevronLeft,
  HiChevronRight,
  HiX
} from 'react-icons/hi';
import { 
  FaDollarSign, 
  FaFileAlt,
  FaFlask,
  FaUsers,
  FaBox,
  FaChartBar,
  FaReceipt,
  FaFileInvoiceDollar,
  FaBuilding
} from 'react-icons/fa';
import logo from '../assets/icon/logo.png';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) {
    return null;
  }

  const getMenuItems = () => {
    const basePath = `/${user.role}`;
    
    switch (user.role) {
      case 'rector':
        return [
          { 
            name: 'Dashboard', 
            icon: HiHome, 
            path: `${basePath}/dashboard`,
            active: location.pathname.includes('/dashboard')
          },
          { 
            name: 'Doanh thu', 
            icon: FaDollarSign, 
            path: `${basePath}/revenue`,
            active: location.pathname.includes('/revenue')
          },
          { 
            name: 'Đề tài nghiên cứu', 
            icon: FaFlask, 
            path: `${basePath}/research`,
            active: location.pathname.includes('/research')
          },
          { 
            name: 'Quản lý nhân sự', 
            icon: FaUsers, 
            path: `${basePath}/personnel`,
            active: location.pathname.includes('/personnel')
          },
          { 
            name: 'Quản lý tài sản', 
            icon: FaBox, 
            path: `${basePath}/asset`,
            active: location.pathname.includes('/asset')
          },
          { 
            name: 'Quản lý báo cáo', 
            icon: FaChartBar, 
            path: `${basePath}/report`,
            active: location.pathname.includes('/report')
          },
        ];
      
      case 'principal':
        return [
          { 
            name: 'Dashboard', 
            icon: HiHome, 
            path: `${basePath}/dashboard`,
            active: location.pathname.includes('/dashboard')
          },
          { 
            name: 'Thông tin các Viện', 
            icon: FaBuilding, 
            path: `${basePath}/institute`,
            active: location.pathname.includes('/institute')
          },
          { 
            name: 'Quản lý nhân sự', 
            icon: FaUsers, 
            path: `${basePath}/personnel`,
            active: location.pathname.includes('/personnel')
          },
          { 
            name: 'Doanh thu/Công nợ', 
            icon: FaDollarSign, 
            path: `${basePath}/revenue`,
            active: location.pathname.includes('/revenue')
          },
          { 
            name: 'Quản lý tài sản', 
            icon: FaBox, 
            path: `${basePath}/asset`,
            active: location.pathname.includes('/asset')
          },
          { 
            name: 'Đề tài nghiên cứu', 
            icon: FaFlask, 
            path: `${basePath}/research`,
            active: location.pathname.includes('/research')
          },
          { 
            name: 'Quản lý báo cáo', 
            icon: FaChartBar, 
            path: `${basePath}/report`,
            active: location.pathname.includes('/report')
          },
        ];
      
      case 'division':
        return [
          { 
            name: 'Dashboard', 
            icon: HiHome, 
            path: `${basePath}/dashboard`,
            active: location.pathname.includes('/dashboard')
          },
          { 
            name: 'Doanh thu', 
            icon: FaDollarSign, 
            path: `${basePath}/revenue`,
            active: location.pathname.includes('/revenue')
          },
          { 
            name: 'Đề tài nghiên cứu', 
            icon: FaFlask, 
            path: `${basePath}/research`,
            active: location.pathname.includes('/research')
          },
          { 
            name: 'Quản lý nhân sự', 
            icon: FaUsers, 
            path: `${basePath}/personnel`,
            active: location.pathname.includes('/personnel')
          },
          { 
            name: 'Quản lý báo cáo', 
            icon: FaChartBar, 
            path: `${basePath}/report`,
            active: location.pathname.includes('/report')
          },
        ];
      
      case 'accountant':
        return [
          { 
            name: 'Dashboard', 
            icon: HiHome, 
            path: `${basePath}/dashboard`,
            active: location.pathname.includes('/dashboard')
          },
          { 
            name: 'Doanh thu', 
            icon: FaDollarSign, 
            path: `${basePath}/revenue`,
            active: location.pathname.includes('/revenue')
          },
          { 
            name: 'Đề tài nghiên cứu', 
            icon: FaFlask, 
            path: `${basePath}/research`,
            active: location.pathname.includes('/research')
          },
          { 
            name: 'Quản lý nhân sự', 
            icon: FaUsers, 
            path: `${basePath}/personnel`,
            active: location.pathname.includes('/personnel')
          },
          { 
            name: 'Quản lý tài sản', 
            icon: FaBox, 
            path: `${basePath}/asset`,
            active: location.pathname.includes('/asset')
          },
          { 
            name: 'Quản lý báo cáo', 
            icon: FaChartBar, 
            path: `${basePath}/report`,
            active: location.pathname.includes('/report')
          },
          { 
            name: 'Hóa đơn', 
            icon: FaReceipt, 
            path: `${basePath}/invoice`,
            active: location.pathname.includes('/invoice')
          },
        ];
      
      default:
        return [];
    }
  };

  const getAccountPages = () => {
    const basePath = `/${user.role}`;
    
    const commonPages = [
      { 
        name: 'Hồ sơ cá nhân', 
        icon: HiUser, 
        path: `${basePath}/profile`,
        active: location.pathname.includes('/profile')
      }
    ];

    // Solo rector puede ver gestión de cuentas
    if (user.role === 'rector') {
      commonPages.push({
        name: 'Quản lý tài khoản', 
        icon: FaFileAlt, 
        path: `${basePath}/accountmanager`,
        active: location.pathname.includes('/accountmanager')
      });
    }

    return commonPages;
  };

  const getTitle = () => {
    switch (user.role) {
      case 'division':
        return 'Phòng NCKH ĐHXDHN';
      case 'principal':
        return 'Đại học Xây Dựng Hà Nội';
      case 'accountant':
        return 'Viện Tin học Xây Dựng';
      case 'rector':
        return 'Viện Tin học Xây Dựng';
      default:
        return 'Viện Tin học Xây Dựng';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = getMenuItems();
  const accountPages = getAccountPages();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-80'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-lg lg:shadow-none
      `}>
        {/* Header với Logo và Title */}
        <div className={`
          flex items-center gap-3
          ${isCollapsed ? 'justify-center p-4' : 'p-6'}
          border-b border-gray-200
        `}>
          {!isCollapsed && (
            <>
              <img 
                src={logo} 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-base font-semibold text-black whitespace-nowrap">
                {getTitle()}
              </h1>
            </>
          )}
          {isCollapsed && (
            <img 
              src={logo} 
              alt="Logo" 
              className="w-10 h-10 object-contain"
            />
          )}
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? (
            <HiChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <HiChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

      {/* Main Navigation Items */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 mb-2 rounded-lg transition-colors
                ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                ${item.active
                  ? 'bg-blue-100 text-black font-bold'
                  : 'text-gray-500 hover:bg-gray-200'
                }
              `}
              title={isCollapsed ? item.name : ''}
            >
              <div
                className={`
                  flex items-center justify-center rounded-lg
                  ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
                  ${item.active
                    ? 'bg-transparent'
                    : 'bg-gray-100'
                  }
                `}
              >
                <Icon
                  className={`
                    ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                    ${item.active
                      ? 'text-blue-600'
                      : 'text-blue-400'
                    }
                  `}
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Account Pages Section */}
      <div className="px-4 py-2 border-t border-gray-300">
        {!isCollapsed && (
          <h2 className="text-sm font-bold text-black mb-2 px-4">ACCOUNT PAGES</h2>
        )}
        {accountPages.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 mb-2 rounded-lg transition-colors
                ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                ${item.active
                  ? 'bg-blue-100 text-black font-bold'
                  : 'text-gray-500 hover:bg-gray-200'
                }
              `}
              title={isCollapsed ? item.name : ''}
            >
              <div
                className={`
                  flex items-center justify-center rounded-lg
                  ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
                  ${item.active
                    ? 'bg-transparent'
                    : 'bg-gray-100'
                  }
                `}
              >
                <Icon
                  className={`
                    ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                    ${item.active
                      ? 'text-blue-600'
                      : 'text-blue-400'
                    }
                  `}
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
        
        {/* Logout button */}
        <button
          onClick={() => {
            handleLogout();
            onMobileClose?.();
          }}
          className={`
            w-full flex items-center gap-3 mb-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors
            ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
          `}
          title={isCollapsed ? 'Đăng xuất' : ''}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
            <HiLogout className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} text-red-400`} />
          </div>
          {!isCollapsed && (
            <span className="text-sm">Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Map quyền từ backend sang route frontend
const mapRoleToRoute = (backendRole) => {
  const roleMap = {
    'hieu_truong': 'principal',      // Hiệu trưởng -> principal
    'vien_truong': 'rector',          // Viện trưởng -> rector
    'cap_phong': 'division',          // Cấp phòng -> division
    'ke_toan_vien': 'accountant'      // Kế toán viên -> accountant
  };
  return roleMap[backendRole] || null;
};

// Map route frontend sang quyền backend (để kiểm tra)
const mapRouteToRole = (frontendRoute) => {
  const routeMap = {
    'principal': 'hieu_truong',
    'rector': 'vien_truong',
    'division': 'cap_phong',
    'accountant': 'ke_toan_vien'
  };
  return routeMap[frontendRoute] || null;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Lấy quyền từ user (có thể là backend role hoặc đã được map)
  const userBackendRole = user.role || user.quyen?.ten_quyen || user.ten_quyen;
  const userFrontendRoute = mapRoleToRoute(userBackendRole) || user.role;

  // Kiểm tra quyền truy cập
  if (requiredRole) {
    // Nếu user.role đã là frontend route (đã được map), so sánh trực tiếp
    // Nếu chưa, map và so sánh
    if (userFrontendRoute !== requiredRole) {
      // Nếu user có quyền hợp lệ nhưng khác, điều hướng đến dashboard của họ
      if (userFrontendRoute) {
        return <Navigate to={`/${userFrontendRoute}/dashboard`} replace />;
      } else {
        // Nếu không có quyền hợp lệ, về login
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;


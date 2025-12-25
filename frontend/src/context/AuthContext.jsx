import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';
import { authAPI } from '../services/api';

// Map quyền từ backend sang route frontend
const mapRoleToRoute = (backendRole) => {
  const roleMap = {
    'hieu_truong': 'principal',      // Hiệu trưởng -> principal
    'vien_truong': 'rector',          // Viện trưởng -> rector
    'cap_phong': 'division',          // Cấp phòng -> division
    'ke_toan_vien': 'accountant'      // Kế toán viên -> accountant
  };
  return roleMap[backendRole] || backendRole; // Nếu không có trong map, giữ nguyên
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verify user has valid role
        if (parsedUser && (parsedUser.role || parsedUser.quyen)) {
          setUser(parsedUser);
          setToken(savedToken);
        } else {
          // If user doesn't have role, clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        // If error parsing, clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      if (response.success && response.data) {
        const userData = response.data.user;
        const authToken = response.data.token;
        
        // Lấy quyền từ backend
        const backendRole = userData.quyen?.ten_quyen || userData.ten_quyen;
        
        // Map backend role sang frontend route
        const frontendRoute = mapRoleToRoute(backendRole);
        
        // Tạo user object với cả backend role và frontend route
        const userWithRole = {
          ...userData,
          role: frontendRoute, // Frontend route để điều hướng
          backendRole: backendRole, // Giữ lại backend role để tham chiếu
        };
        
        setUser(userWithRole);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        localStorage.setItem('token', authToken);
        
        return { success: true, data: userWithRole };
      }
      return { success: false, message: response.message || 'Đăng nhập thất bại' };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng nhập thất bại' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        const userData = response.data;
        
        // Lấy quyền từ backend
        const backendRole = userData.quyen?.ten_quyen || userData.ten_quyen;
        
        // Map backend role sang frontend route
        const frontendRoute = mapRoleToRoute(backendRole);
        
        // Tạo user object với cả backend role và frontend route
        const userWithRole = {
          ...userData,
          role: frontendRoute, // Frontend route để điều hướng
          backendRole: backendRole, // Giữ lại backend role để tham chiếu
        };
        
        setUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        return { success: true, data: userWithRole };
      }
      return { success: false, message: response.message || 'Lấy thông tin thất bại' };
    } catch (error) {
      return { success: false, message: error.message || 'Lấy thông tin thất bại' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


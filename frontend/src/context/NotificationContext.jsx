import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { thongBaoAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kết nối Socket.IO
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseURL = API_BASE_URL.replace('/api', '');

    const newSocket = io(baseURL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Đã kết nối Socket.IO');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Đã ngắt kết nối Socket.IO');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Lỗi kết nối Socket.IO:', error);
    });

    // Lắng nghe thông báo mới
    newSocket.on('new_notification', (data) => {
      if (data.success && data.data) {
        setNotifications((prev) => [data.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Lắng nghe cập nhật thông báo
    newSocket.on('notification_updated', (data) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === data.notificationId
            ? { ...notif, da_doc: data.da_doc }
            : notif
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, token]);

  // Lấy danh sách thông báo
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await thongBaoAPI.getAll({ page: 1, limit: 50 });
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông báo:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy số thông báo chưa đọc
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await thongBaoAPI.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count || 0);
      }
    } catch (error) {
      console.error('Lỗi khi lấy số thông báo chưa đọc:', error);
    }
  }, []);

  // Đánh dấu đã đọc
  const markAsRead = useCallback(async (id) => {
    try {
      const response = await thongBaoAPI.markAsRead(id);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, da_doc: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  }, []);

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await thongBaoAPI.markAllAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, da_doc: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
    }
  }, []);

  // Xóa thông báo
  const deleteNotification = useCallback(async (id) => {
    try {
      const response = await thongBaoAPI.delete(id);
      if (response.success) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        // Giảm unreadCount nếu thông báo chưa đọc
        const notif = notifications.find((n) => n.id === id);
        if (notif && !notif.da_doc) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
    }
  }, [notifications]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, token, fetchNotifications, fetchUnreadCount]);

  // Cập nhật unreadCount khi notifications thay đổi
  useEffect(() => {
    const count = notifications.filter((n) => !n.da_doc).length;
    setUnreadCount(count);
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    socket,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};


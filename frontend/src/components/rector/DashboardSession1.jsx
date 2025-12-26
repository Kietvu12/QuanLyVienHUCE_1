import { FaWallet, FaGlobe, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doanhThuAPI, deTaiNghienCuuStatisticsAPI, nhanSuStatisticsAPI, taiSanAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value) || 0) + ' đ';
  }
  return '0 đ';
};

const DashboardSession1 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([
    {
      label: 'Doanh thu',
      value: '0 đ',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaWallet,
    },
    {
      label: 'Đề tài nghiên cứu',
      value: '0',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaGlobe,
    },
    {
      label: 'Nhân sự',
      value: '0',
      change: null,
      icon: FaUsers,
    },
    {
      label: 'Cảnh báo thiết bị',
      value: '0 thiết bị hỏng',
      icon: FaExclamationTriangle,
    },
  ]);

  useEffect(() => {
    // Chỉ fetch khi user đã được load
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Log để debug
      console.log('=== Dashboard Data Fetch ===');
      console.log('User object:', user);
      console.log('User id_vien:', user?.id_vien);
      console.log('User id_vien type:', typeof user?.id_vien);
      
      // Đảm bảo id_vien là number nếu có, nếu không có thì không truyền param
      const idVien = user?.id_vien ? Number(user.id_vien) : undefined;
      console.log('Converted id_vien:', idVien);
      
      // Tạo params object, chỉ thêm id_vien nếu có giá trị
      const params = idVien ? { id_vien: idVien } : {};
      console.log('API params:', params);
      
      const [revenueStats, projectStats, personnelStats, assetStats] = await Promise.all([
        doanhThuAPI.getStatistics(params),
        deTaiNghienCuuStatisticsAPI.getStatistics(params),
        nhanSuStatisticsAPI.getSummary(params),
        taiSanAPI.getStatistics(params)
      ]);

      // Log responses để debug
      console.log('Dashboard API responses:', {
        revenueStats: {
          success: revenueStats?.success,
          data: revenueStats?.data,
          message: revenueStats?.message
        },
        projectStats: {
          success: projectStats?.success,
          data: projectStats?.data,
          message: projectStats?.message
        },
        personnelStats: {
          success: personnelStats?.success,
          data: personnelStats?.data,
          message: personnelStats?.message
        },
        assetStats: {
          success: assetStats?.success,
          data: assetStats?.data,
          message: assetStats?.message
        }
      });

      const newCards = [
        {
          label: 'Doanh thu',
          value: formatCurrency(revenueStats?.success ? (revenueStats.data?.tong_doanh_thu || 0) : 0),
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaWallet,
        },
        {
          label: 'Đề tài nghiên cứu',
          value: projectStats?.success ? (projectStats.data?.tong_de_tai || 0).toString() : '0',
          change: projectStats?.success && projectStats.data?.change?.tong_de_tai ? 
            `+${projectStats.data.change.tong_de_tai}` : null,
          changeColor: 'text-emerald-500',
          icon: FaGlobe,
        },
        {
          label: 'Nhân sự',
          value: personnelStats?.success ? 
            (personnelStats.data?.nhan_su_moi > 0 ? `+ ${personnelStats.data.nhan_su_moi} nhân sự mới` : 
             `${personnelStats.data?.tong_nhan_su || 0} nhân sự`) : '0',
          change: null,
          icon: FaUsers,
        },
        {
          label: 'Cảnh báo thiết bị',
          value: assetStats?.success ? 
            `${assetStats.data?.thiet_bi_hong || 0} thiết bị hỏng` : '0 thiết bị hỏng',
          icon: FaExclamationTriangle,
        },
      ];

      setCards(newCards);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Nếu có lỗi, vẫn hiển thị cards với giá trị mặc định
      setCards([
        {
          label: 'Doanh thu',
          value: '0 đ',
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaWallet,
        },
        {
          label: 'Đề tài nghiên cứu',
          value: '0',
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaGlobe,
        },
        {
          label: 'Nhân sự',
          value: '0',
          change: null,
          icon: FaUsers,
        },
        {
          label: 'Cảnh báo thiết bị',
          value: '0 thiết bị hỏng',
          icon: FaExclamationTriangle,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5"
            >
              <div className="flex flex-col gap-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
          ))
        ) : (
          cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-400">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-gray-900">
                      {card.value}
                    </span>
                    {card.change && (
                      <span className={`text-xs font-semibold ${card.changeColor}`}>
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500 text-white">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DashboardSession1;



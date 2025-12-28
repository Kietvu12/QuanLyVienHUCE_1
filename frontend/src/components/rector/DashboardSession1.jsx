import { FaWallet, FaGlobe, FaUsers, FaExclamationTriangle, FaFileInvoice } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doanhThuAPI, deTaiNghienCuuStatisticsAPI, nhanSuStatisticsAPI, taiSanAPI, nghiaVuNopAPI } from '../../services/api';

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
    {
      label: 'Nghĩa vụ & Công nợ',
      value: '0 đ',
      change: null,
      changeColor: 'text-red-500',
      icon: FaFileInvoice,
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
      
      const [revenueStats, projectStats, personnelStats, assetStats, nghiaVuStats] = await Promise.allSettled([
        doanhThuAPI.getStatistics(params),
        deTaiNghienCuuStatisticsAPI.getStatistics(params),
        nhanSuStatisticsAPI.getSummary(params),
        taiSanAPI.getStatistics(params),
        nghiaVuNopAPI.getStatistics(params)
      ]);

      // Xử lý kết quả từ Promise.allSettled
      const revenueData = revenueStats.status === 'fulfilled' ? revenueStats.value : null;
      const projectData = projectStats.status === 'fulfilled' ? projectStats.value : null;
      const personnelData = personnelStats.status === 'fulfilled' ? personnelStats.value : null;
      const assetData = assetStats.status === 'fulfilled' ? assetStats.value : null;
      const nghiaVuData = nghiaVuStats.status === 'fulfilled' ? nghiaVuStats.value : null;

      // Log responses để debug
      console.log('Dashboard API responses:', {
        revenueStats: {
          status: revenueStats.status,
          success: revenueData?.success,
          data: revenueData?.data,
          message: revenueData?.message,
          error: revenueStats.status === 'rejected' ? revenueStats.reason : null
        },
        projectStats: {
          status: projectStats.status,
          success: projectData?.success,
          data: projectData?.data,
          message: projectData?.message,
          error: projectStats.status === 'rejected' ? projectStats.reason : null
        },
        personnelStats: {
          status: personnelStats.status,
          success: personnelData?.success,
          data: personnelData?.data,
          message: personnelData?.message,
          error: personnelStats.status === 'rejected' ? personnelStats.reason : null
        },
        assetStats: {
          status: assetStats.status,
          success: assetData?.success,
          data: assetData?.data,
          message: assetData?.message,
          error: assetStats.status === 'rejected' ? assetStats.reason : null
        },
        nghiaVuStats: {
          status: nghiaVuStats.status,
          success: nghiaVuData?.success,
          data: nghiaVuData?.data,
          message: nghiaVuData?.message,
          error: nghiaVuStats.status === 'rejected' ? nghiaVuStats.reason : null
        }
      });

      const newCards = [
        {
          label: 'Doanh thu',
          value: formatCurrency(revenueData?.success ? (revenueData.data?.tong_doanh_thu || 0) : 0),
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaWallet,
        },
        {
          label: 'Đề tài nghiên cứu',
          value: projectData?.success ? (projectData.data?.tong_de_tai || 0).toString() : '0',
          change: projectData?.success && projectData.data?.change?.tong_de_tai ? 
            `+${projectData.data.change.tong_de_tai}` : null,
          changeColor: 'text-emerald-500',
          icon: FaGlobe,
        },
        {
          label: 'Nhân sự',
          value: personnelData?.success ? 
            (personnelData.data?.nhan_su_moi > 0 ? `+ ${personnelData.data.nhan_su_moi} nhân sự mới` : 
             `${personnelData.data?.tong_nhan_su || 0} nhân sự`) : '0',
          change: null,
          icon: FaUsers,
        },
        {
          label: 'Cảnh báo thiết bị',
          value: assetData?.success ? 
            `${assetData.data?.thiet_bi_hong || 0} thiết bị hỏng` : '0 thiết bị hỏng',
          icon: FaExclamationTriangle,
        },
        {
          label: 'Nghĩa vụ & Công nợ',
          value: nghiaVuData?.success ? 
            formatCurrency(nghiaVuData.data?.tong_cong_no || 0) : '0 đ',
          changeColor: 'text-red-500',
          icon: FaFileInvoice,
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
        {
          label: 'Nghĩa vụ & Công nợ',
          value: '0 đ',
          change: null,
          changeColor: 'text-red-500',
          icon: FaFileInvoice,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
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



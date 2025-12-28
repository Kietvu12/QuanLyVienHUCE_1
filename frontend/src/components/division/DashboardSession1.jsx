import { FaUsers, FaFlask, FaDollarSign, FaWallet, FaFileAlt } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  doanhThuAPI, 
  deTaiNghienCuuStatisticsAPI, 
  nhanSuStatisticsAPI, 
  nghiaVuNopAPI,
  baoCaoAPI 
} from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    const num = parseFloat(value) || 0;
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + ' tỷ';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' triệu';
    }
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' đ';
  }
  return '0 đ';
};

const DashboardSession1 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([
    {
      label: 'Tổng nhân sự tất cả Viện',
      value: '0',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaUsers,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Tổng đề tài nghiên cứu',
      value: '0',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaFlask,
      iconBg: 'bg-purple-500',
    },
    {
      label: 'Tổng doanh thu',
      value: '0 đ',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaDollarSign,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Tổng công nợ',
      value: '0 đ',
      change: null,
      changeColor: 'text-red-500',
      icon: FaWallet,
      iconBg: 'bg-orange-500',
    },
    {
      label: 'Báo cáo chờ duyệt',
      value: '0',
      change: null,
      changeColor: 'text-yellow-500',
      icon: FaFileAlt,
      iconBg: 'bg-yellow-500',
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cấp phòng không truyền id_vien để lấy tất cả viện
      const params = {};
      
      const [revenueStats, projectStats, personnelStats, nghiaVuStats, baoCaoStats] = await Promise.allSettled([
        doanhThuAPI.getStatistics(params),
        deTaiNghienCuuStatisticsAPI.getStatistics(params),
        nhanSuStatisticsAPI.getSummary(params),
        nghiaVuNopAPI.getStatistics(params),
        baoCaoAPI.getAll({ trang_thai: 'cho_phe_duyet', limit: 1 })
      ]);

      // Xử lý kết quả
      const revenueData = revenueStats.status === 'fulfilled' ? revenueStats.value : null;
      const projectData = projectStats.status === 'fulfilled' ? projectStats.value : null;
      const personnelData = personnelStats.status === 'fulfilled' ? personnelStats.value : null;
      const nghiaVuData = nghiaVuStats.status === 'fulfilled' ? nghiaVuStats.value : null;
      const baoCaoData = baoCaoStats.status === 'fulfilled' ? baoCaoStats.value : null;

      // Tính toán thay đổi (so với tháng trước - tạm thời để null)
      const tongDoanhThu = revenueData?.success ? (revenueData.data?.tong_doanh_thu || 0) : 0;
      const tongDeTai = projectData?.success ? (projectData.data?.tong_de_tai || 0) : 0;
      const tongNhanSu = personnelData?.success ? (personnelData.data?.tong_nhan_su || 0) : 0;
      const tongCongNo = nghiaVuData?.success ? (nghiaVuData.data?.tong_cong_no || 0) : 0;
      const soBaoCaoChoDuyet = baoCaoData?.success ? (baoCaoData.pagination?.total || 0) : 0;

      const newCards = [
        {
          label: 'Tổng nhân sự tất cả Viện',
          value: tongNhanSu.toString(),
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaUsers,
          iconBg: 'bg-blue-500',
        },
        {
          label: 'Tổng đề tài nghiên cứu',
          value: tongDeTai.toString(),
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaFlask,
          iconBg: 'bg-purple-500',
        },
        {
          label: 'Tổng doanh thu',
          value: formatCurrency(tongDoanhThu),
          change: null,
          changeColor: 'text-emerald-500',
          icon: FaDollarSign,
          iconBg: 'bg-emerald-500',
        },
        {
          label: 'Tổng công nợ',
          value: formatCurrency(tongCongNo),
          change: null,
          changeColor: 'text-red-500',
          icon: FaWallet,
          iconBg: 'bg-orange-500',
        },
        {
          label: 'Báo cáo chờ duyệt',
          value: soBaoCaoChoDuyet.toString(),
          change: null,
          changeColor: 'text-yellow-500',
          icon: FaFileAlt,
          iconBg: 'bg-yellow-500',
        },
      ];

      setCards(newCards);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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

                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.iconBg} text-white`}>
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


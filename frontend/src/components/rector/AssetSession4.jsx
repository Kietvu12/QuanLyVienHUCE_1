import { FaDownload, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taiSanAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    const billions = value / 1000000000;
    if (billions >= 1) {
      return `${billions.toFixed(1)} tỷ`;
    }
    const millions = value / 1000000;
    if (millions >= 1) {
      return `${millions.toFixed(0)} triệu`;
    }
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return '0 đ';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getActivityColor = (type) => {
  switch (type) {
    case 'Thêm mới':
      return 'bg-emerald-100 text-emerald-800';
    case 'Bảo trì':
      return 'bg-yellow-100 text-yellow-800';
    case 'Chuyển đổi':
      return 'bg-blue-100 text-blue-800';
    case 'Thanh lý':
      return 'bg-red-100 text-red-800';
    case 'Cập nhật':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AssetSession4 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [statistics, setStatistics] = useState([
    {
      label: 'Tổng giá trị tài sản',
      value: '0 đ',
      icon: FaDollarSign,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Tài sản cần bảo trì',
      value: '0',
      icon: FaExclamationTriangle,
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Tài sản đang sử dụng',
      value: '0',
      icon: FaCheckCircle,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Bảo trì trong tháng',
      value: '0',
      icon: FaCalendarAlt,
      iconBg: 'bg-purple-500',
    },
  ]);
  const [warnings, setWarnings] = useState({
    canBaoTri: 0,
    hong: 0,
  });

  useEffect(() => {
    if (user?.id_vien) {
      fetchData();
    }
  }, [user?.id_vien]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = user?.id_vien ? { id_vien: user.id_vien, page: 1, limit: 10 } : { page: 1, limit: 10 };
      
      const [statsResponse, assetsResponse] = await Promise.all([
        taiSanAPI.getStatistics(user?.id_vien ? { id_vien: user.id_vien } : {}),
        taiSanAPI.getAll(params)
      ]);

      // Xử lý thống kê
      if (statsResponse.success && statsResponse.data) {
        const stats = statsResponse.data;
        setStatistics([
          {
            label: 'Tổng giá trị tài sản',
            value: formatCurrency(stats.tong_gia_tri || 0),
            icon: FaDollarSign,
            iconBg: 'bg-emerald-500',
          },
          {
            label: 'Tài sản cần bảo trì',
            value: (stats.bao_tri || 0).toString(),
            icon: FaExclamationTriangle,
            iconBg: 'bg-yellow-500',
          },
          {
            label: 'Tài sản đang sử dụng',
            value: (stats.dang_su_dung || 0).toString(),
            icon: FaCheckCircle,
            iconBg: 'bg-blue-500',
          },
          {
            label: 'Bảo trì trong tháng',
            value: (stats.bao_tri || 0).toString(), // Tạm thời dùng bao_tri
            icon: FaCalendarAlt,
            iconBg: 'bg-purple-500',
          },
        ]);
        setWarnings({
          canBaoTri: stats.bao_tri || 0,
          hong: stats.thiet_bi_hong || 0,
        });
      }

      // Xử lý hoạt động gần đây
      if (assetsResponse.success && assetsResponse.data) {
        const activities = assetsResponse.data.slice(0, 5).map((asset, index) => {
          const tenTaiSan = asset.ten_tai_san || 'Tài sản không tên';
          const category = 'Tài sản'; // Có thể phân loại dựa trên tên
          const date = asset.created_at || asset.updated_at;
          
          return {
            id: asset.id,
            type: 'Thêm mới',
            asset: tenTaiSan,
            category: category,
            date: formatDate(date),
            time: formatTime(date),
            action: 'Đã thêm tài sản mới',
          };
        });
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hoạt động gần đây */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử thay đổi tài sản
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
              <FaDownload className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có hoạt động nào</div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <span className="text-xs font-semibold">{activity.type.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {activity.asset}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{activity.date}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {activity.action}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Thống kê */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Thống kê</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng quan tài sản
            </p>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              statistics.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Thông tin bổ sung */}
          {(warnings.canBaoTri > 0 || warnings.hong > 0) && (
            <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <FaExclamationTriangle className="w-4 h-4" />
                Cảnh báo
              </h4>
              <ul className="text-xs text-yellow-800 space-y-1">
                {warnings.canBaoTri > 0 && (
                  <li>• {warnings.canBaoTri} tài sản cần bảo trì ngay</li>
                )}
                {warnings.hong > 0 && (
                  <li>• {warnings.hong} tài sản hỏng cần thay thế</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssetSession4;


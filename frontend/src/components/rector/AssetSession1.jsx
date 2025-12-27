
import { FaBox, FaCheckCircle, FaExclamationTriangle, FaTools } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taiSanAPI } from '../../services/api';

const AssetSession1 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summaryCards, setSummaryCards] = useState([
    {
      label: 'Tổng tài sản',
      value: '0',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaBox,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Đang sử dụng',
      value: '0',
      change: null,
      changeColor: 'text-emerald-500',
      icon: FaCheckCircle,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Cần bảo trì',
      value: '0',
      change: null,
      changeColor: 'text-yellow-500',
      icon: FaTools,
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Hỏng/Cần thay',
      value: '0',
      change: null,
      changeColor: 'text-red-500',
      icon: FaExclamationTriangle,
      iconBg: 'bg-red-500',
    },
  ]);

  useEffect(() => {
    if (user?.id_vien) {
      fetchStatistics();
    }
  }, [user?.id_vien]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = user?.id_vien ? { id_vien: user.id_vien } : {};
      const response = await taiSanAPI.getStatistics(params);
      
      if (response.success && response.data) {
        const data = response.data;
        setSummaryCards([
          {
            label: 'Tổng tài sản',
            value: (data.tong_tai_san || 0).toString(),
            change: null,
            changeColor: 'text-emerald-500',
            icon: FaBox,
            iconBg: 'bg-blue-500',
          },
          {
            label: 'Đang sử dụng',
            value: (data.dang_su_dung || 0).toString(),
            change: null,
            changeColor: 'text-emerald-500',
            icon: FaCheckCircle,
            iconBg: 'bg-emerald-500',
          },
          {
            label: 'Cần bảo trì',
            value: (data.bao_tri || 0).toString(),
            change: null,
            changeColor: 'text-yellow-500',
            icon: FaTools,
            iconBg: 'bg-yellow-500',
          },
          {
            label: 'Hỏng/Cần thay',
            value: (data.thiet_bi_hong || 0).toString(),
            change: null,
            changeColor: 'text-red-500',
            icon: FaExclamationTriangle,
            iconBg: 'bg-red-500',
          },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê tài sản:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6">
      {/* Filtros */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Loại tài sản:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="computer">Máy tính</option>
              <option value="furniture">Nội thất</option>
              <option value="equipment">Thiết bị</option>
              <option value="vehicle">Phương tiện</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="using">Đang sử dụng</option>
              <option value="maintenance">Cần bảo trì</option>
              <option value="broken">Hỏng</option>
              <option value="available">Có sẵn</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Mã tài sản, tên, mô tả..."
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="h-9 px-6 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
            Lọc
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5"
            >
              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
          ))
        ) : (
          summaryCards.map((card) => {
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

export default AssetSession1;


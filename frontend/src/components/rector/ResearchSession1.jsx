import { FaFlask, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deTaiNghienCuuStatisticsAPI } from '../../services/api';

const formatChange = (value) => {
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `${value}`;
};

const getChangeColor = (value) => {
  if (value > 0) return 'text-emerald-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

const ResearchSession1 = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    tong_de_tai: 0,
    da_hoan_thanh: 0,
    dang_thuc_hien: 0,
    cham_tien_do: 0,
    change: {
      tong_de_tai: 0,
      da_hoan_thanh: 0,
      dang_thuc_hien: 0,
      cham_tien_do: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [user?.id_vien]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = { id_vien: user?.id_vien };
      const response = await deTaiNghienCuuStatisticsAPI.getStatistics(params);
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching research statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      label: 'Tổng đề tài',
      value: statistics.tong_de_tai.toString(),
      change: formatChange(statistics.change.tong_de_tai),
      changeColor: getChangeColor(statistics.change.tong_de_tai),
      icon: FaFlask,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Đã hoàn thành',
      value: statistics.da_hoan_thanh.toString(),
      change: formatChange(statistics.change.da_hoan_thanh),
      changeColor: getChangeColor(statistics.change.da_hoan_thanh),
      icon: FaCheckCircle,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Đang thực hiện',
      value: statistics.dang_thuc_hien.toString(),
      change: formatChange(statistics.change.dang_thuc_hien),
      changeColor: getChangeColor(statistics.change.dang_thuc_hien),
      icon: FaClock,
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Chậm tiến độ',
      value: statistics.cham_tien_do.toString(),
      change: formatChange(statistics.change.cham_tien_do),
      changeColor: getChangeColor(statistics.change.cham_tien_do),
      icon: FaExclamationTriangle,
      iconBg: 'bg-red-500',
    },
  ];
  return (
    <section className="px-6">
      {/* Filtros */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="active">Đang thực hiện</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="pending">Chờ duyệt</option>
              <option value="delayed">Chậm tiến độ</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Năm:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Lĩnh vực:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="it">Công nghệ thông tin</option>
              <option value="construction">Xây dựng</option>
              <option value="engineering">Kỹ thuật</option>
              <option value="science">Khoa học</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Người phụ trách:</label>
            <input
              type="text"
              placeholder="Tìm kiếm..."
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
          <div className="col-span-4 text-center py-8 text-gray-500">Đang tải...</div>
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
                    <span className={`text-xs font-semibold ${card.changeColor}`}>
                      {card.change}
                    </span>
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

export default ResearchSession1;


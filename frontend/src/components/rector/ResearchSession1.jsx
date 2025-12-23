import { FaFlask, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng đề tài',
    value: '156',
    change: '+12',
    changeColor: 'text-emerald-500',
    icon: FaFlask,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Đã hoàn thành',
    value: '98',
    change: '+8',
    changeColor: 'text-emerald-500',
    icon: FaCheckCircle,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Đang thực hiện',
    value: '45',
    change: '+5',
    changeColor: 'text-blue-500',
    icon: FaClock,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Chậm tiến độ',
    value: '13',
    change: '-3',
    changeColor: 'text-red-500',
    icon: FaExclamationTriangle,
    iconBg: 'bg-red-500',
  },
];

const ResearchSession1 = () => {
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
        {summaryCards.map((card) => {
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
        })}
      </div>
    </section>
  );
};

export default ResearchSession1;


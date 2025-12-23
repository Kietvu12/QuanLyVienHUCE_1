import { FaFileAlt, FaBuilding, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng báo cáo',
    value: '45',
    change: '+5',
    changeColor: 'text-emerald-500',
    icon: FaFileAlt,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Đã duyệt',
    value: '32',
    change: '+3',
    changeColor: 'text-emerald-500',
    icon: FaCheckCircle,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Chờ duyệt',
    value: '8',
    change: '+2',
    changeColor: 'text-yellow-500',
    icon: FaClock,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Từ chối',
    value: '5',
    change: '0',
    changeColor: 'text-red-500',
    icon: FaTimesCircle,
    iconBg: 'bg-red-500',
  },
];

const ReportSession1 = () => {
  return (
    <section className="px-6">
      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Viện:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto">
              <option value="">Tất cả Viện</option>
              <option value="vien1">Viện Tin học Xây Dựng</option>
              <option value="vien2">Viện Khoa học Công nghệ</option>
              <option value="vien3">Viện Nghiên cứu Phát triển</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Loại:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto">
              <option value="">Tất cả loại</option>
              <option value="doanhthu">Báo cáo doanh thu</option>
              <option value="detai">Báo cáo đề tài</option>
              <option value="nhansu">Báo cáo nhân sự</option>
              <option value="taisan">Báo cáo tài sản</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto">
              <option value="">Tất cả trạng thái</option>
              <option value="daduyet">Đã duyệt</option>
              <option value="choduyet">Chờ duyệt</option>
              <option value="tuchoi">Từ chối</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tên báo cáo..."
                className="w-full h-9 pl-4 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
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

export default ReportSession1;


import { FaFileAlt, FaCheckCircle, FaClock, FaDownload, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng báo cáo',
    value: '156',
    change: '+12',
    changeColor: 'text-emerald-500',
    icon: FaFileAlt,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Đã duyệt',
    value: '98',
    change: '+8',
    changeColor: 'text-emerald-500',
    icon: FaCheckCircle,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Đang chờ duyệt',
    value: '32',
    change: '+5',
    changeColor: 'text-yellow-500',
    icon: FaClock,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Từ chối',
    value: '8',
    change: '-2',
    changeColor: 'text-red-500',
    icon: FaTimesCircle,
    iconBg: 'bg-red-500',
  },
];

const ReportSession1 = () => {
  return (
    <section className="px-6">
      {/* Filtros */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Loại báo cáo:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="revenue">Báo cáo doanh thu</option>
              <option value="research">Báo cáo đề tài</option>
              <option value="personnel">Báo cáo nhân sự</option>
              <option value="asset">Báo cáo tài sản</option>
              <option value="financial">Báo cáo tài chính</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="pending">Chờ duyệt</option>
              <option value="failed">Lỗi</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái duyệt:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="not-sent">Chưa gửi</option>
              <option value="sent">Đã gửi</option>
              <option value="pending-approval">Đang chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
            <input
              type="date"
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="2025-01-01"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
            <input
              type="date"
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="2025-12-31"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tên báo cáo, mã báo cáo..."
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

export default ReportSession1;


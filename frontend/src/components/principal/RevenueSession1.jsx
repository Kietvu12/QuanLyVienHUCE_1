import { FaDollarSign, FaArrowUp, FaArrowDown, FaWallet, FaBuilding } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng thu tất cả Viện',
    value: '12.450.000.000',
    change: '+12.5%',
    changeColor: 'text-emerald-500',
    icon: FaDollarSign,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Tổng chi tất cả Viện',
    value: '9.850.000.000',
    change: '+8.2%',
    changeColor: 'text-red-500',
    icon: FaArrowDown,
    iconBg: 'bg-red-500',
  },
  {
    label: 'Tổng lợi nhuận',
    value: '2.600.000.000',
    change: '+25.3%',
    changeColor: 'text-emerald-500',
    icon: FaArrowUp,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Tổng công nợ',
    value: '1.850.000.000',
    change: '-5.2%',
    changeColor: 'text-red-500',
    icon: FaWallet,
    iconBg: 'bg-orange-500',
  },
];

const RevenueSession1 = () => {
  return (
    <section className="px-6">
      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Viện:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả Viện</option>
              <option value="vien1">Viện Tin học Xây Dựng</option>
              <option value="vien2">Viện Khoa học Công nghệ</option>
              <option value="vien3">Viện Nghiên cứu Phát triển</option>
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
            <label className="text-sm font-medium text-gray-700">Năm:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <button className="h-9 px-6 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
            Lọc
          </button>
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

export default RevenueSession1;


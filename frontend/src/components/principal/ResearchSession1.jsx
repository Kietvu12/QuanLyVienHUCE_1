import { FaFlask, FaUsers, FaDollarSign, FaChartLine, FaBuilding } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng đề tài tất cả Viện',
    value: '68',
    change: '+5',
    changeColor: 'text-emerald-500',
    icon: FaFlask,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Đang thực hiện',
    value: '45',
    change: '+3',
    changeColor: 'text-emerald-500',
    icon: FaChartLine,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Đã hoàn thành',
    value: '23',
    change: '+2',
    changeColor: 'text-emerald-500',
    icon: FaUsers,
    iconBg: 'bg-green-500',
  },
  {
    label: 'Tổng doanh thu từ đề tài',
    value: '8.5 tỷ',
    change: '+15.2%',
    changeColor: 'text-emerald-500',
    icon: FaDollarSign,
    iconBg: 'bg-purple-500',
  },
];

const ResearchSession1 = () => {
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
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="dangthuchien">Đang thực hiện</option>
              <option value="hoanthanh">Đã hoàn thành</option>
              <option value="tamhoan">Tạm hoãn</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Lĩnh vực:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="cntt">Công nghệ thông tin</option>
              <option value="kythuat">Kỹ thuật</option>
              <option value="xaydung">Xây dựng</option>
              <option value="khoahoc">Khoa học</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tên đề tài..."
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

export default ResearchSession1;


import { FaUsers, FaBuilding, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import React from 'react'
const summaryCards = [
  {
    label: 'Tổng nhân sự',
    value: '245',
    change: '+12',
    changeColor: 'text-emerald-500',
    icon: FaUsers,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Số Viện',
    value: '3',
    change: '',
    changeColor: 'text-gray-500',
    icon: FaBuilding,
    iconBg: 'bg-purple-500',
  },
  {
    label: 'Trưởng phòng',
    value: '15',
    change: '+2',
    changeColor: 'text-emerald-500',
    icon: FaUserTie,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Đang làm việc',
    value: '238',
    change: '+8',
    changeColor: 'text-emerald-500',
    icon: FaCheckCircle,
    iconBg: 'bg-green-500',
  },
];

const PersonnelSession1 = () => {
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
            <label className="text-sm font-medium text-gray-700">Phòng ban:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="it">Công nghệ thông tin</option>
              <option value="construction">Xây dựng</option>
              <option value="engineering">Kỹ thuật</option>
              <option value="admin">Hành chính</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Chức vụ:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="director">Giám đốc</option>
              <option value="manager">Trưởng phòng</option>
              <option value="senior">Chuyên viên cao cấp</option>
              <option value="specialist">Chuyên viên</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tên, mã nhân viên..."
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
        })}
      </div>
    </section>
  );
};

export default PersonnelSession1;


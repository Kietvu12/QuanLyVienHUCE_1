import { FaUsers, FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';
import React from 'react';
const summaryCards = [
  {
    label: 'Tổng nhân sự',
    value: '125',
    change: '+8',
    changeColor: 'text-emerald-500',
    icon: FaUsers,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Đang làm việc',
    value: '112',
    change: '+5',
    changeColor: 'text-emerald-500',
    icon: FaUserCheck,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Nhân sự mới',
    value: '8',
    change: '+3',
    changeColor: 'text-blue-500',
    icon: FaUserPlus,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Nghỉ phép',
    value: '5',
    change: '-2',
    changeColor: 'text-orange-500',
    icon: FaUserClock,
    iconBg: 'bg-orange-500',
  },
];

const PersonnelSession1 = () => {
  return (
    <section className="px-6">
      {/* Filtros */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
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
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="working">Đang làm việc</option>
              <option value="leave">Nghỉ phép</option>
              <option value="resigned">Đã nghỉ việc</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tên, mã nhân viên..."
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

export default PersonnelSession1;


import { FaDownload, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import React from 'react';
const recentActivities = [
  {
    id: 1,
    type: 'Thêm mới',
    asset: 'Laptop HP EliteBook',
    category: 'Máy tính',
    date: '15/12/2025',
    time: '09:30',
    action: 'Đã thêm tài sản mới',
  },
  {
    id: 2,
    type: 'Bảo trì',
    asset: 'Máy in Canon',
    category: 'Thiết bị',
    date: '14/12/2025',
    time: '14:20',
    action: 'Đã lên lịch bảo trì',
  },
  {
    id: 3,
    type: 'Chuyển đổi',
    asset: 'Bàn làm việc',
    category: 'Nội thất',
    date: '13/12/2025',
    time: '11:15',
    action: 'Đã chuyển vị trí',
  },
  {
    id: 4,
    type: 'Thanh lý',
    asset: 'Máy tính cũ',
    category: 'Máy tính',
    date: '12/12/2025',
    time: '16:45',
    action: 'Đã thanh lý tài sản',
  },
  {
    id: 5,
    type: 'Cập nhật',
    asset: 'Xe máy Yamaha',
    category: 'Phương tiện',
    date: '11/12/2025',
    time: '10:00',
    action: 'Đã cập nhật thông tin',
  },
];

const statistics = [
  {
    label: 'Tổng giá trị tài sản',
    value: '12.5 tỷ',
    icon: FaDollarSign,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Tài sản cần bảo trì',
    value: '28',
    icon: FaExclamationTriangle,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Tài sản đang sử dụng',
    value: '412',
    icon: FaCheckCircle,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Bảo trì trong tháng',
    value: '15',
    icon: FaCalendarAlt,
    iconBg: 'bg-purple-500',
  },
];

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
            {recentActivities.map((activity) => (
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
            ))}
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
            {statistics.map((stat, index) => {
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
            })}
          </div>

          {/* Thông tin bổ sung */}
          <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4" />
              Cảnh báo
            </h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 28 tài sản cần bảo trì ngay</li>
              <li>• 18 tài sản hỏng cần thay thế</li>
              <li>• 5 hợp đồng bảo hành sắp hết hạn</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetSession4;


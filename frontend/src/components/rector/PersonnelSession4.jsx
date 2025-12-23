import { FaDownload, FaFileAlt, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import React from 'react';
const recentActivities = [
  {
    id: 1,
    type: 'Thêm mới',
    person: 'Nguyễn Văn G',
    position: 'Chuyên viên',
    department: 'Công nghệ thông tin',
    date: '15/12/2025',
    time: '09:30',
    action: 'Đã thêm nhân sự mới',
  },
  {
    id: 2,
    type: 'Cập nhật',
    person: 'Trần Thị H',
    position: 'Chuyên viên cao cấp',
    department: 'Xây dựng',
    date: '14/12/2025',
    time: '14:20',
    action: 'Đã cập nhật thông tin lương',
  },
  {
    id: 3,
    type: 'Thay đổi',
    person: 'Lê Văn I',
    position: 'Trưởng phòng',
    department: 'Kỹ thuật',
    date: '13/12/2025',
    time: '11:15',
    action: 'Đã thay đổi phòng ban',
  },
  {
    id: 4,
    type: 'Thêm mới',
    person: 'Phạm Thị K',
    position: 'Nhân viên',
    department: 'Hành chính',
    date: '12/12/2025',
    time: '16:45',
    action: 'Đã thêm nhân sự mới',
  },
  {
    id: 5,
    type: 'Cập nhật',
    person: 'Hoàng Văn L',
    position: 'Chuyên viên',
    department: 'Công nghệ thông tin',
    date: '11/12/2025',
    time: '10:00',
    action: 'Đã cập nhật thông tin liên hệ',
  },
];

const statistics = [
  {
    label: 'Tổng hợp đồng lao động',
    value: '125',
    icon: FaFileAlt,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Hợp đồng sắp hết hạn',
    value: '8',
    icon: FaCalendarAlt,
    iconBg: 'bg-yellow-500',
  },
  {
    label: 'Tỷ lệ tăng trưởng',
    value: '+12.5%',
    icon: FaChartLine,
    iconBg: 'bg-emerald-500',
  },
];

const getActivityColor = (type) => {
  switch (type) {
    case 'Thêm mới':
      return 'bg-emerald-100 text-emerald-800';
    case 'Cập nhật':
      return 'bg-blue-100 text-blue-800';
    case 'Thay đổi':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PersonnelSession4 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hoạt động gần đây */}
        <div className="xl:col-span-2 rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử thay đổi nhân sự
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
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
                        {activity.person}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.position} - {activity.department}
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
              Tổng quan nhân sự
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
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Thông tin quan trọng
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 8 hợp đồng sắp hết hạn trong 30 ngày</li>
              <li>• 5 nhân sự mới trong tháng này</li>
              <li>• Tỷ lệ nghỉ việc: 2.4%</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonnelSession4;


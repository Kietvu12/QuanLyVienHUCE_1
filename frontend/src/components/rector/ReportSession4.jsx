import { FaFileAlt, FaDownload, FaChartLine, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';
const recentReports = [
  {
    id: 1,
    name: 'Báo cáo doanh thu tháng 12/2025',
    type: 'Báo cáo doanh thu',
    user: 'Nguyễn Văn A',
    action: 'Đã tải xuống',
    date: '15/12/2025',
    time: '14:30',
  },
  {
    id: 2,
    name: 'Báo cáo đề tài nghiên cứu Q4/2025',
    type: 'Báo cáo đề tài',
    user: 'Trần Thị B',
    action: 'Đã tạo mới',
    date: '14/12/2025',
    time: '11:20',
  },
  {
    id: 3,
    name: 'Báo cáo nhân sự tháng 12/2025',
    type: 'Báo cáo nhân sự',
    user: 'Lê Văn C',
    action: 'Đã tải xuống',
    date: '13/12/2025',
    time: '16:45',
  },
  {
    id: 4,
    name: 'Báo cáo tài sản năm 2025',
    type: 'Báo cáo tài sản',
    user: 'Phạm Thị D',
    action: 'Đã hoàn thành',
    date: '12/12/2025',
    time: '09:15',
  },
  {
    id: 5,
    name: 'Báo cáo tài chính Q4/2025',
    type: 'Báo cáo tài chính',
    user: 'Hoàng Văn E',
    action: 'Đang xử lý',
    date: '11/12/2025',
    time: '10:00',
  },
];

const statistics = [
  {
    label: 'Báo cáo đã tạo',
    value: '156',
    icon: FaFileAlt,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Tổng lượt tải',
    value: '1,245',
    icon: FaDownload,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Tỷ lệ hoàn thành',
    value: '91%',
    icon: FaChartLine,
    iconBg: 'bg-purple-500',
  },
  {
    label: 'Đang xử lý',
    value: '10',
    icon: FaClock,
    iconBg: 'bg-yellow-500',
  },
];

const getActionColor = (action) => {
  switch (action) {
    case 'Đã tải xuống':
      return 'bg-emerald-100 text-emerald-800';
    case 'Đã tạo mới':
      return 'bg-blue-100 text-blue-800';
    case 'Đã hoàn thành':
      return 'bg-green-100 text-green-800';
    case 'Đang xử lý':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReportSession4 = () => {
  return (
    <section className="px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hoạt động gần đây */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử tạo và tải báo cáo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(report.action)}`}>
                  <span className="text-xs font-semibold">{report.action.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {report.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {report.type} - {report.user}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{report.date}</p>
                      <p className="text-xs text-gray-400">{report.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {report.action}
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
              Tổng quan báo cáo
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
              <li>• 10 báo cáo đang xử lý</li>
              <li>• 4 báo cáo chờ duyệt</li>
              <li>• Tỷ lệ thành công: 91%</li>
            </ul>
          </div>

          {/* Cảnh báo */}
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4" />
              Cảnh báo
            </h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 2 báo cáo lỗi cần xử lý</li>
              <li>• 1 báo cáo quá hạn</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSession4;


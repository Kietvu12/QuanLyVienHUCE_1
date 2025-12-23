import { FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import React from 'react'
const recentActivities = [
  {
    id: 1,
    type: 'created',
    invoice: 'INV-2025-006',
    customer: 'Công ty MNO',
    amount: 65000000,
    time: '10 phút trước',
    user: 'Nguyễn Văn A',
  },
  {
    id: 2,
    type: 'paid',
    invoice: 'INV-2025-002',
    customer: 'Công ty XYZ',
    amount: 75000000,
    time: '1 giờ trước',
    user: 'Hệ thống',
  },
  {
    id: 3,
    type: 'created',
    invoice: 'INV-2025-007',
    customer: 'Công ty PQR',
    amount: 45000000,
    time: '2 giờ trước',
    user: 'Trần Thị B',
  },
  {
    id: 4,
    type: 'cancelled',
    invoice: 'INV-2025-005',
    customer: 'Công ty JKL',
    amount: 90000000,
    time: '3 giờ trước',
    user: 'Hoàng Văn E',
  },
];

const getActivityIcon = (type) => {
  switch (type) {
    case 'created':
      return FaFileInvoiceDollar;
    case 'paid':
      return FaCheckCircle;
    case 'cancelled':
      return FaTimesCircle;
    default:
      return FaClock;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'created':
      return 'text-blue-600 bg-blue-100';
    case 'paid':
      return 'text-emerald-600 bg-emerald-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getActivityText = (type) => {
  switch (type) {
    case 'created':
      return 'đã tạo';
    case 'paid':
      return 'đã thanh toán';
    case 'cancelled':
      return 'đã hủy';
    default:
      return 'đã cập nhật';
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
};

const InvoiceSession4 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {getActivityText(activity.type)} hóa đơn{' '}
                      <span className="font-medium text-blue-600">{activity.invoice}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.customer} - {formatCurrency(activity.amount)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Tổng giá trị hóa đơn tháng này</p>
                  <p className="text-2xl font-bold text-gray-900">2.450.000.000 đ</p>
                </div>
                <FaFileInvoiceDollar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Đã thu tháng này</p>
                  <p className="text-2xl font-bold text-gray-900">1.980.000.000 đ</p>
                </div>
                <FaCheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Chờ thu tháng này</p>
                  <p className="text-2xl font-bold text-gray-900">470.000.000 đ</p>
                </div>
                <FaClock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceSession4;


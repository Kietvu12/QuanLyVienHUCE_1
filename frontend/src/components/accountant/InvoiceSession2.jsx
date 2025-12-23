import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import React from 'react'
const statusData = [
  { name: 'Đã thanh toán', value: 198, color: '#10b981' },
  { name: 'Chờ thanh toán', value: 35, color: '#f59e0b' },
  { name: 'Đã hủy', value: 12, color: '#ef4444' },
];

const monthlyData = [
  { month: 'Tháng 1', amount: 125000000 },
  { month: 'Tháng 2', amount: 145000000 },
  { month: 'Tháng 3', amount: 168000000 },
  { month: 'Tháng 4', amount: 132000000 },
  { month: 'Tháng 5', amount: 189000000 },
  { month: 'Tháng 6', amount: 156000000 },
];

const InvoiceSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart - Phân bố trạng thái */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố trạng thái
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số hóa đơn: 245
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Hóa đơn theo tháng */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Tổng giá trị hóa đơn theo tháng
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              6 tháng gần nhất
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceSession2;


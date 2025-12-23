import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import React from 'react'
const instituteData = [
  { institute: 'Viện Tin học Xây Dựng', thu: 4500000000, chi: 3200000000, congno: 850000000 },
  { institute: 'Viện Khoa học Công nghệ', thu: 3800000000, chi: 2800000000, congno: 650000000 },
  { institute: 'Viện Nghiên cứu Phát triển', thu: 4150000000, chi: 3850000000, congno: 350000000 },
];

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const RevenueSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Doanh thu và chi phí theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng quan tất cả các Viện
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteData} margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="institute"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  angle={0}
                  textAnchor="middle"
                  height={40}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}T`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar
                  dataKey="thu"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  name="Thu"
                />
                <Bar
                  dataKey="chi"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  name="Chi"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ công nợ theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng công nợ hiện tại
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteData} margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="institute"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  angle={0}
                  textAnchor="middle"
                  height={40}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}T`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(251,146,60,0.1)' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar
                  dataKey="congno"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                  name="Công nợ"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueSession2;


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
import React from 'react';
const instituteProjectData = [
  { institute: 'Viện Tin học Xây Dựng', projects: 25, revenue: 3200000000 },
  { institute: 'Viện Khoa học Công nghệ', projects: 22, revenue: 2800000000 },
  { institute: 'Viện Nghiên cứu Phát triển', projects: 21, revenue: 2900000000 },
];

const statusData = [
  { name: 'Đang thực hiện', value: 45, color: '#3b82f6' },
  { name: 'Đã hoàn thành', value: 23, color: '#10b981' },
];

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const ResearchSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Biểu đồ số đề tài theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Số đề tài theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng quan tất cả các Viện
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteProjectData} margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="institute"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar
                  dataKey="projects"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  name="Số đề tài"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ doanh thu từ đề tài theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Doanh thu từ đề tài theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng doanh thu từ các đề tài
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteProjectData} margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="institute"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}T`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(16,185,129,0.1)' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Doanh thu"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSession2;


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
} from 'recharts';
import React from 'react';
const categoryData = [
  { category: 'Máy tính', fullCategory: 'Máy tính', count: 185, value: 4500000000 },
  { category: 'Nội thất', fullCategory: 'Nội thất', count: 142, value: 3200000000 },
  { category: 'Thiết bị', fullCategory: 'Thiết bị', count: 98, value: 2800000000 },
  { category: 'Phương tiện', fullCategory: 'Phương tiện', count: 23, value: 1500000000 },
  { category: 'Khác', fullCategory: 'Khác', count: 10, value: 500000000 },
];

const statusData = [
  { name: 'Đang sử dụng', value: 412, color: '#10b981' },
  { name: 'Cần bảo trì', value: 28, color: '#f59e0b' },
  { name: 'Có sẵn', value: 18, color: '#3b82f6' },
  { name: 'Hỏng', value: 18, color: '#ef4444' },
];


const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const AssetSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de pastel - Trạng thái */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố trạng thái
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số tài sản: 476
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={30}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend personalizada */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600">{entry.name}</span>
                <span className="text-xs font-semibold text-gray-900">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de barras - Theo loại */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo loại tài sản
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số tài sản: 458
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 10, right: 20, bottom: 10, left: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={60}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  contentStyle={{ 
                    fontSize: 12, 
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff'
                  }}
                  formatter={(value, name, props) => {
                    const fullCategory = props.payload?.fullCategory || props.payload?.category;
                    return [value, fullCategory];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullCategory || payload[0].payload.category;
                    }
                    return label;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  name="Số lượng"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetSession2;


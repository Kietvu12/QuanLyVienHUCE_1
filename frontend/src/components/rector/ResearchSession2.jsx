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
const statusData = [
  { name: 'Đã hoàn thành', value: 98, color: '#10b981' },
  { name: 'Đang thực hiện', value: 45, color: '#3b82f6' },
  { name: 'Chờ duyệt', value: 13, color: '#f59e0b' },
  { name: 'Chậm tiến độ', value: 13, color: '#ef4444' },
];

const yearlyData = [
  { year: '2020', count: 120 },
  { year: '2021', count: 135 },
  { year: '2022', count: 142 },
  { year: '2023', count: 148 },
  { year: '2024', count: 152 },
  { year: '2025', count: 156 },
];

const fieldData = [
  { field: 'CNTT', fullField: 'Công nghệ thông tin', count: 65 },
  { field: 'Xây dựng', fullField: 'Xây dựng', count: 42 },
  { field: 'Kỹ thuật', fullField: 'Kỹ thuật', count: 28 },
  { field: 'Khoa học', fullField: 'Khoa học', count: 21 },
];

const ResearchSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de pastel - Trạng thái */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố trạng thái
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số đề tài: 169
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

        {/* Gráfico de barras - Theo năm */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Số lượng đề tài theo năm
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Xu hướng 6 năm gần nhất
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={yearlyData} 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  contentStyle={{ 
                    fontSize: 12, 
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff'
                  }}
                  formatter={(value) => [value, 'Số đề tài']}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  name="Số đề tài"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de barras - Theo lĩnh vực */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo lĩnh vực
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số đề tài: 156
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fieldData}
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
                  dataKey="field"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={55}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(139,92,246,0.1)' }}
                  contentStyle={{ 
                    fontSize: 12, 
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff'
                  }}
                  formatter={(value, name, props) => {
                    const fullField = props.payload?.fullField || props.payload?.field;
                    return [value, fullField];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullField || payload[0].payload.field;
                    }
                    return label;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[0, 6, 6, 0]}
                  name="Số đề tài"
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


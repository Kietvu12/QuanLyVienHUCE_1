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
const departmentData = [
  { department: 'CNTT', fullDepartment: 'Công nghệ thông tin', count: 45 },
  { department: 'Xây dựng', fullDepartment: 'Xây dựng', count: 32 },
  { department: 'Kỹ thuật', fullDepartment: 'Kỹ thuật', count: 28 },
  { department: 'Hành chính', fullDepartment: 'Hành chính', count: 20 },
];

const positionData = [
  { position: 'Giám đốc', count: 2 },
  { position: 'Trưởng phòng', count: 8 },
  { position: 'Chuyên viên cao cấp', count: 25 },
  { position: 'Chuyên viên', count: 55 },
  { position: 'Nhân viên', count: 35 },
];

const ageGroupData = [
  { name: '20-30', value: 35, color: '#3b82f6' },
  { name: '31-40', value: 45, color: '#10b981' },
  { name: '41-50', value: 30, color: '#f59e0b' },
  { name: '51+', value: 15, color: '#8b5cf6' },
];

const PersonnelSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de pastel - Nhóm tuổi */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo nhóm tuổi
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: 125
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageGroupData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={30}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {ageGroupData.map((entry, index) => (
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
            {ageGroupData.map((entry, index) => (
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

        {/* Gráfico de barras - Theo phòng ban */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo phòng ban
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: 125
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
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
                  dataKey="department"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={55}
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
                    const fullDepartment = props.payload?.fullDepartment || props.payload?.department;
                    return [value, fullDepartment];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullDepartment || payload[0].payload.department;
                    }
                    return label;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  name="Số nhân sự"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de barras - Theo chức vụ */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo chức vụ
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: 125
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={positionData}
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
                  dataKey="position"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={100}
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
                  formatter={(value) => [value, 'Số nhân sự']}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[0, 6, 6, 0]}
                  name="Số nhân sự"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonnelSession2;


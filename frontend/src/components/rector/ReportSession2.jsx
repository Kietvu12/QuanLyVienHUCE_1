import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import React from 'react';
const reportTypeData = [
  { type: 'Doanh thu', fullType: 'Báo cáo doanh thu', count: 45 },
  { type: 'Đề tài', fullType: 'Báo cáo đề tài', count: 38 },
  { type: 'Nhân sự', fullType: 'Báo cáo nhân sự', count: 32 },
  { type: 'Tài sản', fullType: 'Báo cáo tài sản', count: 28 },
  { type: 'Tài chính', fullType: 'Báo cáo tài chính', count: 13 },
];

const monthlyReportData = [
  { month: 'T1', fullMonth: 'Tháng 1', count: 12 },
  { month: 'T2', fullMonth: 'Tháng 2', count: 15 },
  { month: 'T3', fullMonth: 'Tháng 3', count: 18 },
  { month: 'T4', fullMonth: 'Tháng 4', count: 14 },
  { month: 'T5', fullMonth: 'Tháng 5', count: 16 },
  { month: 'T6', fullMonth: 'Tháng 6', count: 20 },
  { month: 'T7', fullMonth: 'Tháng 7', count: 22 },
  { month: 'T8', fullMonth: 'Tháng 8', count: 19 },
  { month: 'T9', fullMonth: 'Tháng 9', count: 17 },
  { month: 'T10', fullMonth: 'Tháng 10', count: 21 },
  { month: 'T11', fullMonth: 'Tháng 11', count: 24 },
  { month: 'T12', fullMonth: 'Tháng 12', count: 18 },
];

const statusData = [
  { month: 'Tháng 1', completed: 10, processing: 2 },
  { month: 'Tháng 2', completed: 13, processing: 2 },
  { month: 'Tháng 3', completed: 16, processing: 2 },
  { month: 'Tháng 4', completed: 12, processing: 2 },
  { month: 'Tháng 5', completed: 14, processing: 2 },
  { month: 'Tháng 6', completed: 18, processing: 2 },
];

const ReportSession2 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de barras - Theo loại */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo loại báo cáo
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số báo cáo: 156
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportTypeData}
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
                  dataKey="type"
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
                    const fullType = props.payload?.fullType || props.payload?.type;
                    return [value, fullType];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullType || payload[0].payload.type;
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

        {/* Gráfico de línea - Theo tháng */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Số lượng báo cáo theo tháng
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Xu hướng 12 tháng gần nhất
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={monthlyReportData} 
                margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
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
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  width={40}
                />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  contentStyle={{ 
                    fontSize: 12, 
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff'
                  }}
                  formatter={(value) => [value, 'Số báo cáo']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullMonth || label;
                    }
                    return label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Số báo cáo"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de barras - Trạng thái */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Trạng thái báo cáo
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              6 tháng gần nhất
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={statusData} 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
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
                />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  name="Đã hoàn thành"
                />
                <Bar
                  dataKey="processing"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  name="Đang xử lý"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#10b981]" />
              <span className="text-gray-600">Đã hoàn thành</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#f59e0b]" />
              <span className="text-gray-600">Đang xử lý</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSession2;


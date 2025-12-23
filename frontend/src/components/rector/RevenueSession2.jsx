import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import React from 'react';
const monthlyData = [
  { month: 'T1', fullMonth: 'Tháng 1', thu: 200000000, chi: 150000000 },
  { month: 'T2', fullMonth: 'Tháng 2', thu: 180000000, chi: 140000000 },
  { month: 'T3', fullMonth: 'Tháng 3', thu: 220000000, chi: 160000000 },
  { month: 'T4', fullMonth: 'Tháng 4', thu: 250000000, chi: 180000000 },
  { month: 'T5', fullMonth: 'Tháng 5', thu: 280000000, chi: 200000000 },
  { month: 'T6', fullMonth: 'Tháng 6', thu: 300000000, chi: 210000000 },
  { month: 'T7', fullMonth: 'Tháng 7', thu: 320000000, chi: 220000000 },
  { month: 'T8', fullMonth: 'Tháng 8', thu: 290000000, chi: 200000000 },
  { month: 'T9', fullMonth: 'Tháng 9', thu: 310000000, chi: 215000000 },
  { month: 'T10', fullMonth: 'Tháng 10', thu: 330000000, chi: 230000000 },
  { month: 'T11', fullMonth: 'Tháng 11', thu: 350000000, chi: 240000000 },
  { month: 'T12', fullMonth: 'Tháng 12', thu: 380000000, chi: 250000000 },
];

const dailyData = [
  { day: '01', thu: 12000000, chi: 8000000 },
  { day: '02', thu: 15000000, chi: 9000000 },
  { day: '03', thu: 18000000, chi: 10000000 },
  { day: '04', thu: 14000000, chi: 8500000 },
  { day: '05', thu: 20000000, chi: 12000000 },
  { day: '06', thu: 22000000, chi: 13000000 },
  { day: '07', thu: 19000000, chi: 11000000 },
  { day: '08', thu: 21000000, chi: 12500000 },
  { day: '09', thu: 23000000, chi: 14000000 },
  { day: '10', thu: 25000000, chi: 15000000 },
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
        {/* Gráfico de barras - Thu chi theo tháng */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Thu chi theo tháng
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng quan 12 tháng gần nhất
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  angle={0}
                  textAnchor="middle"
                  height={40}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullMonth || label;
                    }
                    return label;
                  }}
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

          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#3b82f6]" />
              <span className="text-gray-600">Thu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#ef4444]" />
              <span className="text-gray-600">Chi</span>
            </div>
          </div>
        </div>

        {/* Gráfico de área - Thu chi theo ngày */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Thu chi theo ngày
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                10 ngày gần nhất
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <defs>
                  <linearGradient id="colorThu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorChi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="thu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorThu)"
                  name="Thu"
                />
                <Area
                  type="monotone"
                  dataKey="chi"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorChi)"
                  name="Chi"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#3b82f6]" />
              <span className="text-gray-600">Thu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#ef4444]" />
              <span className="text-gray-600">Chi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueSession2;


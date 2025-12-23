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
} from 'recharts';
import { FaFileAlt, FaRocket, FaWallet } from 'react-icons/fa';
import React from 'react';
const monthlyRevenueData = [
  { month: '01', value: 250 },
  { month: '02', value: 150 },
  { month: '03', value: 220 },
  { month: '04', value: 100 },
  { month: '05', value: 300 },
  { month: '06', value: 280 },
  { month: '07', value: 480 },
  { month: '08', value: 400 },
];

const incomeExpenseData = [
  { month: 'Jan', thu: 450, chi: 280 },
  { month: 'Feb', thu: 250, chi: 180 },
  { month: 'Mar', thu: 300, chi: 200 },
  { month: 'Apr', thu: 350, chi: 300 },
  { month: 'May', thu: 320, chi: 250 },
  { month: 'Jun', thu: 450, chi: 280 },
  { month: 'Jul', thu: 380, chi: 200 },
  { month: 'Aug', thu: 400, chi: 260 },
  { month: 'Sep', thu: 300, chi: 280 },
  { month: 'Oct', thu: 380, chi: 270 },
  { month: 'Nov', thu: 420, chi: 260 },
  { month: 'Dec', thu: 450, chi: 250 },
];

const DashboardSession3 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel izquierdo: Doanh thu hàng tháng */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Doanh thu hàng tháng
              </h3>
              <p className="mt-1 text-xs text-emerald-500 font-semibold">
                (+23) than last week
              </p>
            </div>
          </div>

          {/* Gráfico de barras con fondo azul oscuro */}
          <div className="h-64 rounded-lg bg-[#1e3a8a] p-4 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b82f6" opacity={0.2} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#93c5fd' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#93c5fd' }}
                  domain={[0, 500]}
                  ticks={[0, 100, 200, 300, 400, 500]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{
                    backgroundColor: '#1e3a8a',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#ffffff"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaFileAlt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Đề tài</p>
                <p className="text-sm font-semibold text-gray-900">32,984</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaRocket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Dự án</p>
                <p className="text-sm font-semibold text-gray-900">2,42m</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaWallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Khác</p>
                <p className="text-sm font-semibold text-gray-900">2,400$</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: Thu chi */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Thu chi
              </h3>
              <p className="mt-1 text-xs text-emerald-500 font-semibold">
                (+5) more in 2021
              </p>
            </div>
          </div>

          {/* Gráfico de área */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeExpenseData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <defs>
                  <linearGradient id="colorThu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorChi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  domain={[0, 500]}
                  ticks={[0, 100, 200, 300, 400, 500]}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="thu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorThu)"
                />
                <Area
                  type="monotone"
                  dataKey="chi"
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorChi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession3;


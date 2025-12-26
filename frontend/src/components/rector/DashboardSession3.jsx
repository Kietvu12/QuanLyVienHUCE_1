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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doanhThuAPI, deTaiNghienCuuStatisticsAPI } from '../../services/api';

const DashboardSession3 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [projectStats, setProjectStats] = useState({
    tong_de_tai: 0,
    da_hoan_thanh: 0,
    dang_thuc_hien: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id_vien]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [revenueStats, projectStatsRes] = await Promise.all([
        doanhThuAPI.getStatistics({ id_vien: user?.id_vien }),
        deTaiNghienCuuStatisticsAPI.getStatistics({ id_vien: user?.id_vien })
      ]);

      if (revenueStats.success) {
        setMonthlyRevenueData(revenueStats.data?.monthly_revenue_data || []);
        setIncomeExpenseData(revenueStats.data?.income_expense_data || []);
      }

      if (projectStatsRes.success) {
        setProjectStats({
          tong_de_tai: projectStatsRes.data?.tong_de_tai || 0,
          da_hoan_thanh: projectStatsRes.data?.da_hoan_thanh || 0,
          dang_thuc_hien: projectStatsRes.data?.dang_thuc_hien || 0
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
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
            {loading ? (
              <div className="h-full flex items-center justify-center text-white text-sm">
                Đang tải...
              </div>
            ) : (
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
                    domain={[0, 'dataMax']}
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
                    formatter={(value) => `${value} triệu đồng`}
                  />
                  <Bar
                    dataKey="value"
                    fill="#ffffff"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaFileAlt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Tổng đề tài</p>
                <p className="text-sm font-semibold text-gray-900">{projectStats.tong_de_tai}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaRocket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Đang thực hiện</p>
                <p className="text-sm font-semibold text-gray-900">{projectStats.dang_thuc_hien}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white">
                <FaWallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Đã hoàn thành</p>
                <p className="text-sm font-semibold text-gray-900">{projectStats.da_hoan_thanh}</p>
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
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : (
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
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                    }}
                    formatter={(value) => `${value} triệu đồng`}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession3;


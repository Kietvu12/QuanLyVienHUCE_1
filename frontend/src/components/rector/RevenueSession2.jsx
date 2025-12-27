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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doanhThuAPI, chiPhiAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const RevenueSession2 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [user?.id_vien]);

  // Listen for revenue/expense updates
  useEffect(() => {
    const handleRevenueUpdate = () => {
      fetchChartData();
    };
    
    window.addEventListener('revenueUpdated', handleRevenueUpdate);
    window.addEventListener('expenseUpdated', handleRevenueUpdate);
    
    return () => {
      window.removeEventListener('revenueUpdated', handleRevenueUpdate);
      window.removeEventListener('expenseUpdated', handleRevenueUpdate);
    };
  }, [user?.id_vien]); // Include user?.id_vien to ensure fetchChartData has access to it

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // Lấy dữ liệu 12 tháng gần nhất
      const currentYear = new Date().getFullYear();
      const monthlyStats = {};
      
      // Khởi tạo 12 tháng
      for (let i = 1; i <= 12; i++) {
        const monthKey = i.toString().padStart(2, '0');
        monthlyStats[monthKey] = { thu: 0, chi: 0 };
      }

      // Lấy tất cả doanh thu và chi phí
      const [thuResponse, chiResponse] = await Promise.all([
        doanhThuAPI.getAll({ id_vien: user?.id_vien, limit: 10000 }),
        chiPhiAPI.getAll({ id_vien: user?.id_vien, limit: 10000 })
      ]);

      // Tính toán theo tháng
      if (thuResponse.success && thuResponse.data) {
        thuResponse.data.forEach(item => {
          if (item.trang_thai === 'da_nhan') {
            // Sử dụng ngay_nhan_tien nếu có, nếu không thì dùng ngay_tao
            const dateString = item.ngay_nhan_tien || item.ngay_tao;
            if (dateString) {
              const date = new Date(dateString);
              if (date.getFullYear() === currentYear) {
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                if (monthlyStats[month]) {
                  monthlyStats[month].thu += parseFloat(item.so_tien) || 0;
                }
              }
            }
          }
        });
      }

      if (chiResponse.success && chiResponse.data) {
        chiResponse.data.forEach(item => {
          if (item.trang_thai === 'da_tat_toan') {
            // Sử dụng ngay_tat_toan nếu có, nếu không thì dùng ngay_tao
            const dateString = item.ngay_tat_toan || item.ngay_tao;
            if (dateString) {
              const date = new Date(dateString);
              if (date.getFullYear() === currentYear) {
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                if (monthlyStats[month]) {
                  monthlyStats[month].chi += parseFloat(item.so_tien) || 0;
                }
              }
            }
          }
        });
      }

      // Format dữ liệu tháng
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      const formattedMonthlyData = Object.keys(monthlyStats).map((month) => {
        const monthIndex = parseInt(month) - 1; // Chuyển từ 1-12 sang 0-11
        return {
          month: `T${parseInt(month)}`,
          fullMonth: monthNames[monthIndex],
          thu: monthlyStats[month].thu,
          chi: monthlyStats[month].chi
        };
      });

      setMonthlyData(formattedMonthlyData);

      // Tính toán 10 ngày gần nhất
      const today = new Date();
      const dailyStats = {};
      
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dayKey = date.getDate().toString().padStart(2, '0');
        dailyStats[dateKey] = { day: dayKey, thu: 0, chi: 0 };
      }

      if (thuResponse.success && thuResponse.data) {
        thuResponse.data.forEach(item => {
          if (item.trang_thai === 'da_nhan') {
            // Sử dụng ngay_nhan_tien nếu có, nếu không thì dùng ngay_tao
            const dateString = item.ngay_nhan_tien || item.ngay_tao;
            if (dateString) {
              const dateKey = dateString.split('T')[0];
              if (dailyStats[dateKey]) {
                dailyStats[dateKey].thu += parseFloat(item.so_tien) || 0;
              }
            }
          }
        });
      }

      if (chiResponse.success && chiResponse.data) {
        chiResponse.data.forEach(item => {
          if (item.trang_thai === 'da_tat_toan') {
            // Sử dụng ngay_tat_toan nếu có, nếu không thì dùng ngay_tao
            const dateString = item.ngay_tat_toan || item.ngay_tao;
            if (dateString) {
              const dateKey = dateString.split('T')[0];
              if (dailyStats[dateKey]) {
                dailyStats[dateKey].chi += parseFloat(item.so_tien) || 0;
              }
            }
          }
        });
      }

      const formattedDailyData = Object.values(dailyStats);
      setDailyData(formattedDailyData);

    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
            ) : (
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
            )}
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
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">Đang tải...</div>
            ) : (
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
            )}
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


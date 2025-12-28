import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { vienAPI, doanhThuAPI, chiPhiAPI, nghiaVuNopAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value) || 0) + ' đ';
  }
  return '0 đ';
};

const DashboardSession2 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [instituteData, setInstituteData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchInstituteData();
    }
  }, [user]);

  const fetchInstituteData = async () => {
    try {
      setLoading(true);
      
      // Lấy danh sách tất cả viện
      const vienResponse = await vienAPI.getAll({ limit: 100 });
      if (!vienResponse.success) {
        console.error('Error fetching viens:', vienResponse.message);
        return;
      }

      const viens = vienResponse.data || [];
      
      // Lấy thống kê cho từng viện
      const dataPromises = viens.map(async (vien) => {
        try {
          const [revenueStats, debtStats] = await Promise.allSettled([
            doanhThuAPI.getStatistics({ id_vien: vien.id }),
            nghiaVuNopAPI.getStatistics({ id_vien: vien.id })
          ]);

          const revenueData = revenueStats.status === 'fulfilled' ? revenueStats.value : null;
          const debtData = debtStats.status === 'fulfilled' ? debtStats.value : null;

          // Tính tổng doanh thu (đã nhận)
          const tongDoanhThu = revenueData?.success ? (revenueData.data?.tong_doanh_thu || 0) : 0;
          
          // Tính tổng chi phí từ API statistics (đã có tong_chi_phi)
          const tongChiPhi = revenueData?.success ? (parseFloat(revenueData.data?.tong_chi_phi) || 0) : 0;
          
          // Tổng công nợ
          const tongCongNo = debtData?.success ? (debtData.data?.tong_cong_no || 0) : 0;

          return {
            institute: vien.ten_vien,
            thu: tongDoanhThu,
            chi: tongChiPhi,
            congno: tongCongNo
          };
        } catch (err) {
          console.error(`Error fetching data for vien ${vien.id}:`, err);
          return {
            institute: vien.ten_vien,
            thu: 0,
            chi: 0,
            congno: 0
          };
        }
      });

      const results = await Promise.all(dataPromises);
      setInstituteData(results);
    } catch (err) {
      console.error('Error fetching institute data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 h-full flex flex-col">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1" style={{ minHeight: 0 }}>
        {/* Biểu đồ doanh thu và chi phí theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-4 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Doanh thu và chi phí theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng quan tất cả các Viện
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth" style={{ minHeight: 0 }}>
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : (
              <div style={{ minWidth: `${Math.max(instituteData.length * 200, 800)}px`, height: '100%', minHeight: '350px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                  <BarChart 
                    data={instituteData} 
                    margin={{ top: 5, right: 20, bottom: 25, left: 10 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="institute"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: '#6B7280' }}
                      angle={0}
                      textAnchor="middle"
                      height={25}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#D1D5DB' }}
                      tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}T`}
                      width={60}
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
                      barSize={60}
                    />
                    <Bar
                      dataKey="chi"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                      name="Chi"
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ công nợ theo Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-4 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ theo Viện
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tổng công nợ hiện tại
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth" style={{ minHeight: 0 }}>
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : (
              <div style={{ minWidth: `${Math.max(instituteData.length * 200, 800)}px`, height: '100%', minHeight: '350px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                  <BarChart 
                    data={instituteData} 
                    margin={{ top: 5, right: 20, bottom: 25, left: 10 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="institute"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: '#6B7280' }}
                      angle={0}
                      textAnchor="middle"
                      height={25}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#D1D5DB' }}
                      tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}T`}
                      width={60}
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
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession2;


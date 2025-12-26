import { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { baoCaoAPI } from '../../services/api';
import { FaSpinner } from 'react-icons/fa';
import React from 'react';

const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
const fullMonthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

const getReportType = (tieu_de) => {
  if (!tieu_de) return 'Khác';
  const title = tieu_de.toLowerCase();
  if (title.includes('doanh thu') || title.includes('thu')) return 'Doanh thu';
  if (title.includes('đề tài') || title.includes('nghiên cứu')) return 'Đề tài';
  if (title.includes('nhân sự') || title.includes('nhân viên')) return 'Nhân sự';
  if (title.includes('tài sản')) return 'Tài sản';
  if (title.includes('tài chính') || title.includes('bctc')) return 'Tài chính';
  return 'Khác';
};

const ReportSession2 = () => {
  const { user } = useAuth();
  const [reportTypeData, setReportTypeData] = useState([]);
  const [monthlyReportData, setMonthlyReportData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Lấy tất cả báo cáo
        const params = {
          id_vien: user.id_vien || undefined,
          id_nguoi_tao: user.id,
          limit: 1000,
        };

        const response = await baoCaoAPI.getAll(params);
        
        if (response.success) {
          const reports = response.data || [];
          setTotalReports(reports.length);

          // 1. Phân bố theo loại báo cáo
          const typeCount = {};
          reports.forEach(report => {
            const type = getReportType(report.tieu_de);
            typeCount[type] = (typeCount[type] || 0) + 1;
          });

          const typeData = [
            { type: 'Doanh thu', fullType: 'Báo cáo doanh thu', count: typeCount['Doanh thu'] || 0 },
            { type: 'Đề tài', fullType: 'Báo cáo đề tài', count: typeCount['Đề tài'] || 0 },
            { type: 'Nhân sự', fullType: 'Báo cáo nhân sự', count: typeCount['Nhân sự'] || 0 },
            { type: 'Tài sản', fullType: 'Báo cáo tài sản', count: typeCount['Tài sản'] || 0 },
            { type: 'Tài chính', fullType: 'Báo cáo tài chính', count: typeCount['Tài chính'] || 0 },
          ].filter(item => item.count > 0);
          setReportTypeData(typeData);

          // 2. Số lượng báo cáo theo tháng (12 tháng gần nhất)
          const currentYear = new Date().getFullYear();
          const monthlyCount = {};
          
          reports.forEach(report => {
            const date = new Date(report.ngay_tao);
            if (date.getFullYear() === currentYear) {
              const month = date.getMonth(); // 0-11
              monthlyCount[month] = (monthlyCount[month] || 0) + 1;
            }
          });

          const monthlyData = monthNames.map((month, index) => ({
            month,
            fullMonth: fullMonthNames[index],
            count: monthlyCount[index] || 0,
          }));
          setMonthlyReportData(monthlyData);

          // 3. Trạng thái báo cáo theo tháng (6 tháng gần nhất)
          const last6Months = [];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
              monthIndex: date.getMonth(),
              year: date.getFullYear(),
              monthName: fullMonthNames[date.getMonth()],
            });
          }

          const statusMonthlyData = last6Months.map(({ monthIndex, year, monthName }) => {
            const monthReports = reports.filter(report => {
              const reportDate = new Date(report.ngay_tao);
              return reportDate.getMonth() === monthIndex && reportDate.getFullYear() === year;
            });

            return {
              month: monthName,
              completed: monthReports.filter(r => r.trang_thai === 'da_phe_duyet').length,
              processing: monthReports.filter(r => r.trang_thai === 'cho_phe_duyet').length,
            };
          });
          setStatusData(statusMonthlyData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [user]);
  if (loading) {
    return (
      <section className="px-6">
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mr-2" />
          <span className="text-gray-600">Đang tải dữ liệu biểu đồ...</span>
        </div>
      </section>
    );
  }

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
              Tổng số báo cáo: {totalReports}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {reportTypeData.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                Chưa có dữ liệu
              </div>
            ) : (
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
            )}
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
            {monthlyReportData.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                Chưa có dữ liệu
              </div>
            ) : (
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
            )}
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
            {statusData.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                Chưa có dữ liệu
              </div>
            ) : (
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
            )}
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


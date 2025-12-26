import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { nghiaVuNopAPI } from '../../services/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value || 0) + ' đ';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const DashboardSession2 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tuNgay, setTuNgay] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });
  const [denNgay, setDenNgay] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [donutData, setDonutData] = useState([
    { name: 'Đã nộp về trường', value: 0, color: '#4F46E5' },
    { name: 'Công nợ còn lại', value: 0, color: '#A5B4FC' },
  ]);
  const [barData, setBarData] = useState([]);
  const [tongNghiaVu, setTongNghiaVu] = useState(0);
  const [tongDaNop, setTongDaNop] = useState(0);
  const [tongCongNo, setTongCongNo] = useState(0);

  useEffect(() => {
    fetchCongNoData();
  }, [user?.id_vien, tuNgay, denNgay]);

  const fetchCongNoData = async () => {
    try {
      setLoading(true);
      const response = await nghiaVuNopAPI.getStatistics({
        id_vien: user?.id_vien,
        tu_ngay: tuNgay,
        den_ngay: denNgay
      });

      if (response.success) {
        const data = response.data;
        const tongNghiaVuPhaiNop = data.tong_nghia_vu_phai_nop || 0;
        const tongDaNopValue = data.tong_da_nop || 0;
        const tongCongNoValue = data.tong_cong_no || 0;

        setTongNghiaVu(tongNghiaVuPhaiNop);
        setTongDaNop(tongDaNopValue);
        setTongCongNo(tongCongNoValue);

        // Cập nhật donut data
        setDonutData([
          { name: 'Đã nộp về trường', value: tongDaNopValue, color: '#4F46E5' },
          { name: 'Công nợ còn lại', value: tongCongNoValue, color: '#A5B4FC' },
        ]);

        // Cập nhật bar data
        if (data.monthly_data) {
          setBarData(data.monthly_data);
        }
      }
    } catch (err) {
      console.error('Error fetching cong no data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalDonut = donutData.reduce((sum, item) => sum + item.value, 0);
  const formatPercent = (value) =>
    totalDonut > 0 ? Math.round((value / totalDonut) * 100) : 0;

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Card 1: Công nợ tháng - Donut chart */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col lg:flex-row gap-8 relative">
          {/* Bên trái: tiêu đề + filter + legend */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ tháng {`${currentMonth}/${currentYear}`}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tính đến ngày {formatDate(denNgay)}
              </p>

              {/* Filter date trên cùng */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  Từ ngày <span className="font-medium text-gray-500">{formatDate(tuNgay)}</span> đến ngày{' '}
                  <span className="font-medium text-gray-500">{formatDate(denNgay)}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>Từ ngày</span>
                    <input
                      type="date"
                      value={tuNgay}
                      onChange={(e) => setTuNgay(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Đến ngày</span>
                    <input
                      type="date"
                      value={denNgay}
                      onChange={(e) => setDenNgay(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bên phải: biểu đồ donut phóng to + legend dưới chân */}
          <div className="flex items-center justify-center flex-1">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Đang tải...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="60%"
                        outerRadius="95%"
                        stroke="none"
                      >
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, _name, props) => {
                          const payload = props?.payload ?? {};
                          const amount = value;
                          const label = payload.name ?? '';
                          const percent = formatPercent(amount);
                          const detail = `${formatCurrency(amount)} (${percent}%)`;
                          return [detail, label];
                        }}
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              {/* Legend dưới chân donut */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                  <span className="text-gray-600">
                    Đã nộp về trường
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A5B4FC]" />
                  <span className="text-gray-600">
                    Công nợ còn lại
                  </span>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Nghĩa vụ, Đã nộp, Công nợ - Góc dưới bên trái */}
          <div className="absolute left-6 bottom-6 bg-white/80 rounded-lg shadow px-4 py-3 text-xs space-y-1 min-w-[180px]">
            <p className="text-gray-600">
              Nghĩa vụ phải nộp:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongNghiaVu)}
              </span>
            </p>
            <p className="text-gray-600">
              Đã nộp:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongDaNop)}
              </span>
            </p>
            <p className="text-gray-600">
              Công nợ:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongCongNo)}
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Công nợ theo tháng - Bar chart */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ theo tháng
              </h3>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {formatCurrency(tongCongNo)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Tính đến ngày {formatDate(denNgay)}
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full border border-[#E5E7EB] text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              View Report
            </button>
          </div>

          <div className="mt-5 h-40">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -20, right: 0, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value) => `${value} triệu đồng`}
                  />
                  <Bar
                    dataKey="nghiaVu"
                    fill="#E5E7EB"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                  <Bar
                    dataKey="daNop"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#3B82F6]" />
                <span className="text-gray-500">Nghĩa vụ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#E5E7EB]" />
                <span className="text-gray-500">Đã nộp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession2;



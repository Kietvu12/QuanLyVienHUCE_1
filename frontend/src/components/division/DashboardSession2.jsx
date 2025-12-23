import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import React from 'react'
const instituteData = [
  { institute: 'Viện Tin học Xây Dựng', thu: 4500000000, chi: 3200000000, congno: 850000000 },
  { institute: 'Viện Khoa học Công nghệ', thu: 3800000000, chi: 2800000000, congno: 650000000 },
  { institute: 'Viện Nghiên cứu Phát triển', thu: 4150000000, chi: 3850000000, congno: 350000000 },
  { institute: 'Viện Vật liệu Xây dựng', thu: 5200000000, chi: 4200000000, congno: 720000000 },
  { institute: 'Viện Kiến trúc và Quy hoạch', thu: 4800000000, chi: 3600000000, congno: 580000000 },
  { institute: 'Viện Môi trường và Đô thị', thu: 3900000000, chi: 3100000000, congno: 490000000 },
  { institute: 'Viện Giao thông Vận tải', thu: 5600000000, chi: 4500000000, congno: 920000000 },
  { institute: 'Viện Năng lượng và Cơ khí', thu: 4400000000, chi: 3400000000, congno: 680000000 },
  { institute: 'Viện Quản lý Dự án', thu: 4100000000, chi: 3300000000, congno: 520000000 },
  { institute: 'Viện Kinh tế Xây dựng', thu: 4700000000, chi: 3700000000, congno: 750000000 },
];

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const DashboardSession2 = () => {
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
            <div style={{ minWidth: `${instituteData.length * 200}px`, height: '100%', minHeight: '350px' }}>
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
            <div style={{ minWidth: `${instituteData.length * 200}px`, height: '100%', minHeight: '350px' }}>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession2;


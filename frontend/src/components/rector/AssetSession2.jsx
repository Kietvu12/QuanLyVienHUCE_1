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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taiSanAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
  }
  return value;
};

const AssetSession2 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([
    { name: 'Đang sử dụng', value: 0, color: '#10b981' },
    { name: 'Cần bảo trì', value: 0, color: '#f59e0b' },
    { name: 'Hỏng', value: 0, color: '#ef4444' },
  ]);
  const [totalAssets, setTotalAssets] = useState(0);

  useEffect(() => {
    if (user?.id_vien) {
      fetchData();
    }
  }, [user?.id_vien]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = user?.id_vien ? { id_vien: user.id_vien, page: 1, limit: 10000 } : { page: 1, limit: 10000 };
      
      // Fetch statistics và all assets
      const [statsResponse, assetsResponse] = await Promise.all([
        taiSanAPI.getStatistics(user?.id_vien ? { id_vien: user.id_vien } : {}),
        taiSanAPI.getAll(params)
      ]);

      // Xử lý dữ liệu trạng thái
      if (statsResponse.success && statsResponse.data) {
        const stats = statsResponse.data;
        const total = stats.tong_tai_san || 0;
        setTotalAssets(total);
        
        setStatusData([
          { name: 'Đang sử dụng', value: stats.dang_su_dung || 0, color: '#10b981' },
          { name: 'Cần bảo trì', value: stats.bao_tri || 0, color: '#f59e0b' },
          { name: 'Hỏng', value: stats.thiet_bi_hong || 0, color: '#ef4444' },
        ]);
      }

      // Xử lý dữ liệu theo loại (nếu có trong tên tài sản hoặc cần phân loại)
      if (assetsResponse.success && assetsResponse.data) {
        const assets = assetsResponse.data;
        const categoryMap = {};
        
        // Phân loại dựa trên tên tài sản (heuristic)
        assets.forEach(asset => {
          const tenTaiSan = (asset.ten_tai_san || '').toLowerCase();
          let category = 'Khác';
          
          if (tenTaiSan.includes('máy tính') || tenTaiSan.includes('laptop') || tenTaiSan.includes('computer') || tenTaiSan.includes('pc')) {
            category = 'Máy tính';
          } else if (tenTaiSan.includes('bàn') || tenTaiSan.includes('ghế') || tenTaiSan.includes('tủ') || tenTaiSan.includes('nội thất')) {
            category = 'Nội thất';
          } else if (tenTaiSan.includes('máy in') || tenTaiSan.includes('máy chiếu') || tenTaiSan.includes('thiết bị') || tenTaiSan.includes('equipment')) {
            category = 'Thiết bị';
          } else if (tenTaiSan.includes('xe') || tenTaiSan.includes('ô tô') || tenTaiSan.includes('phương tiện') || tenTaiSan.includes('vehicle')) {
            category = 'Phương tiện';
          }
          
          if (!categoryMap[category]) {
            categoryMap[category] = { category, fullCategory: category, count: 0 };
          }
          categoryMap[category].count++;
        });

        const categoryArray = Object.values(categoryMap).sort((a, b) => b.count - a.count);
        setCategoryData(categoryArray);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de pastel - Trạng thái */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố trạng thái
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số tài sản: {loading ? '...' : totalAssets}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={30}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend personalizada */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {statusData.map((entry, index) => (
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

        {/* Gráfico de barras - Theo loại */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo loại tài sản
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số tài sản: {loading ? '...' : categoryData.reduce((sum, item) => sum + (item.count || 0), 0)}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : categoryData.length === 0 ? (
              <div className="text-center text-gray-500">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
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
                    dataKey="category"
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
                      const fullCategory = props.payload?.fullCategory || props.payload?.category;
                      return [value, fullCategory];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullCategory || payload[0].payload.category;
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
      </div>
    </section>
  );
};

export default AssetSession2;


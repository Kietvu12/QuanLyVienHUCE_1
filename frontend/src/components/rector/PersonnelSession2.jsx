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
import { nhanSuStatisticsAPI } from '../../services/api';

const PersonnelSession2 = () => {
  const { user } = useAuth();
  const [departmentData, setDepartmentData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([
    { name: '20-30', value: 0, color: '#3b82f6' },
    { name: '31-40', value: 0, color: '#10b981' },
    { name: '41-50', value: 0, color: '#f59e0b' },
    { name: '51+', value: 0, color: '#8b5cf6' },
  ]);
  const [loading, setLoading] = useState(true);
  const [totalNhanSu, setTotalNhanSu] = useState(0);

  useEffect(() => {
    fetchData();
  }, [user?.id_vien]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { id_vien: user?.id_vien };

      // Fetch phân bố theo phòng ban
      const phongBanRes = await nhanSuStatisticsAPI.getDistributionByPhongBan(params);
      if (phongBanRes.success) {
        const data = phongBanRes.data.map(item => ({
          department: item.fullDepartment.length > 10 
            ? item.fullDepartment.substring(0, 10) + '...' 
            : item.fullDepartment,
          fullDepartment: item.fullDepartment,
          count: item.count
        }));
        setDepartmentData(data);
        setTotalNhanSu(phongBanRes.total || 0);
      }

      // Fetch phân bố theo chức vụ
      const chucVuRes = await nhanSuStatisticsAPI.getDistributionByChucVu(params);
      if (chucVuRes.success) {
        setPositionData(chucVuRes.data || []);
      }

      // Fetch phân bố theo nhóm tuổi
      const ageGroupRes = await nhanSuStatisticsAPI.getDistributionByAgeGroup(params);
      if (ageGroupRes.success) {
        setAgeGroupData(ageGroupRes.data || []);
        if (ageGroupRes.total) {
          setTotalNhanSu(ageGroupRes.total);
        }
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico de pastel - Nhóm tuổi */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo nhóm tuổi
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: {loading ? '...' : totalNhanSu}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : ageGroupData.length === 0 || ageGroupData.every(item => item.value === 0) ? (
              <div className="text-center text-gray-500">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={30}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {ageGroupData.map((entry, index) => (
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
            {ageGroupData.map((entry, index) => (
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

        {/* Gráfico de barras - Theo phòng ban */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo phòng ban
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: {loading ? '...' : totalNhanSu}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : departmentData.length === 0 ? (
              <div className="text-center text-gray-500">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
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
                    dataKey="department"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    width={55}
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
                      const fullDepartment = props.payload?.fullDepartment || props.payload?.department;
                      return [value, fullDepartment];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullDepartment || payload[0].payload.department;
                      }
                      return label;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                    name="Số nhân sự"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de barras - Theo chức vụ */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Phân bố theo chức vụ
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Tổng số nhân sự: {loading ? '...' : totalNhanSu}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : positionData.length === 0 ? (
              <div className="text-center text-gray-500">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={positionData}
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
                    dataKey="position"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    width={100}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(139,92,246,0.1)' }}
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#fff'
                    }}
                    formatter={(value) => [value, 'Số nhân sự']}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    radius={[0, 6, 6, 0]}
                    name="Số nhân sự"
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

export default PersonnelSession2;


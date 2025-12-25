import { FaDownload, FaFileAlt, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hopDongStatisticsAPI, nhanSuAPI, nhanSuStatisticsAPI } from '../../services/api';

const getActivityColor = (type) => {
  switch (type) {
    case 'Thêm mới':
      return 'bg-emerald-100 text-emerald-800';
    case 'Cập nhật':
      return 'bg-blue-100 text-blue-800';
    case 'Thay đổi':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const PersonnelSession4 = () => {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);
  const [hopDongStats, setHopDongStats] = useState({
    tong_hop_dong: 0,
    sap_het_han: 0,
    ty_le_tang_truong: 0
  });
  const [nhanSuStats, setNhanSuStats] = useState({
    tong_nhan_su: 0,
    nhan_su_moi: 0,
    nghi_viec: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user?.id_vien]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { id_vien: user?.id_vien };

      // Fetch thống kê hợp đồng
      const hopDongRes = await hopDongStatisticsAPI.getStatistics(params);
      if (hopDongRes.success) {
        setHopDongStats(hopDongRes.data);
      }

      // Fetch thống kê nhân sự
      const nhanSuRes = await nhanSuStatisticsAPI.getSummary(params);
      if (nhanSuRes.success) {
        setNhanSuStats(nhanSuRes.data);
      }

      // Fetch nhân sự mới nhất để làm hoạt động gần đây
      const nhanSuListRes = await nhanSuAPI.getAll({ 
        ...params, 
        limit: 5,
        page: 1 
      });
      if (nhanSuListRes.success) {
        const activities = (nhanSuListRes.data || []).map((ns, index) => {
          const createdDate = new Date(ns.created_at);
          return {
            id: ns.id,
            type: 'Thêm mới',
            person: ns.ho_ten,
            position: ns.chuc_vu || 'Nhân viên',
            department: ns.phongBan?.ten_phong_ban || '-',
            date: formatDate(ns.created_at),
            time: formatTime(ns.created_at),
            action: 'Đã thêm nhân sự mới'
          };
        });
        setRecentActivities(activities);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statistics = [
    {
      label: 'Tổng hợp đồng lao động',
      value: hopDongStats.tong_hop_dong.toString(),
      icon: FaFileAlt,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Hợp đồng sắp hết hạn',
      value: hopDongStats.sap_het_han.toString(),
      icon: FaCalendarAlt,
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Tỷ lệ tăng trưởng',
      value: `${hopDongStats.ty_le_tang_truong >= 0 ? '+' : ''}${hopDongStats.ty_le_tang_truong.toFixed(1)}%`,
      icon: FaChartLine,
      iconBg: 'bg-emerald-500',
    },
  ];
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hoạt động gần đây */}
        <div className="xl:col-span-2 rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử thay đổi nhân sự
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
              <FaDownload className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có hoạt động nào</div>
            ) : (
              recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="text-xs font-semibold">{activity.type.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {activity.person}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.position} - {activity.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.date}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {activity.action}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Thống kê */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Thống kê</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng quan nhân sự
            </p>
          </div>

          <div className="space-y-4">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thông tin bổ sung */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Thông tin quan trọng
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• {hopDongStats.sap_het_han} hợp đồng sắp hết hạn trong 30 ngày</li>
              <li>• {nhanSuStats.nhan_su_moi} nhân sự mới trong tháng này</li>
              <li>• Tỷ lệ nghỉ việc: {nhanSuStats.tong_nhan_su > 0 
                ? ((nhanSuStats.nghi_viec / nhanSuStats.tong_nhan_su) * 100).toFixed(1) 
                : '0'}%</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonnelSession4;


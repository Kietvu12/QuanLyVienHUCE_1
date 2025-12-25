import { FaUsers, FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { nhanSuStatisticsAPI, phongBanAPI, nhanSuAPI } from '../../services/api';

const PersonnelSession1 = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    tong_nhan_su: 0,
    dang_lam_viec: 0,
    nhan_su_moi: 0,
    nghi_viec: 0,
    change: {
      tong_nhan_su: 0,
      dang_lam_viec: 0,
      nhan_su_moi: 0,
      nghi_viec: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [phongBans, setPhongBans] = useState([]);
  const [filters, setFilters] = useState({
    id_phong_ban: '',
    chuc_vu: '',
    trang_thai: '',
    search: ''
  });

  useEffect(() => {
    fetchStatistics();
    fetchPhongBans();
  }, [user?.id_vien, filters]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = { id_vien: user?.id_vien };
      const response = await nhanSuStatisticsAPI.getSummary(params);
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhongBans = async () => {
    try {
      const response = await phongBanAPI.getAll({ id_vien: user?.id_vien, limit: 100 });
      if (response.success) {
        setPhongBans(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching phong bans:', err);
    }
  };

  const formatChange = (value) => {
    if (value === 0) return '0';
    return value > 0 ? `+${value}` : `${value}`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-emerald-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const summaryCards = [
    {
      label: 'Tổng nhân sự',
      value: statistics.tong_nhan_su,
      change: formatChange(statistics.change.tong_nhan_su),
      changeColor: getChangeColor(statistics.change.tong_nhan_su),
      icon: FaUsers,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Đang làm việc',
      value: statistics.dang_lam_viec,
      change: formatChange(statistics.change.dang_lam_viec),
      changeColor: getChangeColor(statistics.change.dang_lam_viec),
      icon: FaUserCheck,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Nhân sự mới',
      value: statistics.nhan_su_moi,
      change: formatChange(statistics.change.nhan_su_moi),
      changeColor: getChangeColor(statistics.change.nhan_su_moi),
      icon: FaUserPlus,
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Nghỉ việc',
      value: statistics.nghi_viec,
      change: formatChange(statistics.change.nghi_viec),
      changeColor: getChangeColor(statistics.change.nghi_viec),
      icon: FaUserClock,
      iconBg: 'bg-orange-500',
    },
  ];
  return (
    <section className="px-6">
      {/* Filtros */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Phòng ban:</label>
            <select 
              value={filters.id_phong_ban}
              onChange={(e) => setFilters({ ...filters, id_phong_ban: e.target.value })}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              {phongBans.map((pb) => (
                <option key={pb.id} value={pb.id}>
                  {pb.ten_phong_ban}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Chức vụ:</label>
            <select 
              value={filters.chuc_vu}
              onChange={(e) => setFilters({ ...filters, chuc_vu: e.target.value })}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="Viện trưởng">Viện trưởng</option>
              <option value="Kế toán">Kế toán</option>
              <option value="Trưởng phòng">Trưởng phòng</option>
              <option value="Nhân viên">Nhân viên</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select 
              value={filters.trang_thai}
              onChange={(e) => setFilters({ ...filters, trang_thai: e.target.value })}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="working">Đang làm việc</option>
              <option value="resigned">Đã nghỉ việc</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tên, email, số điện thoại..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            onClick={fetchStatistics}
            className="h-9 px-6 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Lọc
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải thống kê...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-400">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-gray-900">
                      {card.value}
                    </span>
                    <span className={`text-xs font-semibold ${card.changeColor}`}>
                      {card.change}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.iconBg} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PersonnelSession1;


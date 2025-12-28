import { FaUsers, FaBuilding, FaUserTie, FaCheckCircle, FaSearch } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { nhanSuStatisticsAPI, vienAPI, phongBanAPI } from '../../services/api';

const formatChange = (value) => {
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `${value}`;
};

const getChangeColor = (value) => {
  if (value > 0) return 'text-emerald-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

const PersonnelSession1 = () => {
  const [loading, setLoading] = useState(true);
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
  const [viens, setViens] = useState([]);
  const [phongBans, setPhongBans] = useState([]);
  const [filters, setFilters] = useState({
    id_vien: '',
    id_phong_ban: '',
    chuc_vu: ''
  });

  useEffect(() => {
    fetchViens();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchPhongBans();
  }, [filters.id_vien]);

  useEffect(() => {
    fetchStatistics();
  }, [filters]);

  const fetchViens = async () => {
    try {
      const response = await vienAPI.getAll({ limit: 100 });
      if (response.success) {
        setViens(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching viens:', err);
    }
  };

  const fetchPhongBans = async () => {
    try {
      const params = { limit: 100 };
      if (filters.id_vien) {
        params.id_vien = filters.id_vien;
      }
      const response = await phongBanAPI.getAll(params);
      if (response.success) {
        setPhongBans(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching phong bans:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.id_vien) {
        params.id_vien = filters.id_vien;
      }
      if (filters.id_phong_ban) {
        params.id_phong_ban = filters.id_phong_ban;
      }
      if (filters.chuc_vu) {
        params.chuc_vu = filters.chuc_vu;
      }
      
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

  const summaryCards = [
    {
      label: 'Tổng nhân sự',
      value: statistics.tong_nhan_su.toString(),
      change: formatChange(statistics.change.tong_nhan_su),
      changeColor: getChangeColor(statistics.change.tong_nhan_su),
      icon: FaUsers,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Số Viện',
      value: viens.length.toString(),
      change: '',
      changeColor: 'text-gray-500',
      icon: FaBuilding,
      iconBg: 'bg-purple-500',
    },
    {
      label: 'Trưởng phòng',
      value: '0', // Cần API riêng để đếm trưởng phòng
      change: '',
      changeColor: 'text-gray-500',
      icon: FaUserTie,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Đang làm việc',
      value: statistics.dang_lam_viec.toString(),
      change: formatChange(statistics.change.dang_lam_viec),
      changeColor: getChangeColor(statistics.change.dang_lam_viec),
      icon: FaCheckCircle,
      iconBg: 'bg-green-500',
    },
  ];

  return (
    <section className="px-6">
      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Viện:</label>
            <select 
              value={filters.id_vien}
              onChange={(e) => setFilters({ ...filters, id_vien: e.target.value, id_phong_ban: '' })}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả Viện</option>
              {viens.map((vien) => (
                <option key={vien.id} value={vien.id}>
                  {vien.ten_vien}
                </option>
              ))}
            </select>
          </div>
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
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5 animate-pulse"
            >
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            </div>
          ))
        ) : (
          summaryCards.map((card) => {
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
                    {card.change && (
                      <span className={`text-xs font-semibold ${card.changeColor}`}>
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.iconBg} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default PersonnelSession1;


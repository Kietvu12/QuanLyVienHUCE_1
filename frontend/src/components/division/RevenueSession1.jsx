import { FaDollarSign, FaArrowUp, FaArrowDown, FaWallet, FaBuilding } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { doanhThuAPI, nghiaVuNopAPI, vienAPI } from '../../services/api';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value || 0) + ' đ';
};

const RevenueSession1 = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    tongThu: 0,
    tongChi: 0,
    loiNhuan: 0,
    tongCongNo: 0
  });
  const [viens, setViens] = useState([]);
  const [filters, setFilters] = useState({
    id_vien: '',
    tuNgay: '',
    denNgay: '',
    nam: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchViens();
  }, []);

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

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Tính toán date range từ filters
      let startDate = null;
      let endDate = null;
      
      if (filters.tuNgay && filters.denNgay) {
        startDate = filters.tuNgay;
        endDate = filters.denNgay;
      } else if (filters.nam) {
        const year = parseInt(filters.nam);
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      // Chuẩn bị params cho API
      const revenueParams = {};
      const debtParams = {};
      
      if (filters.id_vien) {
        revenueParams.id_vien = filters.id_vien;
        debtParams.id_vien = filters.id_vien;
      }
      
      if (startDate) {
        revenueParams.tu_ngay = startDate;
        debtParams.tu_ngay = startDate;
      }
      
      if (endDate) {
        revenueParams.den_ngay = endDate;
        debtParams.den_ngay = endDate;
      }

      // Gọi API song song
      const [revenueStats, debtStats] = await Promise.allSettled([
        doanhThuAPI.getStatistics(revenueParams),
        nghiaVuNopAPI.getStatistics(debtParams)
      ]);

      let tongThu = 0;
      let tongChi = 0;
      let tongCongNo = 0;

      // Xử lý kết quả doanh thu
      if (revenueStats.status === 'fulfilled' && revenueStats.value?.success) {
        const data = revenueStats.value.data;
        tongThu = parseFloat(data?.tong_doanh_thu || 0);
        tongChi = parseFloat(data?.tong_chi_phi || 0);
      }

      // Xử lý kết quả công nợ
      if (debtStats.status === 'fulfilled' && debtStats.value?.success) {
        const data = debtStats.value.data;
        tongCongNo = parseFloat(data?.tong_cong_no || 0);
      }

      const loiNhuan = tongThu - tongChi;

      setSummaryData({
        tongThu,
        tongChi,
        loiNhuan,
        tongCongNo
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilter = () => {
    fetchStatistics();
  };

  const summaryCards = [
    {
      label: 'Tổng thu tất cả Viện',
      value: formatCurrency(summaryData.tongThu),
      change: '+0%',
      changeColor: 'text-emerald-500',
      icon: FaDollarSign,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Tổng chi tất cả Viện',
      value: formatCurrency(summaryData.tongChi),
      change: '+0%',
      changeColor: 'text-red-500',
      icon: FaArrowDown,
      iconBg: 'bg-red-500',
    },
    {
      label: 'Tổng lợi nhuận',
      value: formatCurrency(summaryData.loiNhuan),
      change: summaryData.loiNhuan >= 0 ? '+0%' : '-0%',
      changeColor: summaryData.loiNhuan >= 0 ? 'text-emerald-500' : 'text-red-500',
      icon: FaArrowUp,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Tổng công nợ',
      value: formatCurrency(summaryData.tongCongNo),
      change: '-0%',
      changeColor: 'text-red-500',
      icon: FaWallet,
      iconBg: 'bg-orange-500',
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
              onChange={(e) => handleFilterChange('id_vien', e.target.value)}
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
            <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
            <input
              type="date"
              value={filters.tuNgay}
              onChange={(e) => handleFilterChange('tuNgay', e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
            <input
              type="date"
              value={filters.denNgay}
              onChange={(e) => handleFilterChange('denNgay', e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Năm:</label>
            <select 
              value={filters.nam}
              onChange={(e) => handleFilterChange('nam', e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <button 
            onClick={handleApplyFilter}
            className="h-9 px-6 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Lọc
          </button>
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
              <div className="w-12 h-12 bg-gray-200 rounded-2xl rounded"></div>
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
          })
        )}
      </div>
    </section>
  );
};

export default RevenueSession1;


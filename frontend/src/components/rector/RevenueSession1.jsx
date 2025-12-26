import { FaDollarSign, FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doanhThuAPI, chiPhiAPI } from '../../services/api';

const RevenueSession1 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    tongThu: 0,
    tongChi: 0,
    loiNhuan: 0,
    soGiaoDich: 0
  });
  const [filters, setFilters] = useState({
    tuNgay: '',
    denNgay: '',
    thang: '',
    nam: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchStatistics();
  }, [user?.id_vien, filters]);

  // Listen for revenue/expense updates
  useEffect(() => {
    const handleRevenueUpdate = () => {
      fetchStatistics();
    };
    
    window.addEventListener('revenueUpdated', handleRevenueUpdate);
    window.addEventListener('expenseUpdated', handleRevenueUpdate);
    
    return () => {
      window.removeEventListener('revenueUpdated', handleRevenueUpdate);
      window.removeEventListener('expenseUpdated', handleRevenueUpdate);
    };
  }, [user?.id_vien]); // Include user?.id_vien to ensure fetchStatistics has access to it

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Tính toán date range từ filters
      let startDate = null;
      let endDate = null;
      
      if (filters.thang && filters.nam) {
        // Filter theo tháng
        const month = parseInt(filters.thang);
        const year = parseInt(filters.nam);
        startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
      } else if (filters.tuNgay && filters.denNgay) {
        startDate = filters.tuNgay;
        endDate = filters.denNgay;
      } else if (filters.nam) {
        // Filter theo năm
        const year = parseInt(filters.nam);
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      // Lấy tất cả doanh thu (không pagination để tính tổng)
      const thuParams = { id_vien: user?.id_vien, limit: 10000 };
      const chiParams = { id_vien: user?.id_vien, limit: 10000 };

      const [thuResponse, chiResponse] = await Promise.all([
        doanhThuAPI.getAll(thuParams),
        chiPhiAPI.getAll(chiParams)
      ]);

      let tongThu = 0;
      let tongChi = 0;
      let soGiaoDichThu = 0;
      let soGiaoDichChi = 0;

      // Filter và tính toán doanh thu
      if (thuResponse.success && thuResponse.data) {
        thuResponse.data.forEach(item => {
          // Kiểm tra filter theo ngày
          let shouldInclude = true;
          if (startDate || endDate) {
            const itemDate = item.ngay_nhan_tien || item.ngay_tao;
            if (itemDate) {
              const date = new Date(itemDate);
              if (startDate && date < new Date(startDate)) {
                shouldInclude = false;
              }
              if (endDate && date > new Date(endDate)) {
                shouldInclude = false;
              }
            } else {
              shouldInclude = false;
            }
          }

          if (shouldInclude) {
            // Chỉ tính các khoản đã nhận
            if (item.trang_thai === 'da_nhan') {
              tongThu += parseFloat(item.so_tien) || 0;
            }
            soGiaoDichThu++;
          }
        });
      }

      // Filter và tính toán chi phí
      if (chiResponse.success && chiResponse.data) {
        chiResponse.data.forEach(item => {
          // Kiểm tra filter theo ngày
          let shouldInclude = true;
          if (startDate || endDate) {
            const itemDate = item.ngay_tat_toan || item.ngay_tao;
            if (itemDate) {
              const date = new Date(itemDate);
              if (startDate && date < new Date(startDate)) {
                shouldInclude = false;
              }
              if (endDate && date > new Date(endDate)) {
                shouldInclude = false;
              }
            } else {
              shouldInclude = false;
            }
          }

          if (shouldInclude) {
            // Chỉ tính các khoản đã tất toán
            if (item.trang_thai === 'da_tat_toan') {
              tongChi += parseFloat(item.so_tien) || 0;
            }
            soGiaoDichChi++;
          }
        });
      }

      const loiNhuan = tongThu - tongChi;
      const soGiaoDich = soGiaoDichThu + soGiaoDichChi;

      setSummaryData({
        tongThu,
        tongChi,
        loiNhuan,
        soGiaoDich
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
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
      label: 'Tổng thu',
      value: formatCurrency(summaryData.tongThu),
      change: '+0%',
      changeColor: 'text-emerald-500',
      icon: FaDollarSign,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Tổng chi',
      value: formatCurrency(summaryData.tongChi),
      change: '+0%',
      changeColor: 'text-red-500',
      icon: FaArrowDown,
      iconBg: 'bg-red-500',
    },
    {
      label: 'Lợi nhuận',
      value: formatCurrency(summaryData.loiNhuan),
      change: summaryData.loiNhuan >= 0 ? '+0%' : '-0%',
      changeColor: summaryData.loiNhuan >= 0 ? 'text-emerald-500' : 'text-red-500',
      icon: FaArrowUp,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Số giao dịch',
      value: summaryData.soGiaoDich.toString(),
      change: '+0',
      changeColor: 'text-emerald-500',
      icon: FaWallet,
      iconBg: 'bg-purple-500',
    },
  ];

  return (
    <section className="px-6">
      {/* Filtros de fecha */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
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
            <label className="text-sm font-medium text-gray-700">Tháng:</label>
            <select 
              value={filters.thang}
              onChange={(e) => handleFilterChange('thang', e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="01">Tháng 1</option>
              <option value="02">Tháng 2</option>
              <option value="03">Tháng 3</option>
              <option value="04">Tháng 4</option>
              <option value="05">Tháng 5</option>
              <option value="06">Tháng 6</option>
              <option value="07">Tháng 7</option>
              <option value="08">Tháng 8</option>
              <option value="09">Tháng 9</option>
              <option value="10">Tháng 10</option>
              <option value="11">Tháng 11</option>
              <option value="12">Tháng 12</option>
            </select>
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

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Đang tải...</div>
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


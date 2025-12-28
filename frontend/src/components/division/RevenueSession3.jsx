import { FaSearch, FaDownload, FaBuilding } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { vienAPI, doanhThuAPI, chiPhiAPI, nghiaVuNopAPI } from '../../services/api';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value || 0) + ' đ';
};

const RevenueSession3 = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viens, setViens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVien, setSelectedVien] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchViens();
    fetchRevenueData();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (searchTerm || selectedVien) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchTerm, selectedVien]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedVien, revenueData, pagination.page]);

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

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      // Lấy danh sách tất cả viện
      const vienResponse = await vienAPI.getAll({ limit: 100 });
      if (!vienResponse.success) {
        console.error('Error fetching viens:', vienResponse.message);
        return;
      }

      const viens = vienResponse.data || [];
      
      // Lấy thống kê cho từng viện
      const dataPromises = viens.map(async (vien) => {
        try {
          const [revenueStats, debtStats, thuList, chiList] = await Promise.allSettled([
            doanhThuAPI.getStatistics({ id_vien: vien.id }),
            nghiaVuNopAPI.getStatistics({ id_vien: vien.id }),
            doanhThuAPI.getAll({ id_vien: vien.id, limit: 10000 }),
            chiPhiAPI.getAll({ id_vien: vien.id, limit: 10000 })
          ]);

          const revenueData = revenueStats.status === 'fulfilled' ? revenueStats.value : null;
          const debtData = debtStats.status === 'fulfilled' ? debtStats.value : null;
          const thuData = thuList.status === 'fulfilled' ? thuList.value : null;
          const chiData = chiList.status === 'fulfilled' ? chiList.value : null;

          // Tính tổng doanh thu
          const tongDoanhThu = revenueData?.success ? (revenueData.data?.tong_doanh_thu || 0) : 0;
          
          // Tính tổng chi phí
          const tongChiPhi = revenueData?.success ? (parseFloat(revenueData.data?.tong_chi_phi) || 0) : 0;
          
          // Tổng công nợ
          const tongCongNo = debtData?.success ? (debtData.data?.tong_cong_no || 0) : 0;

          // Tính số giao dịch
          const soGiaoDichThu = thuData?.success ? (thuData.data?.length || 0) : 0;
          const soGiaoDichChi = chiData?.success ? (chiData.data?.length || 0) : 0;
          const soGiaoDich = soGiaoDichThu + soGiaoDichChi;

          const loiNhuan = tongDoanhThu - tongChiPhi;

          return {
            id: vien.id,
            institute: vien.ten_vien,
            thu: tongDoanhThu,
            chi: tongChiPhi,
            loiNhuan: loiNhuan,
            congNo: tongCongNo,
            soGiaoDich: soGiaoDich
          };
        } catch (err) {
          console.error(`Error fetching data for vien ${vien.id}:`, err);
          return {
            id: vien.id,
            institute: vien.ten_vien,
            thu: 0,
            chi: 0,
            loiNhuan: 0,
            congNo: 0,
            soGiaoDich: 0
          };
        }
      });

      const results = await Promise.all(dataPromises);
      setRevenueData(results);
      setPagination(prev => ({ ...prev, total: results.length }));
    } catch (err) {
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...revenueData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.institute.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected vien
    if (selectedVien) {
      filtered = filtered.filter(item => item.id.toString() === selectedVien);
    }

    // Update total count after filtering
    const totalFiltered = filtered.length;
    setPagination(prev => ({ ...prev, total: totalFiltered }));

    // Pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    filtered = filtered.slice(startIndex, endIndex);

    setFilteredData(filtered);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, pagination.total);

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bảng tổng hợp doanh thu và công nợ</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách doanh thu, chi phí và công nợ của tất cả các Viện
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
            <FaDownload className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>

        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên Viện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select 
            value={selectedVien}
            onChange={(e) => setSelectedVien(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả Viện</option>
            {viens.map((vien) => (
              <option key={vien.id} value={vien.id.toString()}>
                {vien.ten_vien}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Viện
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tổng thu
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tổng chi
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lợi nhuận
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Công nợ
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số giao dịch
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{item.institute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(item.thu)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(item.chi)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-blue-600">
                        {formatCurrency(item.loiNhuan)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-orange-600">
                        {formatCurrency(item.congNo)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-gray-700">{item.soGiaoDich}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <h4 className="text-sm font-semibold text-gray-900">{item.institute}</h4>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Tổng thu:</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(item.thu)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Tổng chi:</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(item.chi)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Lợi nhuận:</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(item.loiNhuan)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Công nợ:</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {formatCurrency(item.congNo)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">Số giao dịch:</span>
                    <span className="text-sm text-gray-700 font-medium">{item.soGiaoDich}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {startIndex + 1}-{endIndex} của {pagination.total} kết quả
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RevenueSession3;


import { FaSearch, FaDownload, FaBuilding } from 'react-icons/fa';
import React from 'react';
const revenueData = [
  {
    id: 1,
    institute: 'Viện Tin học Xây Dựng',
    thu: 4500000000,
    chi: 3200000000,
    loiNhuan: 1300000000,
    congNo: 850000000,
    soGiaoDich: 245,
  },
  {
    id: 2,
    institute: 'Viện Khoa học Công nghệ',
    thu: 3800000000,
    chi: 2800000000,
    loiNhuan: 1000000000,
    congNo: 650000000,
    soGiaoDich: 198,
  },
  {
    id: 3,
    institute: 'Viện Nghiên cứu Phát triển',
    thu: 4150000000,
    chi: 3850000000,
    loiNhuan: 300000000,
    congNo: 350000000,
    soGiaoDich: 167,
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const RevenueSession3 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bảng tổng hợp doanh thu và công nợ</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách doanh thu, chi phí và công nợ của tất cả các Viện
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
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
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả Viện</option>
            <option value="vien1">Viện Tin học Xây Dựng</option>
            <option value="vien2">Viện Khoa học Công nghệ</option>
            <option value="vien3">Viện Nghiên cứu Phát triển</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
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
              {revenueData.map((item) => (
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
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {revenueData.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <FaBuilding className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-gray-900 flex-1">{item.institute}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Tổng thu</p>
                  <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.thu)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Tổng chi</p>
                  <p className="text-sm font-semibold text-red-600">{formatCurrency(item.chi)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Lợi nhuận</p>
                  <p className="text-sm font-semibold text-blue-600">{formatCurrency(item.loiNhuan)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Công nợ</p>
                  <p className="text-sm font-semibold text-orange-600">{formatCurrency(item.congNo)}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Số giao dịch:</span>
                  <span className="text-sm font-semibold text-gray-900">{item.soGiaoDich}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-3 của 3 kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueSession3;


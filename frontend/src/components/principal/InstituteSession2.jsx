import { FaSearch, FaBuilding } from 'react-icons/fa';
import React from 'react';
const instituteSummary = [
  {
    institute: 'Viện Tin học Xây Dựng',
    totalPersonnel: 85,
    totalProjects: 25,
    totalRevenue: 4500000000,
    totalDebt: 850000000,
    totalAssets: 425,
  },
  {
    institute: 'Viện Khoa học Công nghệ',
    totalPersonnel: 78,
    totalProjects: 22,
    totalRevenue: 3800000000,
    totalDebt: 650000000,
    totalAssets: 398,
  },
  {
    institute: 'Viện Nghiên cứu Phát triển',
    totalPersonnel: 82,
    totalProjects: 21,
    totalRevenue: 4150000000,
    totalDebt: 350000000,
    totalAssets: 422,
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const InstituteSession2 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bảng tổng hợp các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng hợp thống kê tất cả các Viện
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tên Viện..."
              className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Viện
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nhân sự
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đề tài
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Công nợ
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tài sản
                </th>
              </tr>
            </thead>
            <tbody>
              {instituteSummary.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{item.institute}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-700">{item.totalPersonnel}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-700">{item.totalProjects}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(item.totalRevenue)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-orange-600">
                      {formatCurrency(item.totalDebt)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-700">{item.totalAssets}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {instituteSummary.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <FaBuilding className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-gray-900 flex-1">{item.institute}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Nhân sự</p>
                  <p className="text-sm font-semibold text-gray-900">{item.totalPersonnel}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Đề tài</p>
                  <p className="text-sm font-semibold text-gray-900">{item.totalProjects}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Tài sản</p>
                  <p className="text-sm font-semibold text-gray-900">{item.totalAssets}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Công nợ</p>
                  <p className="text-sm font-semibold text-orange-600">{formatCurrency(item.totalDebt)}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Doanh thu</p>
                <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.totalRevenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstituteSession2;


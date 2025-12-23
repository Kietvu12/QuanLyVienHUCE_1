import { FaSearch, FaDownload } from 'react-icons/fa';
import React from 'react';
const chiData = [
  {
    id: 1,
    date: '15/12/2025',
    description: 'Lương nhân viên tháng 12',
    category: 'Nhân sự',
    amount: 45000000,
    status: 'Đã thanh toán',
  },
  {
    id: 2,
    date: '14/12/2025',
    description: 'Mua thiết bị máy tính',
    category: 'Thiết bị',
    amount: 25000000,
    status: 'Đã thanh toán',
  },
  {
    id: 3,
    date: '13/12/2025',
    description: 'Tiền điện, nước tháng 12',
    category: 'Chi phí vận hành',
    amount: 5000000,
    status: 'Đã thanh toán',
  },
  {
    id: 4,
    date: '12/12/2025',
    description: 'Thuê văn phòng',
    category: 'Chi phí vận hành',
    amount: 30000000,
    status: 'Chờ thanh toán',
  },
  {
    id: 5,
    date: '11/12/2025',
    description: 'Mua phần mềm bản quyền',
    category: 'Thiết bị',
    amount: 15000000,
    status: 'Đã thanh toán',
  },
  {
    id: 6,
    date: '10/12/2025',
    description: 'Chi phí marketing',
    category: 'Marketing',
    amount: 20000000,
    status: 'Đã thanh toán',
  },
  {
    id: 7,
    date: '09/12/2025',
    description: 'Bảo trì hệ thống',
    category: 'Chi phí vận hành',
    amount: 8000000,
    status: 'Đã thanh toán',
  },
  {
    id: 8,
    date: '08/12/2025',
    description: 'Đào tạo nhân viên',
    category: 'Nhân sự',
    amount: 12000000,
    status: 'Đã thanh toán',
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const RevenueSession4 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bảng chi</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách các khoản chi trong kỳ
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
            <FaDownload className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả danh mục</option>
            <option value="Nhân sự">Nhân sự</option>
            <option value="Thiết bị">Thiết bị</option>
            <option value="Chi phí vận hành">Chi phí vận hành</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {chiData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{item.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{item.description}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(item.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Đã thanh toán'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {chiData.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">{item.description}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Ngày: <span className="text-gray-900 font-medium">{item.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-600">Số tiền: </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Đã thanh toán'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-8 của 8 kết quả
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

export default RevenueSession4;


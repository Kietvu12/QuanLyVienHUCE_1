import { FaSearch, FaBuilding, FaEye, FaFileAlt } from 'react-icons/fa';
import React from 'react';
const assets = [
  {
    id: 'TS-2025-001',
    name: 'Laptop Dell XPS 15',
    category: 'Máy tính',
    institute: 'Viện Tin học Xây Dựng',
    purchaseDate: '15/03/2023',
    purchasePrice: '25.000.000',
    status: 'Đang sử dụng',
    location: 'Phòng 201',
  },
  {
    id: 'TS-2025-002',
    name: 'Máy in HP LaserJet',
    category: 'Thiết bị',
    institute: 'Viện Khoa học Công nghệ',
    purchaseDate: '20/05/2022',
    purchasePrice: '8.500.000',
    status: 'Cần bảo trì',
    location: 'Phòng 105',
  },
  {
    id: 'TS-2025-003',
    name: 'Bàn làm việc gỗ',
    category: 'Nội thất',
    institute: 'Viện Nghiên cứu Phát triển',
    purchaseDate: '10/01/2021',
    purchasePrice: '3.200.000',
    status: 'Đang sử dụng',
    location: 'Phòng 302',
  },
  {
    id: 'TS-2025-004',
    name: 'Máy tính để bàn',
    category: 'Máy tính',
    institute: 'Viện Tin học Xây Dựng',
    purchaseDate: '05/09/2022',
    purchasePrice: '18.000.000',
    status: 'Đang sử dụng',
    location: 'Phòng 205',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Đang sử dụng':
      return 'bg-emerald-100 text-emerald-800';
    case 'Cần bảo trì':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hỏng':
      return 'bg-red-100 text-red-800';
    case 'Có sẵn':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AssetSession3 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách tài sản tất cả các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem thông tin tài sản và tình trạng của tất cả các Viện
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên tài sản..."
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
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả loại</option>
            <option value="maytinh">Máy tính</option>
            <option value="thietbi">Thiết bị</option>
            <option value="noithat">Nội thất</option>
            <option value="phuongtien">Phương tiện</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="dangsudung">Đang sử dụng</option>
            <option value="canbaotri">Cần bảo trì</option>
            <option value="hong">Hỏng</option>
            <option value="cosan">Có sẵn</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã TS
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên tài sản
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Viện
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày mua
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá mua
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{asset.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{asset.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{asset.institute}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{asset.location}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{asset.purchaseDate}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {asset.purchasePrice} đ
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{asset.id}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {asset.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{asset.name}</h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Viện: </span>
                  <span className="text-xs text-gray-900 font-medium">{asset.institute}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Vị trí:</span>
                  <span className="text-xs text-gray-900 font-medium">{asset.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ngày mua:</span>
                  <span className="text-xs text-gray-900 font-medium">{asset.purchaseDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Giá mua:</span>
                  <span className="text-sm font-semibold text-gray-900">{asset.purchasePrice} đ</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">Trạng thái:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                  <FaEye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-4 của 4 kết quả
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

export default AssetSession3;


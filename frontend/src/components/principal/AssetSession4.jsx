import { useState } from 'react';
import { FaSearch, FaBuilding, FaFileAlt, FaDownload, FaEye, FaExchangeAlt } from 'react-icons/fa';
import React from 'react';
const handoverToInstitute = [
  {
    id: 'BG-2025-001',
    assetId: 'TS-2025-001',
    assetName: 'Laptop Dell XPS 15',
    fromInstitute: 'Trường',
    toInstitute: 'Viện Tin học Xây Dựng',
    handoverDate: '15/01/2025',
    handoverBy: 'Ban Giám hiệu',
    handoverSlip: 'phieu-ban-giao-001.pdf',
    status: 'Đã bàn giao',
  },
  {
    id: 'BG-2025-002',
    assetId: 'TS-2025-002',
    assetName: 'Máy in HP LaserJet',
    fromInstitute: 'Trường',
    toInstitute: 'Viện Khoa học Công nghệ',
    handoverDate: '20/02/2025',
    handoverBy: 'Ban Giám hiệu',
    handoverSlip: 'phieu-ban-giao-002.pdf',
    status: 'Đã bàn giao',
  },
];

const handoverFromInstitute = [
  {
    id: 'BG-2025-003',
    assetId: 'TS-2025-003',
    assetName: 'Bàn làm việc gỗ',
    fromInstitute: 'Viện Nghiên cứu Phát triển',
    toInstitute: 'Trường',
    handoverDate: '10/03/2025',
    handoverBy: 'Lê Văn C',
    handoverSlip: 'phieu-ban-giao-003.pdf',
    status: 'Đã bàn giao lại',
  },
  {
    id: 'BG-2025-004',
    assetId: 'TS-2025-004',
    assetName: 'Máy tính để bàn',
    fromInstitute: 'Viện Tin học Xây Dựng',
    toInstitute: 'Trường',
    handoverDate: '05/04/2025',
    handoverBy: 'Nguyễn Văn A',
    handoverSlip: 'phieu-ban-giao-004.pdf',
    status: 'Đã bàn giao lại',
  },
];

const AssetSession4 = () => {
  const [activeTab, setActiveTab] = useState('to');

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quản lý bàn giao tài sản</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách tài sản đã bàn giao cho Viện và tài sản do Viện bàn giao lại
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('to')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'to'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tài sản đã bàn giao cho Viện
          </button>
          <button
            onClick={() => setActiveTab('from')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'from'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tài sản do Viện bàn giao lại
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm mã bàn giao, tên tài sản..."
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
                  Mã BG
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tài sản
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {activeTab === 'to' ? 'Bàn giao đến' : 'Bàn giao từ'}
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày bàn giao
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người bàn giao
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phiếu bàn giao
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'to' ? handoverToInstitute : handoverFromInstitute).map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{item.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.assetName}</div>
                      <div className="text-xs text-gray-500">Mã: {item.assetId}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">
                        {activeTab === 'to' ? item.toInstitute : item.fromInstitute}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{item.handoverDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{item.handoverBy}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{item.handoverSlip}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải phiếu bàn giao">
                        <FaDownload className="w-4 h-4" />
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
          {(activeTab === 'to' ? handoverToInstitute : handoverFromInstitute).map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{item.id}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.assetName}</h4>
                  <p className="text-xs text-gray-500 mb-2">Mã: {item.assetId}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{activeTab === 'to' ? 'Bàn giao đến: ' : 'Bàn giao từ: '}</span>
                  <span className="text-xs text-gray-900 font-medium">
                    {activeTab === 'to' ? item.toInstitute : item.fromInstitute}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ngày bàn giao:</span>
                  <span className="text-xs text-gray-900 font-medium">{item.handoverDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Người bàn giao:</span>
                  <span className="text-xs text-gray-900 font-medium">{item.handoverBy}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <FaFileAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Phiếu bàn giao: </span>
                  <span className="text-xs text-gray-900 font-medium">{item.handoverSlip}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                  <FaEye className="w-4 h-4" />
                </button>
                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải phiếu bàn giao">
                  <FaDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-2 của 2 kết quả
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

export default AssetSession4;


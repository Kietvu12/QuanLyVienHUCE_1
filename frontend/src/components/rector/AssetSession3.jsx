import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaTools, FaTimes, FaUpload, FaFileUpload, FaTrashAlt, FaCheckCircle, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
const assets = [
  {
    id: 'TS-2025-001',
    name: 'Laptop Dell XPS 15',
    category: 'Máy tính',
    purchaseDate: '15/03/2023',
    purchasePrice: '25.000.000',
    status: 'Đang sử dụng',
    location: 'Phòng 201',
  },
  {
    id: 'TS-2025-002',
    name: 'Máy in HP LaserJet',
    category: 'Thiết bị',
    purchaseDate: '20/05/2022',
    purchasePrice: '8.500.000',
    status: 'Cần bảo trì',
    location: 'Phòng 105',
  },
  {
    id: 'TS-2025-003',
    name: 'Bàn làm việc gỗ',
    category: 'Nội thất',
    purchaseDate: '10/01/2021',
    purchasePrice: '3.200.000',
    status: 'Đang sử dụng',
    location: 'Phòng 302',
  },
  {
    id: 'TS-2025-004',
    name: 'Máy tính để bàn',
    category: 'Máy tính',
    purchaseDate: '05/09/2022',
    purchasePrice: '18.000.000',
    status: 'Đang sử dụng',
    location: 'Phòng 205',
  },
  {
    id: 'TS-2025-005',
    name: 'Xe máy Honda',
    category: 'Phương tiện',
    purchaseDate: '12/11/2020',
    purchasePrice: '35.000.000',
    status: 'Đang sử dụng',
    location: 'Bãi xe',
  },
  {
    id: 'TS-2025-006',
    name: 'Máy chiếu Epson',
    category: 'Thiết bị',
    purchaseDate: '15/04/2021',
    purchasePrice: '12.000.000',
    status: 'Hỏng',
    location: 'Phòng họp',
  },
  {
    id: 'TS-2025-007',
    name: 'Ghế văn phòng',
    category: 'Nội thất',
    purchaseDate: '20/06/2023',
    purchasePrice: '2.500.000',
    status: 'Đang sử dụng',
    location: 'Phòng 301',
  },
  {
    id: 'TS-2025-008',
    name: 'Máy tính bảng iPad',
    category: 'Máy tính',
    purchaseDate: '08/08/2023',
    purchasePrice: '15.000.000',
    status: 'Có sẵn',
    location: 'Kho',
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
  const { user } = useAuth();
  const isReadOnly = user?.role === 'accountant';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetsForm, setAssetsForm] = useState([
    {
      name: '',
      category: '',
      location: '',
      purchaseDate: '',
      purchasePrice: '',
      status: 'Đang sử dụng',
    },
  ]);
  const [transferDocument, setTransferDocument] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFiles, setTransferFiles] = useState([]);

  const handleAddAssetRow = () => {
    setAssetsForm([
      ...assetsForm,
      {
        name: '',
        category: '',
        location: '',
        purchaseDate: '',
        purchasePrice: '',
        status: 'Đang sử dụng',
      },
    ]);
  };

  const handleRemoveAssetRow = (index) => {
    if (assetsForm.length > 1) {
      setAssetsForm(assetsForm.filter((_, i) => i !== index));
    }
  };

  const handleAssetChange = (index, field, value) => {
    const updated = [...assetsForm];
    updated[index][field] = value;
    setAssetsForm(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransferDocument(file);
    }
  };

  const handleRemoveFile = () => {
    setTransferDocument(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se procesaría el envío del formulario
    console.log('Assets:', assetsForm);
    console.log('Transfer Document:', transferDocument);
    // Cerrar modal y resetear formulario
    setIsModalOpen(false);
    setAssetsForm([
      {
        name: '',
        category: '',
        location: '',
        purchaseDate: '',
        purchasePrice: '',
        status: 'Đang sử dụng',
      },
    ]);
    setTransferDocument(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAssetsForm([
      {
        name: '',
        category: '',
        location: '',
        purchaseDate: '',
        purchasePrice: '',
        status: 'Đang sử dụng',
      },
    ]);
    setTransferDocument(null);
  };

  const handleSelectAsset = (assetId) => {
    setSelectedAssets((prev) => {
      if (prev.includes(assetId)) {
        return prev.filter((id) => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map((asset) => asset.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Xử lý xóa tài sản đã chọn
    console.log('Deleting assets:', selectedAssets);
    setSelectedAssets([]);
    setShowDeleteConfirm(false);
    // TODO: Gọi API để xóa tài sản
  };

  const handleTransferSelected = () => {
    setShowTransferModal(true);
  };

  const handleTransferFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setTransferFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveTransferFile = (index) => {
    setTransferFiles(transferFiles.filter((_, i) => i !== index));
  };

  const handleSubmitTransfer = () => {
    // Xử lý bàn giao lại
    console.log('Transferring assets:', selectedAssets);
    console.log('Transfer files:', transferFiles);
    setSelectedAssets([]);
    setTransferFiles([]);
    setShowTransferModal(false);
    // TODO: Gọi API để bàn giao lại
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách tài sản</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý toàn bộ tài sản của Viện
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
            >
              <FaPlus className="w-4 h-4" />
              Thêm tài sản
            </button>
          )}
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm mã tài sản, tên, mô tả..."
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả loại</option>
            <option value="computer">Máy tính</option>
            <option value="furniture">Nội thất</option>
            <option value="equipment">Thiết bị</option>
            <option value="vehicle">Phương tiện</option>
            <option value="other">Khác</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="using">Đang sử dụng</option>
            <option value="maintenance">Cần bảo trì</option>
            <option value="broken">Hỏng</option>
            <option value="available">Có sẵn</option>
          </select>
        </div>

        {/* Action buttons khi có item được chọn */}
        {!isReadOnly && selectedAssets.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Đã chọn: {selectedAssets.length} tài sản
            </span>
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={handleTransferSelected}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <FaExchangeAlt className="w-4 h-4" />
                Bàn giao lại
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {!isReadOnly && (
                  <th className="text-center py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === assets.length && assets.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
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
                  Vị trí
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày mua
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá trị
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
                  {!isReadOnly && (
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => handleSelectAsset(asset.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
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
                      {!isReadOnly && (
                        <>
                          <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors" title="Bảo trì">
                            <FaTools className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Chỉnh sửa">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
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
                    {!isReadOnly && (
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => handleSelectAsset(asset.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                      />
                    )}
                    <span className="text-sm font-semibold text-blue-600">{asset.id}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {asset.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{asset.name}</h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Vị trí:</span>
                  <span className="text-xs text-gray-900 font-medium">{asset.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ngày mua:</span>
                  <span className="text-xs text-gray-900 font-medium">{asset.purchaseDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Giá trị:</span>
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
                {!isReadOnly && (
                  <>
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition-colors" title="Bảo trì">
                      <FaTools className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Chỉnh sửa">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-8 của 458 kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal thêm tài sản */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Thêm tài sản mới</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Thêm một hoặc nhiều tài sản cùng lúc
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              {/* Danh sách tài sản */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin tài sản</h3>
                  <button
                    type="button"
                    onClick={handleAddAssetRow}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <FaPlus className="w-3 h-3" />
                    Thêm tài sản khác
                  </button>
                </div>

                {assetsForm.map((asset, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Tài sản {index + 1}
                      </span>
                      {assetsForm.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAssetRow(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên tài sản <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={asset.name}
                          onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập tên tài sản"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={asset.category}
                          onChange={(e) => handleAssetChange(index, 'category', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn loại</option>
                          <option value="Máy tính">Máy tính</option>
                          <option value="Nội thất">Nội thất</option>
                          <option value="Thiết bị">Thiết bị</option>
                          <option value="Phương tiện">Phương tiện</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vị trí <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={asset.location}
                          onChange={(e) => handleAssetChange(index, 'location', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập vị trí"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày mua <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={asset.purchaseDate}
                          onChange={(e) => handleAssetChange(index, 'purchaseDate', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá trị (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={asset.purchasePrice}
                          onChange={(e) => handleAssetChange(index, 'purchasePrice', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập giá trị"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={asset.status}
                          onChange={(e) => handleAssetChange(index, 'status', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Đang sử dụng">Đang sử dụng</option>
                          <option value="Cần bảo trì">Cần bảo trì</option>
                          <option value="Hỏng">Hỏng</option>
                          <option value="Có sẵn">Có sẵn</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload phiếu bàn giao */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Phiếu bàn giao
                </h3>
                <div className="space-y-4">
                  {!transferDocument ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="transfer-document"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="transfer-document"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                          <FaFileUpload className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Tải lên phiếu bàn giao
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                          <FaUpload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transferDocument.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(transferDocument.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Lưu tài sản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FaTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Bạn có chắc chắn muốn xóa {selectedAssets.length} tài sản đã chọn?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến các tài sản này sẽ bị xóa vĩnh viễn.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal bàn giao lại */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bàn giao lại tài sản</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bàn giao lại {selectedAssets.length} tài sản đã chọn
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferFiles([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Danh sách tài sản */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách tài sản - Tình trạng
                </h3>
                <div className="overflow-x-auto">
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
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tình trạng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets
                        .filter((asset) => selectedAssets.includes(asset.id))
                        .map((asset) => (
                          <tr key={asset.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-blue-600">{asset.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-gray-900">{asset.name}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {asset.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                                {asset.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upload phiếu bàn giao */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Phiếu bàn giao (Hình ảnh/Tài liệu)
                </h3>
                <div className="space-y-4">
                  {transferFiles.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="transfer-files"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple
                        onChange={handleTransferFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="transfer-files"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                          <FaFileUpload className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Tải lên phiếu bàn giao
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi file)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transferFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              <FaUpload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTransferFile(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="transfer-files-add"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleTransferFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="transfer-files-add"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaPlus className="w-5 h-5 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            Thêm file khác
                          </p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferFiles([]);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitTransfer}
                className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaCheckCircle className="w-4 h-4" />
                Xác nhận bàn giao
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AssetSession3;


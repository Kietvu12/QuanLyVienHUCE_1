import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaTools, FaTimes, FaUpload, FaFileUpload, FaTrashAlt, FaCheckCircle, FaExchangeAlt, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { phongCuaVienAPI, phongBanAPI, taiSanAPI } from '../../services/api';
import React from 'react';

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
  
  // Tab state
  const [activeTab, setActiveTab] = useState('assets'); // 'assets' or 'rooms'
  
  // Asset states
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetsForm, setAssetsForm] = useState([
    {
      name: '',
      category: '',
      location: '',
      purchaseDate: '',
      purchasePrice: '',
      status: 'Đang sử dụng',
      id_phong: '',
      anh_phieu_nhan: null,
      anh_tai_san: null,
    },
  ]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [transferDocument, setTransferDocument] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFiles, setTransferFiles] = useState([]);
  const [searchAssetTerm, setSearchAssetTerm] = useState('');
  const [selectedAssetCategory, setSelectedAssetCategory] = useState('');
  const [selectedAssetStatus, setSelectedAssetStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  
  // Room states
  const [rooms, setRooms] = useState([]);
  const [phongBans, setPhongBans] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    id_phong_ban: '',
    ten_toa: '',
    so_tang: '',
    so_phong: '',
    dien_tich: '',
    trang_thai: 'trong',
  });
  const [showDeleteRoomConfirm, setShowDeleteRoomConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [searchRoomTerm, setSearchRoomTerm] = useState('');
  const [selectedRoomStatus, setSelectedRoomStatus] = useState('');

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
        id_phong: '',
        anh_phieu_nhan: null,
        anh_tai_san: null,
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

  const handleAssetImageChange = (index, field, file) => {
    const updated = [...assetsForm];
    updated[index][field] = file;
    setAssetsForm(updated);
  };

  const handleRemoveAssetImage = (index, field) => {
    const updated = [...assetsForm];
    updated[index][field] = null;
    setAssetsForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo từng tài sản
      for (const asset of assetsForm) {
        const assetData = {
          id_vien: user?.id_vien,
          id_phong: asset.id_phong || null,
          ten_tai_san: asset.name,
          tinh_trang: asset.status === 'Đang sử dụng' ? 'tot' : 
                     asset.status === 'Cần bảo trì' ? 'can_bao_tri' : 
                     asset.status === 'Hỏng' ? 'hong' : 'tot',
          ngay_nhan_tai_san: asset.purchaseDate || null,
        };

        const response = await taiSanAPI.create(assetData);
        const taiSanId = response.data?.id;

        // Upload media nếu có
        if (taiSanId && (asset.anh_phieu_nhan || asset.anh_tai_san)) {
          const formData = new FormData();
          if (asset.anh_phieu_nhan) {
            formData.append('anh_phieu_nhan', asset.anh_phieu_nhan);
          }
          if (asset.anh_tai_san) {
            formData.append('anh_tai_san', asset.anh_tai_san);
          }
          await taiSanAPI.uploadMedia(taiSanId, formData);
        }
      }

      // TODO: Upload transfer document nếu có
      if (transferDocument) {
        // Xử lý upload file
      }

      alert('Thêm tài sản thành công!');
      setIsModalOpen(false);
      setAssetsForm([
        {
          name: '',
          category: '',
          location: '',
          purchaseDate: '',
          purchasePrice: '',
          status: 'Đang sử dụng',
          id_phong: '',
          anh_phieu_nhan: null,
          anh_tai_san: null,
        },
      ]);
      setTransferDocument(null);
      fetchAssets(); // Refresh danh sách tài sản
    } catch (error) {
      console.error('Lỗi khi thêm tài sản:', error);
      alert('Có lỗi xảy ra khi thêm tài sản');
    }
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
          id_phong: '',
          anh_phieu_nhan: null,
          anh_tai_san: null,
        },
      ]);
      setTransferDocument(null);
  };

  // Fetch rooms when opening asset modal
  useEffect(() => {
    if (isModalOpen && user?.id_vien) {
      const fetchRoomsForAsset = async () => {
        try {
          const response = await phongCuaVienAPI.getAll({
            id_vien: user?.id_vien,
            page: 1,
            limit: 1000,
          });
          if (response.success) {
            setAvailableRooms(response.data || []);
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách phòng:', error);
        }
      };
      fetchRoomsForAsset();
    }
  }, [isModalOpen, user?.id_vien]);

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

  const confirmDelete = async () => {
    try {
      for (const assetId of selectedAssets) {
        await taiSanAPI.delete(assetId);
      }
      setSelectedAssets([]);
      setShowDeleteConfirm(false);
      fetchAssets(); // Refresh danh sách tài sản
      alert('Xóa tài sản thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa tài sản:', error);
      alert('Có lỗi xảy ra khi xóa tài sản');
    }
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

  // Room management functions
  useEffect(() => {
    if (activeTab === 'rooms' && user?.id_vien) {
      fetchRooms();
      fetchPhongBans();
    }
  }, [activeTab, user?.id_vien]);

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const params = {
        id_vien: user?.id_vien,
        page: 1,
        limit: 1000,
      };
      if (selectedRoomStatus) {
        params.trang_thai = selectedRoomStatus;
      }
      const response = await phongCuaVienAPI.getAll(params);
      if (response.success) {
        let filteredRooms = response.data || [];
        if (searchRoomTerm) {
          filteredRooms = filteredRooms.filter(room => 
            room.so_phong?.toLowerCase().includes(searchRoomTerm.toLowerCase()) ||
            room.ten_toa?.toLowerCase().includes(searchRoomTerm.toLowerCase()) ||
            room.phongBan?.ten_phong_ban?.toLowerCase().includes(searchRoomTerm.toLowerCase())
          );
        }
        setRooms(filteredRooms);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchPhongBans = async () => {
    try {
      const response = await phongBanAPI.getAll({ id_vien: user?.id_vien });
      if (response.success) {
        setPhongBans(response.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng ban:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'rooms') {
      fetchRooms();
    }
  }, [searchRoomTerm, selectedRoomStatus]);

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        id_phong_ban: room.id_phong_ban || '',
        ten_toa: room.ten_toa || '',
        so_tang: room.so_tang || '',
        so_phong: room.so_phong || '',
        dien_tich: room.dien_tich || '',
        trang_thai: room.trang_thai || 'trong',
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        id_phong_ban: '',
        ten_toa: '',
        so_tang: '',
        so_phong: '',
        dien_tich: '',
        trang_thai: 'trong',
      });
    }
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomFormData({
      id_phong_ban: '',
      ten_toa: '',
      so_tang: '',
      so_phong: '',
      dien_tich: '',
      trang_thai: 'trong',
    });
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        id_vien: user?.id_vien,
        id_phong_ban: roomFormData.id_phong_ban || null,
        ten_toa: roomFormData.ten_toa || null,
        so_tang: roomFormData.so_tang ? parseInt(roomFormData.so_tang) : null,
        so_phong: roomFormData.so_phong || null,
        dien_tich: roomFormData.dien_tich ? parseFloat(roomFormData.dien_tich) : null,
        trang_thai: roomFormData.trang_thai,
      };

      if (editingRoom) {
        await phongCuaVienAPI.update(editingRoom.id, data);
      } else {
        await phongCuaVienAPI.create(data);
      }
      
      handleCloseRoomModal();
      fetchRooms();
    } catch (error) {
      console.error('Lỗi khi lưu phòng:', error);
      alert('Có lỗi xảy ra khi lưu phòng');
    }
  };

  const handleDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteRoomConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    try {
      await phongCuaVienAPI.delete(roomToDelete.id);
      setShowDeleteRoomConfirm(false);
      setRoomToDelete(null);
      fetchRooms();
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error);
      alert('Có lỗi xảy ra khi xóa phòng');
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'trong':
        return 'bg-blue-100 text-blue-800';
      case 'dang_su_dung':
        return 'bg-emerald-100 text-emerald-800';
      case 'bao_tri':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusLabel = (status) => {
    switch (status) {
      case 'trong':
        return 'Trống';
      case 'dang_su_dung':
        return 'Đang sử dụng';
      case 'bao_tri':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  // Asset management functions
  useEffect(() => {
    if (activeTab === 'assets' && user?.id_vien) {
      fetchAssets();
    }
  }, [activeTab, user?.id_vien, pagination.page, searchAssetTerm, selectedAssetCategory, selectedAssetStatus]);

  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);
      const params = {
        id_vien: user?.id_vien,
        page: pagination.page,
        limit: pagination.limit,
      };
      if (selectedAssetStatus) {
        // Map UI status to API status
        const statusMap = {
          'Đang sử dụng': 'tot',
          'Cần bảo trì': 'can_bao_tri',
          'Hỏng': 'hong',
        };
        params.tinh_trang = statusMap[selectedAssetStatus] || selectedAssetStatus;
      }
      const response = await taiSanAPI.getAll(params);
      if (response.success) {
        let filteredAssets = response.data || [];
        
        // Client-side filtering for category and search
        if (selectedAssetCategory) {
          // Note: Category filtering might need to be done on backend if category is stored
          // For now, we'll skip category filtering as it's not in the model
        }
        if (searchAssetTerm) {
          filteredAssets = filteredAssets.filter(asset =>
            asset.ten_tai_san?.toLowerCase().includes(searchAssetTerm.toLowerCase()) ||
            asset.phong?.so_phong?.toLowerCase().includes(searchAssetTerm.toLowerCase()) ||
            asset.phong?.ten_toa?.toLowerCase().includes(searchAssetTerm.toLowerCase())
          );
        }
        
        setAssets(filteredAssets);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài sản:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const getAssetStatusLabel = (tinh_trang) => {
    switch (tinh_trang) {
      case 'tot':
        return 'Đang sử dụng';
      case 'can_bao_tri':
        return 'Cần bảo trì';
      case 'hong':
        return 'Hỏng';
      default:
        return tinh_trang;
    }
  };

  const getAssetStatusColor = (tinh_trang) => {
    switch (tinh_trang) {
      case 'tot':
        return 'bg-emerald-100 text-emerald-800';
      case 'can_bao_tri':
        return 'bg-yellow-100 text-yellow-800';
      case 'hong':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'assets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tài sản
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rooms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBuilding className="inline-block mr-2" />
              Danh sách phòng
            </button>
          </div>
        </div>

        {/* Assets Tab Content */}
        {activeTab === 'assets' && (
          <>
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

            {/* Search and filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tên tài sản, số phòng..."
                    value={searchAssetTerm}
                    onChange={(e) => setSearchAssetTerm(e.target.value)}
                    className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={selectedAssetCategory}
                onChange={(e) => setSelectedAssetCategory(e.target.value)}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả loại</option>
                <option value="computer">Máy tính</option>
                <option value="furniture">Nội thất</option>
                <option value="equipment">Thiết bị</option>
                <option value="vehicle">Phương tiện</option>
                <option value="other">Khác</option>
              </select>
              <select
                value={selectedAssetStatus}
                onChange={(e) => setSelectedAssetStatus(e.target.value)}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Cần bảo trì">Cần bảo trì</option>
                <option value="Hỏng">Hỏng</option>
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
        {loadingAssets ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : (
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
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên tài sản
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày nhận
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
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={isReadOnly ? 6 : 7} className="text-center py-8 text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
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
                        <span className="text-sm font-medium text-blue-600">TS-{asset.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">{asset.ten_tai_san}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">
                          {asset.phong ? `${asset.phong.so_phong || ''} ${asset.phong.ten_toa ? `- ${asset.phong.ten_toa}` : ''}` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{formatDate(asset.ngay_nhan_tai_san)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssetStatusColor(asset.tinh_trang)}`}>
                          {getAssetStatusLabel(asset.tinh_trang)}
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
                              <button
                                onClick={() => {
                                  setSelectedAssets([asset.id]);
                                  handleDeleteSelected();
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile/Tablet Cards */}
        {loadingAssets ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="2xl:hidden space-y-4">
            {assets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu
              </div>
            ) : (
              assets.map((asset) => (
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
                        <span className="text-sm font-semibold text-blue-600">TS-{asset.id}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssetStatusColor(asset.tinh_trang)}`}>
                          {getAssetStatusLabel(asset.tinh_trang)}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{asset.ten_tai_san}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Phòng:</span>
                      <span className="text-xs text-gray-900 font-medium">
                        {asset.phong ? `${asset.phong.so_phong || ''} ${asset.phong.ten_toa ? `- ${asset.phong.ten_toa}` : ''}` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Ngày nhận:</span>
                      <span className="text-xs text-gray-900 font-medium">{formatDate(asset.ngay_nhan_tai_san)}</span>
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
                        <button
                          onClick={() => {
                            setSelectedAssets([asset.id]);
                            handleDeleteSelected();
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loadingAssets && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
          </>
        )}

        {/* Rooms Tab Content */}
        {activeTab === 'rooms' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Danh sách phòng</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý toàn bộ phòng của Viện
                </p>
              </div>
              {!isReadOnly && (
                <button
                  onClick={() => handleOpenRoomModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  Thêm phòng
                </button>
              )}
            </div>

            {/* Search and filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm số phòng, tên tòa, phòng ban..."
                    value={searchRoomTerm}
                    onChange={(e) => setSearchRoomTerm(e.target.value)}
                    className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={selectedRoomStatus}
                onChange={(e) => setSelectedRoomStatus(e.target.value)}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="trong">Trống</option>
                <option value="dang_su_dung">Đang sử dụng</option>
                <option value="bao_tri">Bảo trì</option>
              </select>
            </div>

            {/* Rooms Table - Desktop */}
            {loadingRooms ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto hidden 2xl:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Số phòng
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tên tòa
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tầng
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Phòng ban
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Diện tích (m²)
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
                      {rooms.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8 text-gray-500">
                            Không có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        rooms.map((room) => (
                          <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="text-sm font-medium text-blue-600">{room.so_phong || '-'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-900">{room.ten_toa || '-'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">{room.so_tang || '-'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">{room.phongBan?.ten_phong_ban || '-'}</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm text-gray-700">{room.dien_tich ? `${room.dien_tich}` : '-'}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomStatusColor(room.trang_thai)}`}>
                                {getRoomStatusLabel(room.trang_thai)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenRoomModal(room)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                {!isReadOnly && (
                                  <button
                                    onClick={() => handleDeleteRoom(room)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Xóa"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Rooms Cards - Mobile/Tablet */}
                <div className="2xl:hidden space-y-4">
                  {rooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Không có dữ liệu
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-blue-600">{room.so_phong || '-'}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomStatusColor(room.trang_thai)}`}>
                                {getRoomStatusLabel(room.trang_thai)}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">{room.ten_toa || 'Chưa có tên tòa'}</h4>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Tầng:</span>
                            <span className="text-xs text-gray-900 font-medium">{room.so_tang || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Phòng ban:</span>
                            <span className="text-xs text-gray-900 font-medium">{room.phongBan?.ten_phong_ban || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Diện tích:</span>
                            <span className="text-xs text-gray-900 font-medium">{room.dien_tich ? `${room.dien_tich} m²` : '-'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleOpenRoomModal(room)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <button
                              onClick={() => handleDeleteRoom(room)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
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
                          Phòng
                        </label>
                        <select
                          value={asset.id_phong}
                          onChange={(e) => handleAssetChange(index, 'id_phong', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn phòng (tùy chọn)</option>
                          {availableRooms.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.so_phong ? `${room.so_phong}` : ''} {room.ten_toa ? `- ${room.ten_toa}` : ''} {room.so_tang ? `(Tầng ${room.so_tang})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vị trí
                        </label>
                        <input
                          type="text"
                          value={asset.location}
                          onChange={(e) => handleAssetChange(index, 'location', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập vị trí (nếu không chọn phòng)"
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

                    {/* Upload ảnh */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ảnh phiếu nhận */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ảnh phiếu nhận
                        </label>
                        {!asset.anh_phieu_nhan ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              id={`anh-phieu-nhan-${index}`}
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleAssetImageChange(index, 'anh_phieu_nhan', e.target.files[0] || null)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`anh-phieu-nhan-${index}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <FaFileUpload className="w-5 h-5 text-blue-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                Tải lên ảnh phiếu nhận
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG, PDF (tối đa 10MB)
                              </p>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                                <FaUpload className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900">
                                  {asset.anh_phieu_nhan.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(asset.anh_phieu_nhan.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAssetImage(index, 'anh_phieu_nhan')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <FaTrashAlt className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Ảnh tài sản ban đầu */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ảnh tài sản ban đầu
                        </label>
                        {!asset.anh_tai_san ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              id={`anh-tai-san-${index}`}
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleAssetImageChange(index, 'anh_tai_san', e.target.files[0] || null)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`anh-tai-san-${index}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <FaFileUpload className="w-5 h-5 text-blue-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                Tải lên ảnh tài sản
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG, PDF (tối đa 10MB)
                              </p>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                                <FaUpload className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900">
                                  {asset.anh_tai_san.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(asset.anh_tai_san.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAssetImage(index, 'anh_tai_san')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <FaTrashAlt className="w-3 h-3" />
                            </button>
                          </div>
                        )}
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

      {/* Modal thêm/sửa phòng */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingRoom ? 'Cập nhật thông tin phòng' : 'Thêm phòng mới vào Viện'}
                </p>
              </div>
              <button
                onClick={handleCloseRoomModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleRoomSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phòng ban
                    </label>
                    <select
                      value={roomFormData.id_phong_ban}
                      onChange={(e) => setRoomFormData({ ...roomFormData, id_phong_ban: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn phòng ban (tùy chọn)</option>
                      {phongBans.map((pb) => (
                        <option key={pb.id} value={pb.id}>
                          {pb.ten_phong_ban}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên tòa
                    </label>
                    <input
                      type="text"
                      value={roomFormData.ten_toa}
                      onChange={(e) => setRoomFormData({ ...roomFormData, ten_toa: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên tòa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tầng
                    </label>
                    <input
                      type="number"
                      value={roomFormData.so_tang}
                      onChange={(e) => setRoomFormData({ ...roomFormData, so_tang: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số tầng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={roomFormData.so_phong}
                      onChange={(e) => setRoomFormData({ ...roomFormData, so_phong: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số phòng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diện tích (m²)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={roomFormData.dien_tich}
                      onChange={(e) => setRoomFormData({ ...roomFormData, dien_tich: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập diện tích"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={roomFormData.trang_thai}
                      onChange={(e) => setRoomFormData({ ...roomFormData, trang_thai: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="trong">Trống</option>
                      <option value="dang_su_dung">Đang sử dụng</option>
                      <option value="bao_tri">Bảo trì</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleCloseRoomModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  {editingRoom ? 'Cập nhật' : 'Thêm phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa phòng */}
      {showDeleteRoomConfirm && roomToDelete && (
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
                    Bạn có chắc chắn muốn xóa phòng này?
                  </p>
                </div>
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Số phòng:</span> {roomToDelete.so_phong || '-'}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Tên tòa:</span> {roomToDelete.ten_toa || '-'}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến phòng này sẽ bị xóa vĩnh viễn.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteRoomConfirm(false);
                    setRoomToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteRoom}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AssetSession3;


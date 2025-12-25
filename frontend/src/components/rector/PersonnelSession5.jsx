import { FaCar, FaUser, FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle, FaTimesCircle, FaTools, FaImage, FaTimes } from 'react-icons/fa';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { xeStatisticsAPI, thongTinXeAPI, nhanSuAPI, mediaNhanSuAPI } from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatChange = (value) => {
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `${value}`;
};

const getChangeColor = (value) => {
  if (value > 0) return 'text-emerald-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PersonnelSession5 = () => {
  const { user } = useAuth();
  const [vehicleStats, setVehicleStats] = useState({
    tong_so_xe: 0,
    xe_da_dang_ky: 0,
    xe_chua_dang_ky: 0,
    dang_bao_tri: 0,
    change: {
      tong_so_xe: 0,
      xe_da_dang_ky: 0,
      xe_chua_dang_ky: 0,
      dang_bao_tri: 0
    }
  });
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showXeModal, setShowXeModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedNhanSuId, setSelectedNhanSuId] = useState(null);
  const [nhanSuList, setNhanSuList] = useState([]);
  const [loadingNhanSu, setLoadingNhanSu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nhanSuSearchTerm, setNhanSuSearchTerm] = useState('');
  const [nhanSuSuggestions, setNhanSuSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedNhanSu, setSelectedNhanSu] = useState(null);
  const [xeImages, setXeImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const autocompleteRef = useRef(null);
  const [xeFormData, setXeFormData] = useState({
    id_nhan_su: '',
    ten_xe: '',
    loai_xe: '',
    bien_so_xe: '',
    so_dang_ki_xe: '',
    ngay_het_han: ''
  });

  useEffect(() => {
    fetchStatistics();
    fetchVehicles();
  }, [user?.id_vien, pagination.page, searchTerm]);

  useEffect(() => {
    if (showXeModal && user?.id_vien) {
      fetchNhanSuList();
    }
  }, [showXeModal, user?.id_vien]);

  useEffect(() => {
    // Filter suggestions based on search term
    if (nhanSuSearchTerm.trim() === '') {
      setNhanSuSuggestions(nhanSuList.slice(0, 10)); // Show first 10 when empty
    } else {
      const searchLower = nhanSuSearchTerm.toLowerCase();
      const filtered = nhanSuList.filter(ns => 
        ns.ho_ten?.toLowerCase().includes(searchLower) ||
        ns.chuc_vu?.toLowerCase().includes(searchLower) ||
        ns.phongBan?.ten_phong_ban?.toLowerCase().includes(searchLower) ||
        ns.email?.toLowerCase().includes(searchLower) ||
        ns.so_dien_thoai?.includes(searchLower)
      ).slice(0, 10);
      setNhanSuSuggestions(filtered);
    }
  }, [nhanSuSearchTerm, nhanSuList]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchStatistics = async () => {
    try {
      const params = { id_vien: user?.id_vien };
      const response = await xeStatisticsAPI.getStatistics(params);
      if (response.success) {
        setVehicleStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching vehicle statistics:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        id_vien: user?.id_vien
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await thongTinXeAPI.getAll(params);
      if (response.success) {
        const vehicles = (response.data || []).map(xe => {
          const nhanSu = xe.nhanSu;
          const hasBienSo = xe.bien_so_xe && xe.bien_so_xe.trim() !== '';
          return {
            id: xe.id,
            licensePlate: xe.bien_so_xe || 'Chưa có',
            brand: xe.ten_xe || '-',
            model: xe.loai_xe || '-',
            year: xe.ngay_het_han ? new Date(xe.ngay_het_han).getFullYear() : '-',
            color: '-',
            employeeId: nhanSu?.id ? `NV-${nhanSu.id}` : null,
            employeeName: nhanSu?.ho_ten || null,
            employeePosition: nhanSu?.chuc_vu || null,
            department: nhanSu?.phongBan?.ten_phong_ban || null,
            registeredDate: xe.so_dang_ki_xe ? formatDate(xe.so_dang_ki_xe) : null,
            status: hasBienSo ? 'Đang sử dụng' : 'Chưa đăng ký',
            statusColor: hasBienSo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800',
            mileage: '-',
            insuranceExpiry: xe.ngay_het_han ? formatDate(xe.ngay_het_han) : '-',
            rawData: xe // Lưu dữ liệu gốc để edit
          };
        });
        setVehicleList(vehicles);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNhanSuList = async () => {
    try {
      setLoadingNhanSu(true);
      const response = await nhanSuAPI.getAll({ 
        id_vien: user?.id_vien, 
        limit: 1000 
      });
      if (response.success) {
        setNhanSuList(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching nhan su list:', err);
    } finally {
      setLoadingNhanSu(false);
    }
  };

  const handleSelectNhanSu = (nhanSu) => {
    setSelectedNhanSu(nhanSu);
    setXeFormData({ ...xeFormData, id_nhan_su: nhanSu.id });
    setNhanSuSearchTerm(nhanSu.ho_ten || '');
    setShowSuggestions(false);
  };

  const handleClearNhanSu = () => {
    setSelectedNhanSu(null);
    setXeFormData({ ...xeFormData, id_nhan_su: '' });
    setNhanSuSearchTerm('');
    setShowSuggestions(false);
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const idNhanSu = selectedNhanSu?.id || xeFormData.id_nhan_su;
    if (!idNhanSu) {
      alert('Vui lòng chọn nhân sự trước khi upload ảnh');
      event.target.value = '';
      return;
    }

    try {
      setUploadingImages(true);
      const response = await mediaNhanSuAPI.uploadFile(idNhanSu, 'anh_xe', files);
      if (response.success) {
        // Get updated images
        const images = response.data.anh_xe;
        if (Array.isArray(images)) {
          setXeImages(images);
        } else if (images) {
          setXeImages([images]);
        }
        alert(`Upload ${files.length} ảnh thành công`);
      } else {
        alert(response.message || 'Lỗi khi upload ảnh');
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      alert(err.message || 'Lỗi khi upload ảnh');
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = async (imagePath) => {
    const idNhanSu = selectedNhanSu?.id || xeFormData.id_nhan_su;
    if (!idNhanSu) return;
    
    try {
      // Get current media
      const mediaResponse = await mediaNhanSuAPI.getByNhanSuId(idNhanSu);
      if (mediaResponse.success && mediaResponse.data) {
        let currentImages = mediaResponse.data.anh_xe || [];
        if (typeof currentImages === 'string') {
          try {
            currentImages = JSON.parse(currentImages);
          } catch (e) {
            currentImages = [currentImages];
          }
        }
        if (!Array.isArray(currentImages)) {
          currentImages = [currentImages];
        }

        // Remove the image
        const updatedImages = currentImages.filter(img => img !== imagePath);
        
        // Update media
        const updateData = {
          anh_xe: updatedImages.length === 0 ? null : (updatedImages.length === 1 ? updatedImages[0] : JSON.stringify(updatedImages))
        };
        
        const updateResponse = await mediaNhanSuAPI.upsert(idNhanSu, updateData);
        if (updateResponse.success) {
          setXeImages(updatedImages);
        } else {
          alert('Lỗi khi xóa ảnh');
        }
      }
    } catch (err) {
      console.error('Error removing image:', err);
      alert('Lỗi khi xóa ảnh');
    }
  };

  const handleOpenXeModal = async (vehicle = null, nhanSuId = null) => {
    if (vehicle) {
      // Chỉnh sửa xe hiện có
      setSelectedVehicle(vehicle);
      const idNhanSu = vehicle.rawData?.id_nhan_su || '';
      setXeFormData({
        id_nhan_su: idNhanSu,
        ten_xe: vehicle.rawData?.ten_xe || '',
        loai_xe: vehicle.rawData?.loai_xe || '',
        bien_so_xe: vehicle.rawData?.bien_so_xe || '',
        so_dang_ki_xe: vehicle.rawData?.so_dang_ki_xe || '',
        ngay_het_han: vehicle.rawData?.ngay_het_han ? vehicle.rawData.ngay_het_han.split('T')[0] : ''
      });
      
      // Load selected nhan su
      if (idNhanSu) {
        const nhanSu = nhanSuList.find(ns => ns.id === parseInt(idNhanSu));
        if (nhanSu) {
          setSelectedNhanSu(nhanSu);
          setNhanSuSearchTerm(nhanSu.ho_ten || '');
        }
      }

      // Load existing images
      if (idNhanSu) {
        try {
          const mediaResponse = await mediaNhanSuAPI.getByNhanSuId(idNhanSu);
          if (mediaResponse.success && mediaResponse.data) {
            let images = mediaResponse.data.anh_xe || [];
            if (typeof images === 'string') {
              try {
                images = JSON.parse(images);
              } catch (e) {
                images = [images];
              }
            }
            if (!Array.isArray(images)) {
              images = [images];
            }
            setXeImages(images.filter(Boolean));
          }
        } catch (err) {
          console.error('Error loading images:', err);
        }
      }
    } else {
      // Đăng ký xe mới
      setSelectedVehicle(null);
      setSelectedNhanSu(null);
      setNhanSuSearchTerm('');
      setXeImages([]);
      setXeFormData({
        id_nhan_su: nhanSuId || '',
        ten_xe: '',
        loai_xe: '',
        bien_so_xe: '',
        so_dang_ki_xe: '',
        ngay_het_han: ''
      });
    }
    setShowXeModal(true);
  };

  const handleCloseXeModal = () => {
    setShowXeModal(false);
    setSelectedVehicle(null);
    setSelectedNhanSu(null);
    setNhanSuSearchTerm('');
    setXeImages([]);
    setShowSuggestions(false);
    setXeFormData({
      id_nhan_su: '',
      ten_xe: '',
      loai_xe: '',
      bien_so_xe: '',
      so_dang_ki_xe: '',
      ngay_het_han: ''
    });
  };

  const handleSubmitXe = async (e) => {
    e.preventDefault();
    if (!selectedNhanSu && !xeFormData.id_nhan_su) {
      alert('Vui lòng chọn nhân sự');
      return;
    }
    
    // Ensure id_nhan_su is set from selectedNhanSu if available
    const idNhanSu = selectedNhanSu?.id || xeFormData.id_nhan_su;
    if (!idNhanSu) {
      alert('Vui lòng chọn nhân sự');
      return;
    }
    try {
      setSubmitting(true);
      const submitData = {
        id_nhan_su: parseInt(idNhanSu),
        ten_xe: xeFormData.ten_xe || null,
        loai_xe: xeFormData.loai_xe || null,
        bien_so_xe: xeFormData.bien_so_xe || null,
        so_dang_ki_xe: xeFormData.so_dang_ki_xe || null,
        ngay_het_han: xeFormData.ngay_het_han || null
      };
      
      let response;
      if (selectedVehicle) {
        // Cập nhật xe
        response = await thongTinXeAPI.update(selectedVehicle.id, submitData);
      } else {
        // Tạo xe mới
        response = await thongTinXeAPI.create(submitData);
      }
      
      if (response.success) {
        handleCloseXeModal();
        fetchVehicles();
        fetchStatistics();
      } else {
        alert(response.message || (selectedVehicle ? 'Lỗi khi cập nhật thông tin xe' : 'Lỗi khi đăng ký xe'));
      }
    } catch (err) {
      alert(err.message || (selectedVehicle ? 'Lỗi khi cập nhật thông tin xe' : 'Lỗi khi đăng ký xe'));
    } finally {
      setSubmitting(false);
    }
  };

  const vehicleSummaryCards = [
    {
      label: 'Tổng số xe',
      value: vehicleStats.tong_so_xe.toString(),
      change: formatChange(vehicleStats.change.tong_so_xe),
      changeColor: getChangeColor(vehicleStats.change.tong_so_xe),
      icon: FaCar,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Xe đã đăng ký',
      value: vehicleStats.xe_da_dang_ky.toString(),
      change: formatChange(vehicleStats.change.xe_da_dang_ky),
      changeColor: getChangeColor(vehicleStats.change.xe_da_dang_ky),
      icon: FaUser,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Xe chưa đăng ký',
      value: vehicleStats.xe_chua_dang_ky.toString(),
      change: formatChange(vehicleStats.change.xe_chua_dang_ky),
      changeColor: getChangeColor(vehicleStats.change.xe_chua_dang_ky),
      icon: FaCar,
      iconBg: 'bg-gray-500',
    },
    {
      label: 'Đang bảo trì',
      value: vehicleStats.dang_bao_tri.toString(),
      change: formatChange(vehicleStats.change.dang_bao_tri),
      changeColor: getChangeColor(vehicleStats.change.dang_bao_tri),
      icon: FaTools,
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <section className="px-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {vehicleSummaryCards.map((card) => {
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
        })}
      </div>

      {/* Tabla de gestión de xe */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quản lý xe của nhân viên</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách xe thuộc sở hữu của nhân viên
            </p>
          </div>
          <button 
            onClick={() => handleOpenXeModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
          >
            <FaPlus className="w-4 h-4" />
            Đăng ký xe mới
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm biển số, nhãn hiệu, nhân viên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="using">Đang sử dụng</option>
            <option value="maintenance">Đang bảo trì</option>
            <option value="unregistered">Chưa đăng ký</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả phòng ban</option>
            <option value="it">Công nghệ thông tin</option>
            <option value="construction">Xây dựng</option>
            <option value="engineering">Kỹ thuật</option>
            <option value="admin">Hành chính</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thông tin xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số km
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hết hạn BH
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : vehicleList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">Không có xe nào</td>
                </tr>
              ) : (
                vehicleList.map((vehicle) => {
                  const employeeInitials = vehicle.employeeName
                    ? getInitials(vehicle.employeeName)
                    : null;

                return (
                  <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-blue-600">{vehicle.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          <FaCar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                          </div>
                          <div className="text-xs text-gray-500">
                            Màu: {vehicle.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {vehicle.employeeName ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                            {employeeInitials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {vehicle.employeeName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {vehicle.employeePosition}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vehicle.department}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {vehicle.employeeId}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Chưa đăng ký</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {vehicle.registeredDate ? (
                        <span className="text-sm text-gray-700">{vehicle.registeredDate}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.mileage}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.insuranceExpiry}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.statusColor}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                          <FaEye className="w-4 h-4" />
                        </button>
                        {vehicle.employeeName ? (
                          <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Xóa đăng ký">
                            <FaTimesCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenXeModal(vehicle);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                            title="Đăng ký xe"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenXeModal(vehicle);
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : vehicleList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có xe nào</div>
          ) : (
            vehicleList.map((vehicle) => {
              const employeeInitials = vehicle.employeeName
                ? getInitials(vehicle.employeeName)
                : null;

            return (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <FaCar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-600">{vehicle.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.statusColor}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{vehicle.licensePlate}</h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                    <p className="text-xs text-gray-500">Màu: {vehicle.color}</p>
                  </div>
                </div>

                {vehicle.employeeName ? (
                  <div className="flex items-start gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {employeeInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{vehicle.employeeName}</p>
                      <p className="text-xs text-gray-600 mb-1">{vehicle.employeePosition}</p>
                      <p className="text-xs text-gray-500 mb-1">{vehicle.department}</p>
                      <p className="text-xs text-blue-600">{vehicle.employeeId}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-400 italic">Chưa đăng ký</p>
                  </div>
                )}

                <div className="space-y-2 mb-3">
                  {vehicle.registeredDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Ngày đăng ký:</span>
                      <span className="text-xs text-gray-900 font-medium">{vehicle.registeredDate}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Số km:</span>
                    <span className="text-xs text-gray-900 font-medium">{vehicle.mileage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Hết hạn BH:</span>
                    <span className="text-xs text-gray-900 font-medium">{vehicle.insuranceExpiry}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <FaEye className="w-4 h-4" />
                  </button>
                  {vehicle.employeeName ? (
                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Xóa đăng ký">
                      <FaTimesCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenXeModal(vehicle)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                      title="Đăng ký xe"
                    >
                      <FaCheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenXeModal(vehicle)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
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
                const pageNum = pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
                if (pageNum > pagination.totalPages) return null;
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
      </div>

      {/* Modal đăng ký/chỉnh sửa xe */}
      {showXeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedVehicle ? 'Chỉnh sửa thông tin xe' : 'Đăng ký xe mới'}
            </h3>
            <form onSubmit={handleSubmitXe} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative" ref={autocompleteRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nhanSuSearchTerm}
                      onChange={(e) => {
                        setNhanSuSearchTerm(e.target.value);
                        setShowSuggestions(true);
                        if (!e.target.value) {
                          handleClearNhanSu();
                        }
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Nhập tên nhân sự để tìm kiếm..."
                      required
                      disabled={loadingNhanSu || !!selectedVehicle}
                      className="w-full h-9 px-3 pr-8 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {selectedNhanSu && !selectedVehicle && (
                      <button
                        type="button"
                        onClick={handleClearNhanSu}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                    {loadingNhanSu && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions dropdown */}
                  {showSuggestions && nhanSuSuggestions.length > 0 && !selectedVehicle && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {nhanSuSuggestions.map((ns) => (
                        <div
                          key={ns.id}
                          onClick={() => handleSelectNhanSu(ns)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900">{ns.ho_ten}</div>
                          <div className="text-xs text-gray-500">
                            {ns.chuc_vu && `${ns.chuc_vu}`}
                            {ns.chuc_vu && ns.phongBan?.ten_phong_ban && ' • '}
                            {ns.phongBan?.ten_phong_ban}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showSuggestions && nhanSuSearchTerm && nhanSuSuggestions.length === 0 && !loadingNhanSu && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-500 text-center">
                      Không tìm thấy nhân sự
                    </div>
                  )}
                  {loadingNhanSu && (
                    <p className="text-xs text-gray-500 mt-1">Đang tải danh sách nhân sự...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên xe
                  </label>
                  <input
                    type="text"
                    value={xeFormData.ten_xe}
                    onChange={(e) => setXeFormData({ ...xeFormData, ten_xe: e.target.value })}
                    placeholder="Ví dụ: Honda Wave"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xe
                  </label>
                  <input
                    type="text"
                    value={xeFormData.loai_xe}
                    onChange={(e) => setXeFormData({ ...xeFormData, loai_xe: e.target.value })}
                    placeholder="Ví dụ: Xe máy, Ô tô"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biển số xe
                  </label>
                  <input
                    type="text"
                    value={xeFormData.bien_so_xe}
                    onChange={(e) => setXeFormData({ ...xeFormData, bien_so_xe: e.target.value })}
                    placeholder="Ví dụ: 30A-12345"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số đăng ký xe
                  </label>
                  <input
                    type="text"
                    value={xeFormData.so_dang_ki_xe}
                    onChange={(e) => setXeFormData({ ...xeFormData, so_dang_ki_xe: e.target.value })}
                    placeholder="Số đăng ký"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    value={xeFormData.ngay_het_han}
                    onChange={(e) => setXeFormData({ ...xeFormData, ngay_het_han: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Upload ảnh xe */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh xe
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                        <FaImage className="w-4 h-4" />
                        {uploadingImages ? 'Đang upload...' : 'Chọn ảnh'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          disabled={uploadingImages || (!selectedNhanSu && !xeFormData.id_nhan_su)}
                          className="hidden"
                        />
                      </label>
                      {!selectedNhanSu && !xeFormData.id_nhan_su && (
                        <span className="text-xs text-gray-500">Vui lòng chọn nhân sự trước</span>
                      )}
                    </div>

                    {/* Display uploaded images */}
                    {xeImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {xeImages.map((imagePath, index) => {
                          const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
                          const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseURL}${imagePath}`;
                          
                          return (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Xe ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                onError={(e) => {
                                  console.error('Error loading image:', imageUrl);
                                  e.target.src = 'https://via.placeholder.com/150?text=Error';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imagePath)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Xóa ảnh"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseXeModal}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? (selectedVehicle ? 'Đang cập nhật...' : 'Đang đăng ký...') 
                    : (selectedVehicle ? 'Cập nhật' : 'Đăng ký')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonnelSession5;


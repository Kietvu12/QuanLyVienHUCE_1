import { FaSearch, FaDownload, FaPlus, FaTimes, FaEdit, FaFile, FaUpload, FaTrash } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chiPhiAPI, deTaiNghienCuuAPI, nghiaVuNopAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value) || 0) + ' đ';
  }
  return '0 đ';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const RevenueSession4 = () => {
  const { user } = useAuth();
  const [chiData, setChiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Modal tạo chi state
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('normal'); // 'normal' hoặc 'debt'
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tieu_de: '',
    noi_dung: '',
    so_tien: '',
    id_de_tai: '',
    trang_thai: 'chua_tat_toan',
    ngay_tat_toan: ''
  });
  const [availableProjects, setAvailableProjects] = useState([]);
  
  // State cho tab thanh toán công nợ
  const [debtFormData, setDebtFormData] = useState({
    id_nghia_vu: '',
    so_tien_thanh_toan: ''
  });
  const [availableNghiaVuNop, setAvailableNghiaVuNop] = useState([]);

  // Inline edit status state
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusValue, setEditingStatusValue] = useState('');

  // Modal chỉnh sửa state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tieu_de: '',
    noi_dung: '',
    so_tien: '',
    id_de_tai: '',
    trang_thai: 'chua_tat_toan',
    ngay_tat_toan: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    fetchChiData();
    if (showModal) {
      fetchAvailableProjects();
      if (activeTab === 'debt') {
        fetchAvailableNghiaVuNop();
      }
    }
  }, [user?.id_vien, pagination.page, searchTerm, selectedCategory, selectedStatus, showModal, activeTab]);

  const fetchAvailableProjects = async () => {
    try {
      const response = await deTaiNghienCuuAPI.getAll({
        id_vien: user?.id_vien,
        limit: 100
      });
      if (response.success) {
        setAvailableProjects(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchAvailableNghiaVuNop = async () => {
    try {
      const response = await nghiaVuNopAPI.getAll({
        id_vien: user?.id_vien,
        trang_thai: 'chua_nop',
        limit: 100
      });
      if (response.success) {
        setAvailableNghiaVuNop(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching nghia vu nop:', err);
    }
  };

  const fetchChiData = async () => {
    try {
      setLoading(true);
      const params = {
        id_vien: user?.id_vien,
        page: pagination.page,
        limit: pagination.limit
      };
      if (selectedStatus) {
        params.trang_thai = selectedStatus === 'Đã thanh toán' ? 'da_tat_toan' : 'chua_tat_toan';
      }
      if (searchTerm) {
        // Có thể thêm search nếu backend hỗ trợ
      }

      const response = await chiPhiAPI.getAll(params);
      if (response.success) {
        const mappedData = (response.data || []).map(item => {
          // Map trạng thái
          let statusText = 'Chờ thanh toán';
          if (item.trang_thai === 'da_tat_toan') {
            statusText = 'Đã thanh toán';
          } else if (item.trang_thai === 'huy') {
            statusText = 'Hủy';
          }

          // Xác định danh mục dựa trên id_de_tai và tieu_de
          let category = 'Khác';
          if (item.id_de_tai) {
            category = 'Đề tài';
          } else if (item.tieu_de?.toLowerCase().includes('nhân sự') || item.tieu_de?.toLowerCase().includes('lương')) {
            category = 'Nhân sự';
          } else if (item.tieu_de?.toLowerCase().includes('thiết bị') || item.tieu_de?.toLowerCase().includes('mua')) {
            category = 'Thiết bị';
          } else if (item.tieu_de?.toLowerCase().includes('vận hành') || item.tieu_de?.toLowerCase().includes('điện') || item.tieu_de?.toLowerCase().includes('nước')) {
            category = 'Chi phí vận hành';
          } else if (item.tieu_de?.toLowerCase().includes('marketing')) {
            category = 'Marketing';
          }

          return {
            id: item.id,
            date: item.ngay_tat_toan ? formatDate(item.ngay_tat_toan) : formatDate(item.ngay_tao),
            description: item.tieu_de,
            category: category,
            amount: parseFloat(item.so_tien),
            status: statusText,
            statusCode: item.trang_thai,
            rawData: item
          };
        });

        // Filter by category nếu có
        let filteredData = mappedData;
        if (selectedCategory) {
          filteredData = mappedData.filter(item => item.category === selectedCategory);
        }
        if (searchTerm) {
          filteredData = filteredData.filter(item => 
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setChiData(filteredData);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching expense data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setActiveTab('normal');
    setFormData({
      tieu_de: '',
      noi_dung: '',
      so_tien: '',
      id_de_tai: '',
      trang_thai: 'chua_tat_toan',
      ngay_tat_toan: ''
    });
    setDebtFormData({
      id_nghia_vu: '',
      so_tien_thanh_toan: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTab('normal');
    setFormData({
      tieu_de: '',
      noi_dung: '',
      so_tien: '',
      id_de_tai: '',
      trang_thai: 'chua_tat_toan',
      ngay_tat_toan: ''
    });
    setDebtFormData({
      id_nghia_vu: '',
      so_tien_thanh_toan: ''
    });
  };

  const handleProjectChange = (projectId) => {
    const project = availableProjects.find(p => p.id === parseInt(projectId));
    if (project) {
      setFormData({
        ...formData,
        id_de_tai: projectId,
        tieu_de: `Chi phí thanh toán cho đề tài ${project.ten_de_tai}`
      });
    } else {
      setFormData({
        ...formData,
        id_de_tai: '',
        tieu_de: formData.tieu_de.replace(/^Chi phí thanh toán cho đề tài\s+/, '')
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tieu_de || !formData.so_tien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        id_vien: user?.id_vien,
        tieu_de: formData.tieu_de,
        noi_dung: formData.noi_dung || null,
        so_tien: parseFloat(formData.so_tien.replace(/[^\d]/g, '')),
        id_de_tai: formData.id_de_tai ? parseInt(formData.id_de_tai) : null,
        trang_thai: formData.trang_thai,
        ngay_tat_toan: formData.ngay_tat_toan || null
      };

      const response = await chiPhiAPI.create(data);
      if (response.success) {
        alert('Tạo chi phí thành công!');
        handleCloseModal();
        fetchChiData();
        // Dispatch event để RevenueSession1 và RevenueSession2 tự động refresh
        window.dispatchEvent(new Event('expenseUpdated'));
      } else {
        alert(response.message || 'Lỗi khi tạo chi phí');
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      alert(err.message || 'Lỗi khi tạo chi phí');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDebtSubmit = async (e) => {
    e.preventDefault();
    if (!debtFormData.id_nghia_vu || !debtFormData.so_tien_thanh_toan) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const soTien = parseFloat(debtFormData.so_tien_thanh_toan.replace(/[^\d]/g, ''));
    if (soTien <= 0) {
      alert('Số tiền thanh toán phải lớn hơn 0');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        id_nghia_vu: parseInt(debtFormData.id_nghia_vu),
        so_tien_thanh_toan: soTien,
        id_vien: user?.id_vien
      };

      const response = await nghiaVuNopAPI.thanhToanCongNo(data);
      if (response.success) {
        alert('Thanh toán công nợ thành công!');
        handleCloseModal();
        fetchChiData();
        // Dispatch event để RevenueSession1 và RevenueSession2 tự động refresh
        window.dispatchEvent(new Event('expenseUpdated'));
      } else {
        alert(response.message || 'Lỗi khi thanh toán công nợ');
      }
    } catch (err) {
      console.error('Error paying debt:', err);
      alert(err.message || 'Lỗi khi thanh toán công nợ');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý cập nhật trạng thái inline
  const handleStartEditStatus = (item) => {
    setEditingStatusId(item.id);
    setEditingStatusValue(item.statusCode);
  };

  const handleCancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatusValue('');
  };

  const handleSaveStatus = async (itemId, newStatus) => {
    try {
      const item = chiData.find(i => i.id === itemId);
      if (!item) return;

      const updateData = {
        trang_thai: newStatus
      };

      // Nếu cập nhật thành "đã tất toán" và chưa có ngày tất toán, tự động set ngày hiện tại
      if (newStatus === 'da_tat_toan' && !item.rawData?.ngay_tat_toan) {
        const today = new Date();
        updateData.ngay_tat_toan = today.toISOString().split('T')[0];
      }

      const response = await chiPhiAPI.update(itemId, updateData);

      if (response.success) {
        setEditingStatusId(null);
        setEditingStatusValue('');
        fetchChiData();
        // Dispatch event để RevenueSession1 và RevenueSession2 tự động refresh
        window.dispatchEvent(new Event('expenseUpdated'));
      } else {
        alert(response.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'da_tat_toan') {
      return 'bg-emerald-100 text-emerald-800';
    } else if (status === 'huy') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status) => {
    if (status === 'da_tat_toan') return 'Đã thanh toán';
    if (status === 'huy') return 'Hủy';
    return 'Chờ thanh toán';
  };

  // Xử lý mở modal chỉnh sửa
  const handleOpenEditModal = async (item) => {
    try {
      const response = await chiPhiAPI.getById(item.id);
      if (response.success) {
        const chiPhi = response.data;
        setEditingItem(chiPhi);
        setEditFormData({
          tieu_de: chiPhi.tieu_de || '',
          noi_dung: chiPhi.noi_dung || '',
          so_tien: chiPhi.so_tien ? chiPhi.so_tien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
          id_de_tai: chiPhi.id_de_tai || '',
          trang_thai: chiPhi.trang_thai || 'chua_tat_toan',
          ngay_tat_toan: chiPhi.ngay_tat_toan ? chiPhi.ngay_tat_toan.split('T')[0] : ''
        });
        setMediaFiles(chiPhi.mediaChiPhis || []);
        setUploadedFiles([]);
        setShowEditModal(true);
        fetchAvailableProjects();
      } else {
        alert(response.message || 'Lỗi khi tải thông tin chi phí');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tải thông tin chi phí');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditFormData({
      tieu_de: '',
      noi_dung: '',
      so_tien: '',
      id_de_tai: '',
      trang_thai: 'chua_tat_toan',
      ngay_tat_toan: ''
    });
    setMediaFiles([]);
    setUploadedFiles([]);
  };

  const handleEditProjectChange = (projectId) => {
    const project = availableProjects.find(p => p.id === parseInt(projectId));
    if (project) {
      setEditFormData({
        ...editFormData,
        id_de_tai: projectId,
        tieu_de: `Chi phí thanh toán cho đề tài ${project.ten_de_tai}`
      });
    } else {
      setEditFormData({
        ...editFormData,
        id_de_tai: '',
        tieu_de: editFormData.tieu_de.replace(/^Chi phí thanh toán cho đề tài\s+/, '')
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveMediaFile = async (mediaId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa file này?')) return;
    try {
      const response = await chiPhiAPI.removeMedia(editingItem.id, mediaId);
      if (response.success) {
        setMediaFiles(prev => prev.filter(m => m.id !== mediaId));
      } else {
        alert(response.message || 'Lỗi khi xóa file');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa file');
    }
  };

  const getFileUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const backendBaseUrl = API_BASE_URL.replace('/api', '');
    if (path.startsWith('/uploads')) {
      return `${backendBaseUrl}${path}`;
    }
    return `${backendBaseUrl}/uploads${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.tieu_de || !editFormData.so_tien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setEditSubmitting(true);
      
      // Cập nhật thông tin chi phí
      const data = {
        tieu_de: editFormData.tieu_de,
        noi_dung: editFormData.noi_dung || null,
        so_tien: parseFloat(editFormData.so_tien.replace(/[^\d]/g, '')),
        id_de_tai: editFormData.id_de_tai ? parseInt(editFormData.id_de_tai) : null,
        trang_thai: editFormData.trang_thai,
        ngay_tat_toan: editFormData.ngay_tat_toan || null
      };

      const response = await chiPhiAPI.update(editingItem.id, data);
      if (!response.success) {
        alert(response.message || 'Lỗi khi cập nhật chi phí');
        return;
      }

      // Upload files nếu có
      if (uploadedFiles.length > 0) {
        try {
          await chiPhiAPI.uploadMedia(editingItem.id, uploadedFiles);
        } catch (uploadErr) {
          console.error('Error uploading files:', uploadErr);
          alert('Cập nhật thông tin thành công nhưng có lỗi khi upload file');
        }
      }

      alert('Cập nhật chi phí thành công!');
      handleCloseEditModal();
      fetchChiData();
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (err) {
      console.error('Error updating expense:', err);
      alert(err.message || 'Lỗi khi cập nhật chi phí');
    } finally {
      setEditSubmitting(false);
    }
  };

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
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button 
              onClick={handleOpenModal}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Thêm chi
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
              <FaDownload className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            <option value="Nhân sự">Nhân sự</option>
            <option value="Thiết bị">Thiết bị</option>
            <option value="Chi phí vận hành">Chi phí vận hành</option>
            <option value="Marketing">Marketing</option>
            <option value="Đề tài">Đề tài</option>
            <option value="Khác">Khác</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : chiData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                chiData.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenEditModal(item)}
                >
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
                    {editingStatusId === item.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={editingStatusValue}
                          onChange={(e) => setEditingStatusValue(e.target.value)}
                          onBlur={() => {
                            if (editingStatusValue !== '') {
                              handleSaveStatus(item.id, editingStatusValue);
                            } else {
                              handleCancelEditStatus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingStatusValue !== '') {
                                handleSaveStatus(item.id, editingStatusValue);
                              }
                            } else if (e.key === 'Escape') {
                              handleCancelEditStatus();
                            }
                          }}
                          className="px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="chua_tat_toan">Chờ thanh toán</option>
                          <option value="da_tat_toan">Đã thanh toán</option>
                          <option value="huy">Hủy</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(item.id, editingStatusValue)}
                          className="text-green-600 hover:text-green-700"
                          title="Lưu"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancelEditStatus}
                          className="text-red-600 hover:text-red-700"
                          title="Hủy"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(item.statusCode)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditStatus(item);
                        }}
                        title="Click để sửa trạng thái"
                      >
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : chiData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
          ) : (
            chiData.map((item) => (
            <div 
              key={item.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenEditModal(item)}
            >
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
                {editingStatusId === item.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editingStatusValue}
                      onChange={(e) => setEditingStatusValue(e.target.value)}
                      onBlur={() => {
                        if (editingStatusValue !== '') {
                          handleSaveStatus(item.id, editingStatusValue);
                        } else {
                          handleCancelEditStatus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingStatusValue !== '') {
                            handleSaveStatus(item.id, editingStatusValue);
                          }
                        } else if (e.key === 'Escape') {
                          handleCancelEditStatus();
                        }
                      }}
                      className="px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    >
                      <option value="chua_tat_toan">Chờ thanh toán</option>
                      <option value="da_tat_toan">Đã thanh toán</option>
                      <option value="huy">Hủy</option>
                    </select>
                    <button
                      onClick={() => handleSaveStatus(item.id, editingStatusValue)}
                      className="text-green-600 hover:text-green-700"
                      title="Lưu"
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleCancelEditStatus}
                      className="text-red-600 hover:text-red-700"
                      title="Hủy"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(item.statusCode)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditStatus(item);
                    }}
                    title="Click để sửa trạng thái"
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
            ))
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

      {/* Modal tạo chi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Thêm khoản chi</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('normal')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'normal'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Phiếu chi thường
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('debt')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'debt'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Thanh toán công nợ
                </button>
              </div>
            </div>

            {/* Tab Content: Phiếu chi thường */}
            {activeTab === 'normal' && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liên quan đến đề tài (tùy chọn)
                </label>
                <select
                  value={formData.id_de_tai}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Không liên quan đến đề tài</option>
                  {availableProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.ten_de_tai}
                    </option>
                  ))}
                </select>
                {formData.id_de_tai && (
                  <p className="text-xs text-blue-600 mt-1">
                    Mô tả sẽ tự động điền: "Chi phí thanh toán cho đề tài + tên đề tài"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề / Mô tả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tieu_de}
                  onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề hoặc mô tả"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  value={formData.noi_dung}
                  onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung chi tiết (tùy chọn)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.so_tien}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({ ...formData, so_tien: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền"
                />
                {formData.so_tien && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Intl.NumberFormat('vi-VN').format(parseFloat(formData.so_tien) || 0)} đ
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="chua_tat_toan">Chưa tất toán</option>
                  <option value="da_tat_toan">Đã tất toán</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tất toán
                </label>
                <input
                  type="date"
                  value={formData.ngay_tat_toan}
                  onChange={(e) => setFormData({ ...formData, ngay_tat_toan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo khoản chi'}
                </button>
              </div>
            </form>
            )}

            {/* Tab Content: Thanh toán công nợ */}
            {activeTab === 'debt' && (
              <form onSubmit={handleDebtSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn nghĩa vụ nộp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={debtFormData.id_nghia_vu}
                    onChange={(e) => setDebtFormData({ ...debtFormData, id_nghia_vu: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn nghĩa vụ nộp --</option>
                    {availableNghiaVuNop.map((nghiaVu) => {
                      const congNo = nghiaVu.congNo;
                      const congNoAmount = congNo ? parseFloat(congNo.cong_no) : 0;
                      const soTienDaNop = congNo ? parseFloat(congNo.so_tien_da_nop) : 0;
                      return (
                        <option key={nghiaVu.id} value={nghiaVu.id}>
                          Nghĩa vụ #{nghiaVu.id} - Hạn nộp: {formatDate(nghiaVu.han_nop)} - Công nợ: {formatCurrency(congNoAmount)} - Đã nộp: {formatCurrency(soTienDaNop)}
                        </option>
                      );
                    })}
                  </select>
                  {debtFormData.id_nghia_vu && (() => {
                    const selectedNghiaVu = availableNghiaVuNop.find(nv => nv.id === parseInt(debtFormData.id_nghia_vu));
                    const congNo = selectedNghiaVu?.congNo;
                    const congNoAmount = congNo ? parseFloat(congNo.cong_no) : 0;
                    return (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Hạn nộp:</strong> {formatDate(selectedNghiaVu?.han_nop)}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Công nợ hiện tại:</strong> <span className="text-red-600 font-semibold">{formatCurrency(congNoAmount)}</span>
                        </p>
                        {congNo && (
                          <p className="text-xs text-gray-600">
                            <strong>Đã nộp:</strong> {formatCurrency(parseFloat(congNo.so_tien_da_nop))}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền thanh toán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={debtFormData.so_tien_thanh_toan}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setDebtFormData({ ...debtFormData, so_tien_thanh_toan: value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số tiền thanh toán"
                  />
                  {debtFormData.so_tien_thanh_toan && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Intl.NumberFormat('vi-VN').format(parseFloat(debtFormData.so_tien_thanh_toan) || 0)} đ
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Khi thanh toán công nợ, hệ thống sẽ tự động tạo một phiếu chi tương ứng với trạng thái "Đã tất toán".
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Đang thanh toán...' : 'Thanh toán công nợ'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa chi */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa khoản chi</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liên quan đến đề tài (tùy chọn)
                </label>
                <select
                  value={editFormData.id_de_tai}
                  onChange={(e) => handleEditProjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Không liên quan đến đề tài</option>
                  {availableProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.ten_de_tai}
                    </option>
                  ))}
                </select>
                {editFormData.id_de_tai && (
                  <p className="text-xs text-blue-600 mt-1">
                    Mô tả sẽ tự động điền: "Chi phí thanh toán cho đề tài + tên đề tài"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề / Mô tả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.tieu_de}
                  onChange={(e) => setEditFormData({ ...editFormData, tieu_de: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề hoặc mô tả"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  value={editFormData.noi_dung}
                  onChange={(e) => setEditFormData({ ...editFormData, noi_dung: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung chi tiết (tùy chọn)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.so_tien}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setEditFormData({ ...editFormData, so_tien: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền"
                />
                {editFormData.so_tien && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Intl.NumberFormat('vi-VN').format(parseFloat(editFormData.so_tien.replace(/[^\d]/g, '')) || 0)} đ
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={editFormData.trang_thai}
                  onChange={(e) => setEditFormData({ ...editFormData, trang_thai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="chua_tat_toan">Chưa tất toán</option>
                  <option value="da_tat_toan">Đã tất toán</option>
                  <option value="huy">Hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tất toán
                </label>
                <input
                  type="date"
                  value={editFormData.ngay_tat_toan}
                  onChange={(e) => setEditFormData({ ...editFormData, ngay_tat_toan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tài liệu đính kèm
                </label>
                
                {/* Danh sách media hiện có */}
                {mediaFiles.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs text-gray-600 mb-2">Tài liệu hiện có:</p>
                    {mediaFiles.map((media) => (
                      <div key={media.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FaFile className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={getFileUrl(media.duong_dan_tai_lieu)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate"
                          >
                            {media.duong_dan_tai_lieu.split('/').pop()}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMediaFile(media.id)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload files mới */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 mb-2">Click để chọn file hoặc kéo thả file vào đây</span>
                    <span className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (tối đa 10MB/file)</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Danh sách file đã chọn để upload */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-600 mb-2">File mới sẽ upload:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FaFile className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          title="Xóa"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default RevenueSession4;


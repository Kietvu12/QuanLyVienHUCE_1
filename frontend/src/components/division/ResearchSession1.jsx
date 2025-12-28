import { FaSearch, FaFlask, FaPlus, FaTrash, FaEdit, FaBuilding, FaFile, FaEye, FaTimes } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { deTaiNghienCuuAPI, vienAPI, nhanSuAPI } from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const ResearchSession1 = () => {
  const [loading, setLoading] = useState(true);
  const [researchData, setResearchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viens, setViens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVien, setSelectedVien] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modal tạo đề tài state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_vien: '',
    ten_vien: '', // Tên viện để hiển thị
    ten_de_tai: '',
    linh_vuc: '',
    so_tien: '',
    ngay_bat_dau: '',
    ngay_hoan_thanh: '',
    tien_do: 0,
    trang_thai: 'dang_thuc_hien',
    danh_gia: ''
  });
  const [vienSearchTerm, setVienSearchTerm] = useState('');
  const [showVienDropdown, setShowVienDropdown] = useState(false);

  // Modal chỉnh sửa đánh giá state (chỉ cho đề tài đã hoàn thành)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    danh_gia: ''
  });

  // Modal chi tiết state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchViens();
    fetchResearchData();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (searchTerm || selectedVien || selectedField) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [searchTerm, selectedVien, selectedField]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedVien, selectedField, researchData, pagination.page]);

  useEffect(() => {
    if (showDetailModal && selectedProject) {
      fetchProjectDetail(selectedProject.id);
    }
  }, [showDetailModal, selectedProject]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVienDropdown && !event.target.closest('.vien-autocomplete-container')) {
        setShowVienDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVienDropdown]);

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

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      // Cấp phòng lấy đề tài từ tất cả viện (không filter id_vien)
      const response = await deTaiNghienCuuAPI.getAll({
        limit: 1000, // Lấy tất cả để filter ở frontend
        page: 1
      });

      if (response.success) {
        const projects = (response.data || []).map(item => {
          // Lấy danh sách người tham gia từ nhanSuDeTais
          const participants = (item.nhanSuDeTais || []).map(ns => {
            if (ns.nhanSu) {
              return ns.nhanSu.ho_ten;
            } else if (ns.ten_nhan_su) {
              return ns.ten_nhan_su;
            }
            return null;
          }).filter(Boolean);

          return {
            id: item.id,
            code: `DT-${item.id}`,
            name: item.ten_de_tai,
            participants: participants.length > 0 ? participants : ['Chưa có thông tin'],
            field: item.linh_vuc || 'Chưa xác định',
            institute: item.vien?.ten_vien || 'Chưa xác định',
            id_vien: item.id_vien,
            trang_thai: item.trang_thai,
            danh_gia: item.danh_gia || '',
            so_tai_lieu: (item.taiLieuDeTais || []).length,
            rawData: item
          };
        });
        setResearchData(projects);
        setPagination(prev => ({ ...prev, total: projects.length }));
      }
    } catch (err) {
      console.error('Error fetching research data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetail = async (id) => {
    try {
      setLoadingDetail(true);
      const response = await deTaiNghienCuuAPI.getById(id);
      if (response.success) {
        setProjectDetail(response.data);
      } else {
        alert(response.message || 'Lỗi khi tải thông tin đề tài');
      }
    } catch (err) {
      console.error('Error fetching project detail:', err);
      alert(err.message || 'Lỗi khi tải thông tin đề tài');
    } finally {
      setLoadingDetail(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...researchData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected vien
    if (selectedVien) {
      filtered = filtered.filter(item => item.id_vien.toString() === selectedVien);
    }

    // Filter by selected field
    if (selectedField) {
      filtered = filtered.filter(item => item.field.toLowerCase().includes(selectedField.toLowerCase()));
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

  const handleOpenModal = () => {
    setFormData({
      id_vien: '',
      ten_vien: '',
      ten_de_tai: '',
      linh_vuc: '',
      so_tien: '',
      ngay_bat_dau: '',
      ngay_hoan_thanh: '',
      tien_do: 0,
      trang_thai: 'dang_thuc_hien',
      danh_gia: ''
    });
    setVienSearchTerm('');
    setShowVienDropdown(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id_vien: '',
      ten_vien: '',
      ten_de_tai: '',
      linh_vuc: '',
      so_tien: '',
      ngay_bat_dau: '',
      ngay_hoan_thanh: '',
      tien_do: 0,
      trang_thai: 'dang_thuc_hien',
      danh_gia: ''
    });
    setVienSearchTerm('');
    setShowVienDropdown(false);
  };

  const handleSelectVien = (vien) => {
    setFormData({
      ...formData,
      id_vien: vien.id,
      ten_vien: vien.ten_vien
    });
    setVienSearchTerm(vien.ten_vien);
    setShowVienDropdown(false);
  };

  const filteredViens = viens.filter(vien =>
    vien.ten_vien.toLowerCase().includes(vienSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_vien) {
      alert('Vui lòng chọn Viện');
      return;
    }
    
    if (!formData.ten_de_tai || !formData.linh_vuc || !formData.so_tien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên đề tài, Lĩnh vực, Số tiền)');
      return;
    }

    try {
      setSubmitting(true);
      
      const deTaiData = {
        id_vien: parseInt(formData.id_vien),
        ten_de_tai: formData.ten_de_tai,
        linh_vuc: formData.linh_vuc,
        so_tien: parseFloat(formData.so_tien.replace(/[^\d]/g, '')),
        trang_thai: formData.trang_thai,
        tien_do: parseInt(formData.tien_do) || 0,
        ngay_bat_dau: formData.ngay_bat_dau || null,
        ngay_hoan_thanh: formData.ngay_hoan_thanh || null,
        danh_gia: formData.danh_gia || null
      };

      const response = await deTaiNghienCuuAPI.create(deTaiData);
      
      if (response.success) {
        alert('Tạo đề tài thành công!');
        handleCloseModal();
        fetchResearchData();
      } else {
        alert(response.message || 'Lỗi khi tạo đề tài');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      alert(err.message || 'Lỗi khi tạo đề tài');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đề tài này?')) return;
    try {
      const response = await deTaiNghienCuuAPI.delete(id);
      if (response.success) {
        alert('Xóa đề tài thành công!');
        fetchResearchData();
      } else {
        alert(response.message || 'Lỗi khi xóa đề tài');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa đề tài');
    }
  };

  const handleOpenEditModal = (project) => {
    if (project.trang_thai !== 'hoan_thanh') {
      alert('Chỉ có thể chỉnh sửa đánh giá cho đề tài đã hoàn thành!');
      return;
    }
    setEditingProject(project);
    setEditFormData({
      danh_gia: project.danh_gia || ''
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
    setEditFormData({
      danh_gia: ''
    });
  };

  const handleUpdateDanhGia = async (e) => {
    e.preventDefault();
    
    if (!editingProject) return;

    try {
      setSubmitting(true);
      
      // Lấy thông tin đầy đủ của đề tài
      const detailResponse = await deTaiNghienCuuAPI.getById(editingProject.id);
      if (!detailResponse.success) {
        alert('Lỗi khi tải thông tin đề tài');
        return;
      }

      const deTaiData = {
        ...detailResponse.data,
        danh_gia: editFormData.danh_gia
      };

      // Loại bỏ các trường không cần thiết
      delete deTaiData.id;
      delete deTaiData.createdAt;
      delete deTaiData.updatedAt;
      delete deTaiData.vien;
      delete deTaiData.nhanSuDeTais;
      delete deTaiData.taiLieuDeTais;

      const response = await deTaiNghienCuuAPI.update(editingProject.id, deTaiData);
      
      if (response.success) {
        alert('Cập nhật đánh giá thành công!');
        handleCloseEditModal();
        fetchResearchData();
      } else {
        alert(response.message || 'Lỗi khi cập nhật đánh giá');
      }
    } catch (err) {
      console.error('Error updating danh gia:', err);
      alert(err.message || 'Lỗi khi cập nhật đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProject(null);
    setProjectDetail(null);
  };

  // Hàm lấy URL file đầy đủ
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

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, pagination.total);

  // Lấy danh sách lĩnh vực unique từ dữ liệu
  const uniqueFields = [...new Set(researchData.map(item => item.field))].filter(Boolean);

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách đề tài nghiên cứu</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách đề tài của tất cả các Viện (chỉ hiển thị tên, người tham gia, lĩnh vực)
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tạo đề tài
          </button>
        </div>

        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên đề tài..."
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
          <select 
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả lĩnh vực</option>
            {uniqueFields.map((field, index) => (
              <option key={index} value={field}>
                {field}
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
                    Mã đề tài
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên đề tài
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Người tham gia
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lĩnh vực
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Viện
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-blue-600">{project.code}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaFlask className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.participants.slice(0, 3).map((participant, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {participant}
                          </span>
                        ))}
                        {project.participants.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{project.participants.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {project.field}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{project.institute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(project)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {project.trang_thai === 'hoan_thanh' && (
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Chỉnh sửa đánh giá"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
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
            filteredData.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-600">{project.code}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {project.field}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mb-3">
                      <FaFlask className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <h4 className="text-sm font-semibold text-gray-900">{project.name}</h4>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Người tham gia:</span>
                    <div className="flex flex-wrap gap-1">
                      {project.participants.slice(0, 3).map((participant, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {participant}
                        </span>
                      ))}
                      {project.participants.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{project.participants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Viện:</span>
                    <span className="text-xs text-gray-900 font-medium">{project.institute}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetail(project)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  {project.trang_thai === 'hoan_thanh' && (
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Sửa đánh giá
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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

      {/* Modal tạo đề tài */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Tạo đề tài nghiên cứu</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="vien-autocomplete-container relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Viện <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={vienSearchTerm}
                    onChange={(e) => {
                      setVienSearchTerm(e.target.value);
                      setShowVienDropdown(true);
                      if (!e.target.value) {
                        setFormData({ ...formData, id_vien: '', ten_vien: '' });
                      }
                    }}
                    onFocus={() => setShowVienDropdown(true)}
                    placeholder="Nhập để tìm Viện..."
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={!formData.id_vien}
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  {showVienDropdown && filteredViens.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredViens.map((vien) => (
                        <button
                          key={vien.id}
                          type="button"
                          onClick={() => handleSelectVien(vien)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          <FaBuilding className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-900">{vien.ten_vien}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showVienDropdown && filteredViens.length === 0 && vienSearchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="px-4 py-2 text-sm text-gray-500">Không tìm thấy Viện</div>
                    </div>
                  )}
                </div>
                {formData.id_vien && (
                  <input type="hidden" value={formData.id_vien} required />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đề tài <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_de_tai}
                  onChange={(e) => setFormData({ ...formData, ten_de_tai: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lĩnh vực <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.linh_vuc}
                  onChange={(e) => setFormData({ ...formData, linh_vuc: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.so_tien}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setFormData({ ...formData, so_tien: value });
                    }}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiến độ (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tien_do}
                    onChange={(e) => setFormData({ ...formData, tien_do: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.ngay_bat_dau}
                    onChange={(e) => setFormData({ ...formData, ngay_bat_dau: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hoàn thành
                  </label>
                  <input
                    type="date"
                    value={formData.ngay_hoan_thanh}
                    onChange={(e) => setFormData({ ...formData, ngay_hoan_thanh: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="dang_thuc_hien">Đang thực hiện</option>
                  <option value="hoan_thanh">Đã hoàn thành</option>
                  <option value="huy_bo">Hủy bỏ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đánh giá
                </label>
                <textarea
                  value={formData.danh_gia}
                  onChange={(e) => setFormData({ ...formData, danh_gia: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập đánh giá về đề tài..."
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo đề tài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa đánh giá */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa đánh giá</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateDanhGia} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đề tài
                </label>
                <input
                  type="text"
                  value={editingProject.name}
                  disabled
                  className="w-full h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đánh giá <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editFormData.danh_gia}
                  onChange={(e) => setEditFormData({ ...editFormData, danh_gia: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập đánh giá về đề tài..."
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chi tiết đề tài */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết đề tài</h3>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {loadingDetail ? (
              <div className="p-6 text-center text-gray-500">Đang tải...</div>
            ) : projectDetail ? (
              <div className="p-6 space-y-6">
                {/* Thông tin cơ bản */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-600">Mã đề tài:</span>
                      <p className="text-sm font-medium text-gray-900">DT-{projectDetail.id}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Tên đề tài:</span>
                      <p className="text-sm font-medium text-gray-900">{projectDetail.ten_de_tai}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Lĩnh vực:</span>
                      <p className="text-sm font-medium text-gray-900">{projectDetail.linh_vuc || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Viện:</span>
                      <p className="text-sm font-medium text-gray-900">{projectDetail.vien?.ten_vien || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Trạng thái:</span>
                      <p className="text-sm font-medium text-gray-900">
                        {projectDetail.trang_thai === 'hoan_thanh' ? 'Đã hoàn thành' : 
                         projectDetail.trang_thai === 'dang_thuc_hien' ? 'Đang thực hiện' : 'Hủy bỏ'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Tiến độ:</span>
                      <p className="text-sm font-medium text-gray-900">{projectDetail.tien_do || 0}%</p>
                    </div>
                  </div>
                </div>

                {/* Người tham gia */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Người tham gia</h4>
                  {projectDetail.nhanSuDeTais && projectDetail.nhanSuDeTais.length > 0 ? (
                    <div className="space-y-2">
                      {projectDetail.nhanSuDeTais.map((ns, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {ns.nhanSu?.ho_ten || ns.ten_nhan_su || 'Chưa có tên'}
                            </p>
                            {ns.chuyen_mon && (
                              <p className="text-xs text-gray-600">Chuyên môn: {ns.chuyen_mon}</p>
                            )}
                            {ns.vai_tro && (
                              <p className="text-xs text-gray-600">Vai trò: {ns.vai_tro}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Chưa có người tham gia</p>
                  )}
                </div>

                {/* Tài liệu */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaFile className="w-4 h-4" />
                    Tài liệu ({projectDetail.taiLieuDeTais?.length || 0})
                  </h4>
                  {projectDetail.taiLieuDeTais && projectDetail.taiLieuDeTais.length > 0 ? (
                    <div className="space-y-2">
                      {projectDetail.taiLieuDeTais.map((taiLieu, index) => (
                        <div key={taiLieu.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FaFile className="w-4 h-4 text-blue-500" />
                            <a
                              href={getFileUrl(taiLieu.duong_dan_tai_lieu)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                              {taiLieu.ten_tai_lieu || `Tài liệu ${index + 1}`}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Chưa có tài liệu</p>
                  )}
                </div>

                {/* Đánh giá */}
                {projectDetail.danh_gia && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Đánh giá</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {projectDetail.danh_gia}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">Không tìm thấy thông tin đề tài</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResearchSession1;

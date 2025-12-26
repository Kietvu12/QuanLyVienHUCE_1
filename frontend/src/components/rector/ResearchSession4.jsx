import { FaSearch, FaDownload, FaEye, FaTimes, FaUsers, FaFile, FaUpload, FaEdit } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deTaiNghienCuuAPI, nhanSuAPI } from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatCurrency = (value) => {
  if (!value) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value)) + ' đ';
};

const completedProjects = [
  {
    id: 'DT-2024-045',
    name: 'Nghiên cứu hệ thống quản lý chất thải xây dựng',
    leader: 'Nguyễn Văn X',
    field: 'Xây dựng',
    startDate: '01/01/2024',
    endDate: '30/11/2024',
    completedDate: '25/11/2024',
    status: 'Đã hoàn thành',
    budget: '550.000.000',
    result: 'Xuất sắc',
  },
  {
    id: 'DT-2024-044',
    name: 'Phát triển ứng dụng quản lý dự án trên mobile',
    leader: 'Trần Thị Y',
    field: 'Công nghệ thông tin',
    startDate: '15/02/2024',
    endDate: '15/12/2024',
    completedDate: '10/12/2024',
    status: 'Đã hoàn thành',
    budget: '420.000.000',
    result: 'Tốt',
  },
  {
    id: 'DT-2024-043',
    name: 'Nghiên cứu vật liệu composite trong xây dựng',
    leader: 'Lê Văn Z',
    field: 'Khoa học',
    startDate: '01/03/2024',
    endDate: '28/02/2025',
    completedDate: '20/02/2025',
    status: 'Đã hoàn thành',
    budget: '680.000.000',
    result: 'Xuất sắc',
  },
  {
    id: 'DT-2024-042',
    name: 'Hệ thống giám sát an toàn lao động',
    leader: 'Phạm Thị W',
    field: 'Kỹ thuật',
    startDate: '10/04/2024',
    endDate: '10/01/2025',
    completedDate: '05/01/2025',
    status: 'Đã hoàn thành',
    budget: '380.000.000',
    result: 'Tốt',
  },
  {
    id: 'DT-2024-041',
    name: 'Nghiên cứu tối ưu hóa chi phí xây dựng',
    leader: 'Hoàng Văn V',
    field: 'Xây dựng',
    startDate: '20/05/2024',
    endDate: '20/02/2025',
    completedDate: '15/02/2025',
    status: 'Đã hoàn thành',
    budget: '490.000.000',
    result: 'Khá',
  },
  {
    id: 'DT-2024-040',
    name: 'Phát triển hệ thống BIM cho quản lý dự án',
    leader: 'Nguyễn Thị U',
    field: 'Công nghệ thông tin',
    startDate: '01/06/2024',
    endDate: '01/03/2025',
    completedDate: '28/02/2025',
    status: 'Đã hoàn thành',
    budget: '720.000.000',
    result: 'Xuất sắc',
  },
];

const getResultColor = (result) => {
  switch (result) {
    case 'Xuất sắc':
      return 'bg-emerald-100 text-emerald-800';
    case 'Tốt':
      return 'bg-blue-100 text-blue-800';
    case 'Khá':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ResearchSession4 = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Modal chi tiết state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailTab, setDetailTab] = useState('nhan-su');
  const [projectDetail, setProjectDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Nhân sự state (cho modal chi tiết)
  const [availablePersonnel, setAvailablePersonnel] = useState([]);
  const [personnelSearchTerm, setPersonnelSearchTerm] = useState('');
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const [showAddExternalPersonnel, setShowAddExternalPersonnel] = useState(false);
  const [externalPersonnelForm, setExternalPersonnelForm] = useState({
    ten_nhan_su: '',
    chuyen_mon: '',
    vai_tro: 'thanh_vien'
  });

  // File upload state (cho modal chi tiết)
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Modal chỉnh sửa state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    ten_de_tai: '',
    linh_vuc: '',
    so_tien: '',
    ngay_bat_dau: '',
    ngay_hoan_thanh: '',
    tien_do: 100,
    trang_thai: 'hoan_thanh',
    danh_gia: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user?.id_vien, pagination.page, searchTerm, selectedField, selectedResult]);

  useEffect(() => {
    if (showDetailModal && selectedProject) {
      fetchProjectDetail(selectedProject.id);
      fetchAvailablePersonnel();
    }
  }, [showDetailModal, selectedProject, user?.id_vien]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPersonnelDropdown && !event.target.closest('.personnel-dropdown-container')) {
        setShowPersonnelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPersonnelDropdown]);

  // Listen for storage events để tự động refresh khi có thay đổi từ component khác
  useEffect(() => {
    const handleStorageChange = () => {
      fetchProjects();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event để refresh khi có thay đổi trong cùng tab
    window.addEventListener('projectUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectUpdated', handleStorageChange);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        id_vien: user?.id_vien,
        trang_thai: 'hoan_thanh',
        page: pagination.page,
        limit: pagination.limit
      };
      if (selectedField) {
        params.linh_vuc = selectedField;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await deTaiNghienCuuAPI.getAll(params);
      if (response.success) {
        let mappedProjects = (response.data || []).map(deTai => {
          // Lấy người phụ trách (người đầu tiên trong danh sách)
          const leader = deTai.nhanSuDeTais && deTai.nhanSuDeTais.length > 0
            ? deTai.nhanSuDeTais[0].nhanSu?.ho_ten || '-'
            : '-';

          // Map danh_gia thành kết quả
          let result = 'Khá';
          if (deTai.danh_gia) {
            const danhGia = deTai.danh_gia.toLowerCase();
            if (danhGia.includes('xuất sắc') || danhGia.includes('excellent')) {
              result = 'Xuất sắc';
            } else if (danhGia.includes('tốt') || danhGia.includes('good')) {
              result = 'Tốt';
            } else if (danhGia.includes('khá') || danhGia.includes('fair')) {
              result = 'Khá';
            }
          }

          return {
            id: deTai.id,
            name: deTai.ten_de_tai,
            leader: leader,
            field: deTai.linh_vuc || '-',
            startDate: deTai.ngay_bat_dau ? formatDate(deTai.ngay_bat_dau) : '-',
            endDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            completedDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            status: 'Đã hoàn thành',
            budget: formatCurrency(deTai.so_tien),
            result: result,
            rawData: deTai
          };
        });

        // Filter by result if selected
        if (selectedResult) {
          const resultMap = {
            'excellent': 'Xuất sắc',
            'good': 'Tốt',
            'fair': 'Khá'
          };
          const resultValue = resultMap[selectedResult];
          if (resultValue) {
            mappedProjects = mappedProjects.filter(p => p.result === resultValue);
          }
        }

        setProjects(mappedProjects);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching completed projects:', err);
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

  const fetchAvailablePersonnel = async () => {
    try {
      const response = await nhanSuAPI.getAll({
        id_vien: user?.id_vien,
        limit: 100
      });
      if (response.success) {
        setAvailablePersonnel(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching personnel:', err);
    }
  };

  const handleViewDetail = (project) => {
    setSelectedProject(project);
    setDetailTab('nhan-su');
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProject(null);
    setProjectDetail(null);
    setPersonnelSearchTerm('');
    setUploadedFiles([]);
    setShowPersonnelDropdown(false);
    setShowAddExternalPersonnel(false);
    setExternalPersonnelForm({
      ten_nhan_su: '',
      chuyen_mon: '',
      vai_tro: 'thanh_vien'
    });
  };

  // Xử lý nhân sự trong modal chi tiết
  const handleAddPersonnelToProject = async (person) => {
    if (!selectedProject) return;
    try {
      const response = await deTaiNghienCuuAPI.addNhanSu(selectedProject.id, {
        id_nhan_su: person.id,
        ten_nhan_su: person.ho_ten,
        chuyen_mon: '',
        vai_tro: 'thanh_vien'
      });
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
        setPersonnelSearchTerm('');
        setShowPersonnelDropdown(false);
      } else {
        alert(response.message || 'Lỗi khi thêm nhân sự');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi thêm nhân sự');
    }
  };

  const handleRemovePersonnelFromProject = async (nhanSuDeTaiId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân sự này khỏi đề tài?')) return;
    try {
      const response = await deTaiNghienCuuAPI.removeNhanSu(selectedProject.id, nhanSuDeTaiId);
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
      } else {
        alert(response.message || 'Lỗi khi xóa nhân sự');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa nhân sự');
    }
  };

  const handleUpdatePersonnel = async (nhanSuDeTaiId, data) => {
    try {
      const response = await deTaiNghienCuuAPI.updateNhanSu(selectedProject.id, nhanSuDeTaiId, data);
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
      } else {
        alert(response.message || 'Lỗi khi cập nhật nhân sự');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật nhân sự');
    }
  };

  // Thêm người ngoài (không phải nhân sự của Viện)
  const handleAddExternalPersonnel = async () => {
    if (!selectedProject || !externalPersonnelForm.ten_nhan_su.trim()) {
      alert('Vui lòng nhập tên người tham gia');
      return;
    }
    try {
      const response = await deTaiNghienCuuAPI.addNhanSu(selectedProject.id, {
        id_nhan_su: null,
        ten_nhan_su: externalPersonnelForm.ten_nhan_su.trim(),
        chuyen_mon: externalPersonnelForm.chuyen_mon || null,
        vai_tro: externalPersonnelForm.vai_tro || 'thanh_vien'
      });
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
        setExternalPersonnelForm({
          ten_nhan_su: '',
          chuyen_mon: '',
          vai_tro: 'thanh_vien'
        });
        setShowAddExternalPersonnel(false);
      } else {
        alert(response.message || 'Lỗi khi thêm người tham gia');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi thêm người tham gia');
    }
  };

  // Xử lý tài liệu trong modal chi tiết
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleUploadFiles = async () => {
    if (!selectedProject || uploadedFiles.length === 0) return;
    try {
      const response = await deTaiNghienCuuAPI.uploadTaiLieu(selectedProject.id, uploadedFiles);
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
        setUploadedFiles([]);
        alert('Upload tài liệu thành công!');
      } else {
        alert(response.message || 'Lỗi khi upload tài liệu');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi upload tài liệu');
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteTaiLieu = async (taiLieuId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      const response = await deTaiNghienCuuAPI.removeTaiLieu(selectedProject.id, taiLieuId);
      if (response.success) {
        fetchProjectDetail(selectedProject.id);
      } else {
        alert(response.message || 'Lỗi khi xóa tài liệu');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa tài liệu');
    }
  };

  const filteredPersonnel = availablePersonnel.filter(p => {
    const existingPersonnel = projectDetail?.nhanSuDeTais || [];
    return !existingPersonnel.find(ep => ep.id_nhan_su === p.id) &&
      (p.ho_ten?.toLowerCase().includes(personnelSearchTerm.toLowerCase()) ||
       p.email?.toLowerCase().includes(personnelSearchTerm.toLowerCase()));
  });

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

  // Xử lý mở modal sửa đề tài
  const handleEditProject = async (project) => {
    try {
      const response = await deTaiNghienCuuAPI.getById(project.id);
      if (response.success) {
        const deTai = response.data;
        setEditingProject(deTai);
        setEditFormData({
          ten_de_tai: deTai.ten_de_tai || '',
          linh_vuc: deTai.linh_vuc || '',
          so_tien: deTai.so_tien ? deTai.so_tien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
          ngay_bat_dau: deTai.ngay_bat_dau ? deTai.ngay_bat_dau.split('T')[0] : '',
          ngay_hoan_thanh: deTai.ngay_hoan_thanh ? deTai.ngay_hoan_thanh.split('T')[0] : '',
          tien_do: deTai.tien_do || 100,
          trang_thai: deTai.trang_thai || 'hoan_thanh',
          danh_gia: deTai.danh_gia || ''
        });
        setShowEditModal(true);
      } else {
        alert(response.message || 'Lỗi khi tải thông tin đề tài');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tải thông tin đề tài');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
    setEditFormData({
      ten_de_tai: '',
      linh_vuc: '',
      so_tien: '',
      ngay_bat_dau: '',
      ngay_hoan_thanh: '',
      tien_do: 100,
      trang_thai: 'hoan_thanh',
      danh_gia: ''
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    if (!editFormData.ten_de_tai || !editFormData.linh_vuc || !editFormData.so_tien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên đề tài, Lĩnh vực, Số tiền)');
      return;
    }

    try {
      setSubmitting(true);
      
      const deTaiData = {
        ten_de_tai: editFormData.ten_de_tai,
        linh_vuc: editFormData.linh_vuc,
        so_tien: parseFloat(editFormData.so_tien.replace(/[^\d]/g, '')),
        trang_thai: editFormData.trang_thai,
        tien_do: parseInt(editFormData.tien_do) || 100,
        ngay_bat_dau: editFormData.ngay_bat_dau || null,
        ngay_hoan_thanh: editFormData.ngay_hoan_thanh || null,
        danh_gia: editFormData.danh_gia || null
      };

      // Nếu chọn trạng thái "Đã hoàn thành", tự động set tiến độ = 100%
      if (editFormData.trang_thai === 'hoan_thanh') {
        deTaiData.tien_do = 100;
      }

      const response = await deTaiNghienCuuAPI.update(editingProject.id, deTaiData);
      
      if (response.success) {
        alert('Cập nhật đề tài thành công!');
        handleCloseEditModal();
        fetchProjects();
      } else {
        alert(response.message || 'Lỗi khi cập nhật đề tài');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      alert(err.message || 'Lỗi khi cập nhật đề tài');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Đề tài đã hoàn thành</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách các đề tài đã hoàn thành và kết quả đánh giá
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
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
                placeholder="Tìm kiếm đề tài, mã đề tài, người phụ trách..."
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
            value={selectedField}
            onChange={(e) => {
              setSelectedField(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả lĩnh vực</option>
            <option value="Công nghệ thông tin">Công nghệ thông tin</option>
            <option value="Xây dựng">Xây dựng</option>
            <option value="Kỹ thuật">Kỹ thuật</option>
            <option value="Khoa học">Khoa học</option>
          </select>
          <select 
            value={selectedResult}
            onChange={(e) => {
              setSelectedResult(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả kết quả</option>
            <option value="excellent">Xuất sắc</option>
            <option value="good">Tốt</option>
            <option value="fair">Khá</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
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
                  Người phụ trách
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lĩnh vực
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày hoàn thành
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngân sách
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kết quả
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
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">Không có đề tài nào</td>
                </tr>
              ) : (
                projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">DT-{project.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{project.leader}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {project.field}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{project.completedDate}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {project.budget}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(project.result)}`}>
                      {project.result}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleViewDetail(project)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                        title="Xem chi tiết"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProject(project)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                        title="Chỉnh sửa"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    </div>
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
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có đề tài nào</div>
          ) : (
            projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">DT-{project.id}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {project.field}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(project.result)}`}>
                      {project.result}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{project.name}</h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Người phụ trách:</span>
                  <span className="text-xs text-gray-900 font-medium">{project.leader}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ngày hoàn thành:</span>
                  <span className="text-xs text-gray-900 font-medium">{project.completedDate}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">Ngân sách:</span>
                  <span className="text-sm font-semibold text-gray-900">{project.budget}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleViewDetail(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                  title="Xem chi tiết"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditProject(project)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                  title="Chỉnh sửa"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
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

      {/* Modal chi tiết đề tài */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {projectDetail?.ten_de_tai || selectedProject.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Mã đề tài: DT-{selectedProject.id}</p>
              </div>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex gap-4">
                <button
                  onClick={() => setDetailTab('nhan-su')}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    detailTab === 'nhan-su'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaUsers className="w-4 h-4" />
                  Nhân sự
                </button>
                <button
                  onClick={() => setDetailTab('tai-lieu')}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    detailTab === 'tai-lieu'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaFile className="w-4 h-4" />
                  Tài liệu
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loadingDetail ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : (
                <>
                  {/* Tab Nhân sự */}
                  {detailTab === 'nhan-su' && (
                    <div className="space-y-4">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách nhân sự tham gia</h3>
                        <div className="space-y-3">
                          {/* Ô tìm kiếm nhân sự của Viện */}
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              <FaUsers className="inline mr-2" />
                              Tìm kiếm nhân sự của Viện
                            </label>
                            <div className="relative personnel-dropdown-container">
                              <input
                                type="text"
                                value={personnelSearchTerm}
                                onChange={(e) => {
                                  setPersonnelSearchTerm(e.target.value);
                                  setShowPersonnelDropdown(true);
                                }}
                                onFocus={() => setShowPersonnelDropdown(true)}
                                placeholder="Nhập tên hoặc email để tìm kiếm nhân sự..."
                                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                              />
                              {showPersonnelDropdown && filteredPersonnel.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                  {filteredPersonnel.map((person) => (
                                    <div
                                      key={person.id}
                                      onClick={() => handleAddPersonnelToProject(person)}
                                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                      <div className="font-medium text-gray-900">{person.ho_ten}</div>
                                      {person.email && (
                                        <div className="text-sm text-gray-500 mt-1">{person.email}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {showPersonnelDropdown && filteredPersonnel.length === 0 && personnelSearchTerm && (
                                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
                                  Không tìm thấy nhân sự
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Nút thêm người ngoài */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-sm text-gray-500">hoặc</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                          </div>
                          <button
                            onClick={() => setShowAddExternalPersonnel(!showAddExternalPersonnel)}
                            className="w-full px-4 py-3 text-blue-600 hover:text-blue-700 transition-colors text-base font-medium flex items-center justify-center gap-2"
                          >
                            <FaUsers className="w-5 h-5" />
                            Thêm người ngoài (không phải nhân sự của Viện)
                          </button>
                        </div>
                      </div>

                      {/* Form thêm người ngoài */}
                      {showAddExternalPersonnel && (
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Thêm người ngoài (không phải nhân sự của Viện)</h4>
                            <button
                              onClick={() => {
                                setShowAddExternalPersonnel(false);
                                setExternalPersonnelForm({
                                  ten_nhan_su: '',
                                  chuyen_mon: '',
                                  vai_tro: 'thanh_vien'
                                });
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tên người tham gia <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={externalPersonnelForm.ten_nhan_su}
                                onChange={(e) => setExternalPersonnelForm({ ...externalPersonnelForm, ten_nhan_su: e.target.value })}
                                placeholder="Nhập tên"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Chuyên môn
                              </label>
                              <input
                                type="text"
                                value={externalPersonnelForm.chuyen_mon}
                                onChange={(e) => setExternalPersonnelForm({ ...externalPersonnelForm, chuyen_mon: e.target.value })}
                                placeholder="Nhập chuyên môn"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Vai trò
                              </label>
                              <select
                                value={externalPersonnelForm.vai_tro}
                                onChange={(e) => setExternalPersonnelForm({ ...externalPersonnelForm, vai_tro: e.target.value })}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                <option value="chu_nhiem">Chủ nhiệm</option>
                                <option value="thanh_vien">Thành viên</option>
                                <option value="cong_tac_vien">Cộng tác viên</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <button
                              onClick={() => {
                                setShowAddExternalPersonnel(false);
                                setExternalPersonnelForm({
                                  ten_nhan_su: '',
                                  chuyen_mon: '',
                                  vai_tro: 'thanh_vien'
                                });
                              }}
                              className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleAddExternalPersonnel}
                              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      )}

                      {projectDetail?.nhanSuDeTais && projectDetail.nhanSuDeTais.length > 0 ? (
                        <div className="space-y-3">
                          {projectDetail.nhanSuDeTais.map((nhanSuDeTai) => (
                            <div key={nhanSuDeTai.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium text-gray-900">
                                      {nhanSuDeTai.nhanSu?.ho_ten || nhanSuDeTai.ten_nhan_su || 'N/A'}
                                    </div>
                                    {!nhanSuDeTai.id_nhan_su && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                        Người ngoài
                                      </span>
                                    )}
                                  </div>
                                  {nhanSuDeTai.nhanSu?.email && (
                                    <div className="text-sm text-gray-500">{nhanSuDeTai.nhanSu.email}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleRemovePersonnelFromProject(nhanSuDeTai.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Vai trò
                                  </label>
                                  <select
                                    value={nhanSuDeTai.vai_tro || 'thanh_vien'}
                                    onChange={(e) => handleUpdatePersonnel(nhanSuDeTai.id, { vai_tro: e.target.value })}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="chu_nhiem">Chủ nhiệm</option>
                                    <option value="thanh_vien">Thành viên</option>
                                    <option value="cong_tac_vien">Cộng tác viên</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Chuyên môn
                                  </label>
                                  <input
                                    type="text"
                                    value={nhanSuDeTai.chuyen_mon || ''}
                                    onChange={(e) => handleUpdatePersonnel(nhanSuDeTai.id, { chuyen_mon: e.target.value })}
                                    placeholder="Nhập chuyên môn"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có nhân sự nào. Hãy thêm nhân sự vào đề tài.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Tài liệu */}
                  {detailTab === 'tai-lieu' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Danh sách tài liệu</h3>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id="detail-file-upload"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="detail-file-upload"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-sm flex items-center gap-2"
                          >
                            <FaUpload className="w-4 h-4" />
                            Tải lên tài liệu
                          </label>
                          {uploadedFiles.length > 0 && (
                            <button
                              onClick={handleUploadFiles}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                            >
                              Lưu ({uploadedFiles.length})
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Danh sách file đang chờ upload */}
                      {uploadedFiles.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Tài liệu đang chờ upload:</p>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center gap-3 flex-1">
                                <FaUpload className="w-4 h-4 text-yellow-600" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Danh sách tài liệu đã upload */}
                      {projectDetail?.taiLieuDeTais && projectDetail.taiLieuDeTais.length > 0 ? (
                        <div className="space-y-2">
                          {projectDetail.taiLieuDeTais.map((taiLieu) => (
                            <div key={taiLieu.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3 flex-1">
                                <FaFile className="w-4 h-4 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{taiLieu.ten_tai_lieu}</p>
                                  {taiLieu.duong_dan_tai_lieu && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <a
                                        href={getFileUrl(taiLieu.duong_dan_tai_lieu)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                                      >
                                        Xem/Tải tài liệu
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteTaiLieu(taiLieu.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có tài liệu nào. Hãy tải lên tài liệu cho đề tài.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa đề tài */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Sửa thông tin đề tài</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đề tài</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đề tài <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.ten_de_tai}
                      onChange={(e) => setEditFormData({ ...editFormData, ten_de_tai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên đề tài"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lĩnh vực <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={editFormData.linh_vuc}
                      onChange={(e) => setEditFormData({ ...editFormData, linh_vuc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn lĩnh vực</option>
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                      <option value="Xây dựng">Xây dựng</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Khoa học">Khoa học</option>
                    </select>
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
                        {new Intl.NumberFormat('vi-VN').format(parseFloat(editFormData.so_tien) || 0)} đ
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={editFormData.ngay_bat_dau}
                      onChange={(e) => setEditFormData({ ...editFormData, ngay_bat_dau: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hoàn thành
                    </label>
                    <input
                      type="date"
                      value={editFormData.ngay_hoan_thanh}
                      onChange={(e) => setEditFormData({ ...editFormData, ngay_hoan_thanh: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      value={editFormData.tien_do}
                      onChange={(e) => setEditFormData({ ...editFormData, tien_do: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Đề tài đã hoàn thành nên có tiến độ 100%</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={editFormData.trang_thai}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setEditFormData({ 
                          ...editFormData, 
                          trang_thai: newStatus,
                          // Nếu chọn "Đã hoàn thành", tự động set tiến độ = 100%
                          tien_do: newStatus === 'hoan_thanh' ? 100 : editFormData.tien_do
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hoan_thanh">Đã hoàn thành</option>
                      <option value="dang_thuc_hien">Đang thực hiện</option>
                      <option value="huy_bo">Hủy bỏ</option>
                    </select>
                    {editFormData.trang_thai === 'hoan_thanh' && (
                      <p className="text-xs text-green-600 mt-1">Tiến độ đã được tự động cập nhật thành 100%</p>
                    )}
                    {editFormData.trang_thai !== 'hoan_thanh' && (
                      <p className="text-xs text-yellow-600 mt-1">Lưu ý: Nếu đổi trạng thái, đề tài sẽ chuyển sang danh sách tương ứng</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đánh giá
                    </label>
                    <textarea
                      value={editFormData.danh_gia}
                      onChange={(e) => setEditFormData({ ...editFormData, danh_gia: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập đánh giá về đề tài"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
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
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang cập nhật...' : 'Cập nhật đề tài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResearchSession4;


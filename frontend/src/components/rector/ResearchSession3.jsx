import { FaSearch, FaPlus, FaEdit, FaTrash, FaUpload, FaTimes, FaUserPlus, FaEye, FaUsers, FaFile } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
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

const activeProjects = [
  {
    id: 'DT-2025-001',
    name: 'Nghiên cứu ứng dụng AI trong quản lý dự án xây dựng',
    leader: 'Nguyễn Văn A',
    field: 'Công nghệ thông tin',
    startDate: '01/03/2025',
    endDate: '30/12/2025',
    progress: 65,
    status: 'Đang thực hiện',
    budget: '500.000.000',
  },
  {
    id: 'DT-2025-002',
    name: 'Phát triển hệ thống quản lý tài nguyên nước',
    leader: 'Trần Thị B',
    field: 'Kỹ thuật',
    startDate: '15/02/2025',
    endDate: '15/11/2025',
    progress: 45,
    status: 'Đang thực hiện',
    budget: '350.000.000',
  },
  {
    id: 'DT-2025-003',
    name: 'Nghiên cứu vật liệu xây dựng bền vững',
    leader: 'Lê Văn C',
    field: 'Xây dựng',
    startDate: '01/01/2025',
    endDate: '31/10/2025',
    progress: 80,
    status: 'Đang thực hiện',
    budget: '600.000.000',
  },
  {
    id: 'DT-2025-004',
    name: 'Ứng dụng IoT trong giám sát công trình',
    leader: 'Phạm Thị D',
    field: 'Công nghệ thông tin',
    startDate: '10/04/2025',
    endDate: '10/12/2025',
    progress: 30,
    status: 'Đang thực hiện',
    budget: '450.000.000',
  },
  {
    id: 'DT-2025-005',
    name: 'Nghiên cứu tối ưu hóa năng lượng trong xây dựng',
    leader: 'Hoàng Văn E',
    field: 'Khoa học',
    startDate: '20/03/2025',
    endDate: '20/12/2025',
    progress: 55,
    status: 'Đang thực hiện',
    budget: '400.000.000',
  },
  {
    id: 'DT-2025-006',
    name: 'Phát triển phần mềm quản lý tài sản',
    leader: 'Nguyễn Thị F',
    field: 'Công nghệ thông tin',
    startDate: '05/05/2025',
    endDate: '05/02/2026',
    progress: 25,
    status: 'Đang thực hiện',
    budget: '300.000.000',
  },
];

const ResearchSession3 = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'accountant';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Modal tạo đề tài state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ten_de_tai: '',
    linh_vuc: '',
    so_tien: '',
    ngay_bat_dau: '',
    ngay_hoan_thanh: '',
    tien_do: 0,
    trang_thai: 'dang_thuc_hien',
    danh_gia: ''
  });

  // Modal sửa đề tài state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    ten_de_tai: '',
    linh_vuc: '',
    so_tien: '',
    ngay_bat_dau: '',
    ngay_hoan_thanh: '',
    tien_do: 0,
    trang_thai: 'dang_thuc_hien',
    danh_gia: ''
  });

  // Inline edit tiến độ state
  const [editingProgressId, setEditingProgressId] = useState(null);
  const [editingProgressValue, setEditingProgressValue] = useState('');
  
  // Inline edit trạng thái state
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusValue, setEditingStatusValue] = useState('');
  
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

  useEffect(() => {
    fetchProjects();
  }, [user?.id_vien, pagination.page, searchTerm, selectedField]);

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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        id_vien: user?.id_vien,
        trang_thai: 'dang_thuc_hien',
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
        const mappedProjects = (response.data || []).map(deTai => {
          // Lấy người phụ trách (người đầu tiên trong danh sách)
          const leader = deTai.nhanSuDeTais && deTai.nhanSuDeTais.length > 0
            ? deTai.nhanSuDeTais[0].nhanSu?.ho_ten || '-'
            : '-';

          // Map trạng thái
          let statusText = 'Đang thực hiện';
          if (deTai.trang_thai === 'hoan_thanh') {
            statusText = 'Đã hoàn thành';
          } else if (deTai.trang_thai === 'huy_bo') {
            statusText = 'Hủy bỏ';
          }

          return {
            id: deTai.id,
            name: deTai.ten_de_tai,
            leader: leader,
            field: deTai.linh_vuc || '-',
            startDate: deTai.ngay_bat_dau ? formatDate(deTai.ngay_bat_dau) : '-',
            endDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            progress: deTai.tien_do || 0,
            status: deTai.trang_thai || 'dang_thuc_hien',
            statusText: statusText,
            budget: formatCurrency(deTai.so_tien),
            rawData: deTai
          };
        });
        setProjects(mappedProjects);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching active projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đề tài này?')) return;
    try {
      const response = await deTaiNghienCuuAPI.delete(id);
      if (response.success) {
        fetchProjects();
      } else {
        alert(response.message || 'Lỗi khi xóa đề tài');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa đề tài');
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

  const handleOpenModal = () => {
    setFormData({
      ten_de_tai: '',
      linh_vuc: '',
      so_tien: '',
      ngay_bat_dau: '',
      ngay_hoan_thanh: '',
      tien_do: 0,
      trang_thai: 'dang_thuc_hien',
      danh_gia: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      ten_de_tai: '',
      linh_vuc: '',
      so_tien: '',
      ngay_bat_dau: '',
      ngay_hoan_thanh: '',
      tien_do: 0,
      trang_thai: 'dang_thuc_hien',
      danh_gia: ''
    });
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

  // Thêm người ngoài (không phải nhân sự của Viện)
  const handleAddExternalPersonnel = async () => {
    if (!selectedProject || !externalPersonnelForm.ten_nhan_su.trim()) {
      alert('Vui lòng nhập tên người tham gia');
      return;
    }
    try {
      const response = await deTaiNghienCuuAPI.addNhanSu(selectedProject.id, {
        id_nhan_su: null, // Người ngoài không có id_nhan_su
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
    // Nếu path đã là URL đầy đủ, trả về nguyên
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Lấy base URL của backend (loại bỏ /api)
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const backendBaseUrl = API_BASE_URL.replace('/api', '');
    // Nếu path bắt đầu bằng /uploads, thêm base URL
    if (path.startsWith('/uploads')) {
      return `${backendBaseUrl}${path}`;
    }
    // Nếu không, thêm /uploads
    return `${backendBaseUrl}/uploads${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ten_de_tai || !formData.linh_vuc || !formData.so_tien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên đề tài, Lĩnh vực, Số tiền)');
      return;
    }

    try {
      setSubmitting(true);
      
      // Tạo đề tài
      const deTaiData = {
        id_vien: user?.id_vien,
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
        alert('Tạo đề tài thành công! Bạn có thể thêm nhân sự và tài liệu trong phần chi tiết.');
        handleCloseModal();
        fetchProjects();
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
          ngay_bat_dau: deTai.ngay_bat_dau || '',
          ngay_hoan_thanh: deTai.ngay_hoan_thanh || '',
          tien_do: deTai.tien_do || 0,
          trang_thai: deTai.trang_thai || 'dang_thuc_hien',
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
      tien_do: 0,
      trang_thai: 'dang_thuc_hien',
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
        tien_do: parseInt(editFormData.tien_do) || 0,
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
        // Nếu trạng thái là hoàn thành, dispatch event để ResearchSession4 refresh
        if (deTaiData.trang_thai === 'hoan_thanh') {
          window.dispatchEvent(new Event('projectUpdated'));
        }
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

  // Xử lý cập nhật tiến độ inline
  const handleStartEditProgress = (project) => {
    setEditingProgressId(project.id);
    setEditingProgressValue(project.progress.toString());
  };

  const handleCancelEditProgress = () => {
    setEditingProgressId(null);
    setEditingProgressValue('');
  };

  const handleSaveProgress = async (projectId, newProgress) => {
    const progressValue = parseInt(newProgress);
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      alert('Tiến độ phải là số từ 0 đến 100');
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Nếu tiến độ = 100%, tự động cập nhật trạng thái thành hoàn thành
      const updateData = {
        tien_do: progressValue
      };
      
      if (progressValue === 100) {
        updateData.trang_thai = 'hoan_thanh';
      }

      const response = await deTaiNghienCuuAPI.update(projectId, updateData);

      if (response.success) {
        setEditingProgressId(null);
        setEditingProgressValue('');
        fetchProjects();
        if (progressValue === 100) {
          alert('Tiến độ đã đạt 100%! Đề tài đã được chuyển sang trạng thái "Đã hoàn thành". Vui lòng chuyển sang tab "Đề tài đã hoàn thành" để xem.');
          // Dispatch event để ResearchSession4 tự động refresh
          window.dispatchEvent(new Event('projectUpdated'));
        }
      } else {
        alert(response.message || 'Lỗi khi cập nhật tiến độ');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật tiến độ');
    }
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'hoan_thanh':
        return 'bg-green-100 text-green-800';
      case 'huy_bo':
        return 'bg-red-100 text-red-800';
      case 'dang_thuc_hien':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Xử lý cập nhật trạng thái inline
  const handleStartEditStatus = (project) => {
    setEditingStatusId(project.id);
    setEditingStatusValue(project.status);
  };

  const handleCancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatusValue('');
  };

  const handleSaveStatus = async (projectId, newStatus) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updateData = {
        trang_thai: newStatus
      };

      // Nếu chọn "Đã hoàn thành", tự động set tiến độ = 100%
      if (newStatus === 'hoan_thanh') {
        updateData.tien_do = 100;
      }

      const response = await deTaiNghienCuuAPI.update(projectId, updateData);

      if (response.success) {
        setEditingStatusId(null);
        setEditingStatusValue('');
        fetchProjects();
        if (newStatus === 'hoan_thanh') {
          alert('Trạng thái đã được cập nhật thành "Đã hoàn thành"! Tiến độ đã được tự động cập nhật thành 100%. Vui lòng chuyển sang tab "Đề tài đã hoàn thành" để xem.');
          // Dispatch event để ResearchSession4 tự động refresh
          window.dispatchEvent(new Event('projectUpdated'));
        }
      } else {
        alert(response.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Đề tài đang thực hiện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách các đề tài đang trong quá trình nghiên cứu
            </p>
          </div>
          {!isReadOnly && (
            <button 
              onClick={handleOpenModal}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
            >
              <FaPlus className="w-4 h-4" />
              Thêm đề tài
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
                  Thời gian
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngân sách
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">Không có đề tài nào</td>
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
                    <div className="text-xs text-gray-600">
                      <div>{project.startDate} - {project.endDate}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {editingProgressId === project.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingProgressValue}
                          onChange={(e) => setEditingProgressValue(e.target.value)}
                          onBlur={() => {
                            if (editingProgressValue !== '') {
                              handleSaveProgress(project.id, editingProgressValue);
                            } else {
                              handleCancelEditProgress();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingProgressValue !== '') {
                                handleSaveProgress(project.id, editingProgressValue);
                              }
                            } else if (e.key === 'Escape') {
                              handleCancelEditProgress();
                            }
                          }}
                          className="w-16 px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <span className="text-xs text-gray-500">%</span>
                        <button
                          onClick={() => handleSaveProgress(project.id, editingProgressValue)}
                          className="text-green-600 hover:text-green-700"
                          title="Lưu"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancelEditProgress}
                          className="text-red-600 hover:text-red-700"
                          title="Hủy"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1 transition-colors"
                        onClick={() => !isReadOnly && handleStartEditProgress(project)}
                        title={!isReadOnly ? "Click để sửa tiến độ" : ""}
                      >
                        <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {project.progress}%
                        </span>
                        {!isReadOnly && (
                          <FaEdit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {editingStatusId === project.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={editingStatusValue}
                          onChange={(e) => setEditingStatusValue(e.target.value)}
                          onBlur={() => {
                            if (editingStatusValue !== '') {
                              handleSaveStatus(project.id, editingStatusValue);
                            } else {
                              handleCancelEditStatus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingStatusValue !== '') {
                                handleSaveStatus(project.id, editingStatusValue);
                              }
                            } else if (e.key === 'Escape') {
                              handleCancelEditStatus();
                            }
                          }}
                          className="px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="dang_thuc_hien">Đang thực hiện</option>
                          <option value="hoan_thanh">Đã hoàn thành</option>
                          <option value="huy_bo">Hủy bỏ</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(project.id, editingStatusValue)}
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(project.status)}`}
                        onClick={() => !isReadOnly && handleStartEditStatus(project)}
                        title={!isReadOnly ? "Click để sửa trạng thái" : ""}
                      >
                        {project.statusText}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {project.budget} đ
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
                      {!isReadOnly && (
                        <>
                          <button 
                            onClick={() => handleEditProject(project)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(project.id)}
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
                  <span className="text-xs text-gray-600">Thời gian:</span>
                  <span className="text-xs text-gray-900 font-medium">{project.startDate} - {project.endDate}</span>
                </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Tiến độ:</span>
                      {editingProgressId === project.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingProgressValue}
                            onChange={(e) => setEditingProgressValue(e.target.value)}
                            onBlur={() => {
                              if (editingProgressValue !== '') {
                                handleSaveProgress(project.id, editingProgressValue);
                              } else {
                                handleCancelEditProgress();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (editingProgressValue !== '') {
                                  handleSaveProgress(project.id, editingProgressValue);
                                }
                              } else if (e.key === 'Escape') {
                                handleCancelEditProgress();
                              }
                            }}
                            className="w-16 px-2 py-1 border border-blue-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      ) : (
                        <span 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => !isReadOnly && handleStartEditProgress(project)}
                        >
                          {project.progress}%
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Trạng thái:</span>
                    {editingStatusId === project.id ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={editingStatusValue}
                          onChange={(e) => setEditingStatusValue(e.target.value)}
                          onBlur={() => {
                            if (editingStatusValue !== '') {
                              handleSaveStatus(project.id, editingStatusValue);
                            } else {
                              handleCancelEditStatus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingStatusValue !== '') {
                                handleSaveStatus(project.id, editingStatusValue);
                              }
                            } else if (e.key === 'Escape') {
                              handleCancelEditStatus();
                            }
                          }}
                          className="px-2 py-1 border border-blue-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="dang_thuc_hien">Đang thực hiện</option>
                          <option value="hoan_thanh">Đã hoàn thành</option>
                          <option value="huy_bo">Hủy bỏ</option>
                        </select>
                      </div>
                    ) : (
                      <span 
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(project.status)}`}
                        onClick={() => !isReadOnly && handleStartEditStatus(project)}
                      >
                        {project.statusText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">Ngân sách:</span>
                    <span className="text-sm font-semibold text-gray-900">{project.budget} đ</span>
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
                {!isReadOnly && (
                  <>
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
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

      {/* Modal thêm đề tài */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Thêm đề tài mới</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      value={formData.ten_de_tai}
                      onChange={(e) => setFormData({ ...formData, ten_de_tai: e.target.value })}
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
                      value={formData.linh_vuc}
                      onChange={(e) => setFormData({ ...formData, linh_vuc: e.target.value })}
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
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={formData.ngay_bat_dau}
                      onChange={(e) => setFormData({ ...formData, ngay_bat_dau: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hoàn thành dự kiến
                    </label>
                    <input
                      type="date"
                      value={formData.ngay_hoan_thanh}
                      onChange={(e) => setFormData({ ...formData, ngay_hoan_thanh: e.target.value })}
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
                      value={formData.tien_do}
                      onChange={(e) => setFormData({ ...formData, tien_do: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đánh giá
                    </label>
                    <textarea
                      value={formData.danh_gia}
                      onChange={(e) => setFormData({ ...formData, danh_gia: e.target.value })}
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
                  {submitting ? 'Đang tạo...' : 'Tạo đề tài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                        {!isReadOnly && (
                          <div className="space-y-3">
                            {/* Ô tìm kiếm nhân sự của Viện - Làm to và rõ hơn */}
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
                              <FaUserPlus className="w-5 h-5" />
                              Thêm người ngoài (không phải nhân sự của Viện)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Form thêm người ngoài */}
                      {showAddExternalPersonnel && !isReadOnly && (
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
                                {!isReadOnly && (
                                  <button
                                    onClick={() => handleRemovePersonnelFromProject(nhanSuDeTai.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Vai trò
                                  </label>
                                  {isReadOnly ? (
                                    <div className="text-sm text-gray-900">
                                      {nhanSuDeTai.vai_tro === 'chu_nhiem' ? 'Chủ nhiệm' :
                                       nhanSuDeTai.vai_tro === 'thanh_vien' ? 'Thành viên' :
                                       nhanSuDeTai.vai_tro === 'cong_tac_vien' ? 'Cộng tác viên' : '-'}
                                    </div>
                                  ) : (
                                    <select
                                      value={nhanSuDeTai.vai_tro || 'thanh_vien'}
                                      onChange={(e) => handleUpdatePersonnel(nhanSuDeTai.id, { vai_tro: e.target.value })}
                                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="chu_nhiem">Chủ nhiệm</option>
                                      <option value="thanh_vien">Thành viên</option>
                                      <option value="cong_tac_vien">Cộng tác viên</option>
                                    </select>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Chuyên môn
                                  </label>
                                  {isReadOnly ? (
                                    <div className="text-sm text-gray-900">{nhanSuDeTai.chuyen_mon || '-'}</div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={nhanSuDeTai.chuyen_mon || ''}
                                      onChange={(e) => handleUpdatePersonnel(nhanSuDeTai.id, { chuyen_mon: e.target.value })}
                                      placeholder="Nhập chuyên môn"
                                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có nhân sự nào. {!isReadOnly && 'Hãy thêm nhân sự vào đề tài.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Tài liệu */}
                  {detailTab === 'tai-lieu' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Danh sách tài liệu</h3>
                        {!isReadOnly && (
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
                        )}
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
                              {!isReadOnly && (
                                <button
                                  onClick={() => handleDeleteTaiLieu(taiLieu.id)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có tài liệu nào. {!isReadOnly && 'Hãy tải lên tài liệu cho đề tài.'}
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
                      Ngày hoàn thành dự kiến
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
                      <option value="dang_thuc_hien">Đang thực hiện</option>
                      <option value="hoan_thanh">Đã hoàn thành</option>
                      <option value="huy_bo">Hủy bỏ</option>
                    </select>
                    {editFormData.trang_thai === 'hoan_thanh' && (
                      <p className="text-xs text-green-600 mt-1">Tiến độ đã được tự động cập nhật thành 100%</p>
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

export default ResearchSession3;


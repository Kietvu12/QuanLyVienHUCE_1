import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaDownload, FaEye, FaEdit, FaTrash, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { baoCaoAPI } from '../../services/api';
import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getStatusLabel = (status) => {
  const statusMap = {
    'cho_phe_duyet': 'Chờ phê duyệt',
    'da_phe_duyet': 'Đã phê duyệt',
    'tu_choi': 'Từ chối',
  };
  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'da_phe_duyet':
      return 'bg-emerald-100 text-emerald-800';
    case 'cho_phe_duyet':
      return 'bg-yellow-100 text-yellow-800';
    case 'tu_choi':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getApprovalStatusColor = (status) => {
  switch (status) {
    case 'da_phe_duyet':
      return 'bg-emerald-100 text-emerald-800';
    case 'cho_phe_duyet':
      return 'bg-yellow-100 text-yellow-800';
    case 'tu_choi':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type) => {
  if (type?.includes('doanh thu')) return 'bg-emerald-100 text-emerald-800';
  if (type?.includes('đề tài')) return 'bg-blue-100 text-blue-800';
  if (type?.includes('nhân sự')) return 'bg-purple-100 text-purple-800';
  if (type?.includes('tài sản')) return 'bg-orange-100 text-orange-800';
  if (type?.includes('tài chính')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

const oldReports = [
  {
    id: 'BC-2025-001',
    name: 'Báo cáo doanh thu tháng 12/2025',
    type: 'Báo cáo doanh thu',
    createdBy: 'Nguyễn Văn A',
    createdDate: '15/12/2025',
    sentDate: '15/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đã duyệt',
    approvedBy: 'Trưởng phòng Tài chính',
    approvedDate: '16/12/2025',
    downloadCount: 25,
    fileSize: '2.5 MB',
  },
  {
    id: 'BC-2025-002',
    name: 'Báo cáo đề tài nghiên cứu Q4/2025',
    type: 'Báo cáo đề tài',
    createdBy: 'Trần Thị B',
    createdDate: '14/12/2025',
    sentDate: '14/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đang chờ duyệt',
    approvedBy: '-',
    approvedDate: '-',
    downloadCount: 0,
    fileSize: '3.2 MB',
  },
  {
    id: 'BC-2025-003',
    name: 'Báo cáo nhân sự tháng 12/2025',
    type: 'Báo cáo nhân sự',
    createdBy: 'Lê Văn C',
    createdDate: '13/12/2025',
    sentDate: '13/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đã gửi',
    approvedBy: '-',
    approvedDate: '-',
    downloadCount: 0,
    fileSize: '2.8 MB',
  },
  {
    id: 'BC-2025-004',
    name: 'Báo cáo tài sản năm 2025',
    type: 'Báo cáo tài sản',
    createdBy: 'Phạm Thị D',
    createdDate: '12/12/2025',
    sentDate: '12/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Từ chối',
    approvedBy: 'Giám đốc',
    approvedDate: '13/12/2025',
    rejectionReason: 'Thiếu thông tin chi tiết',
    downloadCount: 0,
    fileSize: '4.8 MB',
  },
  {
    id: 'BC-2025-005',
    name: 'Báo cáo tài chính Q4/2025',
    type: 'Báo cáo tài chính',
    createdBy: 'Hoàng Văn E',
    createdDate: '11/12/2025',
    sentDate: '-',
    status: 'Đã hoàn thành',
    approvalStatus: 'Chưa gửi',
    approvedBy: '-',
    approvedDate: '-',
    downloadCount: 0,
    fileSize: '5.1 MB',
  },
  {
    id: 'BC-2025-006',
    name: 'Báo cáo tổng hợp tháng 12/2025',
    type: 'Báo cáo doanh thu',
    createdBy: 'Nguyễn Thị F',
    createdDate: '10/12/2025',
    sentDate: '10/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đã duyệt',
    approvedBy: 'Phó Giám đốc',
    approvedDate: '11/12/2025',
    downloadCount: 45,
    fileSize: '5.2 MB',
  },
  {
    id: 'BC-2025-007',
    name: 'Báo cáo đề tài đang thực hiện',
    type: 'Báo cáo đề tài',
    createdBy: 'Trần Văn G',
    createdDate: '09/12/2025',
    sentDate: '09/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đang chờ duyệt',
    approvedBy: '-',
    approvedDate: '-',
    downloadCount: 0,
    fileSize: '1.8 MB',
  },
  {
    id: 'BC-2025-008',
    name: 'Báo cáo nhân sự mới',
    type: 'Báo cáo nhân sự',
    createdBy: 'Lê Thị H',
    createdDate: '08/12/2025',
    sentDate: '-',
    status: 'Đang xử lý',
    approvalStatus: 'Chưa gửi',
    approvedBy: '-',
    approvedDate: '-',
    downloadCount: 0,
    fileSize: '-',
  },
];

const ReportSession3 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user?.role ? `/${user.role}` : '/rector';
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Fetch danh sách báo cáo
  const fetchReports = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        id_vien: user.id_vien || undefined,
        id_nguoi_tao: user.id,
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (selectedApprovalStatus) {
        params.trang_thai = selectedApprovalStatus;
      }

      console.log('Fetching reports with params:', params);
      const response = await baoCaoAPI.getAll(params);
      console.log('Reports API response:', response);
      
      if (response.success) {
        setReports(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      } else {
        console.error('API returned success=false:', response);
        setReports([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách báo cáo:', error);
      setReports([]);
      // Không hiển thị alert để tránh spam
      // alert('Lỗi khi lấy danh sách báo cáo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReports();
    }
  }, [user?.id, pagination.page, selectedApprovalStatus]);

  // Xử lý gửi báo cáo
  const handleGuiBaoCao = async (id) => {
    try {
      const response = await baoCaoAPI.gui(id);
      if (response.success) {
        alert('Gửi báo cáo thành công!');
        fetchReports();
      } else {
        alert('Lỗi khi gửi báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      alert('Lỗi khi gửi báo cáo: ' + error.message);
    }
  };

  // Xử lý xóa báo cáo
  const handleDeleteBaoCao = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;
    
    try {
      const response = await baoCaoAPI.delete(id);
      if (response.success) {
        alert('Xóa báo cáo thành công!');
        fetchReports();
      } else {
        alert('Lỗi khi xóa báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa báo cáo:', error);
      alert('Lỗi khi xóa báo cáo: ' + error.message);
    }
  };

  // Lọc báo cáo theo search term
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.tieu_de?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id?.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách báo cáo</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và tạo báo cáo mới
            </p>
          </div>
          <button
            onClick={() => navigate(`${basePath}/report/create`)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto"
          >
            <FaPlus className="w-4 h-4" />
            Tạo báo cáo mới
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm tên báo cáo, mã báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả loại</option>
            <option value="revenue">Báo cáo doanh thu</option>
            <option value="research">Báo cáo đề tài</option>
            <option value="personnel">Báo cáo nhân sự</option>
            <option value="asset">Báo cáo tài sản</option>
            <option value="financial">Báo cáo tài chính</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="processing">Đang xử lý</option>
            <option value="pending">Chờ duyệt</option>
            <option value="failed">Lỗi</option>
          </select>
          <select 
            value={selectedApprovalStatus}
            onChange={(e) => {
              setSelectedApprovalStatus(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái duyệt</option>
            <option value="cho_phe_duyet">Chờ phê duyệt</option>
            <option value="da_phe_duyet">Đã phê duyệt</option>
            <option value="tu_choi">Từ chối</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã BC
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên báo cáo
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người tạo
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái duyệt
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người duyệt
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày duyệt
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lượt tải
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kích thước
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center">
                    <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-gray-500">
                    Không có báo cáo nào
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">BC-{report.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{report.tieu_de}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.tieu_de)}`}>
                      {report.tieu_de?.split(' ')[0] || 'Báo cáo'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.nguoiTao?.ho_ten || report.nguoiTao?.username || '-'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{formatDate(report.ngay_tao)}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('da_hoan_thanh')}`}>
                      Đã hoàn thành
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.trang_thai)}`}>
                      {getStatusLabel(report.trang_thai)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{formatDate(report.ngay_cap_nhat)}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-700">-</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-700">-</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
                      {report.status === 'Đã hoàn thành' && report.approvalStatus === 'Đã duyệt' && (
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải xuống">
                          <FaDownload className="w-4 h-4" />
                        </button>
                      )}
                      {report.trang_thai === 'cho_phe_duyet' && !report.ngay_gui && (
                        <button 
                          onClick={() => handleGuiBaoCao(report.id)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                          title="Gửi duyệt"
                        >
                          <FaPaperPlane className="w-4 h-4" />
                        </button>
                      )}
                      {report.trang_thai === 'tu_choi' && (
                        <button 
                          onClick={() => handleGuiBaoCao(report.id)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" 
                          title="Gửi lại"
                        >
                          <FaPaperPlane className="w-4 h-4" />
                        </button>
                      )}
                      {report.duong_dan_tai_lieu && (
                        <a 
                          href={report.duong_dan_tai_lieu}
                          download
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors inline-block" 
                          title="Tải xuống"
                        >
                          <FaDownload className="w-4 h-4" />
                        </a>
                      )}
                      {report.trang_thai === 'cho_phe_duyet' && (
                        <button 
                          onClick={() => navigate(`${basePath}/report/edit/${report.id}`)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      {report.trang_thai === 'cho_phe_duyet' && (
                        <button 
                          onClick={() => handleDeleteBaoCao(report.id)}
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

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có báo cáo nào
            </div>
          ) : (
            filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">BC-{report.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.tieu_de)}`}>
                      {report.tieu_de?.split(' ')[0] || 'Báo cáo'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{report.tieu_de}</h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Người tạo:</span>
                  <span className="text-xs text-gray-900 font-medium">{report.nguoiTao?.ho_ten || report.nguoiTao?.username || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ngày tạo:</span>
                  <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_tao)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Trạng thái:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('da_hoan_thanh')}`}>
                    Đã hoàn thành
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Trạng thái duyệt:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.trang_thai)}`}>
                    {getStatusLabel(report.trang_thai)}
                  </span>
                </div>
                {report.nguoiPheDuyet && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Người duyệt:</span>
                      <span className="text-xs text-gray-900 font-medium">{report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Ngày duyệt:</span>
                      <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_cap_nhat)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                {report.trang_thai === 'cho_phe_duyet' && !report.ngay_gui && (
                  <button 
                    onClick={() => handleGuiBaoCao(report.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                    title="Gửi duyệt"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                )}
                {report.trang_thai === 'tu_choi' && (
                  <button 
                    onClick={() => handleGuiBaoCao(report.id)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors" 
                    title="Gửi lại"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                )}
                {report.duong_dan_tai_lieu && (
                  <a 
                    href={report.duong_dan_tai_lieu}
                    download
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors inline-block" 
                    title="Tải xuống"
                  >
                    <FaDownload className="w-4 h-4" />
                  </a>
                )}
                {report.trang_thai === 'cho_phe_duyet' && (
                  <>
                    <button 
                      onClick={() => navigate(`${basePath}/report/edit/${report.id}`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" 
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBaoCao(report.id)}
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
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportSession3;


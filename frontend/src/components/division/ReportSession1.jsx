import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheckCircle, FaTimesCircle, FaBuilding, FaFileAlt, FaDownload, FaSpinner, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { baoCaoAPI, vienAPI } from '../../services/api';
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
    'cho_cap_phong_duyet': 'Chờ cấp phòng duyệt',
    'da_cap_phong_duyet': 'Đã cấp phòng duyệt',
    'cap_phong_tu_choi': 'Cấp phòng từ chối',
  };
  return statusMap[status] || status;
};

const getApprovalStatusColor = (status) => {
  switch (status) {
    case 'da_phe_duyet':
    case 'da_cap_phong_duyet':
      return 'bg-emerald-100 text-emerald-800';
    case 'cho_phe_duyet':
      return 'bg-yellow-100 text-yellow-800';
    case 'cho_cap_phong_duyet':
      return 'bg-purple-100 text-purple-800';
    case 'tu_choi':
    case 'cap_phong_tu_choi':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type) => {
  if (type.includes('doanh thu')) return 'bg-emerald-100 text-emerald-800';
  if (type.includes('đề tài')) return 'bg-blue-100 text-blue-800';
  if (type.includes('nhân sự')) return 'bg-purple-100 text-purple-800';
  if (type.includes('tài sản')) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
};

const ReportSession1 = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVien, setSelectedVien] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('cho_cap_phong_duyet'); // Mặc định hiển thị chờ cấp phòng duyệt
  const [vienList, setVienList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  // Fetch danh sách viện
  useEffect(() => {
    const fetchViens = async () => {
      try {
        const response = await vienAPI.getAll();
        if (response.success) {
          setVienList(response.data || []);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách viện:', error);
      }
    };
    fetchViens();
  }, []);

  // Fetch danh sách báo cáo
  const fetchReports = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        // Cấp phòng xem tất cả báo cáo (không filter theo id_vien)
      };
      
      // Filter theo trạng thái
      if (selectedStatus) {
        params.trang_thai = selectedStatus;
      }
      // Nếu không chọn trạng thái, không filter (hiển thị tất cả)
      
      if (selectedVien) {
        params.id_vien = selectedVien;
      }

      const response = await baoCaoAPI.getAll(params);
      
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
        setReports([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách báo cáo:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReports();
    }
  }, [user?.id, pagination.page, selectedVien, selectedStatus]);

  // Xem chi tiết báo cáo
  const handleViewDetail = async (report) => {
    try {
      setLoading(true);
      const response = await baoCaoAPI.getById(report.id);
      if (response.success) {
        setReportDetail(response.data);
        setShowDetailModal(true);
      } else {
        alert('Lỗi khi lấy chi tiết báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết báo cáo:', error);
      alert('Lỗi khi lấy chi tiết báo cáo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (report) => {
    setSelectedReport(report);
    setShowApproveModal(true);
  };

  const handleReject = (report) => {
    setSelectedReport(report);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedReport) return;

    setProcessing(true);
    try {
      const response = await baoCaoAPI.pheDuyet(selectedReport.id, user.id);
      if (response.success) {
        alert('Phê duyệt báo cáo thành công!');
        setShowApproveModal(false);
        setSelectedReport(null);
        fetchReports();
      } else {
        alert('Lỗi khi phê duyệt báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi phê duyệt báo cáo:', error);
      alert('Lỗi khi phê duyệt báo cáo: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (!selectedReport) return;

    setProcessing(true);
    try {
      const response = await baoCaoAPI.tuChoi(selectedReport.id, user.id, rejectionReason);
      if (response.success) {
        alert('Từ chối báo cáo thành công!');
        setShowRejectModal(false);
        setSelectedReport(null);
        setRejectionReason('');
        fetchReports();
      } else {
        alert('Lỗi khi từ chối báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi từ chối báo cáo:', error);
      alert('Lỗi khi từ chối báo cáo: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Lọc báo cáo theo search term
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.tieu_de?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id?.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Parse lịch sử từ chối
  const parseLichSuTuChoi = (lichSuTuChoi) => {
    if (!lichSuTuChoi) return [];
    try {
      return JSON.parse(lichSuTuChoi);
    } catch (e) {
      return [];
    }
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách báo cáo các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem và phê duyệt báo cáo từ các Viện
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
                placeholder="Tìm kiếm tên báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select 
            value={selectedVien}
            onChange={(e) => {
              setSelectedVien(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả Viện</option>
            {vienList.map((vien) => (
              <option key={vien.id} value={vien.id}>{vien.ten_vien}</option>
            ))}
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
            <option value="cho_cap_phong_duyet">Chờ cấp phòng duyệt</option>
            <option value="da_cap_phong_duyet">Đã cấp phòng duyệt</option>
            <option value="cap_phong_tu_choi">Cấp phòng từ chối</option>
            <option value="cho_phe_duyet">Chờ phê duyệt (Viện trưởng)</option>
            <option value="da_phe_duyet">Đã phê duyệt (Viện trưởng)</option>
            <option value="tu_choi">Từ chối (Viện trưởng)</option>
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
                  Viện
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người tạo
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày gửi
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
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center">
                    <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-gray-500">
                    Không có báo cáo nào
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const lichSuTuChoi = parseLichSuTuChoi(report.lich_su_tu_choi);
                  return (
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
                        <div className="flex items-center gap-2">
                          <FaBuilding className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">{report.vien?.ten_vien || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{report.nguoiTao?.ho_ten || report.nguoiTao?.username || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{formatDate(report.ngay_gui)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.trang_thai)}`}>
                            {getStatusLabel(report.trang_thai)}
                          </span>
                          {report.ly_do_tu_choi && (
                            <p className="text-xs text-red-600 max-w-xs truncate" title={report.ly_do_tu_choi}>
                              Lý do: {report.ly_do_tu_choi}
                            </p>
                          )}
                        </div>
                      </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {report.nguoiPheDuyet && (
                        <div className="text-xs">
                          <span className="text-gray-500">Viện trưởng: </span>
                          <span className="text-sm text-gray-700">{report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}</span>
                        </div>
                      )}
                      {report.nguoiCapPhongPheDuyet && (
                        <div className="text-xs">
                          <span className="text-gray-500">Cấp phòng: </span>
                          <span className="text-sm text-gray-700">{report.nguoiCapPhongPheDuyet?.ho_ten || report.nguoiCapPhongPheDuyet?.username || '-'}</span>
                        </div>
                      )}
                      {!report.nguoiPheDuyet && !report.nguoiCapPhongPheDuyet && (
                        <span className="text-sm text-gray-700">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {report.nguoiPheDuyet && (
                        <div className="text-xs">
                          <span className="text-gray-500">Viện trưởng: </span>
                          <span className="text-sm text-gray-700">{formatDate(report.ngay_cap_nhat)}</span>
                        </div>
                      )}
                      {report.nguoiCapPhongPheDuyet && (
                        <div className="text-xs">
                          <span className="text-gray-500">Cấp phòng: </span>
                          <span className="text-sm text-gray-700">{formatDate(report.ngay_cap_phong_duyet || report.ngay_cap_nhat)}</span>
                        </div>
                      )}
                      {!report.nguoiPheDuyet && !report.nguoiCapPhongPheDuyet && (
                        <span className="text-sm text-gray-700">-</span>
                      )}
                    </div>
                  </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleViewDetail(report)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          {report.trang_thai === 'cho_cap_phong_duyet' && (
                            <>
                              <button
                                onClick={() => handleApprove(report)}
                                disabled={processing}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                                title="Phê duyệt"
                              >
                                <FaCheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(report)}
                                disabled={processing}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Từ chối"
                              >
                                <FaTimesCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
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
            <div className="text-center py-8">
              <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có báo cáo nào</div>
          ) : (
            filteredReports.map((report) => {
              const lichSuTuChoi = parseLichSuTuChoi(report.lich_su_tu_choi);
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-blue-600">BC-{report.id}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.tieu_de)}`}>
                          {report.tieu_de?.split(' ')[0] || 'Báo cáo'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.trang_thai)}`}>
                          {getStatusLabel(report.trang_thai)}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{report.tieu_de}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">Viện: </span>
                      <span className="text-xs text-gray-900 font-medium">{report.vien?.ten_vien || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Người tạo:</span>
                      <span className="text-xs text-gray-900 font-medium">{report.nguoiTao?.ho_ten || report.nguoiTao?.username || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Ngày gửi:</span>
                      <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_gui)}</span>
                    </div>
                    {report.ly_do_tu_choi && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        Lý do từ chối: {report.ly_do_tu_choi}
                      </div>
                    )}
                    {lichSuTuChoi.length > 0 && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <p className="font-medium mb-1">Lịch sử từ chối:</p>
                        {lichSuTuChoi.map((item, idx) => (
                          <p key={idx} className="text-xs">
                            {idx + 1}. {item.ten_nguoi_tu_choi} - {formatDate(item.ngay_tu_choi)}: {item.ly_do || 'Không có lý do'}
                          </p>
                        ))}
                      </div>
                    )}
                    {report.nguoiPheDuyet && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Người duyệt (Viện trưởng):</span>
                          <span className="text-xs text-gray-900 font-medium">
                            {report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Ngày duyệt (Viện trưởng):</span>
                          <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_cap_nhat)}</span>
                        </div>
                      </>
                    )}
                    {report.nguoiCapPhongPheDuyet && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Người duyệt (Cấp phòng):</span>
                          <span className="text-xs text-gray-900 font-medium">
                            {report.nguoiCapPhongPheDuyet?.ho_ten || report.nguoiCapPhongPheDuyet?.username || '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Ngày duyệt (Cấp phòng):</span>
                          <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_cap_phong_duyet || report.ngay_cap_nhat)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleViewDetail(report)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                      title="Xem chi tiết"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    {report.trang_thai === 'cho_cap_phong_duyet' && (
                      <>
                        <button
                          onClick={() => handleApprove(report)}
                          disabled={processing}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                          title="Phê duyệt"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(report)}
                          disabled={processing}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Từ chối"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.total > 0 && (
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
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
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

      {/* Approve Modal */}
      {showApproveModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Phê duyệt báo cáo</h3>
                <p className="text-sm text-gray-500">Xác nhận phê duyệt báo cáo này?</p>
              </div>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Báo cáo:</p>
              <p className="text-sm text-gray-700">{selectedReport.tieu_de}</p>
              <p className="text-sm text-gray-700 mt-1">Mã: BC-{selectedReport.id}</p>
              <p className="text-sm text-gray-700 mt-1">Viện: {selectedReport.vien?.ten_vien || '-'}</p>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedReport(null);
                }}
                disabled={processing}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmApprove}
                disabled={processing}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận phê duyệt'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FaTimesCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Từ chối báo cáo</h3>
                <p className="text-sm text-gray-500">Nhập lý do từ chối báo cáo</p>
              </div>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Báo cáo:</p>
              <p className="text-sm text-gray-700">{selectedReport.tieu_de}</p>
              <p className="text-sm text-gray-700 mt-1">Mã: BC-{selectedReport.id}</p>
              <p className="text-sm text-gray-700 mt-1">Viện: {selectedReport.vien?.ten_vien || '-'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full h-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedReport(null);
                  setRejectionReason('');
                }}
                disabled={processing}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={processing || !rejectionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận từ chối'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && reportDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết báo cáo</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setReportDetail(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Mã báo cáo:</p>
                  <p className="text-sm font-medium text-gray-900">BC-{reportDetail.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Trạng thái:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(reportDetail.trang_thai)}`}>
                    {getStatusLabel(reportDetail.trang_thai)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tiêu đề:</p>
                  <p className="text-sm font-medium text-gray-900">{reportDetail.tieu_de}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Viện:</p>
                  <p className="text-sm font-medium text-gray-900">{reportDetail.vien?.ten_vien || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Người tạo:</p>
                  <p className="text-sm font-medium text-gray-900">{reportDetail.nguoiTao?.ho_ten || reportDetail.nguoiTao?.username || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Ngày tạo:</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(reportDetail.ngay_tao)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Ngày gửi:</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(reportDetail.ngay_gui)}</p>
                </div>
                {reportDetail.nguoiPheDuyet && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Người phê duyệt (Viện trưởng):</p>
                      <p className="text-sm font-medium text-gray-900">{reportDetail.nguoiPheDuyet?.ho_ten || reportDetail.nguoiPheDuyet?.username || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Ngày phê duyệt (Viện trưởng):</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(reportDetail.ngay_cap_nhat)}</p>
                    </div>
                  </>
                )}
                {reportDetail.nguoiCapPhongPheDuyet && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Người phê duyệt (Cấp phòng):</p>
                      <p className="text-sm font-medium text-gray-900">{reportDetail.nguoiCapPhongPheDuyet?.ho_ten || reportDetail.nguoiCapPhongPheDuyet?.username || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Ngày phê duyệt (Cấp phòng):</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(reportDetail.ngay_cap_phong_duyet || reportDetail.ngay_cap_nhat)}</p>
                    </div>
                  </>
                )}
              </div>
              
              {reportDetail.ly_do_tu_choi && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-xs font-medium text-red-800 mb-1">Lý do từ chối:</p>
                  <p className="text-sm text-red-700">{reportDetail.ly_do_tu_choi}</p>
                </div>
              )}
              
              {reportDetail.lich_su_tu_choi && parseLichSuTuChoi(reportDetail.lich_su_tu_choi).length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-800 mb-2">Lịch sử từ chối:</p>
                  <div className="space-y-2">
                    {parseLichSuTuChoi(reportDetail.lich_su_tu_choi).map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-700 border-l-2 border-red-300 pl-2">
                        <p className="font-medium">{idx + 1}. {item.ten_nguoi_tu_choi} - {formatDate(item.ngay_tu_choi)}</p>
                        <p className="text-gray-600">{item.ly_do || 'Không có lý do'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {reportDetail.duong_dan_tai_lieu && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-800 mb-2">Tài liệu:</p>
                  <a
                    href={reportDetail.duong_dan_tai_lieu.startsWith('http') ? reportDetail.duong_dan_tai_lieu : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${reportDetail.duong_dan_tai_lieu}`}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FaDownload className="w-4 h-4" />
                    Tải xuống tài liệu
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportSession1;


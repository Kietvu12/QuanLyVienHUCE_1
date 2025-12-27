import { FaSearch, FaBuilding, FaEye, FaDownload, FaCheckCircle, FaTimesCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
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
  if (!type) return 'bg-gray-100 text-gray-800';
  const title = type.toLowerCase();
  if (title.includes('doanh thu')) return 'bg-emerald-100 text-emerald-800';
  if (title.includes('đề tài')) return 'bg-blue-100 text-blue-800';
  if (title.includes('nhân sự')) return 'bg-purple-100 text-purple-800';
  if (title.includes('tài sản')) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
};

const ReportSession2 = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [user?.id, selectedStatus]);

  const fetchReports = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        trang_thai: selectedStatus || undefined,
        limit: 1000,
      };

      const response = await baoCaoAPI.getAll(params);
      
      if (response.success) {
        // Lọc chỉ lấy báo cáo đã được gửi (có ngay_gui)
        const sentReports = (response.data || []).filter(report => report.ngay_gui);
        setReports(sentReports);
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

  const handlePheDuyet = async (reportId) => {
    if (!confirm('Bạn có chắc chắn muốn phê duyệt báo cáo này?')) return;

    setProcessing(true);
    try {
      const response = await baoCaoAPI.pheDuyet(reportId, user.id);
      if (response.success) {
        alert('Phê duyệt báo cáo thành công!');
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

  const handleOpenRejectModal = (report) => {
    setSelectedReport(report);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedReport(null);
    setRejectReason('');
  };

  const handleTuChoi = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (!selectedReport) return;

    setProcessing(true);
    try {
      const response = await baoCaoAPI.tuChoi(selectedReport.id, user.id, rejectReason);
      if (response.success) {
        alert('Từ chối báo cáo thành công!');
        handleCloseRejectModal();
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.tieu_de?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách báo cáo các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách báo cáo được các Viện gửi lên
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
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
                          <p className="text-xs text-red-600 mt-1 max-w-xs truncate" title={report.ly_do_tu_choi}>
                            Lý do: {report.ly_do_tu_choi}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{formatDate(report.ngay_cap_nhat)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                          <FaEye className="w-4 h-4" />
                        </button>
                        {report.trang_thai === 'cho_phe_duyet' && (
                          <>
                            <button
                              onClick={() => handlePheDuyet(report.id)}
                              disabled={processing}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                              title="Phê duyệt"
                            >
                              <FaCheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(report)}
                              disabled={processing}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title="Từ chối"
                            >
                              <FaTimesCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {report.duong_dan_tai_lieu && (
                          <a
                            href={report.duong_dan_tai_lieu.startsWith('http') ? report.duong_dan_tai_lieu : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${report.duong_dan_tai_lieu}`}
                            download
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors inline-block"
                            title="Tải xuống"
                          >
                            <FaDownload className="w-4 h-4" />
                          </a>
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
                  <div className="flex-1 min-w-0">
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
                  <div>
                    <span className="text-xs text-gray-600">Người tạo: </span>
                    <span className="text-xs text-gray-900 font-medium">{report.nguoiTao?.ho_ten || report.nguoiTao?.username || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Ngày gửi: </span>
                    <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_gui)}</span>
                  </div>
                  {report.trang_thai !== 'cho_phe_duyet' && (
                    <>
                      <div>
                        <span className="text-xs text-gray-600">Người duyệt: </span>
                        <span className="text-xs text-gray-900 font-medium">{report.nguoiPheDuyet?.ho_ten || report.nguoiPheDuyet?.username || '-'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Ngày duyệt: </span>
                        <span className="text-xs text-gray-900 font-medium">{formatDate(report.ngay_cap_nhat)}</span>
                      </div>
                    </>
                  )}
                  {report.ly_do_tu_choi && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs text-red-600 font-medium">Lý do từ chối: {report.ly_do_tu_choi}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <FaEye className="w-4 h-4" />
                  </button>
                  {report.trang_thai === 'cho_phe_duyet' && (
                    <>
                      <button
                        onClick={() => handlePheDuyet(report.id)}
                        disabled={processing}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                        title="Phê duyệt"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenRejectModal(report)}
                        disabled={processing}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Từ chối"
                      >
                        <FaTimesCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {report.duong_dan_tai_lieu && (
                    <a
                      href={report.duong_dan_tai_lieu.startsWith('http') ? report.duong_dan_tai_lieu : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${report.duong_dan_tai_lieu}`}
                      download
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors inline-block"
                      title="Tải xuống"
                    >
                      <FaDownload className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal từ chối báo cáo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Từ chối báo cáo</h3>
              <button
                onClick={handleCloseRejectModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Báo cáo:</strong> {selectedReport?.tieu_de}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Viện:</strong> {selectedReport?.vien?.ten_vien || '-'}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối báo cáo..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseRejectModal}
                disabled={processing}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleTuChoi}
                disabled={processing || !rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="w-4 h-4" />
                    Từ chối
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportSession2;

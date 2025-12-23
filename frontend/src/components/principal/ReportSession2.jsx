import { FaSearch, FaBuilding, FaEye, FaDownload, FaFileAlt } from 'react-icons/fa';
import React from 'react';
const reports = [
  {
    id: 'BC-2025-001',
    name: 'Báo cáo doanh thu tháng 12/2025',
    type: 'Báo cáo doanh thu',
    institute: 'Viện Tin học Xây Dựng',
    createdBy: 'Nguyễn Văn A',
    createdDate: '15/12/2025',
    sentDate: '15/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đã duyệt',
    approvedBy: 'Ban Giám hiệu',
    approvedDate: '16/12/2025',
    downloadCount: 25,
    fileSize: '2.5 MB',
  },
  {
    id: 'BC-2025-002',
    name: 'Báo cáo đề tài nghiên cứu Q4/2025',
    type: 'Báo cáo đề tài',
    institute: 'Viện Khoa học Công nghệ',
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
    institute: 'Viện Nghiên cứu Phát triển',
    createdBy: 'Lê Văn C',
    createdDate: '13/12/2025',
    sentDate: '13/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Đã duyệt',
    approvedBy: 'Ban Giám hiệu',
    approvedDate: '14/12/2025',
    downloadCount: 18,
    fileSize: '2.8 MB',
  },
  {
    id: 'BC-2025-004',
    name: 'Báo cáo tài sản năm 2025',
    type: 'Báo cáo tài sản',
    institute: 'Viện Tin học Xây Dựng',
    createdBy: 'Phạm Thị D',
    createdDate: '12/12/2025',
    sentDate: '12/12/2025',
    status: 'Đã hoàn thành',
    approvalStatus: 'Từ chối',
    approvedBy: 'Ban Giám hiệu',
    approvedDate: '13/12/2025',
    rejectionReason: 'Thiếu thông tin chi tiết',
    downloadCount: 0,
    fileSize: '4.8 MB',
  },
];

const getApprovalStatusColor = (status) => {
  switch (status) {
    case 'Đã duyệt':
      return 'bg-emerald-100 text-emerald-800';
    case 'Đang chờ duyệt':
      return 'bg-yellow-100 text-yellow-800';
    case 'Đã gửi':
      return 'bg-blue-100 text-blue-800';
    case 'Từ chối':
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

const ReportSession2 = () => {
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
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả Viện</option>
            <option value="vien1">Viện Tin học Xây Dựng</option>
            <option value="vien2">Viện Khoa học Công nghệ</option>
            <option value="vien3">Viện Nghiên cứu Phát triển</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả loại</option>
            <option value="doanhthu">Báo cáo doanh thu</option>
            <option value="detai">Báo cáo đề tài</option>
            <option value="nhansu">Báo cáo nhân sự</option>
            <option value="taisan">Báo cáo tài sản</option>
          </select>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="daduyet">Đã duyệt</option>
            <option value="choduyet">Chờ duyệt</option>
            <option value="tuchoi">Từ chối</option>
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
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{report.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{report.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{report.institute}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.createdBy}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.sentDate}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.approvalStatus)}`}>
                      {report.approvalStatus}
                    </span>
                    {report.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1" title={report.rejectionReason}>
                        Lý do: {report.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.approvedBy}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{report.approvedDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
                      {report.approvalStatus === 'Đã duyệt' && (
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải xuống">
                          <FaDownload className="w-4 h-4" />
                        </button>
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
          {reports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{report.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(report.approvalStatus)}`}>
                      {report.approvalStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{report.name}</h4>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <FaEye className="w-4 h-4" />
                  </button>
                  {report.approvalStatus === 'Đã duyệt' && (
                    <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải xuống">
                      <FaDownload className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Viện: </span>
                  <span className="text-xs text-gray-900 font-medium">{report.institute}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Người tạo: </span>
                  <span className="text-xs text-gray-900 font-medium">{report.createdBy}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Ngày gửi: </span>
                  <span className="text-xs text-gray-900 font-medium">{report.sentDate}</span>
                </div>
                {report.approvalStatus !== 'Đang chờ duyệt' && (
                  <>
                    <div>
                      <span className="text-xs text-gray-600">Người duyệt: </span>
                      <span className="text-xs text-gray-900 font-medium">{report.approvedBy}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Ngày duyệt: </span>
                      <span className="text-xs text-gray-900 font-medium">{report.approvedDate}</span>
                    </div>
                  </>
                )}
                {report.rejectionReason && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-xs text-red-600 font-medium">Lý do từ chối: {report.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-4 của 4 kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSession2;


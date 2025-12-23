import { FaBuilding, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import React from 'react'
const pendingReports = [
  {
    id: 'BC-2025-001',
    name: 'Báo cáo doanh thu tháng 12/2025',
    type: 'Báo cáo doanh thu',
    institute: 'Viện Tin học Xây Dựng',
    createdBy: 'Nguyễn Văn A',
    sentDate: '15/12/2025',
  },
  {
    id: 'BC-2025-002',
    name: 'Báo cáo đề tài nghiên cứu Q4/2025',
    type: 'Báo cáo đề tài',
    institute: 'Viện Khoa học Công nghệ',
    createdBy: 'Trần Thị B',
    sentDate: '14/12/2025',
  },
  {
    id: 'BC-2025-005',
    name: 'Báo cáo nhân sự tháng 12/2025',
    type: 'Báo cáo nhân sự',
    institute: 'Viện Nghiên cứu Phát triển',
    createdBy: 'Lê Văn C',
    sentDate: '13/12/2025',
  },
];

const getTypeColor = (type) => {
  if (type.includes('doanh thu')) return 'bg-emerald-100 text-emerald-800';
  if (type.includes('đề tài')) return 'bg-blue-100 text-blue-800';
  if (type.includes('nhân sự')) return 'bg-purple-100 text-purple-800';
  if (type.includes('tài sản')) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
};

const DashboardSession3 = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Báo cáo chờ duyệt</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách báo cáo từ các Viện đang chờ phê duyệt
            </p>
          </div>
          <button
            onClick={() => navigate('/division/report')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả →
          </button>
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
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.map((report) => (
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
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate('/division/report')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('/division/report')}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Phê duyệt"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('/division/report')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Từ chối"
                      >
                        <FaTimesCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{report.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{report.name}</h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Viện:</span>
                  <span className="text-xs text-gray-900 font-medium">{report.institute}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Người tạo:</span>
                  <span className="text-xs text-gray-900 font-medium">{report.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Ngày gửi:</span>
                  <span className="text-xs text-gray-900 font-medium">{report.sentDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate('/division/report')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Xem chi tiết"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/division/report')}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  title="Phê duyệt"
                >
                  <FaCheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/division/report')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Từ chối"
                >
                  <FaTimesCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSession3;


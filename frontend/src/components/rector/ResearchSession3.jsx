import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const ResearchSession3 = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'accountant';

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
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
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
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả lĩnh vực</option>
            <option value="it">Công nghệ thông tin</option>
            <option value="construction">Xây dựng</option>
            <option value="engineering">Kỹ thuật</option>
            <option value="science">Khoa học</option>
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
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngân sách
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {activeProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{project.id}</span>
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
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {project.budget} đ
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {!isReadOnly && (
                        <>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Chỉnh sửa">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </>
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
          {activeProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{project.id}</span>
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
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">Ngân sách:</span>
                  <span className="text-sm font-semibold text-gray-900">{project.budget} đ</span>
                </div>
              </div>

              {!isReadOnly && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Chỉnh sửa">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-6 của 45 kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              3
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

export default ResearchSession3;


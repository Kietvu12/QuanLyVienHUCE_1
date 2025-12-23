import { FaSearch, FaBuilding, FaUsers, FaFlask, FaEye, FaDollarSign } from 'react-icons/fa';
import React from 'react';
const projects = [
  {
    id: 'DT-2025-001',
    name: 'Nghiên cứu ứng dụng AI trong quản lý dự án xây dựng',
    leader: 'Nguyễn Văn A',
    participants: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'],
    field: 'Công nghệ thông tin',
    institute: 'Viện Tin học Xây Dựng',
    startDate: '01/03/2025',
    endDate: '30/12/2025',
    progress: 65,
    status: 'Đang thực hiện',
    budget: '500.000.000',
    revenue: '320.000.000',
  },
  {
    id: 'DT-2025-002',
    name: 'Phát triển hệ thống quản lý tài nguyên nước',
    leader: 'Trần Thị B',
    participants: ['Trần Thị B', 'Hoàng Văn E'],
    field: 'Kỹ thuật',
    institute: 'Viện Khoa học Công nghệ',
    startDate: '15/02/2025',
    endDate: '15/11/2025',
    progress: 45,
    status: 'Đang thực hiện',
    budget: '350.000.000',
    revenue: '180.000.000',
  },
  {
    id: 'DT-2025-003',
    name: 'Nghiên cứu vật liệu xây dựng bền vững',
    leader: 'Lê Văn C',
    participants: ['Lê Văn C', 'Nguyễn Thị F', 'Trần Văn G'],
    field: 'Xây dựng',
    institute: 'Viện Nghiên cứu Phát triển',
    startDate: '01/01/2025',
    endDate: '31/10/2025',
    progress: 80,
    status: 'Đang thực hiện',
    budget: '600.000.000',
    revenue: '450.000.000',
  },
];

const ResearchSession3 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách đề tài nghiên cứu</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách đề tài, doanh thu, tiến độ, nhân sự tham gia của tất cả các Viện
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
                placeholder="Tìm kiếm tên đề tài..."
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
            <option value="">Tất cả trạng thái</option>
            <option value="dangthuchien">Đang thực hiện</option>
            <option value="hoanthanh">Đã hoàn thành</option>
            <option value="tamhoan">Tạm hoãn</option>
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
                  Viện
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người phụ trách
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người tham gia
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lĩnh vực
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngân sách
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{project.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaFlask className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{project.institute}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{project.leader}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex -space-x-2">
                      {project.participants.map((participant, index) => {
                        const initials = participant
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(-2);
                        const colors = [
                          'from-blue-400 to-blue-600',
                          'from-purple-400 to-purple-600',
                          'from-emerald-400 to-emerald-600',
                          'from-orange-400 to-orange-600',
                          'from-pink-400 to-pink-600',
                          'from-teal-400 to-teal-600',
                        ];
                        const colorClass = colors[index % colors.length];
                        return (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-semibold text-xs border-2 border-white shadow-sm`}
                            title={participant}
                          >
                            {initials}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {project.field}
                    </span>
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
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <FaDollarSign className="w-3 h-3 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-600">
                        {project.revenue} đ
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
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
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <FaFlask className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-blue-600">{project.id}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {project.field}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{project.name}</h4>
                </div>
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0" title="Xem chi tiết">
                  <FaEye className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Viện: </span>
                  <span className="text-xs text-gray-900 font-medium">{project.institute}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Người phụ trách: </span>
                  <span className="text-xs text-gray-900 font-medium">{project.leader}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-600 block mb-2">Người tham gia:</span>
                  <div className="flex -space-x-2 flex-wrap">
                    {project.participants.map((participant, index) => {
                      const initials = participant
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(-2);
                      const colors = [
                        'from-blue-400 to-blue-600',
                        'from-purple-400 to-purple-600',
                        'from-emerald-400 to-emerald-600',
                        'from-orange-400 to-orange-600',
                        'from-pink-400 to-pink-600',
                        'from-teal-400 to-teal-600',
                      ];
                      const colorClass = colors[index % colors.length];
                      return (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-semibold text-xs border-2 border-white shadow-sm`}
                          title={participant}
                        >
                          {initials}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Tiến độ:</span>
                    <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Ngân sách:</span>
                    <span className="text-sm font-semibold text-gray-900">{project.budget} đ</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Doanh thu:</span>
                    <div className="flex items-center gap-1">
                      <FaDollarSign className="w-3 h-3 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-600">{project.revenue} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-3 của 3 kết quả
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

export default ResearchSession3;


import { FaFlask, FaBuilding } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import React from 'react'
const recentProjects = [
  {
    id: 'DT-2025-001',
    name: 'Nghiên cứu ứng dụng AI trong quản lý dự án xây dựng',
    participants: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
    field: 'Công nghệ thông tin',
    institute: 'Viện Tin học Xây Dựng',
  },
  {
    id: 'DT-2025-002',
    name: 'Phát triển hệ thống quản lý tài nguyên nước',
    participants: ['Phạm Thị D', 'Hoàng Văn E'],
    field: 'Kỹ thuật',
    institute: 'Viện Khoa học Công nghệ',
  },
  {
    id: 'DT-2025-003',
    name: 'Nghiên cứu vật liệu xây dựng bền vững',
    participants: ['Nguyễn Thị F', 'Trần Văn G', 'Lê Thị H'],
    field: 'Xây dựng',
    institute: 'Viện Nghiên cứu Phát triển',
  },
  {
    id: 'DT-2025-004',
    name: 'Ứng dụng IoT trong giám sát công trình',
    participants: ['Phạm Văn I', 'Hoàng Thị K'],
    field: 'Công nghệ thông tin',
    institute: 'Viện Tin học Xây Dựng',
  },
  {
    id: 'DT-2025-005',
    name: 'Nghiên cứu tối ưu hóa năng lượng trong xây dựng',
    participants: ['Nguyễn Văn L', 'Trần Thị M'],
    field: 'Khoa học',
    institute: 'Viện Khoa học Công nghệ',
  },
];

const DashboardSession4 = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Đề tài nghiên cứu mới nhất</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách đề tài từ tất cả các Viện (chỉ hiển thị tên, người tham gia, lĩnh vực)
            </p>
          </div>
          <button
            onClick={() => navigate('/division/research')}
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
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
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
                    <div className="flex flex-wrap gap-1">
                      {project.participants.map((participant, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {participant}
                        </span>
                      ))}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600">{project.id}</span>
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
                    {project.participants.map((participant, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Viện:</span>
                  <span className="text-xs text-gray-900 font-medium">{project.institute}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSession4;


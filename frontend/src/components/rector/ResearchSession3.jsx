import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { deTaiNghienCuuAPI } from '../../services/api';

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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const ResearchSession3 = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'accountant';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchProjects();
  }, [user?.id_vien, pagination.page, searchTerm, selectedField]);

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

          return {
            id: deTai.id,
            name: deTai.ten_de_tai,
            leader: leader,
            field: deTai.linh_vuc || '-',
            startDate: deTai.ngay_bat_dau ? formatDate(deTai.ngay_bat_dau) : '-',
            endDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            progress: deTai.tien_do || 0,
            status: deTai.trang_thai === 'dang_thuc_hien' ? 'Đang thực hiện' : deTai.trang_thai,
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
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                    title="Xóa"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
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
    </section>
  );
};

export default ResearchSession3;


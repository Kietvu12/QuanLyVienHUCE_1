import { FaSearch, FaDownload, FaEye } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

const completedProjects = [
  {
    id: 'DT-2024-045',
    name: 'Nghiên cứu hệ thống quản lý chất thải xây dựng',
    leader: 'Nguyễn Văn X',
    field: 'Xây dựng',
    startDate: '01/01/2024',
    endDate: '30/11/2024',
    completedDate: '25/11/2024',
    status: 'Đã hoàn thành',
    budget: '550.000.000',
    result: 'Xuất sắc',
  },
  {
    id: 'DT-2024-044',
    name: 'Phát triển ứng dụng quản lý dự án trên mobile',
    leader: 'Trần Thị Y',
    field: 'Công nghệ thông tin',
    startDate: '15/02/2024',
    endDate: '15/12/2024',
    completedDate: '10/12/2024',
    status: 'Đã hoàn thành',
    budget: '420.000.000',
    result: 'Tốt',
  },
  {
    id: 'DT-2024-043',
    name: 'Nghiên cứu vật liệu composite trong xây dựng',
    leader: 'Lê Văn Z',
    field: 'Khoa học',
    startDate: '01/03/2024',
    endDate: '28/02/2025',
    completedDate: '20/02/2025',
    status: 'Đã hoàn thành',
    budget: '680.000.000',
    result: 'Xuất sắc',
  },
  {
    id: 'DT-2024-042',
    name: 'Hệ thống giám sát an toàn lao động',
    leader: 'Phạm Thị W',
    field: 'Kỹ thuật',
    startDate: '10/04/2024',
    endDate: '10/01/2025',
    completedDate: '05/01/2025',
    status: 'Đã hoàn thành',
    budget: '380.000.000',
    result: 'Tốt',
  },
  {
    id: 'DT-2024-041',
    name: 'Nghiên cứu tối ưu hóa chi phí xây dựng',
    leader: 'Hoàng Văn V',
    field: 'Xây dựng',
    startDate: '20/05/2024',
    endDate: '20/02/2025',
    completedDate: '15/02/2025',
    status: 'Đã hoàn thành',
    budget: '490.000.000',
    result: 'Khá',
  },
  {
    id: 'DT-2024-040',
    name: 'Phát triển hệ thống BIM cho quản lý dự án',
    leader: 'Nguyễn Thị U',
    field: 'Công nghệ thông tin',
    startDate: '01/06/2024',
    endDate: '01/03/2025',
    completedDate: '28/02/2025',
    status: 'Đã hoàn thành',
    budget: '720.000.000',
    result: 'Xuất sắc',
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const getResultColor = (result) => {
  switch (result) {
    case 'Xuất sắc':
      return 'bg-emerald-100 text-emerald-800';
    case 'Tốt':
      return 'bg-blue-100 text-blue-800';
    case 'Khá':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ResearchSession4 = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchProjects();
  }, [user?.id_vien, pagination.page, searchTerm, selectedField, selectedResult]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        id_vien: user?.id_vien,
        trang_thai: 'hoan_thanh',
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
        let mappedProjects = (response.data || []).map(deTai => {
          // Lấy người phụ trách (người đầu tiên trong danh sách)
          const leader = deTai.nhanSuDeTais && deTai.nhanSuDeTais.length > 0
            ? deTai.nhanSuDeTais[0].nhanSu?.ho_ten || '-'
            : '-';

          // Map danh_gia thành kết quả
          let result = 'Khá';
          if (deTai.danh_gia) {
            const danhGia = deTai.danh_gia.toLowerCase();
            if (danhGia.includes('xuất sắc') || danhGia.includes('excellent')) {
              result = 'Xuất sắc';
            } else if (danhGia.includes('tốt') || danhGia.includes('good')) {
              result = 'Tốt';
            } else if (danhGia.includes('khá') || danhGia.includes('fair')) {
              result = 'Khá';
            }
          }

          return {
            id: deTai.id,
            name: deTai.ten_de_tai,
            leader: leader,
            field: deTai.linh_vuc || '-',
            startDate: deTai.ngay_bat_dau ? formatDate(deTai.ngay_bat_dau) : '-',
            endDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            completedDate: deTai.ngay_hoan_thanh ? formatDate(deTai.ngay_hoan_thanh) : '-',
            status: 'Đã hoàn thành',
            budget: formatCurrency(deTai.so_tien),
            result: result,
            rawData: deTai
          };
        });

        // Filter by result if selected
        if (selectedResult) {
          const resultMap = {
            'excellent': 'Xuất sắc',
            'good': 'Tốt',
            'fair': 'Khá'
          };
          const resultValue = resultMap[selectedResult];
          if (resultValue) {
            mappedProjects = mappedProjects.filter(p => p.result === resultValue);
          }
        }

        setProjects(mappedProjects);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching completed projects:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Đề tài đã hoàn thành</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách các đề tài đã hoàn thành và kết quả đánh giá
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
            <FaDownload className="w-4 h-4" />
            Xuất Excel
          </button>
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
          <select 
            value={selectedResult}
            onChange={(e) => {
              setSelectedResult(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả kết quả</option>
            <option value="excellent">Xuất sắc</option>
            <option value="good">Tốt</option>
            <option value="fair">Khá</option>
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
                  Ngày hoàn thành
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngân sách
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kết quả
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
                    <span className="text-sm text-gray-700">{project.completedDate}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {project.budget}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(project.result)}`}>
                      {project.result}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(project.result)}`}>
                      {project.result}
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
                  <span className="text-xs text-gray-600">Ngày hoàn thành:</span>
                  <span className="text-xs text-gray-900 font-medium">{project.completedDate}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">Ngân sách:</span>
                  <span className="text-sm font-semibold text-gray-900">{project.budget}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                  <FaEye className="w-4 h-4" />
                </button>
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
    </section>
  );
};

export default ResearchSession4;


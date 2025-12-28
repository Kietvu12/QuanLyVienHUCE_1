import { FaFlask, FaBuilding } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deTaiNghienCuuAPI } from '../../services/api';

const DashboardSession4 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecentProjects();
    }
  }, [user]);

  const fetchRecentProjects = async () => {
    try {
      setLoading(true);
      // Cấp phòng lấy đề tài mới nhất từ tất cả viện (không filter id_vien)
      const response = await deTaiNghienCuuAPI.getAll({
        limit: 10,
        page: 1
      });

      if (response.success) {
        const projects = (response.data || []).map(item => {
          // Lấy danh sách người tham gia từ nhanSuDeTais
          const participants = (item.nhanSuDeTais || []).map(ns => {
            if (ns.nhanSu) {
              return ns.nhanSu.ho_ten;
            } else if (ns.ten_nhan_su) {
              return ns.ten_nhan_su;
            }
            return null;
          }).filter(Boolean);

          return {
            id: `DT-${item.id}`,
            name: item.ten_de_tai,
            participants: participants.length > 0 ? participants : ['Chưa có thông tin'],
            field: item.linh_vuc || 'Chưa xác định',
            institute: item.vien?.ten_vien || 'Chưa xác định',
            rawData: item
          };
        });
        setRecentProjects(projects);
      }
    } catch (err) {
      console.error('Error fetching recent projects:', err);
    } finally {
      setLoading(false);
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : recentProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Không có đề tài nào</td>
                </tr>
              ) : (
                recentProjects.map((project) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có đề tài nào</div>
          ) : (
            recentProjects.map((project) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardSession4;


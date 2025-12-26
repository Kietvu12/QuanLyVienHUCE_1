import { FaCheck, FaEllipsisV } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deTaiNghienCuuAPI, nhanSuAPI } from '../../services/api';

const formatCurrency = (value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(parseFloat(value) || 0) + ' đ';
  }
  return '0 đ';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getIconForProject = (index) => {
  const icons = ['Xd', '△', '♠', '♪', '◆', 'in', '●', '■', '▲', '▼'];
  return icons[index % icons.length];
};

const getIconBgForProject = (index) => {
  const colors = ['bg-purple-500', 'bg-blue-500', 'bg-teal-500', 'bg-green-500', 'bg-red-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
  return colors[index % colors.length];
};

const getAvatarColor = (index) => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-red-400 to-red-600'
  ];
  return colors[index % colors.length];
};

const DashboardSession4 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [completedThisMonth, setCompletedThisMonth] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id_vien]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, personnelRes] = await Promise.all([
        deTaiNghienCuuAPI.getAll({
          id_vien: user?.id_vien,
          limit: 6,
          page: 1
        }),
        nhanSuAPI.getAll({
          id_vien: user?.id_vien,
          limit: 5,
          page: 1
        })
      ]);

      if (projectsRes.success) {
        const projectsData = (projectsRes.data || []).map((project, index) => {
          // Đếm số nhân sự tham gia
          const members = project.nhanSuDeTais?.length || 0;
          
          return {
            id: project.id,
            name: project.ten_de_tai,
            icon: getIconForProject(index),
            iconBg: getIconBgForProject(index),
            members: members,
            budget: project.so_tien ? formatCurrency(project.so_tien) : 'Chưa có',
            completion: project.tien_do || 0,
          };
        });
        setProjects(projectsData);

        // Đếm số đề tài hoàn thành trong tháng này
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const completed = projectsData.filter(p => {
          // Giả sử completion = 100 là hoàn thành
          return p.completion === 100;
        }).length;
        setCompletedThisMonth(completed);
      }

      if (personnelRes.success) {
        const personnelData = (personnelRes.data || []).map((person, index) => {
          // Lấy lương từ hợp đồng lao động hoặc bảng lương
          let salary = 'Chưa có';
          if (person.hopDongLaoDongs && person.hopDongLaoDongs.length > 0) {
            const latestContract = person.hopDongLaoDongs[0];
            salary = formatCurrency(latestContract.luong_theo_hop_dong);
          } else if (person.bangLuongs && person.bangLuongs.length > 0) {
            const latestSalary = person.bangLuongs[0];
            salary = formatCurrency(latestSalary.thuc_nhan || latestSalary.luong_thuc_nhan);
          }

          return {
            id: person.id,
            name: person.ho_ten,
            startDate: formatDate(person.ngay_bat_dau_lam),
            salary: salary,
            avatarColor: getAvatarColor(index),
          };
        });
        setPersonnelList(personnelData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel izquierdo: Projects */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Đề tài nghiên cứu</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{completedThisMonth} hoàn thành tháng này</span>
                <FaCheck className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Menu"
            >
              <FaEllipsisV className="w-5 h-5" />
            </button>
          </div>

          {/* Tabla de proyectos */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Chưa có đề tài nào</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      TÊN ĐỀ TÀI
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      NHÂN SỰ
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      NGÂN SÁCH
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      TIẾN ĐỘ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${project.iconBg} rounded flex items-center justify-center text-white text-xs font-semibold`}
                          >
                            {project.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {project.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex -space-x-2">
                          {Array.from({ length: Math.min(project.members, 5) }).map((_, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                              title={`Nhân sự ${index + 1}`}
                            />
                          ))}
                          {project.members > 5 && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                              +{project.members - 5}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-700">{project.budget}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {project.completion}%
                          </span>
                          <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-400 rounded-full transition-all"
                              style={{ width: `${project.completion}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Panel derecho: Danh sách nhân sự của Viện */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Danh sách nhân sự của Viện
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Menu"
            >
              <FaEllipsisV className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de nhân sự */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
            ) : personnelList.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Chưa có nhân sự</div>
            ) : (
              personnelList.map((person) => {
                const initials = person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(-2);
                
                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${person.avatarColor} flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm`}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {person.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Bắt đầu: {person.startDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {person.salary}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession4;


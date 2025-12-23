import { FaCheck, FaEllipsisV } from 'react-icons/fa';
import React from 'react';
const projects = [
  {
    id: 1,
    name: 'Chakra Soft UI Version',
    icon: 'Xd',
    iconBg: 'bg-purple-500',
    members: 5,
    budget: '$14,000',
    completion: 60,
  },
  {
    id: 2,
    name: 'Add Progress Track',
    icon: '△',
    iconBg: 'bg-blue-500',
    members: 2,
    budget: '$3,000',
    completion: 10,
  },
  {
    id: 3,
    name: 'Fix Platform Errors',
    icon: '♠',
    iconBg: 'bg-teal-500',
    members: 2,
    budget: 'Not set',
    completion: 100,
  },
  {
    id: 4,
    name: 'Launch our Mobile App',
    icon: '♪',
    iconBg: 'bg-green-500',
    members: 4,
    budget: '$32,000',
    completion: 100,
  },
  {
    id: 5,
    name: 'Add the New Pricing Page',
    icon: '◆',
    iconBg: 'bg-blue-500',
    members: 5,
    budget: '$400',
    completion: 25,
  },
  {
    id: 6,
    name: 'Redesign New Online Shop',
    icon: 'in',
    iconBg: 'bg-red-500',
    members: 2,
    budget: '$7,600',
    completion: 40,
  },
];

const personnelList = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    startDate: '15/01/2020',
    salary: '15.000.000 đ',
    avatarColor: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    startDate: '20/03/2021',
    salary: '18.500.000 đ',
    avatarColor: 'from-purple-400 to-purple-600',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    startDate: '10/06/2019',
    salary: '22.000.000 đ',
    avatarColor: 'from-green-400 to-green-600',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    startDate: '05/09/2022',
    salary: '16.000.000 đ',
    avatarColor: 'from-orange-400 to-orange-600',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    startDate: '12/11/2020',
    salary: '20.000.000 đ',
    avatarColor: 'from-teal-400 to-teal-600',
  },
];

const DashboardSession4 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel izquierdo: Projects */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Projects</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">30 done this month</span>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    COMPANIES
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    MEMBERS
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    BUDGET
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    COMPLETION
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
                        {Array.from({ length: project.members }).map((_, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                            title={`Member ${index + 1}`}
                          />
                        ))}
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
            {personnelList.map((person) => {
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
                        {person.startDate}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {person.salary}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSession4;


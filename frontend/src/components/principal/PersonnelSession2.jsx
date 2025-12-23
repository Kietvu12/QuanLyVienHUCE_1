import { FaSearch, FaBuilding } from 'react-icons/fa';
import React from 'react';
const personnelData = [
  {
    id: 'NV-2025-001',
    name: 'Nguyễn Văn A',
    position: 'Giám đốc',
    department: 'Công nghệ thông tin',
    institute: 'Viện Tin học Xây Dựng',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    startDate: '15/01/2020',
    salary: '35.000.000',
  },
  {
    id: 'NV-2025-002',
    name: 'Trần Thị B',
    position: 'Giám đốc',
    department: 'Kỹ thuật',
    institute: 'Viện Khoa học Công nghệ',
    email: 'tranthib@example.com',
    phone: '0901234568',
    startDate: '20/03/2021',
    salary: '35.000.000',
  },
  {
    id: 'NV-2025-003',
    name: 'Lê Văn C',
    position: 'Giám đốc',
    department: 'Nghiên cứu',
    institute: 'Viện Nghiên cứu Phát triển',
    email: 'levanc@example.com',
    phone: '0901234569',
    startDate: '10/06/2019',
    salary: '35.000.000',
  },
  {
    id: 'NV-2025-004',
    name: 'Phạm Thị D',
    position: 'Trưởng phòng',
    department: 'Hành chính',
    institute: 'Viện Tin học Xây Dựng',
    email: 'phamthid@example.com',
    phone: '0901234570',
    startDate: '05/09/2020',
    salary: '25.000.000',
  },
  {
    id: 'NV-2025-005',
    name: 'Hoàng Văn E',
    position: 'Chuyên viên',
    department: 'Công nghệ thông tin',
    institute: 'Viện Khoa học Công nghệ',
    email: 'hoangvane@example.com',
    phone: '0901234571',
    startDate: '12/11/2022',
    salary: '18.000.000',
  },
];

const PersonnelSession2 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách nhân sự tất cả các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem thông tin nhân sự của tất cả các Viện
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
                placeholder="Tìm kiếm tên, mã nhân viên, email..."
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
            <option value="">Tất cả phòng ban</option>
            <option value="it">Công nghệ thông tin</option>
            <option value="construction">Xây dựng</option>
            <option value="engineering">Kỹ thuật</option>
            <option value="admin">Hành chính</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã NV
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Viện
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày vào làm
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lương
                </th>
              </tr>
            </thead>
            <tbody>
              {personnelData.map((person) => {
                const initials = person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(-2);
                
                return (
                  <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-blue-600">{person.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs`}>
                          {initials}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{person.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{person.position}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {person.department}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{person.institute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-gray-600">
                        <div>{person.email}</div>
                        <div className="text-gray-500">{person.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{person.startDate}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {person.salary} đ
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="2xl:hidden space-y-4">
          {personnelData.map((person) => {
            const initials = person.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(-2);
            
            return (
              <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                      <span className="text-xs font-medium text-blue-600">{person.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-600">{person.position}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {person.department}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Viện: </span>
                    <span className="text-xs text-gray-900 font-medium">{person.institute}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="mb-1">
                      <span className="text-gray-500">Email: </span>
                      <span className="text-gray-900">{person.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Điện thoại: </span>
                      <span className="text-gray-900">{person.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-600">Ngày vào làm: </span>
                      <span className="text-xs text-gray-900 font-medium">{person.startDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Lương: </span>
                      <span className="text-sm font-semibold text-gray-900">{person.salary} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-5 của 5 kết quả
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

export default PersonnelSession2;


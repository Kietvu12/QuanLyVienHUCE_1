import { FaCar, FaUser, FaSearch, FaBuilding, FaTools } from 'react-icons/fa';
import React from 'react';
const vehicleSummaryCards = [
  {
    label: 'Tổng số xe tất cả Viện',
    value: '45',
    change: '+3',
    changeColor: 'text-emerald-500',
    icon: FaCar,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Xe đã đăng ký',
    value: '42',
    change: '+2',
    changeColor: 'text-emerald-500',
    icon: FaUser,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Xe chưa đăng ký',
    value: '3',
    change: '+1',
    changeColor: 'text-gray-500',
    icon: FaCar,
    iconBg: 'bg-gray-500',
  },
  {
    label: 'Đang bảo trì',
    value: '2',
    change: '0',
    changeColor: 'text-orange-500',
    icon: FaTools,
    iconBg: 'bg-orange-500',
  },
];

const vehicleList = [
  {
    id: 'XE-2025-001',
    licensePlate: '30A-12345',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Trắng',
    employeeId: 'NV-2025-001',
    employeeName: 'Nguyễn Văn A',
    employeePosition: 'Giám đốc',
    department: 'Công nghệ thông tin',
    institute: 'Viện Tin học Xây Dựng',
    registeredDate: '15/01/2020',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '45.200 km',
    insuranceExpiry: '15/06/2026',
  },
  {
    id: 'XE-2025-002',
    licensePlate: '30A-23456',
    brand: 'Honda',
    model: 'CR-V',
    year: 2021,
    color: 'Đen',
    employeeId: 'NV-2025-002',
    employeeName: 'Trần Thị B',
    employeePosition: 'Giám đốc',
    department: 'Kỹ thuật',
    institute: 'Viện Khoa học Công nghệ',
    registeredDate: '20/03/2021',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '38.500 km',
    insuranceExpiry: '20/09/2026',
  },
  {
    id: 'XE-2025-003',
    licensePlate: '30A-34567',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2019,
    color: 'Xám',
    employeeId: 'NV-2025-003',
    employeeName: 'Lê Văn C',
    employeePosition: 'Giám đốc',
    department: 'Nghiên cứu',
    institute: 'Viện Nghiên cứu Phát triển',
    registeredDate: '10/06/2019',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '52.300 km',
    insuranceExpiry: '10/12/2025',
  },
];

const PersonnelSession3 = () => {
  return (
    <section className="px-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {vehicleSummaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-6 py-5"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-gray-400">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">
                    {card.value}
                  </span>
                  <span className={`text-xs font-semibold ${card.changeColor}`}>
                    {card.change}
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.iconBg} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle table */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách xe của nhân viên</h3>
            <p className="text-sm text-gray-500 mt-1">
              Xem danh sách xe thuộc sở hữu của nhân viên tất cả các Viện
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
                placeholder="Tìm kiếm biển số, nhãn hiệu, nhân viên..."
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
            <option value="using">Đang sử dụng</option>
            <option value="maintenance">Đang bảo trì</option>
            <option value="unregistered">Chưa đăng ký</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden 2xl:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thông tin xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Viện
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số km
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleList.map((vehicle) => {
                const employeeInitials = vehicle.employeeName
                  ? vehicle.employeeName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(-2)
                  : null;

                return (
                  <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-blue-600">{vehicle.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Biển số: {vehicle.licensePlate} | Màu: {vehicle.color}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {vehicle.employeeName ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                            {employeeInitials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vehicle.employeeName}</div>
                            <div className="text-xs text-gray-500">{vehicle.employeePosition}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{vehicle.institute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.registeredDate || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.mileage}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.statusColor}`}>
                        {vehicle.status}
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
          {vehicleList.map((vehicle) => {
            const employeeInitials = vehicle.employeeName
              ? vehicle.employeeName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(-2)
              : null;

            return (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <FaCar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-600">{vehicle.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.statusColor}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </h4>
                    <p className="text-xs text-gray-500">
                      Biển số: {vehicle.licensePlate} | Màu: {vehicle.color}
                    </p>
                  </div>
                </div>

                {vehicle.employeeName ? (
                  <div className="flex items-start gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {employeeInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{vehicle.employeeName}</p>
                      <p className="text-xs text-gray-500 mb-1">{vehicle.employeePosition}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-400">Chưa có chủ sở hữu</p>
                  </div>
                )}

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Viện: </span>
                    <span className="text-xs text-gray-900 font-medium">{vehicle.institute}</span>
                  </div>
                  {vehicle.registeredDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Ngày đăng ký:</span>
                      <span className="text-xs text-gray-900 font-medium">{vehicle.registeredDate}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Số km:</span>
                    <span className="text-xs text-gray-900 font-medium">{vehicle.mileage}</span>
                  </div>
                </div>
              </div>
            );
          })}
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

export default PersonnelSession3;


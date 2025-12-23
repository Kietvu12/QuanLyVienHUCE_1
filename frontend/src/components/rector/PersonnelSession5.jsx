import { FaCar, FaUser, FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle, FaTimesCircle, FaTools } from 'react-icons/fa';
import React from 'react';
const vehicleSummaryCards = [
  {
    label: 'Tổng số xe',
    value: '28',
    change: '+3',
    changeColor: 'text-emerald-500',
    icon: FaCar,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Xe đã đăng ký',
    value: '26',
    change: '+2',
    changeColor: 'text-emerald-500',
    icon: FaUser,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Xe chưa đăng ký',
    value: '2',
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
    employeePosition: 'Trưởng phòng',
    department: 'Công nghệ thông tin',
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
    employeePosition: 'Chuyên viên cao cấp',
    department: 'Xây dựng',
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
    employeePosition: 'Chuyên viên',
    department: 'Kỹ thuật',
    registeredDate: '10/06/2019',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '52.300 km',
    insuranceExpiry: '10/12/2025',
  },
  {
    id: 'XE-2025-004',
    licensePlate: '30A-45678',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    color: 'Bạc',
    employeeId: 'NV-2025-004',
    employeeName: 'Phạm Thị D',
    employeePosition: 'Chuyên viên',
    department: 'Công nghệ thông tin',
    registeredDate: '05/09/2022',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '28.900 km',
    insuranceExpiry: '05/03/2026',
  },
  {
    id: 'XE-2025-005',
    licensePlate: '30A-56789',
    brand: 'Ford',
    model: 'Everest',
    year: 2020,
    color: 'Đỏ',
    employeeId: 'NV-2025-005',
    employeeName: 'Hoàng Văn E',
    employeePosition: 'Nhân viên',
    department: 'Hành chính',
    registeredDate: '12/11/2020',
    status: 'Đang bảo trì',
    statusColor: 'bg-orange-100 text-orange-800',
    mileage: '48.100 km',
    insuranceExpiry: '12/05/2026',
  },
  {
    id: 'XE-2025-006',
    licensePlate: '30A-67890',
    brand: 'Toyota',
    model: 'Vios',
    year: 2021,
    color: 'Trắng',
    employeeId: null,
    employeeName: null,
    employeePosition: null,
    department: null,
    registeredDate: null,
    status: 'Chưa đăng ký',
    statusColor: 'bg-gray-100 text-gray-800',
    mileage: '15.200 km',
    insuranceExpiry: '15/08/2026',
  },
  {
    id: 'XE-2025-007',
    licensePlate: '30A-78901',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    color: 'Xanh',
    employeeId: 'NV-2025-006',
    employeeName: 'Nguyễn Thị F',
    employeePosition: 'Chuyên viên cao cấp',
    department: 'Xây dựng',
    registeredDate: '15/04/2021',
    status: 'Đang sử dụng',
    statusColor: 'bg-emerald-100 text-emerald-800',
    mileage: '22.400 km',
    insuranceExpiry: '15/10/2026',
  },
  {
    id: 'XE-2025-008',
    licensePlate: '30A-89012',
    brand: 'Mitsubishi',
    model: 'Outlander',
    year: 2020,
    color: 'Đen',
    employeeId: null,
    employeeName: null,
    employeePosition: null,
    department: null,
    registeredDate: null,
    status: 'Chưa đăng ký',
    statusColor: 'bg-gray-100 text-gray-800',
    mileage: '18.500 km',
    insuranceExpiry: '20/07/2026',
  },
];

const PersonnelSession5 = () => {
  return (
    <section className="px-6">
      {/* Summary Cards */}
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

      {/* Tabla de gestión de xe */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quản lý xe của nhân viên</h3>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách xe thuộc sở hữu của nhân viên
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors self-start sm:self-auto">
            <FaPlus className="w-4 h-4" />
            Đăng ký xe mới
          </button>
        </div>

        {/* Filtros y búsqueda */}
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
            <option value="">Tất cả trạng thái</option>
            <option value="using">Đang sử dụng</option>
            <option value="maintenance">Đang bảo trì</option>
            <option value="unregistered">Chưa đăng ký</option>
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
                  Mã xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thông tin xe
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số km
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hết hạn BH
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                          <FaCar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                          </div>
                          <div className="text-xs text-gray-500">
                            Màu: {vehicle.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {vehicle.employeeName ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                            {employeeInitials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {vehicle.employeeName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {vehicle.employeePosition}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vehicle.department}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {vehicle.employeeId}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Chưa đăng ký</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {vehicle.registeredDate ? (
                        <span className="text-sm text-gray-700">{vehicle.registeredDate}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.mileage}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.insuranceExpiry}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.statusColor}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                          <FaEye className="w-4 h-4" />
                        </button>
                        {vehicle.employeeName ? (
                          <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Xóa đăng ký">
                            <FaTimesCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Đăng ký xe">
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Chỉnh sửa">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
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
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{vehicle.licensePlate}</h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                    <p className="text-xs text-gray-500">Màu: {vehicle.color}</p>
                  </div>
                </div>

                {vehicle.employeeName ? (
                  <div className="flex items-start gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {employeeInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{vehicle.employeeName}</p>
                      <p className="text-xs text-gray-600 mb-1">{vehicle.employeePosition}</p>
                      <p className="text-xs text-gray-500 mb-1">{vehicle.department}</p>
                      <p className="text-xs text-blue-600">{vehicle.employeeId}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-400 italic">Chưa đăng ký</p>
                  </div>
                )}

                <div className="space-y-2 mb-3">
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Hết hạn BH:</span>
                    <span className="text-xs text-gray-900 font-medium">{vehicle.insuranceExpiry}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <FaEye className="w-4 h-4" />
                  </button>
                  {vehicle.employeeName ? (
                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Xóa đăng ký">
                      <FaTimesCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Đăng ký xe">
                      <FaCheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Chỉnh sửa">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị 1-8 của 28 kết quả
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

export default PersonnelSession5;


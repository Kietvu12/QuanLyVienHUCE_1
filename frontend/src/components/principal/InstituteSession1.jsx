import { FaBuilding, FaUsers, FaFlask, FaDollarSign, FaWallet, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import React from 'react';
const institutes = [
  {
    id: 'VIEN-001',
    name: 'Viện Tin học Xây Dựng',
    code: 'VIEN-001',
    director: 'Nguyễn Văn A',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '028.1234.5678',
    email: 'vien.tinhoc@example.com',
    establishedDate: '15/01/2010',
    personnel: 85,
    projects: 25,
    revenue: 4500000000,
    debt: 850000000,
    assets: 425,
    status: 'Hoạt động tốt',
  },
  {
    id: 'VIEN-002',
    name: 'Viện Khoa học Công nghệ',
    code: 'VIEN-002',
    director: 'Trần Thị B',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    phone: '028.2345.6789',
    email: 'vien.khcn@example.com',
    establishedDate: '20/03/2012',
    personnel: 78,
    projects: 22,
    revenue: 3800000000,
    debt: 650000000,
    assets: 398,
    status: 'Hoạt động tốt',
  },
  {
    id: 'VIEN-003',
    name: 'Viện Nghiên cứu Phát triển',
    code: 'VIEN-003',
    director: 'Lê Văn C',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    phone: '028.3456.7890',
    email: 'vien.nghiencuu@example.com',
    establishedDate: '10/06/2015',
    personnel: 82,
    projects: 21,
    revenue: 4150000000,
    debt: 350000000,
    assets: 422,
    status: 'Hoạt động tốt',
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const InstituteSession1 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Thông tin các Viện trong trường</h3>
            <p className="text-sm text-gray-500 mt-1">
              Chi tiết thông tin tất cả các Viện
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {institutes.map((institute) => (
            <div
              key={institute.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaBuilding className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{institute.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Mã: {institute.code}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {institute.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Thông tin cơ bản</h5>
                  <div className="flex items-center gap-2 text-sm">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Giám đốc:</span>
                    <span className="font-medium text-gray-900">{institute.director}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{institute.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{institute.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{institute.email}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-gray-600">Thành lập:</span>
                    <span className="font-medium text-gray-900 ml-2">{institute.establishedDate}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Thống kê</h5>
                  <div className="flex items-center gap-2 text-sm">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Nhân sự:</span>
                    <span className="font-medium text-gray-900">{institute.personnel} người</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaFlask className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Đề tài:</span>
                    <span className="font-medium text-gray-900">{institute.projects} đề tài</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Tài sản:</span>
                    <span className="font-medium text-gray-900 ml-2">{institute.assets} tài sản</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Tài chính</h5>
                  <div className="flex items-center gap-2 text-sm">
                    <FaDollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Doanh thu:</span>
                    <span className="font-medium text-emerald-600">
                      {formatCurrency(institute.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaWallet className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Công nợ:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(institute.debt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstituteSession1;


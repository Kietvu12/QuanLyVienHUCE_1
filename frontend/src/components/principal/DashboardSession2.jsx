import { FaBuilding, FaUsers, FaFlask, FaDollarSign, FaWallet } from 'react-icons/fa';
import React from 'react';
const institutes = [
  {
    id: 'VIEN-001',
    name: 'Viện Tin học Xây Dựng',
    director: 'Nguyễn Văn A',
    personnel: 85,
    projects: 25,
    revenue: 4500000000,
    debt: 850000000,
    status: 'Hoạt động tốt',
  },
  {
    id: 'VIEN-002',
    name: 'Viện Khoa học Công nghệ',
    director: 'Trần Thị B',
    personnel: 78,
    projects: 22,
    revenue: 3800000000,
    debt: 650000000,
    status: 'Hoạt động tốt',
  },
  {
    id: 'VIEN-003',
    name: 'Viện Nghiên cứu Phát triển',
    director: 'Lê Văn C',
    personnel: 82,
    projects: 21,
    revenue: 4150000000,
    debt: 350000000,
    status: 'Hoạt động tốt',
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' đ';
};

const DashboardSession2 = () => {
  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Thông tin các Viện</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng quan thông tin tất cả các Viện trong trường
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {institutes.map((institute) => (
            <div
              key={institute.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaBuilding className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{institute.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Mã: {institute.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <FaUsers className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Giám đốc:</span>
                  <span className="font-medium text-gray-900">{institute.director}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaUsers className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Nhân sự:</span>
                  <span className="font-medium text-gray-900">{institute.personnel} người</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaFlask className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Đề tài:</span>
                  <span className="font-medium text-gray-900">{institute.projects} đề tài</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaDollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Doanh thu:</span>
                  <span className="font-medium text-emerald-600">
                    {formatCurrency(institute.revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaWallet className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Công nợ:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(institute.debt)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {institute.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSession2;


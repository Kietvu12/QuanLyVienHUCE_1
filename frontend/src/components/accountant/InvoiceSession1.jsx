import { FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimesCircle, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import React from 'react'
const InvoiceSession1 = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const cards = [
    {
      label: 'Tổng số hóa đơn',
      value: '245',
      change: '+12',
      changeColor: 'text-emerald-500',
      icon: FaFileInvoiceDollar,
    },
    {
      label: 'Đã thanh toán',
      value: '198',
      change: '+8',
      changeColor: 'text-emerald-500',
      icon: FaCheckCircle,
    },
    {
      label: 'Chờ thanh toán',
      value: '35',
      change: '+4',
      changeColor: 'text-yellow-500',
      icon: FaClock,
    },
    {
      label: 'Đã hủy',
      value: '12',
      change: '-2',
      changeColor: 'text-red-500',
      icon: FaTimesCircle,
    },
  ];

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Tổng quan hóa đơn</h3>
          <p className="text-sm text-gray-500 mt-1">
            Thống kê và quản lý hóa đơn, chứng từ
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 px-5 py-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-500">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </span>
                    <span className={`text-xs font-semibold ${card.changeColor}`}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm số hóa đơn, người tạo, mô tả..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="Từ ngày"
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder="Đến ngày"
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
};

export default InvoiceSession1;


import { FaUsers, FaFlask, FaDollarSign, FaWallet, FaFileAlt } from 'react-icons/fa';
import React from 'react'
const cards = [
  {
    label: 'Tổng nhân sự tất cả Viện',
    value: '245',
    change: '+12',
    changeColor: 'text-emerald-500',
    icon: FaUsers,
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Tổng đề tài nghiên cứu',
    value: '68',
    change: '+5',
    changeColor: 'text-emerald-500',
    icon: FaFlask,
    iconBg: 'bg-purple-500',
  },
  {
    label: 'Tổng doanh thu',
    value: '12.45 tỷ',
    change: '+12.5%',
    changeColor: 'text-emerald-500',
    icon: FaDollarSign,
    iconBg: 'bg-emerald-500',
  },
  {
    label: 'Tổng công nợ',
    value: '1.85 tỷ',
    change: '-5.2%',
    changeColor: 'text-red-500',
    icon: FaWallet,
    iconBg: 'bg-orange-500',
  },
  {
    label: 'Báo cáo chờ duyệt',
    value: '8',
    change: '+2',
    changeColor: 'text-yellow-500',
    icon: FaFileAlt,
    iconBg: 'bg-yellow-500',
  },
];

const DashboardSession1 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
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
                  {card.change && (
                    <span className={`text-xs font-semibold ${card.changeColor}`}>
                      {card.change}
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.iconBg} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardSession1;


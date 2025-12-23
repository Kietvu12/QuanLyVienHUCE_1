import { FaWallet, FaGlobe, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';
const cards = [
  {
    label: 'Doanh thu',
    value: '$53,000',
    change: '+55%',
    changeColor: 'text-emerald-500',
    icon: FaWallet,
  },
  {
    label: 'Đề tài nghiên cứu',
    value: '2,300',
    change: '+5%',
    changeColor: 'text-emerald-500',
    icon: FaGlobe,
  },
  {
    label: 'Nhân sự',
    value: '+ 2 nhân sự mới',
    icon: FaUsers,
  },
  {
    label: 'Cảnh báo thiết bị',
    value: '2 thiết bị hỏng',
    icon: FaExclamationTriangle,
  },
];

const DashboardSession1 = () => {
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500 text-white">
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



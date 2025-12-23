import DashboardSession1 from '../../components/principal/DashboardSession1';
import DashboardSession2 from '../../components/principal/DashboardSession2';
import DashboardSession3 from '../../components/principal/DashboardSession3';
import React from 'react';
const Dashboard = () => {
  return (
    <div className="space-y-6 py-6">
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard - Hiệu trưởng/Ban giám hiệu</h1>
        <p className="text-sm text-gray-500">Tổng quan hoạt động của tất cả các Viện trong trường</p>
      </div>

      <DashboardSession1 />
      <DashboardSession2 />
      <DashboardSession3 />
    </div>
  );
};

export default Dashboard;


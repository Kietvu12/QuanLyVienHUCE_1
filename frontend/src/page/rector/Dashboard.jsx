import DashboardSession1 from '../../components/rector/DashboardSession1';
import DashboardSession2 from '../../components/rector/DashboardSession2';
import DashboardSession3 from '../../components/rector/DashboardSession3';
import DashboardSession4 from '../../components/rector/DashboardSession4';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardSession1 />
      <DashboardSession2 />
      <DashboardSession3 />
      <DashboardSession4 />

 
    </div>
  );
};

export default Dashboard;


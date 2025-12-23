import RevenueSession1 from '../../components/division/RevenueSession1';
import RevenueSession2 from '../../components/division/RevenueSession2';
import RevenueSession3 from '../../components/division/RevenueSession3';
import React from 'react';
const Revenue = () => {
  return (
    <div className="space-y-6 py-6">
      <RevenueSession1 />
      <RevenueSession2 />
      <RevenueSession3 />
    </div>
  );
};

export default Revenue;


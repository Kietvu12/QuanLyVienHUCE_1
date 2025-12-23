import ReportSession1 from '../../components/rector/ReportSession1';
import ReportSession2 from '../../components/rector/ReportSession2';
import ReportSession3 from '../../components/rector/ReportSession3';
import ReportSession4 from '../../components/rector/ReportSession4';
import React from 'react';
const Report = () => {
  return (
    <div className="space-y-6 py-6">
      <ReportSession1 />
      <ReportSession2 />
      <ReportSession3 />
      <ReportSession4 />
    </div>
  );
};

export default Report;

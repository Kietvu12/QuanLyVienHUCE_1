import PersonnelSession1 from '../../components/principal/PersonnelSession1';
import PersonnelSession2 from '../../components/principal/PersonnelSession2';
import PersonnelSession3 from '../../components/principal/PersonnelSession3';
import React from 'react';
const Personnel = () => {
  return (
    <div className="space-y-6 py-6">
      <PersonnelSession1 />
      <PersonnelSession2 />
      <PersonnelSession3 />
    </div>
  );
};

export default Personnel;


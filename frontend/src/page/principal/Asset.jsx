import AssetSession1 from '../../components/principal/AssetSession1';
import AssetSession2 from '../../components/principal/AssetSession2';
import AssetSession3 from '../../components/principal/AssetSession3';
import AssetSession4 from '../../components/principal/AssetSession4';
import React from 'react';
const Asset = () => {
  return (
    <div className="space-y-6 py-6">
      <AssetSession1 />
      <AssetSession2 />
      <AssetSession3 />
      <AssetSession4 />
    </div>
  );
};

export default Asset;


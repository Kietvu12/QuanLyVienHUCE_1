const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MediaChiPhi = sequelize.define('MediaChiPhi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID media chi phí'
    },
    id_chi_phi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chi_phi',
        key: 'id'
      },
      comment: 'ID chi phí (khóa ngoại)'
    },
    duong_dan_tai_lieu: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Đường dẫn tài liệu'
    }
  }, {
    tableName: 'media_chi_phi',
    timestamps: true,
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_chi_phi']
      }
    ]
  });

  MediaChiPhi.associate = (models) => {
    // Một media chi phí thuộc về một chi phí
    MediaChiPhi.belongsTo(models.ChiPhi, {
      foreignKey: 'id_chi_phi',
      as: 'chiPhi'
    });
  };

  return MediaChiPhi;
};




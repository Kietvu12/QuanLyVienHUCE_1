const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MediaDoanhThu = sequelize.define('MediaDoanhThu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID media doanh thu'
    },
    id_doanh_thu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doanh_thu',
        key: 'id'
      },
      comment: 'ID doanh thu (khóa ngoại)'
    },
    duong_dan_tai_lieu: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Đường dẫn tài liệu'
    }
  }, {
    tableName: 'media_doanh_thu',
    timestamps: true,
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_doanh_thu']
      }
    ]
  });

  MediaDoanhThu.associate = (models) => {
    // Một media doanh thu thuộc về một doanh thu
    MediaDoanhThu.belongsTo(models.DoanhThu, {
      foreignKey: 'id_doanh_thu',
      as: 'doanhThu'
    });
  };

  return MediaDoanhThu;
};




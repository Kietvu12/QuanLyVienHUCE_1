const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoaiHopDong = sequelize.define('LoaiHopDong', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID loại hợp đồng'
    },
    ten_loai: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Tên loại hợp đồng'
    },
    mo_ta: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả loại hợp đồng'
    }
  }, {
    tableName: 'loai_hop_dong',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['ten_loai'],
        unique: true
      }
    ]
  });

  LoaiHopDong.associate = (models) => {
    // Một loại hợp đồng có nhiều hợp đồng lao động
    LoaiHopDong.hasMany(models.HopDongLaoDong, {
      foreignKey: 'id_loai_hop_dong',
      as: 'hopDongLaoDongs'
    });
  };

  return LoaiHopDong;
};


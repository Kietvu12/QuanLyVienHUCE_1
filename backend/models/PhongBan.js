const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PhongBan = sequelize.define('PhongBan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID phòng ban'
    },
    id_vien: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vien',
        key: 'id'
      },
      comment: 'ID viện (khóa ngoại)'
    },
    ten_phong_ban: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên phòng ban'
    }
  }, {
    tableName: 'phong_ban',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_vien']
      }
    ]
  });

  PhongBan.associate = (models) => {
    // Một phòng ban thuộc về một viện
    PhongBan.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một phòng ban có nhiều nhân sự
    PhongBan.hasMany(models.NhanSu, {
      foreignKey: 'id_phong_ban',
      as: 'nhanSus'
    });

    // Một phòng ban có nhiều phòng
    PhongBan.hasMany(models.PhongCuaVien, {
      foreignKey: 'id_phong_ban',
      as: 'phongCuaViens'
    });
  };

  return PhongBan;
};




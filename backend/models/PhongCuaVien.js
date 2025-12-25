const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PhongCuaVien = sequelize.define('PhongCuaVien', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID phòng của viện'
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
    id_phong_ban: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'phong_ban',
        key: 'id'
      },
      comment: 'ID phòng ban (khóa ngoại) - có thể null'
    },
    ten_toa: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Tên tòa'
    },
    so_tang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Số tầng'
    },
    so_phong: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Số phòng'
    },
    dien_tich: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Diện tích'
    },
    trang_thai: {
      type: DataTypes.ENUM('trong', 'dang_su_dung', 'bao_tri'),
      allowNull: false,
      defaultValue: 'trong',
      comment: 'Trạng thái phòng'
    }
  }, {
    tableName: 'phong_cua_vien',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['id_phong_ban']
      }
    ]
  });

  PhongCuaVien.associate = (models) => {
    // Một phòng thuộc về một viện
    PhongCuaVien.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một phòng có thể thuộc về một phòng ban
    PhongCuaVien.belongsTo(models.PhongBan, {
      foreignKey: 'id_phong_ban',
      as: 'phongBan'
    });

    // Một phòng có nhiều tài sản
    PhongCuaVien.hasMany(models.TaiSan, {
      foreignKey: 'id_phong',
      as: 'taiSans'
    });
  };

  return PhongCuaVien;
};




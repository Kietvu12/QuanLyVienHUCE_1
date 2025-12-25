const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Quyen = sequelize.define('Quyen', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID quyền'
    },
    ten_quyen: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Tên quyền'
    },
    mo_ta: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả quyền'
    }
  }, {
    tableName: 'quyen',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Quyen.associate = (models) => {
    // Một quyền có nhiều tài khoản
    Quyen.hasMany(models.TaiKhoan, {
      foreignKey: 'id_quyen',
      as: 'taiKhoans'
    });
  };

  return Quyen;
};




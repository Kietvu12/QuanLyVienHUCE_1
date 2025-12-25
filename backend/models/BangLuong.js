const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BangLuong = sequelize.define('BangLuong', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID bảng lương'
    },
    id_nhan_su: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhan_su',
        key: 'id'
      },
      comment: 'ID nhân sự (khóa ngoại)'
    },
    luong_thuc_nhan: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Lương thực nhận'
    },
    thuong: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Thưởng'
    },
    phat: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Phạt'
    },
    thuc_nhan: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Thực nhận'
    }
  }, {
    tableName: 'bang_luong',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_nhan_su']
      }
    ]
  });

  BangLuong.associate = (models) => {
    // Một bảng lương thuộc về một nhân sự
    BangLuong.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });
  };

  return BangLuong;
};


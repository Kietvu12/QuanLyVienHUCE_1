const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ThongTinXe = sequelize.define('ThongTinXe', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID thông tin xe'
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
    ten_xe: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Tên xe'
    },
    loai_xe: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Loại xe'
    },
    bien_so_xe: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Biển số xe'
    },
    so_dang_ki_xe: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Số đăng ký xe'
    },
    ngay_het_han: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày hết hạn'
    }
  }, {
    tableName: 'thong_tin_xe',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_nhan_su']
      },
      {
        fields: ['bien_so_xe']
      }
    ]
  });

  ThongTinXe.associate = (models) => {
    // Một thông tin xe thuộc về một nhân sự
    ThongTinXe.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });
  };

  return ThongTinXe;
};




const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BaoHiemYTe = sequelize.define('BaoHiemYTe', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID bảo hiểm y tế'
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
    so_the_bhyt: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Số thẻ BHYT'
    },
    noi_dang_ki_kham_chua_benh_ban_dau: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nơi đăng ký khám chữa bệnh ban đầu'
    },
    ngay_het_han: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày hết hạn'
    }
  }, {
    tableName: 'bao_hiem_y_te',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_nhan_su']
      }
    ]
  });

  BaoHiemYTe.associate = (models) => {
    // Một bảo hiểm y tế thuộc về một nhân sự
    BaoHiemYTe.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });
  };

  return BaoHiemYTe;
};




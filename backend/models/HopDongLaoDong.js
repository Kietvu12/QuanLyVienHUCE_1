const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HopDongLaoDong = sequelize.define('HopDongLaoDong', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID hợp đồng lao động'
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
    id_loai_hop_dong: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loai_hop_dong',
        key: 'id'
      },
      comment: 'ID loại hợp đồng (khóa ngoại)'
    },
    ma_hop_dong: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Mã hợp đồng'
    },
    ngay_tao_hop_dong_lao_dong: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Ngày tạo hợp đồng lao động'
    },
    luong_theo_hop_dong: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Lương theo hợp đồng'
    },
    ngay_ki_hop_dong: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Ngày ký hợp đồng'
    },
    ngay_ket_thuc_hop_dong_lao_dong: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày kết thúc hợp đồng lao động'
    }
  }, {
    tableName: 'hop_dong_lao_dong',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_nhan_su']
      },
      {
        fields: ['id_loai_hop_dong']
      },
      {
        fields: ['ma_hop_dong']
      }
    ]
  });

  HopDongLaoDong.associate = (models) => {
    // Một hợp đồng lao động thuộc về một nhân sự
    HopDongLaoDong.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });

    // Một hợp đồng lao động thuộc về một loại hợp đồng
    HopDongLaoDong.belongsTo(models.LoaiHopDong, {
      foreignKey: 'id_loai_hop_dong',
      as: 'loaiHopDong'
    });
  };

  return HopDongLaoDong;
};


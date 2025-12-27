const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaiSan = sequelize.define('TaiSan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID tài sản'
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
    id_phong: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'phong_cua_vien',
        key: 'id'
      },
      comment: 'ID phòng (khóa ngoại) - có thể null'
    },
    ten_tai_san: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên tài sản'
    },
    tinh_trang: {
      type: DataTypes.ENUM('tot', 'hong', 'can_bao_tri'),
      allowNull: false,
      defaultValue: 'tot',
      comment: 'Tình trạng tài sản'
    },
    ngay_nhan_tai_san: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày nhận tài sản'
    },
    ngay_ban_giao_tai_san: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày bàn giao tài sản'
    },
    gia_tri: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Giá trị tài sản (VND)'
    }
  }, {
    tableName: 'tai_san',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['id_phong']
      }
    ]
  });

  TaiSan.associate = (models) => {
    // Một tài sản thuộc về một viện
    TaiSan.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một tài sản có thể thuộc về một phòng
    TaiSan.belongsTo(models.PhongCuaVien, {
      foreignKey: 'id_phong',
      as: 'phong'
    });

    // Một tài sản có một media
    TaiSan.hasOne(models.MediaTaiSan, {
      foreignKey: 'id_tai_san',
      as: 'mediaTaiSan'
    });
  };

  return TaiSan;
};




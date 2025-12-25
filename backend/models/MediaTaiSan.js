const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MediaTaiSan = sequelize.define('MediaTaiSan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID media tài sản'
    },
    id_tai_san: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_san',
        key: 'id'
      },
      comment: 'ID tài sản (khóa ngoại)'
    },
    anh_phieu_nhan: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh phiếu nhận'
    },
    anh_tai_san: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh tài sản'
    },
    anh_phieu_ban_giao: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh phiếu bàn giao'
    }
  }, {
    tableName: 'media_tai_san',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'ngay_cap_nhat'
  });

  MediaTaiSan.associate = (models) => {
    // Một media tài sản thuộc về một tài sản
    MediaTaiSan.belongsTo(models.TaiSan, {
      foreignKey: 'id_tai_san',
      as: 'taiSan'
    });
  };

  return MediaTaiSan;
};




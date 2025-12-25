const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MediaNhanSu = sequelize.define('MediaNhanSu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID media nhân sự'
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
    anh_ho_so: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh hồ sơ'
    },
    anh_bang_cap: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh bằng cấp'
    },
    anh_bhyt: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh BHYT'
    },
    anh_hop_dong: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh hợp đồng'
    },
    anh_xe: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Ảnh xe'
    },
    ngay_cap_nhat_ho_so: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Ngày cập nhật hồ sơ'
    }
  }, {
    tableName: 'media_nhan_su',
    timestamps: true,
    createdAt: 'ngay_tao',
    updatedAt: false
  });

  MediaNhanSu.associate = (models) => {
    // Một media nhân sự thuộc về một nhân sự
    MediaNhanSu.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });
  };

  return MediaNhanSu;
};




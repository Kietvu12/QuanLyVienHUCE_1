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
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ảnh hồ sơ (có thể là string đơn hoặc JSON array)'
    },
    anh_bang_cap: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ảnh bằng cấp (có thể là string đơn hoặc JSON array)'
    },
    anh_bhyt: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ảnh BHYT (có thể là string đơn hoặc JSON array)'
    },
    anh_hop_dong: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ảnh hợp đồng (có thể là string đơn hoặc JSON array)'
    },
    anh_xe: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ảnh xe (có thể là string đơn hoặc JSON array)'
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




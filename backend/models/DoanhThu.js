const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoanhThu = sequelize.define('DoanhThu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID doanh thu'
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
    tieu_de: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tiêu đề'
    },
    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nội dung'
    },
    so_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Số tiền'
    },
    id_de_tai: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'de_tai_nghien_cuu',
        key: 'id'
      },
      comment: 'ID đề tài (khóa ngoại) - có thể null'
    },
    trang_thai: {
      type: DataTypes.ENUM('chua_nhan', 'da_nhan', 'huy'),
      allowNull: false,
      defaultValue: 'chua_nhan',
      comment: 'Trạng thái doanh thu'
    },
    ngay_nhan_tien: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày nhận tiền'
    }
  }, {
    tableName: 'doanh_thu',
    timestamps: true,
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['id_de_tai']
      },
      {
        fields: ['trang_thai']
      }
    ]
  });

  DoanhThu.associate = (models) => {
    // Một doanh thu thuộc về một viện
    DoanhThu.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một doanh thu có thể thuộc về một đề tài
    DoanhThu.belongsTo(models.DeTaiNghienCuu, {
      foreignKey: 'id_de_tai',
      as: 'deTaiNghienCuu'
    });

    // Một doanh thu có nhiều media
    DoanhThu.hasMany(models.MediaDoanhThu, {
      foreignKey: 'id_doanh_thu',
      as: 'mediaDoanhThus'
    });
  };

  return DoanhThu;
};




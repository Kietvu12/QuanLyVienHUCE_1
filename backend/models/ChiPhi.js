const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChiPhi = sequelize.define('ChiPhi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID chi phí'
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
      type: DataTypes.ENUM('chua_tat_toan', 'da_tat_toan', 'huy'),
      allowNull: false,
      defaultValue: 'chua_tat_toan',
      comment: 'Trạng thái chi phí'
    },
    ngay_tat_toan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày tất toán'
    }
  }, {
    tableName: 'chi_phi',
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

  ChiPhi.associate = (models) => {
    // Một chi phí thuộc về một viện
    ChiPhi.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một chi phí có thể thuộc về một đề tài
    ChiPhi.belongsTo(models.DeTaiNghienCuu, {
      foreignKey: 'id_de_tai',
      as: 'deTaiNghienCuu'
    });

    // Một chi phí có nhiều media
    ChiPhi.hasMany(models.MediaChiPhi, {
      foreignKey: 'id_chi_phi',
      as: 'mediaChiPhis'
    });
  };

  return ChiPhi;
};




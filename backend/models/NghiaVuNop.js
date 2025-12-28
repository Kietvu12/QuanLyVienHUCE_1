const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NghiaVuNop = sequelize.define('NghiaVuNop', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID nghĩa vụ nộp'
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
    thoi_gian_tao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Thời gian tạo'
    },
    han_nop: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Hạn nộp'
    },
    trang_thai: {
      type: DataTypes.ENUM('chua_nop', 'da_nop', 'qua_han'),
      allowNull: false,
      defaultValue: 'chua_nop',
      comment: 'Trạng thái: chua_nop, da_nop, qua_han'
    },
    so_tien_phai_nop: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Số tiền phải nộp'
    }
  }, {
    tableName: 'nghia_vu_nop',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['han_nop']
      },
      {
        fields: ['trang_thai']
      }
    ]
  });

  NghiaVuNop.associate = (models) => {
    // Một nghĩa vụ nộp thuộc về một viện
    NghiaVuNop.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một nghĩa vụ nộp có một công nợ
    NghiaVuNop.hasOne(models.CongNo, {
      foreignKey: 'id_nghia_vu',
      as: 'congNo'
    });
  };

  return NghiaVuNop;
};


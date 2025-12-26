const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CongNo = sequelize.define('CongNo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID công nợ'
    },
    id_nghia_vu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nghia_vu_nop',
        key: 'id'
      },
      comment: 'ID nghĩa vụ nộp (khóa ngoại)'
    },
    so_tien_da_nop: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Số tiền đã nộp'
    },
    cong_no: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Công nợ'
    },
    thoi_gian_cap_nhat_lan_cuoi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Thời gian cập nhật lần cuối'
    }
  }, {
    tableName: 'cong_no',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_nghia_vu']
      }
    ]
  });

  CongNo.associate = (models) => {
    // Một công nợ thuộc về một nghĩa vụ nộp
    CongNo.belongsTo(models.NghiaVuNop, {
      foreignKey: 'id_nghia_vu',
      as: 'nghiaVuNop'
    });
  };

  return CongNo;
};


const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NhanSuDeTai = sequelize.define('NhanSuDeTai', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID nhân sự đề tài'
    },
    id_de_tai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'de_tai_nghien_cuu',
        key: 'id'
      },
      comment: 'ID đề tài (khóa ngoại)'
    },
    id_nhan_su: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'nhan_su',
        key: 'id'
      },
      comment: 'ID nhân sự (khóa ngoại) - có thể null'
    },
    ten_nhan_su: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Tên nhân sự'
    },
    chuyen_mon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Chuyên môn'
    },
    vai_tro: {
      type: DataTypes.ENUM('chu_nhiem', 'thanh_vien', 'cong_tac_vien'),
      allowNull: true,
      comment: 'Vai trò trong đề tài'
    }
  }, {
    tableName: 'nhan_su_de_tai',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['id_de_tai']
      },
      {
        fields: ['id_nhan_su']
      }
    ]
  });

  NhanSuDeTai.associate = (models) => {
    // Một nhân sự đề tài thuộc về một đề tài
    NhanSuDeTai.belongsTo(models.DeTaiNghienCuu, {
      foreignKey: 'id_de_tai',
      as: 'deTaiNghienCuu'
    });

    // Một nhân sự đề tài có thể thuộc về một nhân sự
    NhanSuDeTai.belongsTo(models.NhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSu'
    });
  };

  return NhanSuDeTai;
};




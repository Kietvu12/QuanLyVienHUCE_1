const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaiLieuDeTai = sequelize.define('TaiLieuDeTai', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID tài liệu đề tài'
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
    ten_tai_lieu: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên tài liệu'
    },
    duong_dan_tai_lieu: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Đường dẫn tài liệu'
    }
  }, {
    tableName: 'tai_lieu_de_tai',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_de_tai']
      }
    ]
  });

  TaiLieuDeTai.associate = (models) => {
    // Một tài liệu đề tài thuộc về một đề tài
    TaiLieuDeTai.belongsTo(models.DeTaiNghienCuu, {
      foreignKey: 'id_de_tai',
      as: 'deTaiNghienCuu'
    });
  };

  return TaiLieuDeTai;
};




const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BaoCao = sequelize.define('BaoCao', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID báo cáo'
    },
    tieu_de: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tiêu đề'
    },
    id_vien: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vien',
        key: 'id'
      },
      comment: 'ID viện (khóa ngoại) - có thể null'
    },
    id_nguoi_tao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_khoan',
        key: 'id'
      },
      comment: 'ID người tạo (khóa ngoại)'
    },
    id_nguoi_phe_duyet: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tai_khoan',
        key: 'id'
      },
      comment: 'ID người phê duyệt (khóa ngoại) - có thể null'
    },
    duong_dan_tai_lieu: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Đường dẫn tài liệu'
    },
    trang_thai: {
      type: DataTypes.ENUM('cho_phe_duyet', 'da_phe_duyet', 'tu_choi'),
      allowNull: false,
      defaultValue: 'cho_phe_duyet',
      comment: 'Trạng thái báo cáo'
    },
    ngay_gui: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Ngày gửi'
    }
  }, {
    tableName: 'bao_cao',
    timestamps: true,
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['id_nguoi_tao']
      },
      {
        fields: ['id_nguoi_phe_duyet']
      },
      {
        fields: ['trang_thai']
      }
    ]
  });

  BaoCao.associate = (models) => {
    // Một báo cáo có thể thuộc về một viện
    BaoCao.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một báo cáo được tạo bởi một tài khoản
    BaoCao.belongsTo(models.TaiKhoan, {
      foreignKey: 'id_nguoi_tao',
      as: 'nguoiTao'
    });

    // Một báo cáo được phê duyệt bởi một tài khoản
    BaoCao.belongsTo(models.TaiKhoan, {
      foreignKey: 'id_nguoi_phe_duyet',
      as: 'nguoiPheDuyet'
    });
  };

  return BaoCao;
};




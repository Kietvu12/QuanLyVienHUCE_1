const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeTaiNghienCuu = sequelize.define('DeTaiNghienCuu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID đề tài nghiên cứu'
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
    ten_de_tai: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên đề tài'
    },
    linh_vuc: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Lĩnh vực'
    },
    so_tien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Số tiền'
    },
    trang_thai: {
      type: DataTypes.ENUM('dang_thuc_hien', 'hoan_thanh', 'huy_bo'),
      allowNull: false,
      defaultValue: 'dang_thuc_hien',
      comment: 'Trạng thái đề tài'
    },
    tien_do: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Tiến độ (0-100)'
    },
    ngay_bat_dau: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày bắt đầu'
    },
    ngay_hoan_thanh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày hoàn thành'
    },
    danh_gia: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Đánh giá'
    }
  }, {
    tableName: 'de_tai_nghien_cuu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'ngay_cap_nhat',
    indexes: [
      {
        fields: ['id_vien']
      },
      {
        fields: ['trang_thai']
      }
    ]
  });

  DeTaiNghienCuu.associate = (models) => {
    // Một đề tài thuộc về một viện
    DeTaiNghienCuu.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một đề tài có nhiều nhân sự tham gia
    DeTaiNghienCuu.hasMany(models.NhanSuDeTai, {
      foreignKey: 'id_de_tai',
      as: 'nhanSuDeTais'
    });

    // Một đề tài có nhiều tài liệu
    DeTaiNghienCuu.hasMany(models.TaiLieuDeTai, {
      foreignKey: 'id_de_tai',
      as: 'taiLieuDeTais'
    });

    // Một đề tài có thể liên kết với nhiều doanh thu
    DeTaiNghienCuu.hasMany(models.DoanhThu, {
      foreignKey: 'id_de_tai',
      as: 'doanhThus'
    });

    // Một đề tài có thể liên kết với nhiều chi phí
    DeTaiNghienCuu.hasMany(models.ChiPhi, {
      foreignKey: 'id_de_tai',
      as: 'chiPhis'
    });
  };

  return DeTaiNghienCuu;
};




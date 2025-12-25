const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NhanSu = sequelize.define('NhanSu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID nhân sự'
    },
    id_phong_ban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'phong_ban',
        key: 'id'
      },
      comment: 'ID phòng ban (khóa ngoại)'
    },
    ho_ten: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Họ tên'
    },
    ngay_sinh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày sinh'
    },
    chuc_vu: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Chức vụ: Viện trưởng, Kế toán, Trưởng phòng, Nhân viên'
    },
    dia_chi_tam_tru: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Địa chỉ tạm trú'
    },
    dia_chi_thuong_tru: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Địa chỉ thường trú'
    },
    cccd: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Số CCCD'
    },
    bang_cap: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Bằng cấp'
    },
    so_dien_thoai: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Số điện thoại'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Email'
    },
    nguoi_than_lien_he: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Người thân liên hệ'
    },
    ngay_bat_dau_lam: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày bắt đầu làm'
    },
    ngay_ket_thuc_lam_viec: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Ngày kết thúc làm việc'
    }
  }, {
    tableName: 'nhan_su',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_phong_ban']
      },
      {
        fields: ['cccd']
      }
    ]
  });

  NhanSu.associate = (models) => {
    // Một nhân sự thuộc về một phòng ban
    NhanSu.belongsTo(models.PhongBan, {
      foreignKey: 'id_phong_ban',
      as: 'phongBan'
    });

    // Một nhân sự có một thông tin bảo hiểm y tế
    NhanSu.hasOne(models.BaoHiemYTe, {
      foreignKey: 'id_nhan_su',
      as: 'baoHiemYTe'
    });

    // Một nhân sự có nhiều thông tin xe
    NhanSu.hasMany(models.ThongTinXe, {
      foreignKey: 'id_nhan_su',
      as: 'thongTinXes'
    });

    // Một nhân sự có một media
    NhanSu.hasOne(models.MediaNhanSu, {
      foreignKey: 'id_nhan_su',
      as: 'mediaNhanSu'
    });

    // Một nhân sự có thể tham gia nhiều đề tài
    NhanSu.hasMany(models.NhanSuDeTai, {
      foreignKey: 'id_nhan_su',
      as: 'nhanSuDeTais'
    });

    // Một nhân sự có nhiều hợp đồng lao động
    NhanSu.hasMany(models.HopDongLaoDong, {
      foreignKey: 'id_nhan_su',
      as: 'hopDongLaoDongs'
    });

    // Một nhân sự có nhiều bảng lương
    NhanSu.hasMany(models.BangLuong, {
      foreignKey: 'id_nhan_su',
      as: 'bangLuongs'
    });
  };

  return NhanSu;
};




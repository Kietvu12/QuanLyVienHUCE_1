const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vien = sequelize.define('Vien', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID viện'
    },
    ten_vien: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên viện'
    }
  }, {
    tableName: 'vien',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Vien.associate = (models) => {
    // Một viện có nhiều phòng ban
    Vien.hasMany(models.PhongBan, {
      foreignKey: 'id_vien',
      as: 'phongBans'
    });

    // Một viện có nhiều tài khoản
    Vien.hasMany(models.TaiKhoan, {
      foreignKey: 'id_vien',
      as: 'taiKhoans'
    });

    // Một viện có nhiều đề tài nghiên cứu
    Vien.hasMany(models.DeTaiNghienCuu, {
      foreignKey: 'id_vien',
      as: 'deTaiNghienCuus'
    });

    // Một viện có nhiều phòng
    Vien.hasMany(models.PhongCuaVien, {
      foreignKey: 'id_vien',
      as: 'phongCuaViens'
    });

    // Một viện có nhiều tài sản
    Vien.hasMany(models.TaiSan, {
      foreignKey: 'id_vien',
      as: 'taiSans'
    });

    // Một viện có nhiều doanh thu
    Vien.hasMany(models.DoanhThu, {
      foreignKey: 'id_vien',
      as: 'doanhThus'
    });

    // Một viện có nhiều chi phí
    Vien.hasMany(models.ChiPhi, {
      foreignKey: 'id_vien',
      as: 'chiPhis'
    });

    // Một viện có nhiều báo cáo
    Vien.hasMany(models.BaoCao, {
      foreignKey: 'id_vien',
      as: 'baoCaos'
    });

    // Một viện có nhiều nghĩa vụ nộp
    Vien.hasMany(models.NghiaVuNop, {
      foreignKey: 'id_vien',
      as: 'nghiaVuNops'
    });
  };

  return Vien;
};




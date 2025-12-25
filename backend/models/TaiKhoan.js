const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaiKhoan = sequelize.define('TaiKhoan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID tài khoản'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Tên đăng nhập'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Mật khẩu'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Email'
    },
    ho_ten: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Họ tên'
    },
    id_quyen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quyen',
        key: 'id'
      },
      comment: 'ID quyền (khóa ngoại)'
    },
    id_vien: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vien',
        key: 'id'
      },
      comment: 'ID viện (khóa ngoại) - nullable cho hiệu trưởng và cấp phòng'
    },
    trang_thai: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1,
      comment: 'Trạng thái: 1 - active, 0 - inactive'
    }
  }, {
    tableName: 'tai_khoan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['id_quyen']
      },
      {
        fields: ['id_vien']
      },
      {
        unique: true,
        fields: ['username']
      }
    ]
  });

  TaiKhoan.associate = (models) => {
    // Một tài khoản thuộc về một quyền
    TaiKhoan.belongsTo(models.Quyen, {
      foreignKey: 'id_quyen',
      as: 'quyen'
    });

    // Một tài khoản có thể thuộc về một viện
    TaiKhoan.belongsTo(models.Vien, {
      foreignKey: 'id_vien',
      as: 'vien'
    });

    // Một tài khoản có thể tạo nhiều báo cáo
    TaiKhoan.hasMany(models.BaoCao, {
      foreignKey: 'id_nguoi_tao',
      as: 'baoCaosTao'
    });

    // Một tài khoản có thể phê duyệt nhiều báo cáo
    TaiKhoan.hasMany(models.BaoCao, {
      foreignKey: 'id_nguoi_phe_duyet',
      as: 'baoCaosPheDuyet'
    });
  };

  return TaiKhoan;
};




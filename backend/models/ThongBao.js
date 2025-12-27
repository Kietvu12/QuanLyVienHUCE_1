'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ThongBao extends Model {
    static associate(models) {
      // Một thông báo thuộc về một người nhận
      ThongBao.belongsTo(models.TaiKhoan, {
        foreignKey: 'id_nguoi_nhan',
        as: 'nguoiNhan',
        onDelete: 'CASCADE'
      });

      // Một thông báo có thể có người gửi
      ThongBao.belongsTo(models.TaiKhoan, {
        foreignKey: 'id_nguoi_gui',
        as: 'nguoiGui',
        onDelete: 'SET NULL'
      });
    }
  }

  ThongBao.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_nguoi_nhan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID người nhận thông báo',
        references: {
          model: 'tai_khoan',
          key: 'id'
        }
      },
      id_nguoi_gui: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID người gửi thông báo',
        references: {
          model: 'tai_khoan',
          key: 'id'
        }
      },
      tieu_de: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tiêu đề thông báo'
      },
      noi_dung: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Nội dung thông báo'
      },
      loai: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'thong_bao',
        comment: 'Loại thông báo: thong_bao, canh_bao, thanh_cong'
      },
      loai_du_lieu: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Loại dữ liệu được cập nhật: tai_san, nhan_su, phong_cua_vien, bao_cao, etc.'
      },
      id_du_lieu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID của dữ liệu được cập nhật'
      },
      da_doc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Đã đọc: false = chưa đọc, true = đã đọc'
      }
    },
    {
      sequelize,
      modelName: 'ThongBao',
      tableName: 'thong_bao',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  );

  return ThongBao;
};


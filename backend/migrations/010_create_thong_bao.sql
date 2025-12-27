-- Migration: Tạo bảng thong_bao
-- File: 010_create_thong_bao.sql

USE quan_ly_vien;

-- Tạo bảng thong_bao
CREATE TABLE IF NOT EXISTS `thong_bao` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_nguoi_nhan` INT(11) NOT NULL COMMENT 'ID người nhận thông báo',
  `id_nguoi_gui` INT(11) NULL DEFAULT NULL COMMENT 'ID người gửi thông báo',
  `tieu_de` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo',
  `noi_dung` TEXT NOT NULL COMMENT 'Nội dung thông báo',
  `loai` VARCHAR(50) NOT NULL DEFAULT 'thong_bao' COMMENT 'Loại thông báo: thong_bao, canh_bao, thanh_cong',
  `loai_du_lieu` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Loại dữ liệu được cập nhật: tai_san, nhan_su, phong_cua_vien, bao_cao, etc.',
  `id_du_lieu` INT(11) NULL DEFAULT NULL COMMENT 'ID của dữ liệu được cập nhật',
  `da_doc` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Đã đọc: 0 = chưa đọc, 1 = đã đọc',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_id_nguoi_nhan` (`id_nguoi_nhan`),
  INDEX `idx_da_doc` (`da_doc`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_thong_bao_nguoi_nhan` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_thong_bao_nguoi_gui` FOREIGN KEY (`id_nguoi_gui`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông báo';


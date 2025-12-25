-- ============================================
-- MIGRATION: Cập nhật bảng nhân sự và tạo bảng mới
-- Ngày tạo: 2024
-- Mô tả: 
--   1. Sửa bảng nhan_su: loại bỏ ngay_ki_hop_dong_lao_dong, ma_hop_dong_lao_dong
--      Thêm trường ngay_ket_thuc_lam_viec
--   2. Tạo bảng hop_dong_lao_dong
--   3. Tạo bảng bang_luong
-- ============================================

-- 1. Sửa bảng nhan_su
-- Loại bỏ các trường: ngay_ki_hop_dong_lao_dong, ma_hop_dong_lao_dong
-- Lưu ý: Nếu các cột không tồn tại, câu lệnh sẽ báo lỗi. Kiểm tra trước khi chạy migration.

ALTER TABLE `nhan_su` 
DROP COLUMN `ngay_ki_hop_dong_lao_dong`;

ALTER TABLE `nhan_su` 
DROP COLUMN `ma_hop_dong_lao_dong`;

-- Thêm trường ngay_ket_thuc_lam_viec
ALTER TABLE `nhan_su` 
ADD COLUMN `ngay_ket_thuc_lam_viec` DATE NULL COMMENT 'Ngày kết thúc làm việc' AFTER `ngay_bat_dau_lam`;

-- 2. Tạo bảng hợp đồng lao động
CREATE TABLE IF NOT EXISTS `hop_dong_lao_dong` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nhan_su` INT(11) NOT NULL,
    `ma_hop_dong` VARCHAR(100) NOT NULL,
    `ngay_tao_hop_dong_lao_dong` DATE NOT NULL COMMENT 'Ngày tạo hợp đồng lao động',
    `luong_theo_hop_dong` DECIMAL(15,2) NOT NULL COMMENT 'Lương theo hợp đồng',
    `ngay_ki_hop_dong` DATE NOT NULL COMMENT 'Ngày ký hợp đồng',
    `ngay_ket_thuc_hop_dong_lao_dong` DATE NULL COMMENT 'Ngày kết thúc hợp đồng lao động',
    `duong_dan_tai_lieu` VARCHAR(500) NULL COMMENT 'Đường dẫn tài liệu',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    KEY `idx_ma_hop_dong` (`ma_hop_dong`),
    CONSTRAINT `fk_hop_dong_lao_dong_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tạo bảng bảng lương
CREATE TABLE IF NOT EXISTS `bang_luong` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nhan_su` INT(11) NOT NULL,
    `luong_thuc_nhan` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Lương thực nhận',
    `thuong` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Thưởng',
    `phat` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Phạt',
    `thuc_nhan` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Thực nhận',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    CONSTRAINT `fk_bang_luong_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


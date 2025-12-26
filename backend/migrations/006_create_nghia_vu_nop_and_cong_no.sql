-- ============================================
-- MIGRATION: Tạo bảng nghĩa vụ nộp và công nợ
-- File: 006_create_nghia_vu_nop_and_cong_no.sql
-- Ngày tạo: 2024
-- Mô tả: 
--   1. Tạo bảng nghia_vu_nop (nghĩa vụ nộp)
--   2. Tạo bảng cong_no (công nợ)
-- ============================================

USE quan_ly_vien;

-- 1. Tạo bảng nghĩa vụ nộp
CREATE TABLE IF NOT EXISTS `nghia_vu_nop` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL COMMENT 'ID viện',
    `thoi_gian_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
    `han_nop` DATE NOT NULL COMMENT 'Hạn nộp',
    `trang_thai` VARCHAR(50) NOT NULL DEFAULT 'chua_nop' COMMENT 'Trạng thái: chua_nop, da_nop, qua_han',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_han_nop` (`han_nop`),
    KEY `idx_trang_thai` (`trang_thai`),
    CONSTRAINT `fk_nghia_vu_nop_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tạo bảng công nợ
CREATE TABLE IF NOT EXISTS `cong_no` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nghia_vu` INT(11) NOT NULL COMMENT 'ID nghĩa vụ nộp',
    `so_tien_da_nop` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Số tiền đã nộp',
    `cong_no` DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Công nợ',
    `thoi_gian_cap_nhat_lan_cuoi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật lần cuối',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_nghia_vu` (`id_nghia_vu`),
    CONSTRAINT `fk_cong_no_nghia_vu_nop` FOREIGN KEY (`id_nghia_vu`) REFERENCES `nghia_vu_nop` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


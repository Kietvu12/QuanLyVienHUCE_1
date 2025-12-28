-- ============================================
-- MIGRATION: Thêm trạng thái và field cho cấp phòng duyệt báo cáo
-- File: 012_add_cap_phong_duyet_to_bao_cao.sql
-- Ngày tạo: 2024
-- Mô tả: 
--   Thêm các trạng thái mới: cho_cap_phong_duyet, da_cap_phong_duyet, cap_phong_tu_choi
--   Thêm field id_nguoi_cap_phong_phe_duyet để lưu người cấp phòng phê duyệt
--   Thêm field lich_su_tu_choi để lưu lịch sử từ chối (JSON)
-- ============================================

USE quan_ly_vien;

-- Thêm các trạng thái mới vào ENUM
ALTER TABLE `bao_cao` 
MODIFY COLUMN `trang_thai` ENUM('cho_phe_duyet', 'da_phe_duyet', 'tu_choi', 'cho_cap_phong_duyet', 'da_cap_phong_duyet', 'cap_phong_tu_choi') NOT NULL DEFAULT 'cho_phe_duyet' COMMENT 'Trạng thái báo cáo';

-- Thêm field id_nguoi_cap_phong_phe_duyet
ALTER TABLE `bao_cao`
ADD COLUMN `id_nguoi_cap_phong_phe_duyet` INT(11) NULL DEFAULT NULL COMMENT 'ID người cấp phòng phê duyệt' AFTER `id_nguoi_phe_duyet`,
ADD CONSTRAINT `fk_bao_cao_cap_phong_phe_duyet` FOREIGN KEY (`id_nguoi_cap_phong_phe_duyet`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

-- Thêm field lich_su_tu_choi để lưu lịch sử từ chối (JSON)
ALTER TABLE `bao_cao`
ADD COLUMN `lich_su_tu_choi` TEXT NULL DEFAULT NULL COMMENT 'Lịch sử từ chối (JSON array)' AFTER `ly_do_tu_choi`;

-- Thêm index cho field mới
ALTER TABLE `bao_cao`
ADD INDEX `idx_id_nguoi_cap_phong_phe_duyet` (`id_nguoi_cap_phong_phe_duyet`);


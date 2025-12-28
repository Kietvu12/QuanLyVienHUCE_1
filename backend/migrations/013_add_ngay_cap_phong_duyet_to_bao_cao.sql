-- ============================================
-- MIGRATION: Thêm field ngày cấp phòng duyệt
-- File: 013_add_ngay_cap_phong_duyet_to_bao_cao.sql
-- Ngày tạo: 2024
-- Mô tả: 
--   Thêm field ngay_cap_phong_duyet để lưu ngày cấp phòng duyệt riêng
-- ============================================

USE quan_ly_vien;

-- Thêm field ngay_cap_phong_duyet
ALTER TABLE `bao_cao`
ADD COLUMN `ngay_cap_phong_duyet` DATETIME NULL DEFAULT NULL COMMENT 'Ngày cấp phòng duyệt' AFTER `id_nguoi_cap_phong_phe_duyet`;


-- ============================================
-- MIGRATION: Thêm trường giá trị (VND) vào bảng tài sản
-- File: 008_add_gia_tri_to_tai_san.sql
-- Ngày tạo: 2025
-- Mô tả: Thêm cột gia_tri vào bảng tai_san để lưu giá trị tài sản bằng VND
-- ============================================

USE quan_ly_vien;

-- Thêm cột gia_tri vào bảng tai_san
ALTER TABLE `tai_san` 
ADD COLUMN `gia_tri` DECIMAL(15, 2) NULL COMMENT 'Giá trị tài sản (VND)' AFTER `ngay_ban_giao_tai_san`;

-- Thêm index cho gia_tri để tối ưu truy vấn
ALTER TABLE `tai_san`
ADD INDEX `idx_gia_tri` (`gia_tri`);


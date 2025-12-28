-- ============================================
-- MIGRATION: Thêm trường số tiền phải nộp vào bảng nghia_vu_nop
-- File: 011_add_so_tien_phai_nop_to_nghia_vu_nop.sql
-- Ngày tạo: 2024
-- Mô tả: 
--   Thêm trường so_tien_phai_nop vào bảng nghia_vu_nop để lưu số tiền phải nộp
-- ============================================

USE quan_ly_vien;

-- Thêm trường so_tien_phai_nop vào bảng nghia_vu_nop
ALTER TABLE `nghia_vu_nop` 
ADD COLUMN `so_tien_phai_nop` DECIMAL(15,2) NULL DEFAULT NULL COMMENT 'Số tiền phải nộp' AFTER `trang_thai`;


-- Migration: Thêm trường ly_do_tu_choi vào bảng bao_cao
-- File: 009_add_ly_do_tu_choi_to_bao_cao.sql

USE quan_ly_vien;

-- Thêm trường ly_do_tu_choi vào bảng bao_cao
ALTER TABLE `bao_cao`
  ADD COLUMN `ly_do_tu_choi` TEXT NULL COMMENT 'Lý do từ chối báo cáo' AFTER `ngay_gui`;


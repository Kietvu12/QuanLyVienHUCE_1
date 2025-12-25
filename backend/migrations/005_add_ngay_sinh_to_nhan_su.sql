-- Migration: Thêm trường ngày sinh vào bảng nhân sự
-- File: 005_add_ngay_sinh_to_nhan_su.sql

USE quan_ly_vien;

-- Thêm trường ngày sinh vào bảng nhan_su
ALTER TABLE `nhan_su` 
  ADD COLUMN `ngay_sinh` DATE NULL COMMENT 'Ngày sinh' AFTER `ho_ten`;


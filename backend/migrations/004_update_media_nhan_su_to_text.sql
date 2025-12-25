-- Migration: Đổi các field ảnh từ VARCHAR(255) sang TEXT để hỗ trợ JSON array
-- File: 004_update_media_nhan_su_to_text.sql

USE quan_ly_vien;

-- Đổi các field ảnh sang TEXT để có thể lưu JSON array dài hơn
ALTER TABLE `media_nhan_su` 
  MODIFY COLUMN `anh_ho_so` TEXT NULL COMMENT 'Ảnh hồ sơ (có thể là string đơn hoặc JSON array)',
  MODIFY COLUMN `anh_bang_cap` TEXT NULL COMMENT 'Ảnh bằng cấp (có thể là string đơn hoặc JSON array)',
  MODIFY COLUMN `anh_bhyt` TEXT NULL COMMENT 'Ảnh BHYT (có thể là string đơn hoặc JSON array)',
  MODIFY COLUMN `anh_hop_dong` TEXT NULL COMMENT 'Ảnh hợp đồng (có thể là string đơn hoặc JSON array)',
  MODIFY COLUMN `anh_xe` TEXT NULL COMMENT 'Ảnh xe (có thể là string đơn hoặc JSON array)';


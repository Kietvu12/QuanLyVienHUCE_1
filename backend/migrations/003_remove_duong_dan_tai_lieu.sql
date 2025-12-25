-- ============================================
-- MIGRATION: Loại bỏ trường duong_dan_tai_lieu
-- Ngày tạo: 2024
-- Mô tả: 
--   Loại bỏ trường duong_dan_tai_lieu khỏi bảng hop_dong_lao_dong
-- ============================================

-- Loại bỏ trường duong_dan_tai_lieu
ALTER TABLE `hop_dong_lao_dong` 
DROP COLUMN `duong_dan_tai_lieu`;

-- ============================================
-- LƯU Ý:
-- 1. Migration này sẽ xóa cột duong_dan_tai_lieu khỏi bảng hop_dong_lao_dong
-- 2. Dữ liệu trong cột này sẽ bị mất sau khi chạy migration
-- 3. Ảnh hợp đồng sẽ được lưu trong bảng media_nhan_su thay vì trường này
-- ============================================


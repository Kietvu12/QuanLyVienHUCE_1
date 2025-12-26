-- ============================================
-- MIGRATION: Thêm trình độ, giới tính vào nhân sự và tạo bảng loại hợp đồng
-- File: 007_add_trinh_do_gioi_tinh_and_loai_hop_dong.sql
-- Ngày tạo: 2024
-- Mô tả:
--   1. Thêm cột trinh_do và gioi_tinh vào bảng nhan_su
--   2. Tạo bảng loai_hop_dong với các data mẫu
--   3. Thêm cột id_loai_hop_dong vào bảng hop_dong_lao_dong
-- ============================================

USE quan_ly_vien;

-- 1. Thêm cột trinh_do vào bảng nhan_su
ALTER TABLE `nhan_su` 
ADD COLUMN `trinh_do` VARCHAR(100) NULL COMMENT 'Trình độ: Tiến sĩ, Thạc sĩ, Đại học, Cao đẳng, Trung cấp, Khác' AFTER `bang_cap`;

-- 2. Thêm cột gioi_tinh vào bảng nhan_su
ALTER TABLE `nhan_su` 
ADD COLUMN `gioi_tinh` VARCHAR(10) NULL COMMENT 'Giới tính: Nam, Nữ, Khác' AFTER `ngay_sinh`;

-- 3. Tạo bảng loai_hop_dong
CREATE TABLE IF NOT EXISTS `loai_hop_dong` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ten_loai` VARCHAR(255) NOT NULL COMMENT 'Tên loại hợp đồng',
    `mo_ta` TEXT NULL COMMENT 'Mô tả loại hợp đồng',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_ten_loai` (`ten_loai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Thêm dữ liệu mẫu vào bảng loai_hop_dong
INSERT INTO `loai_hop_dong` (`ten_loai`, `mo_ta`) VALUES
('Viên chức của Trường ĐHXDHN', 'Hợp đồng cho viên chức chính thức của Trường Đại học Xây dựng Hà Nội'),
('Hợp đồng lao động', 'Hợp đồng lao động theo quy định của Bộ luật Lao động'),
('Hợp đồng khác', 'Các loại hợp đồng khác không thuộc hai loại trên')
ON DUPLICATE KEY UPDATE `ten_loai` = VALUES(`ten_loai`);

-- 5. Thêm cột id_loai_hop_dong vào bảng hop_dong_lao_dong
ALTER TABLE `hop_dong_lao_dong` 
ADD COLUMN `id_loai_hop_dong` INT(11) NULL COMMENT 'ID loại hợp đồng' AFTER `id_nhan_su`;

-- 6. Thêm foreign key constraint
ALTER TABLE `hop_dong_lao_dong`
ADD CONSTRAINT `fk_hop_dong_lao_dong_loai_hop_dong` 
FOREIGN KEY (`id_loai_hop_dong`) REFERENCES `loai_hop_dong` (`id`) ON DELETE SET NULL;

-- 7. Thêm index cho id_loai_hop_dong
ALTER TABLE `hop_dong_lao_dong`
ADD INDEX `idx_id_loai_hop_dong` (`id_loai_hop_dong`);


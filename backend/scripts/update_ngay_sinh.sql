-- Script: Cập nhật ngày sinh cho nhân sự hiện có
-- File: update_ngay_sinh.sql
-- Mô tả: Cập nhật ngày sinh cho các nhân sự chưa có ngày sinh
--        Có thể lấy từ CCCD hoặc random trong khoảng hợp lý (25-55 tuổi)

USE quan_ly_vien;

-- Cập nhật ngày sinh từ CCCD (nếu có)
-- CCCD có 12 số, 6 số đầu là ngày tháng năm sinh (ddmmyy)
-- Ví dụ: 010195123456 -> 01/01/1995
UPDATE `nhan_su`
SET `ngay_sinh` = CASE
    WHEN `cccd` IS NOT NULL AND LENGTH(`cccd`) = 12 AND `cccd` REGEXP '^[0-9]{12}$' THEN
        -- Lấy 6 số đầu của CCCD
        STR_TO_DATE(
            CONCAT(
                SUBSTRING(`cccd`, 5, 2),  -- năm (yy)
                '-',
                SUBSTRING(`cccd`, 3, 2),  -- tháng (mm)
                '-',
                SUBSTRING(`cccd`, 1, 2)   -- ngày (dd)
            ),
            '%y-%m-%d'
        )
    ELSE NULL
END
WHERE `ngay_sinh` IS NULL AND `cccd` IS NOT NULL AND LENGTH(`cccd`) = 12;

-- Cập nhật ngày sinh random cho các nhân sự còn lại (25-55 tuổi)
-- Tạo ngày sinh trong khoảng 25-55 tuổi tính từ hiện tại
UPDATE `nhan_su`
SET `ngay_sinh` = DATE_SUB(
    CURDATE(),
    INTERVAL (25 + FLOOR(RAND() * 31)) YEAR
)
WHERE `ngay_sinh` IS NULL;

-- Kiểm tra kết quả
SELECT 
    COUNT(*) as total_nhan_su,
    COUNT(`ngay_sinh`) as co_ngay_sinh,
    COUNT(*) - COUNT(`ngay_sinh`) as chua_co_ngay_sinh
FROM `nhan_su`;


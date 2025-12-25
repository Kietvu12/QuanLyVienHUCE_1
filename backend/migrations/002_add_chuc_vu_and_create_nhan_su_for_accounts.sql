-- ============================================
-- MIGRATION: Thêm trường chức vụ và tạo nhân sự cho tài khoản
-- Ngày tạo: 2024
-- Mô tả: 
--   1. Thêm trường chuc_vu vào bảng nhan_su
--   2. Tạo phòng ban "Hành chính nhân sự" cho các viện (nếu chưa có)
--   3. Tạo thông tin nhân sự cho các tài khoản Viện trưởng và Kế toán đã có
-- ============================================

-- 1. Thêm trường chuc_vu vào bảng nhan_su
ALTER TABLE `nhan_su` 
ADD COLUMN `chuc_vu` VARCHAR(100) NULL COMMENT 'Chức vụ: Viện trưởng, Kế toán, Trưởng phòng, Nhân viên' AFTER `ho_ten`;

-- 2. Tạo phòng ban "Hành chính nhân sự" cho các viện chưa có phòng ban này
-- Lưu ý: Chỉ tạo nếu chưa tồn tại
INSERT INTO `phong_ban` (`id_vien`, `ten_phong_ban`)
SELECT `id`, 'Hành chính nhân sự'
FROM `vien`
WHERE `id` NOT IN (
    SELECT DISTINCT `id_vien` 
    FROM `phong_ban` 
    WHERE `ten_phong_ban` = 'Hành chính nhân sự'
);

-- 3. Tạo thông tin nhân sự cho các tài khoản Viện trưởng và Kế toán
-- Lấy ID phòng ban "Hành chính nhân sự" cho từng viện
-- Tạo nhân sự cho Viện trưởng (id_quyen = 3, ten_quyen = 'vien_truong')
INSERT INTO `nhan_su` (
    `id_phong_ban`, 
    `ho_ten`, 
    `chuc_vu`, 
    `email`, 
    `ngay_bat_dau_lam`
)
SELECT 
    pb.`id` AS `id_phong_ban`,
    tk.`ho_ten`,
    'Viện trưởng' AS `chuc_vu`,
    tk.`email`,
    tk.`created_at` AS `ngay_bat_dau_lam`
FROM `tai_khoan` tk
INNER JOIN `quyen` q ON tk.`id_quyen` = q.`id`
INNER JOIN `phong_ban` pb ON tk.`id_vien` = pb.`id_vien` AND pb.`ten_phong_ban` = 'Hành chính nhân sự'
WHERE q.`ten_quyen` = 'vien_truong'
  AND tk.`id_vien` IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 
      FROM `nhan_su` ns 
      WHERE ns.`ho_ten` = tk.`ho_ten` 
        AND ns.`email` = tk.`email`
  );

-- Tạo nhân sự cho Kế toán (id_quyen = 4, ten_quyen = 'ke_toan_vien')
INSERT INTO `nhan_su` (
    `id_phong_ban`, 
    `ho_ten`, 
    `chuc_vu`, 
    `email`, 
    `ngay_bat_dau_lam`
)
SELECT 
    pb.`id` AS `id_phong_ban`,
    tk.`ho_ten`,
    'Kế toán' AS `chuc_vu`,
    tk.`email`,
    tk.`created_at` AS `ngay_bat_dau_lam`
FROM `tai_khoan` tk
INNER JOIN `quyen` q ON tk.`id_quyen` = q.`id`
INNER JOIN `phong_ban` pb ON tk.`id_vien` = pb.`id_vien` AND pb.`ten_phong_ban` = 'Hành chính nhân sự'
WHERE q.`ten_quyen` = 'ke_toan_vien'
  AND tk.`id_vien` IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 
      FROM `nhan_su` ns 
      WHERE ns.`ho_ten` = tk.`ho_ten` 
        AND ns.`email` = tk.`email`
  );

-- ============================================
-- LƯU Ý:
-- 1. Migration này sẽ:
--    - Thêm trường chuc_vu vào bảng nhan_su
--    - Tạo phòng ban "Hành chính nhân sự" cho các viện chưa có
--    - Tạo thông tin nhân sự cho các tài khoản Viện trưởng và Kế toán đã có
-- 2. Các chức vụ có thể có: 'Viện trưởng', 'Kế toán', 'Trưởng phòng', 'Nhân viên'
-- 3. Migration sẽ không tạo trùng lặp nhân sự (kiểm tra theo họ tên và email)
-- ============================================


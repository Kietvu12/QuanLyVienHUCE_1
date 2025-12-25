-- ============================================
-- INSERT DỮ LIỆU MẪU CHO HỆ THỐNG
-- ============================================

-- Lưu ý: Mật khẩu mặc định cho tất cả tài khoản là "123456"
-- Mật khẩu đã được hash bằng bcrypt với salt rounds = 10
-- Hash của "123456": $2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy

-- 1. Tạo Viện "Viện Tin học Xây dựng"
INSERT INTO `vien` (`ten_vien`) VALUES
('Viện Tin học Xây dựng');

-- Lấy ID viện vừa tạo (giả sử ID = 1, nếu đã có viện khác thì điều chỉnh)
SET @vien_tin_hoc_id = LAST_INSERT_ID();

-- 2. Tạo Phòng ban cho Viện Tin học Xây dựng (ví dụ: Phòng Hành chính)
INSERT INTO `phong_ban` (`id_vien`, `ten_phong_ban`) VALUES
(@vien_tin_hoc_id, 'Phòng Hành chính');

-- 3. Lấy ID các quyền (giả sử theo thứ tự trong INSERT ban đầu)
-- hieu_truong = 1, cap_phong = 2, vien_truong = 3, ke_toan_vien = 4
-- Nếu thứ tự khác, cần điều chỉnh

-- 4. Tạo tài khoản cho Hoàng Thanh Tùng - Hiệu trưởng
-- Hiệu trưởng không thuộc viện nào (id_vien = NULL)
-- Mật khẩu: 123456
INSERT INTO `tai_khoan` (`username`, `password`, `email`, `ho_ten`, `id_quyen`, `id_vien`, `trang_thai`) VALUES
('hoangthanhtung', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'hoangthanhtung@example.com', 'Hoàng Thanh Tùng', 1, NULL, 1);

-- 5. Tạo tài khoản cho Vũ Văn Lai - Cấp phòng
-- Cấp phòng không thuộc viện nào (id_vien = NULL)
-- Mật khẩu: 123456
INSERT INTO `tai_khoan` (`username`, `password`, `email`, `ho_ten`, `id_quyen`, `id_vien`, `trang_thai`) VALUES
('vuvanlai', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'vuvanlai@example.com', 'Vũ Văn Lai', 2, NULL, 1);

-- 6. Tạo tài khoản cho Trần Anh Bình - Viện trưởng Viện Tin học Xây dựng
-- Mật khẩu: 123456
INSERT INTO `tai_khoan` (`username`, `password`, `email`, `ho_ten`, `id_quyen`, `id_vien`, `trang_thai`) VALUES
('trananhbinh', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'trananhbinh@example.com', 'Trần Anh Bình', 3, @vien_tin_hoc_id, 1);

-- 7. Tạo tài khoản cho Ngô Thị Vui - Kế toán Viện Tin học Xây dựng
-- Mật khẩu: 123456
INSERT INTO `tai_khoan` (`username`, `password`, `email`, `ho_ten`, `id_quyen`, `id_vien`, `trang_thai`) VALUES
('ngothivui', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'ngothivui@example.com', 'Ngô Thị Vui', 4, @vien_tin_hoc_id, 1);

-- ============================================
-- LƯU Ý:
-- 1. Mật khẩu mặc định cho tất cả tài khoản: "123456"
-- 2. Hash password đã được generate bằng bcrypt với salt rounds = 10
-- 3. ID quyền giả định:
--    - 1 = hieu_truong
--    - 2 = cap_phong
--    - 3 = vien_truong
--    - 4 = ke_toan_vien
-- 4. Nếu ID quyền trong database khác, cần điều chỉnh lại id_quyen trong các câu INSERT
-- 5. Để kiểm tra ID quyền thực tế, chạy: SELECT * FROM quyen;
-- ============================================


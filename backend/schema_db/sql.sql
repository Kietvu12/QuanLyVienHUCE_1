-- ============================================
-- SCHEMA DATABASE QUAN LY VIEN
-- ============================================

-- 1. Bảng Viện
CREATE TABLE IF NOT EXISTS `vien` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ten_vien` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Phòng/Ban
CREATE TABLE IF NOT EXISTS `phong_ban` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `ten_phong_ban` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    CONSTRAINT `fk_phong_ban_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Quyền (Roles)
CREATE TABLE IF NOT EXISTS `quyen` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ten_quyen` VARCHAR(100) NOT NULL,
    `mo_ta` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_ten_quyen` (`ten_quyen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Tài khoản
CREATE TABLE IF NOT EXISTS `tai_khoan` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `ho_ten` VARCHAR(255),
    `id_quyen` INT(11) NOT NULL,
    `id_vien` INT(11) NULL,
    `trang_thai` TINYINT(1) DEFAULT 1 COMMENT '1: active, 0: inactive',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_id_quyen` (`id_quyen`),
    KEY `idx_id_vien` (`id_vien`),
    CONSTRAINT `fk_tai_khoan_quyen` FOREIGN KEY (`id_quyen`) REFERENCES `quyen` (`id`),
    CONSTRAINT `fk_tai_khoan_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Nhân sự Viện
CREATE TABLE IF NOT EXISTS `nhan_su` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_phong_ban` INT(11) NOT NULL,
    `ho_ten` VARCHAR(255) NOT NULL,
    `dia_chi_tam_tru` TEXT,
    `dia_chi_thuong_tru` TEXT,
    `cccd` VARCHAR(20),
    `bang_cap` VARCHAR(255),
    `so_dien_thoai` VARCHAR(20),
    `email` VARCHAR(255),
    `nguoi_than_lien_he` VARCHAR(255),
    `ngay_ki_hop_dong_lao_dong` DATE,
    `ngay_bat_dau_lam` DATE,
    `ma_hop_dong_lao_dong` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_phong_ban` (`id_phong_ban`),
    KEY `idx_cccd` (`cccd`),
    CONSTRAINT `fk_nhan_su_phong_ban` FOREIGN KEY (`id_phong_ban`) REFERENCES `phong_ban` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng thông tin bảo hiểm y tế
CREATE TABLE IF NOT EXISTS `bao_hiem_y_te` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nhan_su` INT(11) NOT NULL,
    `so_the_bhyt` VARCHAR(50),
    `noi_dang_ki_kham_chua_benh_ban_dau` VARCHAR(255),
    `ngay_het_han` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    CONSTRAINT `fk_bhyt_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng thông tin xe
CREATE TABLE IF NOT EXISTS `thong_tin_xe` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nhan_su` INT(11) NOT NULL,
    `ten_xe` VARCHAR(255),
    `loai_xe` VARCHAR(100),
    `bien_so_xe` VARCHAR(20),
    `so_dang_ki_xe` VARCHAR(50),
    `ngay_het_han` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    KEY `idx_bien_so_xe` (`bien_so_xe`),
    CONSTRAINT `fk_xe_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng media thông tin nhân sự
CREATE TABLE IF NOT EXISTS `media_nhan_su` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_nhan_su` INT(11) NOT NULL,
    `anh_ho_so` VARCHAR(255),
    `anh_bang_cap` VARCHAR(255),
    `anh_bhyt` VARCHAR(255),
    `anh_hop_dong` VARCHAR(255),
    `anh_xe` VARCHAR(255),
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_cap_nhat_ho_so` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    CONSTRAINT `fk_media_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng Đề tài nghiên cứu
CREATE TABLE IF NOT EXISTS `de_tai_nghien_cuu` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `ten_de_tai` VARCHAR(255) NOT NULL,
    `linh_vuc` VARCHAR(255),
    `so_tien` DECIMAL(15,2) DEFAULT 0,
    `trang_thai` VARCHAR(50) DEFAULT 'dang_thuc_hien' COMMENT 'dang_thuc_hien, hoan_thanh, huy_bo',
    `tien_do` INT(3) DEFAULT 0 COMMENT '0-100',
    `ngay_bat_dau` DATE,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ngay_hoan_thanh` DATE NULL,
    `danh_gia` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_trang_thai` (`trang_thai`),
    CONSTRAINT `fk_de_tai_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bảng Nhân sự đề tài
CREATE TABLE IF NOT EXISTS `nhan_su_de_tai` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_de_tai` INT(11) NOT NULL,
    `id_nhan_su` INT(11) NULL,
    `ten_nhan_su` VARCHAR(255),
    `chuyen_mon` VARCHAR(255),
    `vai_tro` VARCHAR(100) COMMENT 'chu_nhiem, thanh_vien, cong_tac_vien',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_de_tai` (`id_de_tai`),
    KEY `idx_id_nhan_su` (`id_nhan_su`),
    CONSTRAINT `fk_nhan_su_de_tai_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_nhan_su_de_tai_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Bảng Tài liệu đề tài
CREATE TABLE IF NOT EXISTS `tai_lieu_de_tai` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_de_tai` INT(11) NOT NULL,
    `ten_tai_lieu` VARCHAR(255) NOT NULL,
    `duong_dan_tai_lieu` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_de_tai` (`id_de_tai`),
    CONSTRAINT `fk_tai_lieu_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Bảng Phòng của viện
CREATE TABLE IF NOT EXISTS `phong_cua_vien` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `id_phong_ban` INT(11) NULL,
    `ten_toa` VARCHAR(255),
    `so_tang` INT(3),
    `so_phong` VARCHAR(50),
    `dien_tich` DECIMAL(10,2),
    `trang_thai` VARCHAR(50) DEFAULT 'trong' COMMENT 'trong, dang_su_dung, bao_tri',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_id_phong_ban` (`id_phong_ban`),
    CONSTRAINT `fk_phong_cua_vien_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_phong_cua_vien_phong_ban` FOREIGN KEY (`id_phong_ban`) REFERENCES `phong_ban` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Bảng tài sản
CREATE TABLE IF NOT EXISTS `tai_san` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `id_phong` INT(11) NULL,
    `ten_tai_san` VARCHAR(255) NOT NULL,
    `tinh_trang` VARCHAR(50) DEFAULT 'tot' COMMENT 'tot, hong, can_bao_tri',
    `ngay_nhan_tai_san` DATE,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ngay_ban_giao_tai_san` DATE NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_id_phong` (`id_phong`),
    CONSTRAINT `fk_tai_san_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tai_san_phong` FOREIGN KEY (`id_phong`) REFERENCES `phong_cua_vien` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Bảng media tài sản
CREATE TABLE IF NOT EXISTS `media_tai_san` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_tai_san` INT(11) NOT NULL,
    `anh_phieu_nhan` VARCHAR(255),
    `anh_tai_san` VARCHAR(255),
    `anh_phieu_ban_giao` VARCHAR(255),
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_tai_san` (`id_tai_san`),
    CONSTRAINT `fk_media_tai_san` FOREIGN KEY (`id_tai_san`) REFERENCES `tai_san` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Bảng doanh thu
CREATE TABLE IF NOT EXISTS `doanh_thu` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `tieu_de` VARCHAR(255) NOT NULL,
    `noi_dung` TEXT,
    `so_tien` DECIMAL(15,2) NOT NULL,
    `id_de_tai` INT(11) NULL,
    `trang_thai` VARCHAR(50) DEFAULT 'chua_nhan' COMMENT 'chua_nhan, da_nhan, huy',
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ngay_nhan_tien` DATE NULL,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_id_de_tai` (`id_de_tai`),
    KEY `idx_trang_thai` (`trang_thai`),
    CONSTRAINT `fk_doanh_thu_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_doanh_thu_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Bảng media doanh thu
CREATE TABLE IF NOT EXISTS `media_doanh_thu` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_doanh_thu` INT(11) NOT NULL,
    `duong_dan_tai_lieu` VARCHAR(500),
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_doanh_thu` (`id_doanh_thu`),
    CONSTRAINT `fk_media_doanh_thu` FOREIGN KEY (`id_doanh_thu`) REFERENCES `doanh_thu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Bảng chi phí
CREATE TABLE IF NOT EXISTS `chi_phi` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_vien` INT(11) NOT NULL,
    `tieu_de` VARCHAR(255) NOT NULL,
    `noi_dung` TEXT,
    `so_tien` DECIMAL(15,2) NOT NULL,
    `id_de_tai` INT(11) NULL,
    `trang_thai` VARCHAR(50) DEFAULT 'chua_tat_toan' COMMENT 'chua_tat_toan, da_tat_toan, huy',
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ngay_tat_toan` DATE NULL,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_id_de_tai` (`id_de_tai`),
    KEY `idx_trang_thai` (`trang_thai`),
    CONSTRAINT `fk_chi_phi_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chi_phi_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Bảng media chi phí
CREATE TABLE IF NOT EXISTS `media_chi_phi` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `id_chi_phi` INT(11) NOT NULL,
    `duong_dan_tai_lieu` VARCHAR(500),
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_chi_phi` (`id_chi_phi`),
    CONSTRAINT `fk_media_chi_phi` FOREIGN KEY (`id_chi_phi`) REFERENCES `chi_phi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Bảng báo cáo
CREATE TABLE IF NOT EXISTS `bao_cao` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `tieu_de` VARCHAR(255) NOT NULL,
    `id_vien` INT(11) NULL,
    `id_nguoi_tao` INT(11) NOT NULL,
    `id_nguoi_phe_duyet` INT(11) NULL,
    `duong_dan_tai_lieu` VARCHAR(500),
    `trang_thai` VARCHAR(50) DEFAULT 'cho_phe_duyet' COMMENT 'cho_phe_duyet, da_phe_duyet, tu_choi',
    `ngay_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ngay_gui` TIMESTAMP NULL,
    `ngay_cap_nhat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_id_vien` (`id_vien`),
    KEY `idx_id_nguoi_tao` (`id_nguoi_tao`),
    KEY `idx_id_nguoi_phe_duyet` (`id_nguoi_phe_duyet`),
    KEY `idx_trang_thai` (`trang_thai`),
    CONSTRAINT `fk_bao_cao_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_bao_cao_nguoi_tao` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`),
    CONSTRAINT `fk_bao_cao_nguoi_phe_duyet` FOREIGN KEY (`id_nguoi_phe_duyet`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DỮ LIỆU MẪU CHO BẢNG QUYỀN
-- ============================================
INSERT INTO `quyen` (`ten_quyen`, `mo_ta`) VALUES
('hieu_truong', 'Quyền hiệu trưởng - Quyền cao nhất trong hệ thống'),
('cap_phong', 'Quyền cấp phòng - Cấp trên của Viện'),
('vien_truong', 'Quyền viện trưởng - Quản lý một Viện cụ thể'),
('ke_toan_vien', 'Quyền kế toán Viện - Quản lý tài chính của Viện');


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2025 at 11:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlyvien`
--

-- --------------------------------------------------------

--
-- Table structure for table `bang_luong`
--

CREATE TABLE `bang_luong` (
  `id` int(11) NOT NULL,
  `id_nhan_su` int(11) NOT NULL,
  `luong_thuc_nhan` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Lương thực nhận',
  `thuong` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Thưởng',
  `phat` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Phạt',
  `thuc_nhan` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Thực nhận',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bao_cao`
--

CREATE TABLE `bao_cao` (
  `id` int(11) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `id_vien` int(11) DEFAULT NULL,
  `id_nguoi_tao` int(11) NOT NULL,
  `id_nguoi_phe_duyet` int(11) DEFAULT NULL,
  `duong_dan_tai_lieu` varchar(500) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'cho_phe_duyet' COMMENT 'cho_phe_duyet, da_phe_duyet, tu_choi',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_gui` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bao_hiem_y_te`
--

CREATE TABLE `bao_hiem_y_te` (
  `id` int(11) NOT NULL,
  `id_nhan_su` int(11) NOT NULL,
  `so_the_bhyt` varchar(50) DEFAULT NULL,
  `noi_dang_ki_kham_chua_benh_ban_dau` varchar(255) DEFAULT NULL,
  `ngay_het_han` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bao_hiem_y_te`
--

INSERT INTO `bao_hiem_y_te` (`id`, `id_nhan_su`, `so_the_bhyt`, `noi_dang_ki_kham_chua_benh_ban_dau`, `ngay_het_han`, `created_at`, `updated_at`) VALUES
(1, 3, '213131112313', 'Bệnh viện Dệt May', '2028-10-26', '2025-12-25 08:43:18', '2025-12-25 08:43:18');

-- --------------------------------------------------------

--
-- Table structure for table `chi_phi`
--

CREATE TABLE `chi_phi` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `id_de_tai` int(11) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'chua_tat_toan' COMMENT 'chua_tat_toan, da_tat_toan, huy',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_tat_toan` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `de_tai_nghien_cuu`
--

CREATE TABLE `de_tai_nghien_cuu` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `ten_de_tai` varchar(255) NOT NULL,
  `linh_vuc` varchar(255) DEFAULT NULL,
  `so_tien` decimal(15,2) DEFAULT 0.00,
  `trang_thai` varchar(50) DEFAULT 'dang_thuc_hien' COMMENT 'dang_thuc_hien, hoan_thanh, huy_bo',
  `tien_do` int(3) DEFAULT 0 COMMENT '0-100',
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_hoan_thanh` date DEFAULT NULL,
  `danh_gia` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doanh_thu`
--

CREATE TABLE `doanh_thu` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `id_de_tai` int(11) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'chua_nhan' COMMENT 'chua_nhan, da_nhan, huy',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_nhan_tien` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hop_dong_lao_dong`
--

CREATE TABLE `hop_dong_lao_dong` (
  `id` int(11) NOT NULL,
  `id_nhan_su` int(11) NOT NULL,
  `ma_hop_dong` varchar(100) NOT NULL,
  `ngay_tao_hop_dong_lao_dong` date NOT NULL COMMENT 'Ngày tạo hợp đồng lao động',
  `luong_theo_hop_dong` decimal(15,2) NOT NULL COMMENT 'Lương theo hợp đồng',
  `ngay_ki_hop_dong` date NOT NULL COMMENT 'Ngày ký hợp đồng',
  `ngay_ket_thuc_hop_dong_lao_dong` date DEFAULT NULL COMMENT 'Ngày kết thúc hợp đồng lao động',
  `duong_dan_tai_lieu` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn tài liệu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hop_dong_lao_dong`
--

INSERT INTO `hop_dong_lao_dong` (`id`, `id_nhan_su`, `ma_hop_dong`, `ngay_tao_hop_dong_lao_dong`, `luong_theo_hop_dong`, `ngay_ki_hop_dong`, `ngay_ket_thuc_hop_dong_lao_dong`, `duong_dan_tai_lieu`, `created_at`, `updated_at`) VALUES
(1, 3, '12121', '2025-12-25', 15000000.00, '2025-12-25', '2026-12-25', NULL, '2025-12-25 08:13:27', '2025-12-25 08:13:27');

-- --------------------------------------------------------

--
-- Table structure for table `media_chi_phi`
--

CREATE TABLE `media_chi_phi` (
  `id` int(11) NOT NULL,
  `id_chi_phi` int(11) NOT NULL,
  `duong_dan_tai_lieu` varchar(500) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_doanh_thu`
--

CREATE TABLE `media_doanh_thu` (
  `id` int(11) NOT NULL,
  `id_doanh_thu` int(11) NOT NULL,
  `duong_dan_tai_lieu` varchar(500) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_nhan_su`
--

CREATE TABLE `media_nhan_su` (
  `id` int(11) NOT NULL,
  `id_nhan_su` int(11) NOT NULL,
  `anh_ho_so` text DEFAULT NULL COMMENT 'Ảnh hồ sơ (có thể là string đơn hoặc JSON array)',
  `anh_bang_cap` text DEFAULT NULL COMMENT 'Ảnh bằng cấp (có thể là string đơn hoặc JSON array)',
  `anh_bhyt` text DEFAULT NULL COMMENT 'Ảnh BHYT (có thể là string đơn hoặc JSON array)',
  `anh_hop_dong` text DEFAULT NULL COMMENT 'Ảnh hợp đồng (có thể là string đơn hoặc JSON array)',
  `anh_xe` text DEFAULT NULL COMMENT 'Ảnh xe (có thể là string đơn hoặc JSON array)',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat_ho_so` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_nhan_su`
--

INSERT INTO `media_nhan_su` (`id`, `id_nhan_su`, `anh_ho_so`, `anh_bang_cap`, `anh_bhyt`, `anh_hop_dong`, `anh_xe`, `ngay_tao`, `ngay_cap_nhat_ho_so`) VALUES
(1, 3, NULL, NULL, '[\"/uploads/media-nhan-su/anh_1-1766652204612-488945894.jpg\",\"/uploads/media-nhan-su/anh_2-1766652204711-80306237.jpg\",\"/uploads/media-nhan-su/bfe87897e1b66ee837a7-1766652204745-533975468.jpg\",\"/uploads/media-nhan-su/da4600a8-01b3-471e-b2d7-733ba9420b5c-1766652204746-330406163.jpg\",\"/uploads/media-nhan-su/feb0cf390e368168d827-1766652204747-443328700.jpg\",\"/uploads/media-nhan-su/shot-panoramic-composition-bedroom-1766652204750-646366656.jpg\"]', '[\"[\\\"/uploads/media-nhan-su/anh_1-1766651899373-929845760.jpg\\\",\\\"/uploads/media-nhan-su/anh_2-1766651899429-467793658.jpg\\\",\\\"/uploads/media-nhan-su/bfe87897e1b66ee837a7-1766651899461-669704461.jpg\\\",\\\"/uploads/media-nhan-su/da4600a8-01b3-471e-b2d7-733ba9420b5c-1\",\"/uploads/media-nhan-su/anh_1-1766652158460-465363494.jpg\",\"/uploads/media-nhan-su/anh_2-1766652158517-784481977.jpg\",\"/uploads/media-nhan-su/bfe87897e1b66ee837a7-1766652158559-653356564.jpg\",\"/uploads/media-nhan-su/da4600a8-01b3-471e-b2d7-733ba9420b5c-1766652158559-34715581.jpg\",\"/uploads/media-nhan-su/feb0cf390e368168d827-1766652158563-931258709.jpg\",\"/uploads/media-nhan-su/shot-panoramic-composition-bedroom-1766652158564-888516429.jpg\"]', '[\"/uploads/media-nhan-su/anh_1-1766656116572-560521501.jpg\",\"/uploads/media-nhan-su/anh_2-1766656116688-688549246.jpg\",\"/uploads/media-nhan-su/bfe87897e1b66ee837a7-1766656116746-326556256.jpg\",\"/uploads/media-nhan-su/da4600a8-01b3-471e-b2d7-733ba9420b5c-1766656116746-212026219.jpg\",\"/uploads/media-nhan-su/feb0cf390e368168d827-1766656116751-983157470.jpg\",\"/uploads/media-nhan-su/shot-panoramic-composition-bedroom-1766656116753-258509464.jpg\"]', '2025-12-25 08:35:33', '2025-12-25 09:48:36');

-- --------------------------------------------------------

--
-- Table structure for table `media_tai_san`
--

CREATE TABLE `media_tai_san` (
  `id` int(11) NOT NULL,
  `id_tai_san` int(11) NOT NULL,
  `anh_phieu_nhan` varchar(255) DEFAULT NULL,
  `anh_tai_san` varchar(255) DEFAULT NULL,
  `anh_phieu_ban_giao` varchar(255) DEFAULT NULL,
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhan_su`
--

CREATE TABLE `nhan_su` (
  `id` int(11) NOT NULL,
  `id_phong_ban` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ngay_sinh` date DEFAULT NULL COMMENT 'Ngày sinh',
  `chuc_vu` varchar(100) DEFAULT NULL COMMENT 'Chức vụ: Viện trưởng, Kế toán, Trưởng phòng, Nhân viên',
  `dia_chi_tam_tru` text DEFAULT NULL,
  `dia_chi_thuong_tru` text DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `bang_cap` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nguoi_than_lien_he` varchar(255) DEFAULT NULL,
  `ngay_bat_dau_lam` date DEFAULT NULL,
  `ngay_ket_thuc_lam_viec` date DEFAULT NULL COMMENT 'Ngày kết thúc làm việc',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nhan_su`
--

INSERT INTO `nhan_su` (`id`, `id_phong_ban`, `ho_ten`, `ngay_sinh`, `chuc_vu`, `dia_chi_tam_tru`, `dia_chi_thuong_tru`, `cccd`, `bang_cap`, `so_dien_thoai`, `email`, `nguoi_than_lien_he`, `ngay_bat_dau_lam`, `ngay_ket_thuc_lam_viec`, `created_at`, `updated_at`) VALUES
(2, 6, 'Trần Anh Bình', '1981-10-03', 'Viện trưởng', NULL, NULL, NULL, NULL, NULL, 'trananhbinh@example.com', NULL, '2025-12-25', NULL, '2025-12-25 07:55:51', '2025-12-25 09:39:47'),
(3, 6, 'Ngô Thị Vui', '1990-04-25', 'Kế toán', NULL, NULL, NULL, NULL, NULL, 'ngothivui@example.com', NULL, '2025-12-25', NULL, '2025-12-25 07:55:51', '2025-12-25 09:39:28');

-- --------------------------------------------------------

--
-- Table structure for table `nhan_su_de_tai`
--

CREATE TABLE `nhan_su_de_tai` (
  `id` int(11) NOT NULL,
  `id_de_tai` int(11) NOT NULL,
  `id_nhan_su` int(11) DEFAULT NULL,
  `ten_nhan_su` varchar(255) DEFAULT NULL,
  `chuyen_mon` varchar(255) DEFAULT NULL,
  `vai_tro` varchar(100) DEFAULT NULL COMMENT 'chu_nhiem, thanh_vien, cong_tac_vien',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phong_ban`
--

CREATE TABLE `phong_ban` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `ten_phong_ban` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phong_ban`
--

INSERT INTO `phong_ban` (`id`, `id_vien`, `ten_phong_ban`, `created_at`, `updated_at`) VALUES
(2, 1, 'Phòng RDSIC', '2025-12-25 07:40:45', '2025-12-25 07:40:45'),
(3, 1, 'Phòng SBIM', '2025-12-25 07:40:54', '2025-12-25 07:40:54'),
(4, 1, 'Phòng SPC', '2025-12-25 07:41:07', '2025-12-25 07:41:07'),
(6, 1, 'Phòng Hành chính nhân sự', '2025-12-25 07:55:51', '2025-12-25 08:12:54');

-- --------------------------------------------------------

--
-- Table structure for table `phong_cua_vien`
--

CREATE TABLE `phong_cua_vien` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `id_phong_ban` int(11) DEFAULT NULL,
  `ten_toa` varchar(255) DEFAULT NULL,
  `so_tang` int(3) DEFAULT NULL,
  `so_phong` varchar(50) DEFAULT NULL,
  `dien_tich` decimal(10,2) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'trong' COMMENT 'trong, dang_su_dung, bao_tri',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quyen`
--

CREATE TABLE `quyen` (
  `id` int(11) NOT NULL,
  `ten_quyen` varchar(100) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quyen`
--

INSERT INTO `quyen` (`id`, `ten_quyen`, `mo_ta`, `created_at`) VALUES
(1, 'hieu_truong', 'Quyền hiệu trưởng - Quyền cao nhất trong hệ thống', '2025-12-25 03:24:43'),
(2, 'cap_phong', 'Quyền cấp phòng - Cấp trên của Viện', '2025-12-25 03:24:43'),
(3, 'vien_truong', 'Quyền viện trưởng - Quản lý một Viện cụ thể', '2025-12-25 03:24:43'),
(4, 'ke_toan_vien', 'Quyền kế toán Viện - Quản lý tài chính của Viện', '2025-12-25 03:24:43');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `id_quyen` int(11) NOT NULL,
  `id_vien` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1 COMMENT '1: active, 0: inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`id`, `username`, `password`, `email`, `ho_ten`, `id_quyen`, `id_vien`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 'hoangthanhtung', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'hoangthanhtung@example.com', 'Hoàng Thanh Tùng', 1, NULL, 1, '2025-12-25 07:18:28', '2025-12-25 07:25:44'),
(2, 'vuvanlai', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'vuvanlai@example.com', 'Vũ Văn Lai', 2, NULL, 1, '2025-12-25 07:18:28', '2025-12-25 07:25:48'),
(3, 'trananhbinh', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'trananhbinh@example.com', 'Trần Anh Bình', 3, 1, 1, '2025-12-25 07:18:28', '2025-12-25 07:25:51'),
(4, 'ngothivui', '$2b$10$l63XJz.dmuCBYsLBvkaBf.4Ctg4S96QTkhhQcxACwHCmnBS6AvYJy', 'ngothivui@example.com', 'Ngô Thị Vui', 4, 1, 1, '2025-12-25 07:18:28', '2025-12-25 07:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `tai_lieu_de_tai`
--

CREATE TABLE `tai_lieu_de_tai` (
  `id` int(11) NOT NULL,
  `id_de_tai` int(11) NOT NULL,
  `ten_tai_lieu` varchar(255) NOT NULL,
  `duong_dan_tai_lieu` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tai_san`
--

CREATE TABLE `tai_san` (
  `id` int(11) NOT NULL,
  `id_vien` int(11) NOT NULL,
  `id_phong` int(11) DEFAULT NULL,
  `ten_tai_san` varchar(255) NOT NULL,
  `tinh_trang` varchar(50) DEFAULT 'tot' COMMENT 'tot, hong, can_bao_tri',
  `ngay_nhan_tai_san` date DEFAULT NULL,
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_ban_giao_tai_san` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_xe`
--

CREATE TABLE `thong_tin_xe` (
  `id` int(11) NOT NULL,
  `id_nhan_su` int(11) NOT NULL,
  `ten_xe` varchar(255) DEFAULT NULL,
  `loai_xe` varchar(100) DEFAULT NULL,
  `bien_so_xe` varchar(20) DEFAULT NULL,
  `so_dang_ki_xe` varchar(50) DEFAULT NULL,
  `ngay_het_han` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vien`
--

CREATE TABLE `vien` (
  `id` int(11) NOT NULL,
  `ten_vien` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vien`
--

INSERT INTO `vien` (`id`, `ten_vien`, `created_at`, `updated_at`) VALUES
(1, 'Viện Tin học Xây dựng', '2025-12-25 07:18:27', '2025-12-25 07:18:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bang_luong`
--
ALTER TABLE `bang_luong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`);

--
-- Indexes for table `bao_cao`
--
ALTER TABLE `bao_cao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_id_nguoi_tao` (`id_nguoi_tao`),
  ADD KEY `idx_id_nguoi_phe_duyet` (`id_nguoi_phe_duyet`),
  ADD KEY `idx_trang_thai` (`trang_thai`);

--
-- Indexes for table `bao_hiem_y_te`
--
ALTER TABLE `bao_hiem_y_te`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`);

--
-- Indexes for table `chi_phi`
--
ALTER TABLE `chi_phi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_id_de_tai` (`id_de_tai`),
  ADD KEY `idx_trang_thai` (`trang_thai`);

--
-- Indexes for table `de_tai_nghien_cuu`
--
ALTER TABLE `de_tai_nghien_cuu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_trang_thai` (`trang_thai`);

--
-- Indexes for table `doanh_thu`
--
ALTER TABLE `doanh_thu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_id_de_tai` (`id_de_tai`),
  ADD KEY `idx_trang_thai` (`trang_thai`);

--
-- Indexes for table `hop_dong_lao_dong`
--
ALTER TABLE `hop_dong_lao_dong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`),
  ADD KEY `idx_ma_hop_dong` (`ma_hop_dong`);

--
-- Indexes for table `media_chi_phi`
--
ALTER TABLE `media_chi_phi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_chi_phi` (`id_chi_phi`);

--
-- Indexes for table `media_doanh_thu`
--
ALTER TABLE `media_doanh_thu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_doanh_thu` (`id_doanh_thu`);

--
-- Indexes for table `media_nhan_su`
--
ALTER TABLE `media_nhan_su`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`);

--
-- Indexes for table `media_tai_san`
--
ALTER TABLE `media_tai_san`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_tai_san` (`id_tai_san`);

--
-- Indexes for table `nhan_su`
--
ALTER TABLE `nhan_su`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_phong_ban` (`id_phong_ban`),
  ADD KEY `idx_cccd` (`cccd`);

--
-- Indexes for table `nhan_su_de_tai`
--
ALTER TABLE `nhan_su_de_tai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_de_tai` (`id_de_tai`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`);

--
-- Indexes for table `phong_ban`
--
ALTER TABLE `phong_ban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`);

--
-- Indexes for table `phong_cua_vien`
--
ALTER TABLE `phong_cua_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_id_phong_ban` (`id_phong_ban`);

--
-- Indexes for table `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ten_quyen` (`ten_quyen`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_username` (`username`),
  ADD KEY `idx_id_quyen` (`id_quyen`),
  ADD KEY `idx_id_vien` (`id_vien`);

--
-- Indexes for table `tai_lieu_de_tai`
--
ALTER TABLE `tai_lieu_de_tai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_de_tai` (`id_de_tai`);

--
-- Indexes for table `tai_san`
--
ALTER TABLE `tai_san`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_vien` (`id_vien`),
  ADD KEY `idx_id_phong` (`id_phong`);

--
-- Indexes for table `thong_tin_xe`
--
ALTER TABLE `thong_tin_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_nhan_su` (`id_nhan_su`),
  ADD KEY `idx_bien_so_xe` (`bien_so_xe`);

--
-- Indexes for table `vien`
--
ALTER TABLE `vien`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bang_luong`
--
ALTER TABLE `bang_luong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bao_cao`
--
ALTER TABLE `bao_cao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bao_hiem_y_te`
--
ALTER TABLE `bao_hiem_y_te`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chi_phi`
--
ALTER TABLE `chi_phi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `de_tai_nghien_cuu`
--
ALTER TABLE `de_tai_nghien_cuu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doanh_thu`
--
ALTER TABLE `doanh_thu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hop_dong_lao_dong`
--
ALTER TABLE `hop_dong_lao_dong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `media_chi_phi`
--
ALTER TABLE `media_chi_phi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_doanh_thu`
--
ALTER TABLE `media_doanh_thu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_nhan_su`
--
ALTER TABLE `media_nhan_su`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `media_tai_san`
--
ALTER TABLE `media_tai_san`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nhan_su`
--
ALTER TABLE `nhan_su`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `nhan_su_de_tai`
--
ALTER TABLE `nhan_su_de_tai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phong_ban`
--
ALTER TABLE `phong_ban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `phong_cua_vien`
--
ALTER TABLE `phong_cua_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quyen`
--
ALTER TABLE `quyen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tai_lieu_de_tai`
--
ALTER TABLE `tai_lieu_de_tai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tai_san`
--
ALTER TABLE `tai_san`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_tin_xe`
--
ALTER TABLE `thong_tin_xe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vien`
--
ALTER TABLE `vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bang_luong`
--
ALTER TABLE `bang_luong`
  ADD CONSTRAINT `fk_bang_luong_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bao_cao`
--
ALTER TABLE `bao_cao`
  ADD CONSTRAINT `fk_bao_cao_nguoi_phe_duyet` FOREIGN KEY (`id_nguoi_phe_duyet`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_bao_cao_nguoi_tao` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`),
  ADD CONSTRAINT `fk_bao_cao_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bao_hiem_y_te`
--
ALTER TABLE `bao_hiem_y_te`
  ADD CONSTRAINT `fk_bhyt_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chi_phi`
--
ALTER TABLE `chi_phi`
  ADD CONSTRAINT `fk_chi_phi_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_chi_phi_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `de_tai_nghien_cuu`
--
ALTER TABLE `de_tai_nghien_cuu`
  ADD CONSTRAINT `fk_de_tai_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doanh_thu`
--
ALTER TABLE `doanh_thu`
  ADD CONSTRAINT `fk_doanh_thu_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_doanh_thu_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hop_dong_lao_dong`
--
ALTER TABLE `hop_dong_lao_dong`
  ADD CONSTRAINT `fk_hop_dong_lao_dong_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_chi_phi`
--
ALTER TABLE `media_chi_phi`
  ADD CONSTRAINT `fk_media_chi_phi` FOREIGN KEY (`id_chi_phi`) REFERENCES `chi_phi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_doanh_thu`
--
ALTER TABLE `media_doanh_thu`
  ADD CONSTRAINT `fk_media_doanh_thu` FOREIGN KEY (`id_doanh_thu`) REFERENCES `doanh_thu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_nhan_su`
--
ALTER TABLE `media_nhan_su`
  ADD CONSTRAINT `fk_media_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_tai_san`
--
ALTER TABLE `media_tai_san`
  ADD CONSTRAINT `fk_media_tai_san` FOREIGN KEY (`id_tai_san`) REFERENCES `tai_san` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nhan_su`
--
ALTER TABLE `nhan_su`
  ADD CONSTRAINT `fk_nhan_su_phong_ban` FOREIGN KEY (`id_phong_ban`) REFERENCES `phong_ban` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nhan_su_de_tai`
--
ALTER TABLE `nhan_su_de_tai`
  ADD CONSTRAINT `fk_nhan_su_de_tai_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_nhan_su_de_tai_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `phong_ban`
--
ALTER TABLE `phong_ban`
  ADD CONSTRAINT `fk_phong_ban_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `phong_cua_vien`
--
ALTER TABLE `phong_cua_vien`
  ADD CONSTRAINT `fk_phong_cua_vien_phong_ban` FOREIGN KEY (`id_phong_ban`) REFERENCES `phong_ban` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_phong_cua_vien_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD CONSTRAINT `fk_tai_khoan_quyen` FOREIGN KEY (`id_quyen`) REFERENCES `quyen` (`id`),
  ADD CONSTRAINT `fk_tai_khoan_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tai_lieu_de_tai`
--
ALTER TABLE `tai_lieu_de_tai`
  ADD CONSTRAINT `fk_tai_lieu_de_tai` FOREIGN KEY (`id_de_tai`) REFERENCES `de_tai_nghien_cuu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tai_san`
--
ALTER TABLE `tai_san`
  ADD CONSTRAINT `fk_tai_san_phong` FOREIGN KEY (`id_phong`) REFERENCES `phong_cua_vien` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tai_san_vien` FOREIGN KEY (`id_vien`) REFERENCES `vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `thong_tin_xe`
--
ALTER TABLE `thong_tin_xe`
  ADD CONSTRAINT `fk_xe_nhan_su` FOREIGN KEY (`id_nhan_su`) REFERENCES `nhan_su` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

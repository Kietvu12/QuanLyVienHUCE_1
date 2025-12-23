-- ============================================
-- DATABASE SCHEMA: HỆ THỐNG QUẢN LÝ CÁC VIỆN
-- TRƯỜNG ĐHXD HÀ NỘI
-- ============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS QuanLyVien CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QuanLyVien;

-- ============================================
-- 1. BẢNG QUẢN LÝ NGƯỜI DÙNG VÀ PHÂN QUYỀN
-- ============================================

-- Bảng Vai trò
CREATE TABLE VaiTro (
    MaVaiTro INT PRIMARY KEY AUTO_INCREMENT,
    TenVaiTro VARCHAR(100) NOT NULL UNIQUE,
    CapPhanQuyen VARCHAR(50) NOT NULL COMMENT 'Vien: thuộc Viện, Truong: cấp trường',
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. BẢNG QUẢN LÝ VIỆN
-- ============================================

CREATE TABLE Vien (
    MaVien INT PRIMARY KEY AUTO_INCREMENT,
    TenVien VARCHAR(255) NOT NULL,
    MaVienCode VARCHAR(50) UNIQUE COMMENT 'Mã viện',
    DienTich DECIMAL(10,2) COMMENT 'Diện tích (m²)',
    DiaChi TEXT,
    SoDienThoai VARCHAR(20),
    Email VARCHAR(255),
    TruongVien VARCHAR(255),
    TrangThai VARCHAR(20) DEFAULT 'HoatDong' COMMENT 'HoatDong, TamNgung',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Người dùng
CREATE TABLE NguoiDung (
    MaNguoiDung INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    MSSV VARCHAR(50),
    MatKhau VARCHAR(255) NOT NULL,
    HoTen VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(20),
    TrangThai VARCHAR(20) DEFAULT 'HoatDong' COMMENT 'HoatDong, TamKhoa, VoHieu',
    MaXacThuc2FA VARCHAR(10),
    ThoiGianHetHanOTP DATETIME,
    SoLanDangNhapSai INT DEFAULT 0,
    ThoiGianKhoa DATETIME,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Phân quyền người dùng
CREATE TABLE PhanQuyenNguoiDung (
    MaPhanQuyen INT PRIMARY KEY AUTO_INCREMENT,
    MaNguoiDung INT NOT NULL,
    MaVaiTro INT NOT NULL,
    MaVien INT COMMENT 'Mã viện (bắt buộc nếu vai trò thuộc Viện, NULL nếu vai trò cấp trường)',
    NgayCap DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayHetHan DATETIME,
    NguoiCap INT,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro) ON DELETE CASCADE,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (NguoiCap) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. BẢNG QUẢN LÝ NHÂN SỰ
-- ============================================

-- Bảng Phòng ban
CREATE TABLE PhongBan (
    MaPhongBan INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    TenPhongBan VARCHAR(255) NOT NULL,
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chuyên ngành
CREATE TABLE ChuyenNganh (
    MaChuyenNganh INT PRIMARY KEY AUTO_INCREMENT,
    TenChuyenNganh VARCHAR(255) NOT NULL,
    MoTa TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Nhân sự
CREATE TABLE NhanSu (
    MaNhanSu INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaPhongBan INT,
    MaChuyenNganh INT,
    MaSoNhanSu VARCHAR(50) UNIQUE COMMENT 'Mã số nhân sự',
    HoTen VARCHAR(255) NOT NULL,
    GioiTinh VARCHAR(10),
    NgaySinh DATE,
    SoCMND_CCCD VARCHAR(20),
    SoDienThoai VARCHAR(20),
    Email VARCHAR(255),
    DiaChi TEXT,
    TrangThai VARCHAR(20) DEFAULT 'DangLamViec' COMMENT 'DangLamViec, NghiViec, TamNghi',
    NgayVaoLam DATE,
    NgayNghiViec DATE,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaPhongBan) REFERENCES PhongBan(MaPhongBan) ON DELETE SET NULL,
    FOREIGN KEY (MaChuyenNganh) REFERENCES ChuyenNganh(MaChuyenNganh) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Hồ sơ năng lực
CREATE TABLE HoSoNangLuc (
    MaHoSo INT PRIMARY KEY AUTO_INCREMENT,
    MaNhanSu INT NOT NULL,
    TrinhDoHocVan VARCHAR(100) COMMENT 'Đại học, Thạc sĩ, Tiến sĩ...',
    BangCap TEXT COMMENT 'Danh sách bằng cấp',
    KinhNghiem TEXT COMMENT 'Kinh nghiệm làm việc',
    ChuyenMon TEXT COMMENT 'Chuyên môn, kỹ năng',
    CongTrinhDaThamGia TEXT COMMENT 'Các công trình đã tham gia',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng File đính kèm hồ sơ năng lực
CREATE TABLE FileHoSoNangLuc (
    MaFile INT PRIMARY KEY AUTO_INCREMENT,
    MaHoSo INT NOT NULL,
    TenFile VARCHAR(255) NOT NULL,
    DuongDanFile VARCHAR(500) NOT NULL,
    LoaiFile VARCHAR(50) COMMENT 'PDF, JPG, PNG...',
    KichThuoc BIGINT COMMENT 'Kích thước file (bytes)',
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNangLuc(MaHoSo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BẢNG QUẢN LÝ ĐỀ TÀI
-- ============================================

-- Bảng Đề tài
CREATE TABLE DeTai (
    MaDeTai INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaSoDeTai VARCHAR(50) UNIQUE COMMENT 'Mã đề tài',
    TenDeTai VARCHAR(500) NOT NULL,
    MoTa TEXT,
    TrangThai VARCHAR(50) DEFAULT 'DangThucHien' COMMENT 'DangThucHien, ChoNghiemThu, DaNghiemThu, Huy',
    PhanTramTienDo DECIMAL(5,2) DEFAULT 0 COMMENT 'Phần trăm tiến độ (0-100)',
    NgayBatDau DATE,
    NgayDuKienHoanThanh DATE,
    NgayHoanThanhThucTe DATE,
    NguonVon DECIMAL(15,2) DEFAULT 0 COMMENT 'Nguồn vốn (VNĐ)',
    KetQuaTaiChinh DECIMAL(15,2) DEFAULT 0 COMMENT 'Lãi/Lỗ (VNĐ)',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Nhân sự tham gia đề tài
CREATE TABLE NhanSuDeTai (
    MaNhanSuDeTai INT PRIMARY KEY AUTO_INCREMENT,
    MaDeTai INT NOT NULL,
    MaNhanSu INT NOT NULL,
    VaiTro VARCHAR(50) NOT NULL COMMENT 'TruongDeTai, ThanhVien, CongTacVien',
    VaiTroChinhPhu VARCHAR(20) DEFAULT 'Chinh' COMMENT 'Chinh, Phu',
    NgayThamGia DATE,
    NgayKetThuc DATE,
    GhiChu TEXT,
    FOREIGN KEY (MaDeTai) REFERENCES DeTai(MaDeTai) ON DELETE CASCADE,
    FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu) ON DELETE CASCADE,
    UNIQUE KEY unique_nhansu_detai (MaDeTai, MaNhanSu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Tiến độ đề tài
CREATE TABLE TienDoDeTai (
    MaTienDo INT PRIMARY KEY AUTO_INCREMENT,
    MaDeTai INT NOT NULL,
    PhanTramTienDo DECIMAL(5,2) NOT NULL,
    MoTa TEXT,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiCapNhat INT,
    FOREIGN KEY (MaDeTai) REFERENCES DeTai(MaDeTai) ON DELETE CASCADE,
    FOREIGN KEY (NguoiCapNhat) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. BẢNG QUẢN LÝ BÁO CÁO ĐỊNH KỲ
-- ============================================

-- Bảng Kỳ báo cáo
CREATE TABLE KyBaoCao (
    MaKyBaoCao INT PRIMARY KEY AUTO_INCREMENT,
    TenKy VARCHAR(100) NOT NULL COMMENT 'Kỳ 1/2024, Kỳ 2/2024...',
    Nam INT NOT NULL,
    Ky INT NOT NULL COMMENT '1 hoặc 2 (6 tháng)',
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    HanNop DATE NOT NULL,
    TrangThai VARCHAR(20) DEFAULT 'Mo' COMMENT 'Mo, Dong',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    UNIQUE KEY unique_ky_nam (Nam, Ky)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Báo cáo định kỳ
CREATE TABLE BaoCaoDinhKy (
    MaBaoCao INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaKyBaoCao INT NOT NULL,
    TrangThai VARCHAR(50) DEFAULT 'Nhap' COMMENT 'Nhap, GuiDuyet, DaDuyet, DaKhoa, TuChoi',
    TongDoanhThu DECIMAL(15,2) DEFAULT 0,
    TongChiPhi DECIMAL(15,2) DEFAULT 0,
    TongNhanSu INT DEFAULT 0,
    TongDeTai INT DEFAULT 0,
    TongThue DECIMAL(15,2) DEFAULT 0,
    TongNghiaVuNop DECIMAL(15,2) DEFAULT 0,
    TongHuyDongCong DECIMAL(15,2) DEFAULT 0 COMMENT 'Huy động công (không tính lương)',
    KeHoach TEXT COMMENT 'Kế hoạch',
    KienNghi TEXT COMMENT 'Kiến nghị',
    NhanXet TEXT COMMENT 'Nhận xét từ reviewer',
    NgayGuiDuyet DATETIME,
    NgayDuyet DATETIME,
    NgayKhoa DATETIME,
    NguoiDuyet INT,
    NguoiKy INT,
    ChuKyDienTu TEXT COMMENT 'Chữ ký điện tử',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaKyBaoCao) REFERENCES KyBaoCao(MaKyBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (NguoiDuyet) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    FOREIGN KEY (NguoiKy) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    UNIQUE KEY unique_vien_ky (MaVien, MaKyBaoCao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chi tiết báo cáo - Khái quát đơn vị
CREATE TABLE ChiTietBaoCao (
    MaChiTiet INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    LoaiChiTiet VARCHAR(50) NOT NULL COMMENT 'KhaiQuatDonVi, HoatDongKHCN, DoanhThu, Thue, CongNo, KeHoach',
    NoiDung TEXT,
    GiaTri DECIMAL(15,2),
    DonVi VARCHAR(50),
    GhiChu TEXT,
    BinhLuan TEXT COMMENT 'Bình luận từ reviewer',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chi tiết báo cáo - Đề tài trong kỳ
CREATE TABLE ChiTietBaoCaoDeTai (
    MaChiTiet INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    MaDeTai INT NOT NULL,
    NguonVon DECIMAL(15,2) DEFAULT 0,
    KetQuaTaiChinh DECIMAL(15,2) DEFAULT 0,
    SoLuongNhanSu INT DEFAULT 0,
    GhiChu TEXT,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (MaDeTai) REFERENCES DeTai(MaDeTai) ON DELETE CASCADE,
    UNIQUE KEY unique_baocao_detai (MaBaoCao, MaDeTai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chi tiết báo cáo - Doanh thu theo loại hình
CREATE TABLE ChiTietBaoCaoDoanhThu (
    MaChiTiet INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    LoaiHinh VARCHAR(100) NOT NULL COMMENT 'CGCN, ThauPhu, DeTai, Khac',
    SoTien DECIMAL(15,2) NOT NULL,
    GhiChu TEXT,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Chi tiết báo cáo - Thuế
CREATE TABLE ChiTietBaoCaoThue (
    MaChiTiet INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    LoaiThue VARCHAR(50) NOT NULL COMMENT 'GTGT, TNDN, TNCN',
    SoTien DECIMAL(15,2) NOT NULL,
    GhiChu TEXT,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Lịch sử báo cáo (versioning)
CREATE TABLE LichSuBaoCao (
    MaLichSu INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    PhienBan INT NOT NULL,
    NoiDungThayDoi TEXT COMMENT 'JSON hoặc text mô tả thay đổi',
    NguoiThayDoi INT,
    NgayThayDoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (NguoiThayDoi) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng File đính kèm báo cáo
CREATE TABLE FileBaoCao (
    MaFile INT PRIMARY KEY AUTO_INCREMENT,
    MaBaoCao INT NOT NULL,
    TenFile VARCHAR(255) NOT NULL,
    DuongDanFile VARCHAR(500) NOT NULL,
    LoaiFile VARCHAR(50) COMMENT 'PDF, DOCX, XLSX, JPG...',
    KichThuoc BIGINT,
    LoaiChungTu VARCHAR(100) COMMENT 'HopDong, NhanSu, ThietBi, Khac',
    PhienBan INT DEFAULT 1,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaBaoCao) REFERENCES BaoCaoDinhKy(MaBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Báo cáo tổng hợp toàn trường
CREATE TABLE BaoCaoTongHop (
    MaBaoCaoTongHop INT PRIMARY KEY AUTO_INCREMENT,
    MaKyBaoCao INT NOT NULL,
    TongDoanhThu DECIMAL(15,2) DEFAULT 0,
    TongChiPhi DECIMAL(15,2) DEFAULT 0,
    TongNhanSu INT DEFAULT 0,
    TongDeTai INT DEFAULT 0,
    TongThue DECIMAL(15,2) DEFAULT 0,
    TongNghiaVuNop DECIMAL(15,2) DEFAULT 0,
    TongHuyDongCong DECIMAL(15,2) DEFAULT 0,
    SoVienDaNop INT DEFAULT 0,
    SoVienChuaNop INT DEFAULT 0,
    NhanXetTuDong TEXT COMMENT 'Nhận xét tự động phát hiện bất thường',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaKyBaoCao) REFERENCES KyBaoCao(MaKyBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    UNIQUE KEY unique_ky_baocao (MaKyBaoCao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Báo cáo chi tiết hàng tháng
CREATE TABLE BaoCaoChiTietThang (
    MaBaoCaoThang INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    Thang INT NOT NULL COMMENT '1-12',
    Nam INT NOT NULL,
    DoanhThu DECIMAL(15,2) DEFAULT 0,
    SoDeTai INT DEFAULT 0,
    SoNhanSu INT DEFAULT 0,
    TongCongNo DECIMAL(15,2) DEFAULT 0,
    CongNoPhaiThu DECIMAL(15,2) DEFAULT 0,
    CongNoPhaiTra DECIMAL(15,2) DEFAULT 0,
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL,
    UNIQUE KEY unique_vien_thang_nam (MaVien, Thang, Nam)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. BẢNG QUẢN LÝ CƠ SỞ VẬT CHẤT
-- ============================================

-- Bảng Phòng
CREATE TABLE Phong (
    MaPhong INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    TenPhong VARCHAR(255) NOT NULL,
    MaSoPhong VARCHAR(50) COMMENT 'Mã phòng',
    LoaiPhong VARCHAR(100) COMMENT 'PhongHop, PhongThiNghiem, PhongLamViec, Khac',
    DienTich DECIMAL(10,2) COMMENT 'Diện tích (m²)',
    ViTri TEXT COMMENT 'Vị trí đặt',
    TinhTrang VARCHAR(50) DEFAULT 'Tot' COMMENT 'Tot, Hong, DangBaoTri, CanThayMoi',
    NgayKiemKeGanNhat DATE,
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Thiết bị
CREATE TABLE ThietBi (
    MaThietBi INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaPhong INT,
    TenThietBi VARCHAR(255) NOT NULL,
    MaTaiSan VARCHAR(50) COMMENT 'Mã tài sản / số hiệu',
    LoaiThietBi VARCHAR(100) COMMENT 'MayTinh, MayIn, MayChieu, BanGhe, Khac',
    SoLuong INT DEFAULT 1,
    NgayCap DATE,
    NgayHetHan DATE COMMENT 'Ngày hết hạn bảo hành/thay mới',
    TinhTrang VARCHAR(50) DEFAULT 'Tot' COMMENT 'Tot, Hong, DangBaoTri, CanThayMoi',
    ViTri TEXT COMMENT 'Vị trí đặt',
    DonViSuDung VARCHAR(255) COMMENT 'Đơn vị sử dụng',
    NgayKiemKeGanNhat DATE,
    GiaTri DECIMAL(15,2) COMMENT 'Giá trị (VNĐ)',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Lịch sử bảo trì thiết bị
CREATE TABLE LichSuBaoTri (
    MaBaoTri INT PRIMARY KEY AUTO_INCREMENT,
    MaThietBi INT NOT NULL,
    NgayBaoTri DATE NOT NULL,
    LoaiBaoTri VARCHAR(100) COMMENT 'BaoTri, SuaChua, ThayThe',
    ChiPhi DECIMAL(15,2),
    MoTa TEXT,
    NguoiThucHien VARCHAR(255),
    FileDinhKem VARCHAR(500),
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaThietBi) REFERENCES ThietBi(MaThietBi) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng File đính kèm thiết bị
CREATE TABLE FileThietBi (
    MaFile INT PRIMARY KEY AUTO_INCREMENT,
    MaThietBi INT NOT NULL,
    TenFile VARCHAR(255) NOT NULL,
    DuongDanFile VARCHAR(500) NOT NULL,
    LoaiFile VARCHAR(50),
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaThietBi) REFERENCES ThietBi(MaThietBi) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. BẢNG QUẢN LÝ TÀI CHÍNH
-- ============================================

-- Bảng Đối tác
CREATE TABLE DoiTac (
    MaDoiTac INT PRIMARY KEY AUTO_INCREMENT,
    TenDoiTac VARCHAR(255) NOT NULL,
    MaSoThue VARCHAR(50),
    DiaChi TEXT,
    SoDienThoai VARCHAR(20),
    Email VARCHAR(255),
    NguoiLienHe VARCHAR(255),
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Hợp đồng
CREATE TABLE HopDong (
    MaHopDong INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaDoiTac INT,
    SoHopDong VARCHAR(100) NOT NULL UNIQUE,
    TenHopDong VARCHAR(500) NOT NULL,
    LoaiHopDong VARCHAR(100) COMMENT 'CGCN, ThauPhu, DeTai, Khac',
    GiaTriHopDong DECIMAL(15,2) NOT NULL,
    GiaTriSauVAT DECIMAL(15,2),
    NgayKy DATE,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    PhanTramTienDo DECIMAL(5,2) DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'DangThucHien' COMMENT 'DangThucHien, HoanThanh, Huy',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaDoiTac) REFERENCES DoiTac(MaDoiTac) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Ngân sách
CREATE TABLE NganSach (
    MaNganSach INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    Nam INT NOT NULL,
    TongNganSach DECIMAL(15,2) NOT NULL COMMENT 'Tổng ngân sách được cấp',
    NganSachDaSuDung DECIMAL(15,2) DEFAULT 0,
    NganSachConLai DECIMAL(15,2),
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    UNIQUE KEY unique_vien_nam (MaVien, Nam)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Dự toán
CREATE TABLE DuToan (
    MaDuToan INT PRIMARY KEY AUTO_INCREMENT,
    MaNganSach INT NOT NULL,
    MaKyBaoCao INT,
    HangMuc VARCHAR(255) NOT NULL COMMENT 'Hạng mục chi phí',
    SoTienDuToan DECIMAL(15,2) NOT NULL,
    SoTienThucTe DECIMAL(15,2) DEFAULT 0,
    ChenhLech DECIMAL(15,2),
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNganSach) REFERENCES NganSach(MaNganSach) ON DELETE CASCADE,
    FOREIGN KEY (MaKyBaoCao) REFERENCES KyBaoCao(MaKyBaoCao) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Doanh thu
CREATE TABLE DoanhThu (
    MaDoanhThu INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaHopDong INT,
    MaDeTai INT,
    LoaiDoanhThu VARCHAR(100) NOT NULL COMMENT 'CGCN, ThauPhu, DeTai, HuyDongCong, Khac',
    SoTien DECIMAL(15,2) NOT NULL,
    NgayPhatSinh DATE NOT NULL,
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaHopDong) REFERENCES HopDong(MaHopDong) ON DELETE SET NULL,
    FOREIGN KEY (MaDeTai) REFERENCES DeTai(MaDeTai) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Công nợ
CREATE TABLE CongNo (
    MaCongNo INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaHopDong INT,
    MaDoiTac INT,
    LoaiCongNo VARCHAR(50) NOT NULL COMMENT 'PhaiThu, PhaiTra',
    SoTien DECIMAL(15,2) NOT NULL,
    SoTienDaThanhToan DECIMAL(15,2) DEFAULT 0,
    SoTienConLai DECIMAL(15,2),
    NgayPhatSinh DATE NOT NULL,
    HanThanhToan DATE,
    TrangThai VARCHAR(50) DEFAULT 'ChuaThanhToan' COMMENT 'ChuaThanhToan, DaThanhToan, QuaHan',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaHopDong) REFERENCES HopDong(MaHopDong) ON DELETE SET NULL,
    FOREIGN KEY (MaDoiTac) REFERENCES DoiTac(MaDoiTac) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Lịch sử thanh toán công nợ
CREATE TABLE LichSuThanhToan (
    MaThanhToan INT PRIMARY KEY AUTO_INCREMENT,
    MaCongNo INT NOT NULL,
    SoTienThanhToan DECIMAL(15,2) NOT NULL,
    NgayThanhToan DATE NOT NULL,
    PhuongThucThanhToan VARCHAR(100) COMMENT 'ChuyenKhoan, TienMat, Khac',
    SoChungTu VARCHAR(100),
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaCongNo) REFERENCES CongNo(MaCongNo) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Thuế
CREATE TABLE Thue (
    MaThue INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    LoaiThue VARCHAR(50) NOT NULL COMMENT 'GTGT, TNDN, TNCN',
    SoTien DECIMAL(15,2) NOT NULL,
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    NgayNop DATE,
    TrangThai VARCHAR(50) DEFAULT 'ChuaNop' COMMENT 'ChuaNop, DaNop',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Nghĩa vụ nộp về trường
CREATE TABLE NghiaVuNop (
    MaNghiaVu INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaKyBaoCao INT,
    Thang INT,
    Nam INT NOT NULL,
    DoanhThu DECIMAL(15,2) NOT NULL,
    TyLeNop DECIMAL(5,2) NOT NULL COMMENT 'Tỷ lệ nộp (%)',
    SoTienPhaiNop DECIMAL(15,2) NOT NULL,
    SoTienDaNop DECIMAL(15,2) DEFAULT 0,
    SoTienConLai DECIMAL(15,2),
    NgayNop DATE,
    TrangThai VARCHAR(50) DEFAULT 'ChuaNop' COMMENT 'ChuaNop, DaNop, QuaHan',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaKyBaoCao) REFERENCES KyBaoCao(MaKyBaoCao) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. BẢNG QUẢN LÝ XE
-- ============================================

CREATE TABLE Xe (
    MaXe INT PRIMARY KEY AUTO_INCREMENT,
    MaNhanSu INT NOT NULL COMMENT 'Chủ sở hữu xe (nhân viên)',
    BienSoXe VARCHAR(20) NOT NULL UNIQUE,
    LoaiXe VARCHAR(100) COMMENT 'XeMay, XeOTo, XeDap',
    SoKm DECIMAL(10,2) COMMENT 'Số km hiện tại',
    SoDangKyXe VARCHAR(50) COMMENT 'Số đăng ký xe',
    FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. BẢNG QUẢN LÝ CÔNG NỢ BẢO HIỂM
-- ============================================

CREATE TABLE CongNoBaoHiem (
    MaCongNoBH INT PRIMARY KEY AUTO_INCREMENT,
    MaVien INT NOT NULL,
    MaNhanSu INT,
    LoaiBaoHiem VARCHAR(100) NOT NULL COMMENT 'BHXH, BHYT, BHTN',
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    SoTienPhaiNop DECIMAL(15,2) NOT NULL,
    SoTienDaNop DECIMAL(15,2) DEFAULT 0,
    SoTienConLai DECIMAL(15,2),
    HanNop DATE,
    TrangThai VARCHAR(50) DEFAULT 'ChuaNop' COMMENT 'ChuaNop, DaNop, QuaHan',
    GhiChu TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao INT,
    FOREIGN KEY (MaVien) REFERENCES Vien(MaVien) ON DELETE CASCADE,
    FOREIGN KEY (MaNhanSu) REFERENCES NhanSu(MaNhanSu) ON DELETE SET NULL,
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. BẢNG CẤU HÌNH HỆ THỐNG
-- ============================================

CREATE TABLE CauHinh (
    MaCauHinh INT PRIMARY KEY AUTO_INCREMENT,
    TenCauHinh VARCHAR(255) NOT NULL UNIQUE,
    GiaTri TEXT,
    MoTa TEXT,
    LoaiCauHinh VARCHAR(100) COMMENT 'TyLeNop, LoaiHinh, Thue, Khac',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiCapNhat INT,
    FOREIGN KEY (NguoiCapNhat) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. BẢNG NHẬT KÝ HỆ THỐNG
-- ============================================

CREATE TABLE NhatKy (
    MaNhatKy INT PRIMARY KEY AUTO_INCREMENT,
    MaNguoiDung INT,
    LoaiThaoTac VARCHAR(100) NOT NULL COMMENT 'Them, Sua, Xoa, Xem, DangNhap, DangXuat',
    Bang VARCHAR(100) NOT NULL COMMENT 'Tên bảng',
    MaBanGhi INT COMMENT 'ID bản ghi',
    NoiDungThayDoi TEXT COMMENT 'JSON hoặc text mô tả thay đổi',
    DiaChiIP VARCHAR(50),
    ThietBi VARCHAR(255),
    NgayThaoTac DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. BẢNG LƯU VIEW DASHBOARD
-- ============================================

CREATE TABLE LuuView (
    MaView INT PRIMARY KEY AUTO_INCREMENT,
    MaNguoiDung INT NOT NULL,
    TenView VARCHAR(255) NOT NULL,
    LoaiView VARCHAR(100) NOT NULL COMMENT 'Dashboard, BaoCao, DanhSach',
    CauHinhLoc TEXT COMMENT 'JSON chứa cấu hình bộ lọc',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TẠO INDEX ĐỂ TỐI ƯU HIỆU SUẤT
-- ============================================

-- Index cho bảng NguoiDung
CREATE INDEX idx_nguoidung_email ON NguoiDung(Email);
CREATE INDEX idx_nguoidung_mavien ON NguoiDung(MaVien);
CREATE INDEX idx_nguoidung_trangthai ON NguoiDung(TrangThai);

-- Index cho bảng PhanQuyenNguoiDung
CREATE INDEX idx_phanquyen_manguoidung ON PhanQuyenNguoiDung(MaNguoiDung);
CREATE INDEX idx_phanquyen_mavaitro ON PhanQuyenNguoiDung(MaVaiTro);
CREATE INDEX idx_phanquyen_mavien ON PhanQuyenNguoiDung(MaVien);

-- Index cho bảng NhanSu
CREATE INDEX idx_nhansu_mavien ON NhanSu(MaVien);
CREATE INDEX idx_nhansu_maphongban ON NhanSu(MaPhongBan);
CREATE INDEX idx_nhansu_masonhansu ON NhanSu(MaSoNhanSu);
CREATE INDEX idx_nhansu_hoten ON NhanSu(HoTen);

-- Index cho bảng DeTai
CREATE INDEX idx_detai_mavien ON DeTai(MaVien);
CREATE INDEX idx_detai_trangthai ON DeTai(TrangThai);
CREATE INDEX idx_detai_masodetai ON DeTai(MaSoDeTai);

-- Index cho bảng BaoCaoDinhKy
CREATE INDEX idx_baocaodinhky_mavien ON BaoCaoDinhKy(MaVien);
CREATE INDEX idx_baocaodinhky_makybaocao ON BaoCaoDinhKy(MaKyBaoCao);
CREATE INDEX idx_baocaodinhky_trangthai ON BaoCaoDinhKy(TrangThai);

-- Index cho bảng HopDong
CREATE INDEX idx_hopdong_mavien ON HopDong(MaVien);
CREATE INDEX idx_hopdong_madoitac ON HopDong(MaDoiTac);
CREATE INDEX idx_hopdong_trangthai ON HopDong(TrangThai);

-- Index cho bảng CongNo
CREATE INDEX idx_congno_mavien ON CongNo(MaVien);
CREATE INDEX idx_congno_loaicongno ON CongNo(LoaiCongNo);
CREATE INDEX idx_congno_trangthai ON CongNo(TrangThai);
CREATE INDEX idx_congno_hathanhtoan ON CongNo(HanThanhToan);

-- Index cho bảng DoanhThu
CREATE INDEX idx_doanhthu_mavien ON DoanhThu(MaVien);
CREATE INDEX idx_doanhthu_thang_nam ON DoanhThu(Thang, Nam);

-- Index cho bảng ThietBi
CREATE INDEX idx_thietbi_mavien ON ThietBi(MaVien);
CREATE INDEX idx_thietbi_tinhtrang ON ThietBi(TinhTrang);
CREATE INDEX idx_thietbi_ngayhethan ON ThietBi(NgayHetHan);

-- Index cho bảng NhatKy
CREATE INDEX idx_nhatky_manguoidung ON NhatKy(MaNguoiDung);
CREATE INDEX idx_nhatky_bang ON NhatKy(Bang);
CREATE INDEX idx_nhatky_ngaythaotac ON NhatKy(NgayThaoTac);

-- ============================================
-- INSERT DỮ LIỆU MẪU
-- ============================================

-- Insert Vai trò mặc định
INSERT INTO VaiTro (TenVaiTro, CapPhanQuyen, MoTa) VALUES
('Super Admin', 'Truong', 'Quản trị viên hệ thống, có toàn quyền'),
('Ban GH', 'Truong', 'Ban Giám Hiệu - quản lý toàn trường'),
('Phòng NCKH', 'Truong', 'Phòng Nghiên cứu Khoa học - quản lý cấp trường'),
('Viện trưởng', 'Vien', 'Viện trưởng - quản lý viện'),
('Kế toán Viện', 'Vien', 'Kế toán viện - quản lý tài chính viện');

-- Insert Cấu hình mặc định
INSERT INTO CauHinh (TenCauHinh, GiaTri, MoTa, LoaiCauHinh) VALUES
('TyLeNopVeTruong', '10', 'Tỷ lệ nộp về trường (%)', 'TyLeNop'),
('ThueGTGT', '10', 'Thuế GTGT (%)', 'Thue'),
('ThueTNDN', '20', 'Thuế TNDN (%)', 'Thue'),
('ThueTNCN', '5', 'Thuế TNCN (%)', 'Thue');

-- ============================================
-- KẾT THÚC SCHEMA
-- ============================================


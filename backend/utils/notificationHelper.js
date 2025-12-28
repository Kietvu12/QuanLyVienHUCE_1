const db = require('../models');

/**
 * Gửi thông báo khi có cập nhật dữ liệu
 * @param {Object} io - Socket.IO instance
 * @param {Number} idVien - ID của viện
 * @param {Number} idNguoiGui - ID người gửi (người cập nhật)
 * @param {String} loaiDuLieu - Loại dữ liệu: 'tai_san', 'nhan_su', 'phong_cua_vien', 'bao_cao'
 * @param {Number} idDuLieu - ID của dữ liệu được cập nhật
 * @param {String} tenDuLieu - Tên của dữ liệu (ví dụ: tên tài sản, tên nhân sự)
 * @param {String} hanhDong - Hành động: 'them_moi', 'cap_nhat', 'xoa'
 */
const sendDataUpdateNotification = async (io, idVien, idNguoiGui, loaiDuLieu, idDuLieu, tenDuLieu, hanhDong) => {
  try {
    if (!io || !idVien) {
      console.warn('Không thể gửi thông báo: thiếu io hoặc idVien');
      return;
    }

    // Lấy thông tin người gửi
    const nguoiGui = await db.TaiKhoan.findByPk(idNguoiGui, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['ten_quyen']
        }
      ]
    });

    if (!nguoiGui) {
      console.warn('Không tìm thấy người gửi');
      return;
    }

    const nguoiGuiRole = nguoiGui.quyen?.ten_quyen || nguoiGui.ten_quyen;
    const nguoiGuiName = nguoiGui.ho_ten || nguoiGui.username;

    // Xác định người nhận dựa trên role
    let targetRole = null;
    if (nguoiGuiRole === 'vien_truong') {
      // Viện trưởng cập nhật → gửi cho kế toán
      targetRole = 'ke_toan_vien';
    } else if (nguoiGuiRole === 'ke_toan_vien') {
      // Kế toán cập nhật → gửi cho viện trưởng
      targetRole = 'vien_truong';
    } else {
      // Các role khác không gửi thông báo
      return;
    }

    // Lấy danh sách người nhận trong viện
    const nguoiNhans = await db.TaiKhoan.findAll({
      where: {
        id_vien: idVien,
        trang_thai: 1
      },
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['ten_quyen'],
          where: {
            ten_quyen: targetRole
          }
        }
      ]
    });

    if (nguoiNhans.length === 0) {
      console.log(`Không có ${targetRole} nào trong viện ${idVien}`);
      return;
    }

    // Tạo nội dung thông báo
    const loaiDuLieuLabels = {
      'tai_san': 'Tài sản',
      'nhan_su': 'Nhân sự',
      'phong_cua_vien': 'Phòng của Viện',
      'bao_cao': 'Báo cáo',
      'doanh_thu': 'Doanh thu',
      'chi_phi': 'Chi phí',
      'de_tai_nghien_cuu': 'Đề tài nghiên cứu'
    };

    const hanhDongLabels = {
      'them_moi': 'đã thêm mới',
      'cap_nhat': 'đã cập nhật',
      'xoa': 'đã xóa'
    };

    const tieuDe = `${loaiDuLieuLabels[loaiDuLieu] || loaiDuLieu} ${hanhDongLabels[hanhDong] || hanhDong}`;
    const noiDung = `${nguoiGuiName} (${nguoiGuiRole === 'vien_truong' ? 'Viện trưởng' : 'Kế toán'}) ${hanhDongLabels[hanhDong] || hanhDong} ${loaiDuLieuLabels[loaiDuLieu] || loaiDuLieu}: "${tenDuLieu || 'N/A'}"`;

    // Gửi thông báo cho từng người nhận
    const { sendNotificationToUser } = require('../socket/socketServer');
    for (const nguoiNhan of nguoiNhans) {
      await sendNotificationToUser(
        io,
        nguoiNhan.id,
        {
          id_nguoi_gui: idNguoiGui,
          tieu_de: tieuDe,
          noi_dung: noiDung,
          loai: 'thong_bao',
          loai_du_lieu: loaiDuLieu,
          id_du_lieu: idDuLieu
        }
      );
    }

    console.log(`✅ Đã gửi thông báo cho ${nguoiNhans.length} ${targetRole} trong viện ${idVien}`);
  } catch (error) {
    console.error('Lỗi khi gửi thông báo cập nhật dữ liệu:', error);
  }
};

module.exports = {
  sendDataUpdateNotification
};


const db = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả báo cáo (có thể filter theo id_vien, trang_thai, id_nguoi_tao)
const getAllBaoCao = async (req, res) => {
  try {
    const { id_vien, trang_thai, id_nguoi_tao, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user.ten_quyen;
    const userIdVien = req.user.id_vien;

    const where = {};
    
    // Nếu là kế toán viên hoặc viện trưởng, tự động filter theo viện của họ
    if ((userRole === 'ke_toan_vien' || userRole === 'vien_truong') && userIdVien) {
      // Xem tất cả báo cáo có id_vien = viện của họ
      // HOẶC báo cáo có id_vien null nhưng được tạo bởi user cùng viện
      where[Op.or] = [
        { id_vien: userIdVien },
        {
          [Op.and]: [
            { id_vien: null },
            {
              id_nguoi_tao: {
                [Op.in]: db.sequelize.literal(`(SELECT id FROM tai_khoan WHERE id_vien = ${userIdVien})`)
              }
            }
          ]
        }
      ];
    } else if (id_vien) {
      // Các role khác có thể filter theo id_vien từ query
      where.id_vien = id_vien;
    }
    
    if (trang_thai) where.trang_thai = trang_thai;
    if (id_nguoi_tao) {
      // Nếu đã có Op.or, cần merge với điều kiện id_nguoi_tao
      if (where[Op.or]) {
        // Thêm điều kiện id_nguoi_tao vào Op.or
        where[Op.or].push({ id_nguoi_tao: parseInt(id_nguoi_tao) });
      } else {
        where.id_nguoi_tao = id_nguoi_tao;
      }
    }

    const { count, rows } = await db.BaoCao.findAndCountAll({
      where,
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['ngay_tao', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách báo cáo',
      error: error.message
    });
  }
};

// Lấy báo cáo theo ID
const getBaoCaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const baoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten', 'email'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten', 'email'],
          required: false
        }
      ]
    });

    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    res.json({
      success: true,
      data: baoCao
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin báo cáo',
      error: error.message
    });
  }
};

// Tạo báo cáo mới
const createBaoCao = async (req, res) => {
  try {
    const {
      tieu_de,
      id_vien,
      id_nguoi_tao,
      duong_dan_tai_lieu
    } = req.body;

    // Kiểm tra người tạo tồn tại và lấy thông tin quyền
    const nguoiTao = await db.TaiKhoan.findByPk(id_nguoi_tao || req.user.id, {
      include: [
        {
          model: db.Quyen,
          as: 'quyen',
          attributes: ['id', 'ten_quyen']
        }
      ]
    });
    if (!nguoiTao) {
      return res.status(400).json({
        success: false,
        message: 'Người tạo không tồn tại'
      });
    }

    // Kiểm tra nếu người tạo là viện trưởng thì tự động phê duyệt
    const nguoiTaoRole = nguoiTao.quyen?.ten_quyen || nguoiTao.ten_quyen;
    const isVienTruong = nguoiTaoRole === 'vien_truong';

    // Tự động set id_vien từ user nếu không có
    let finalIdVien = id_vien;
    if (!finalIdVien && nguoiTao.id_vien) {
      finalIdVien = nguoiTao.id_vien;
    }

    // Kiểm tra viện nếu có
    if (finalIdVien) {
      const vien = await db.Vien.findByPk(finalIdVien);
      if (!vien) {
        return res.status(400).json({
          success: false,
          message: 'Viện không tồn tại'
        });
      }
    }

    // Nếu là viện trưởng, tự động phê duyệt
    const trangThai = isVienTruong ? 'da_phe_duyet' : 'cho_phe_duyet';
    const idNguoiPheDuyet = isVienTruong ? (id_nguoi_tao || req.user.id) : null;
    const ngayGui = isVienTruong ? new Date() : null;

    const baoCao = await db.BaoCao.create({
      tieu_de,
      id_vien: finalIdVien || null,
      id_nguoi_tao: id_nguoi_tao || req.user.id,
      id_nguoi_phe_duyet: idNguoiPheDuyet,
      duong_dan_tai_lieu: duong_dan_tai_lieu || null,
      trang_thai: trangThai,
      ngay_gui: ngayGui
    });

    const baoCaoWithRelations = await db.BaoCao.findByPk(baoCao.id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Tạo báo cáo thành công',
      data: baoCaoWithRelations
    });
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo báo cáo',
      error: error.message
    });
  }
};

// Cập nhật báo cáo
const updateBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tieu_de,
      id_vien,
      duong_dan_tai_lieu
    } = req.body;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Chỉ cho phép sửa khi chưa được phê duyệt hoặc bị từ chối (có thể sửa lại)
    // Không cho sửa khi đã được cấp phòng duyệt
    if (baoCao.trang_thai === 'da_cap_phong_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Không thể sửa báo cáo đã được cấp phòng duyệt'
      });
    }
    
    // Cho phép sửa khi bị từ chối (có thể sửa lại)
    if (baoCao.trang_thai !== 'cho_phe_duyet' && baoCao.trang_thai !== 'tu_choi' && baoCao.trang_thai !== 'cap_phong_tu_choi') {
      return res.status(400).json({
        success: false,
        message: 'Không thể sửa báo cáo đã được phê duyệt'
      });
    }

    // Kiểm tra viện nếu có thay đổi
    if (id_vien !== undefined && id_vien !== baoCao.id_vien) {
      if (id_vien) {
        const vien = await db.Vien.findByPk(id_vien);
        if (!vien) {
          return res.status(400).json({
            success: false,
            message: 'Viện không tồn tại'
          });
        }
      }
    }

    await baoCao.update({
      tieu_de: tieu_de !== undefined ? tieu_de : baoCao.tieu_de,
      id_vien: id_vien !== undefined ? id_vien : baoCao.id_vien,
      duong_dan_tai_lieu: duong_dan_tai_lieu !== undefined ? duong_dan_tai_lieu : baoCao.duong_dan_tai_lieu
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật báo cáo',
      error: error.message
    });
  }
};

// Xóa báo cáo
const deleteBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.ten_quyen;
    const userId = req.user.id;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Chỉ cho phép xóa khi chưa được phê duyệt
    if (baoCao.trang_thai !== 'cho_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa báo cáo đã được phê duyệt hoặc từ chối'
      });
    }

    // Nếu là kế toán viên, chỉ cho phép xóa báo cáo do chính mình tạo ra
    if (userRole === 'ke_toan_vien') {
      if (baoCao.id_nguoi_tao !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Bạn chỉ có thể xóa báo cáo do chính mình tạo ra'
        });
      }
    }

    await baoCao.destroy();

    res.json({
      success: true,
      message: 'Xóa báo cáo thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa báo cáo',
      error: error.message
    });
  }
};

// Gửi báo cáo (cập nhật ngay_gui và giữ nguyên trạng thái cho_phe_duyet)
const guiBaoCao = async (req, res) => {
  try {
    const { id } = req.params;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Cho phép gửi nếu báo cáo chưa được gửi hoặc đang ở trạng thái chờ phê duyệt
    if (baoCao.trang_thai === 'da_phe_duyet' || baoCao.trang_thai === 'tu_choi') {
      return res.status(400).json({
        success: false,
        message: 'Báo cáo đã được xử lý rồi'
      });
    }

    await baoCao.update({
      trang_thai: 'cho_phe_duyet',
      ngay_gui: new Date()
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        }
      ]
    });

    // Gửi thông báo cho viện trưởng khi kế toán gửi báo cáo
    const io = req.app.get('io');
    if (io && req.user && updatedBaoCao.id_vien) {
      // Lấy danh sách viện trưởng trong viện
      const vienTruongs = await db.TaiKhoan.findAll({
        where: {
          id_vien: updatedBaoCao.id_vien,
          trang_thai: 1
        },
        include: [
          {
            model: db.Quyen,
            as: 'quyen',
            attributes: ['ten_quyen'],
            where: {
              ten_quyen: 'vien_truong'
            }
          }
        ]
      });

      // Lấy thông tin người gửi
      const nguoiGui = await db.TaiKhoan.findByPk(req.user.id, {
        attributes: ['id', 'ho_ten', 'username']
      });

      const nguoiGuiName = nguoiGui?.ho_ten || nguoiGui?.username || 'Kế toán';

      // Gửi thông báo cho từng viện trưởng
      const { sendNotificationToUser } = require('../socket/socketServer');
      for (const vienTruong of vienTruongs) {
        await sendNotificationToUser(
          io,
          vienTruong.id,
          {
            id_nguoi_gui: req.user.id,
            tieu_de: 'Báo cáo mới cần phê duyệt',
            noi_dung: `${nguoiGuiName} (Kế toán) đã gửi báo cáo "${updatedBaoCao.tieu_de}" cần bạn phê duyệt`,
            loai: 'thong_bao',
            loai_du_lieu: 'bao_cao',
            id_du_lieu: updatedBaoCao.id
          }
        );
      }
    }

    res.json({
      success: true,
      message: 'Gửi báo cáo thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi báo cáo',
      error: error.message
    });
  }
};

// Phê duyệt báo cáo (có thể là viện trưởng hoặc cấp phòng)
const pheDuyetBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nguoi_phe_duyet } = req.body;
    const userRole = req.user.ten_quyen;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Kiểm tra người phê duyệt
    const nguoiPheDuyet = await db.TaiKhoan.findByPk(id_nguoi_phe_duyet);
    if (!nguoiPheDuyet) {
      return res.status(400).json({
        success: false,
        message: 'Người phê duyệt không tồn tại'
      });
    }

    let updateData = {};
    let trangThaiMoi = '';
    let message = '';

    // Nếu là cấp phòng duyệt
    if (userRole === 'cap_phong') {
      if (baoCao.trang_thai !== 'cho_cap_phong_duyet') {
        return res.status(400).json({
          success: false,
          message: 'Báo cáo không ở trạng thái chờ cấp phòng duyệt'
        });
      }
      trangThaiMoi = 'da_cap_phong_duyet';
      updateData = {
        trang_thai: trangThaiMoi,
        id_nguoi_cap_phong_phe_duyet: id_nguoi_phe_duyet,
        ngay_cap_phong_duyet: new Date()
        // Giữ lại id_nguoi_phe_duyet (viện trưởng) - không cập nhật field này
      };
      message = 'Cấp phòng đã phê duyệt báo cáo';
    } 
    // Nếu là viện trưởng duyệt
    else if (userRole === 'vien_truong') {
      if (baoCao.trang_thai !== 'cho_phe_duyet') {
        return res.status(400).json({
          success: false,
          message: 'Báo cáo không ở trạng thái chờ phê duyệt'
        });
      }
      trangThaiMoi = 'da_phe_duyet';
      updateData = {
        trang_thai: trangThaiMoi,
        id_nguoi_phe_duyet: id_nguoi_phe_duyet
      };
      message = 'Viện trưởng đã phê duyệt báo cáo';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền phê duyệt báo cáo'
      });
    }

    await baoCao.update(updateData);

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiCapPhongPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ]
    });

    // Gửi thông báo
    const io = req.app.get('io');
    if (io) {
      const { sendNotificationToUser } = require('../socket/socketServer');
      const nguoiPheDuyetName = updatedBaoCao.nguoiPheDuyet?.ho_ten || 
                                updatedBaoCao.nguoiCapPhongPheDuyet?.ho_ten ||
                                updatedBaoCao.nguoiPheDuyet?.username || 
                                updatedBaoCao.nguoiCapPhongPheDuyet?.username ||
                                req.user?.ho_ten || 
                                req.user?.username || 
                                (userRole === 'cap_phong' ? 'Cấp phòng' : 'Viện trưởng');

      // Gửi thông báo cho người tạo báo cáo
      if (updatedBaoCao.id_nguoi_tao) {
        await sendNotificationToUser(
          io,
          updatedBaoCao.id_nguoi_tao,
          {
            id_nguoi_gui: id_nguoi_phe_duyet,
            tieu_de: userRole === 'cap_phong' ? 'Báo cáo đã được cấp phòng duyệt' : 'Báo cáo đã được phê duyệt',
            noi_dung: `Báo cáo "${updatedBaoCao.tieu_de}" đã được phê duyệt bởi ${nguoiPheDuyetName}`,
            loai: 'thanh_cong',
            loai_du_lieu: 'bao_cao',
            id_du_lieu: updatedBaoCao.id
          }
        );
      }

      // Nếu là cấp phòng duyệt, gửi thông báo cho viện trưởng và kế toán của viện
      if (userRole === 'cap_phong' && updatedBaoCao.id_vien) {
        // Lấy viện trưởng và kế toán của viện
        const vienTruongVaKeToan = await db.TaiKhoan.findAll({
          where: {
            id_vien: updatedBaoCao.id_vien,
            trang_thai: 1
          },
          include: [
            {
              model: db.Quyen,
              as: 'quyen',
              attributes: ['ten_quyen'],
              where: {
                ten_quyen: { [Op.in]: ['vien_truong', 'ke_toan_vien'] }
              }
            }
          ]
        });

        for (const user of vienTruongVaKeToan) {
          await sendNotificationToUser(
            io,
            user.id,
            {
              id_nguoi_gui: id_nguoi_phe_duyet,
              tieu_de: 'Báo cáo đã được cấp phòng duyệt',
              noi_dung: `Báo cáo "${updatedBaoCao.tieu_de}" của Viện ${updatedBaoCao.vien?.ten_vien || ''} đã được cấp phòng duyệt`,
              loai: 'thanh_cong',
              loai_du_lieu: 'bao_cao',
              id_du_lieu: updatedBaoCao.id
            }
          );
        }
      }
    }

    res.json({
      success: true,
      message: message,
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi phê duyệt báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi phê duyệt báo cáo',
      error: error.message
    });
  }
};

// Từ chối báo cáo (có thể là viện trưởng hoặc cấp phòng)
const tuChoiBaoCao = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nguoi_phe_duyet, ly_do_tu_choi } = req.body;
    const userRole = req.user.ten_quyen;

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Kiểm tra người từ chối
    const nguoiTuChoi = await db.TaiKhoan.findByPk(id_nguoi_phe_duyet);
    if (!nguoiTuChoi) {
      return res.status(400).json({
        success: false,
        message: 'Người từ chối không tồn tại'
      });
    }

    let updateData = {};
    let trangThaiMoi = '';
    let message = '';

    // Nếu là cấp phòng từ chối
    if (userRole === 'cap_phong') {
      if (baoCao.trang_thai !== 'cho_cap_phong_duyet') {
        return res.status(400).json({
          success: false,
          message: 'Báo cáo không ở trạng thái chờ cấp phòng duyệt'
        });
      }
      trangThaiMoi = 'cap_phong_tu_choi';
      
      // Lấy lịch sử từ chối hiện tại
      let lichSuTuChoi = [];
      if (baoCao.lich_su_tu_choi) {
        try {
          lichSuTuChoi = JSON.parse(baoCao.lich_su_tu_choi);
        } catch (e) {
          lichSuTuChoi = [];
        }
      }
      
      // Thêm lần từ chối mới vào lịch sử
      lichSuTuChoi.push({
        id_nguoi_tu_choi: id_nguoi_phe_duyet,
        ten_nguoi_tu_choi: nguoiTuChoi.ho_ten || nguoiTuChoi.username,
        ly_do: ly_do_tu_choi || null,
        ngay_tu_choi: new Date().toISOString()
      });
      
      updateData = {
        trang_thai: trangThaiMoi,
        id_nguoi_cap_phong_phe_duyet: id_nguoi_phe_duyet,
        ly_do_tu_choi: ly_do_tu_choi || null,
        lich_su_tu_choi: JSON.stringify(lichSuTuChoi)
      };
      message = 'Cấp phòng đã từ chối báo cáo';
    } 
    // Nếu là viện trưởng từ chối
    else if (userRole === 'vien_truong') {
      if (baoCao.trang_thai !== 'cho_phe_duyet') {
        return res.status(400).json({
          success: false,
          message: 'Báo cáo không ở trạng thái chờ phê duyệt'
        });
      }
      trangThaiMoi = 'tu_choi';
      updateData = {
        trang_thai: trangThaiMoi,
        id_nguoi_phe_duyet: id_nguoi_phe_duyet,
        ly_do_tu_choi: ly_do_tu_choi || null
      };
      message = 'Viện trưởng đã từ chối báo cáo';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền từ chối báo cáo'
      });
    }

    await baoCao.update(updateData);

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiCapPhongPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ]
    });

    // Gửi thông báo
    const io = req.app.get('io');
    if (io) {
      const { sendNotificationToUser } = require('../socket/socketServer');
      const nguoiTuChoiName = updatedBaoCao.nguoiPheDuyet?.ho_ten || 
                              updatedBaoCao.nguoiCapPhongPheDuyet?.ho_ten ||
                              updatedBaoCao.nguoiPheDuyet?.username || 
                              updatedBaoCao.nguoiCapPhongPheDuyet?.username ||
                              req.user?.ho_ten || 
                              req.user?.username || 
                              (userRole === 'cap_phong' ? 'Cấp phòng' : 'Viện trưởng');
      const lyDoText = ly_do_tu_choi ? ` Lý do: ${ly_do_tu_choi}` : '';

      // Gửi thông báo cho người tạo báo cáo
      if (updatedBaoCao.id_nguoi_tao) {
        await sendNotificationToUser(
          io,
          updatedBaoCao.id_nguoi_tao,
          {
            id_nguoi_gui: id_nguoi_phe_duyet,
            tieu_de: userRole === 'cap_phong' ? 'Báo cáo bị cấp phòng từ chối' : 'Báo cáo bị từ chối',
            noi_dung: `Báo cáo "${updatedBaoCao.tieu_de}" đã bị từ chối bởi ${nguoiTuChoiName}.${lyDoText}`,
            loai: 'canh_bao',
            loai_du_lieu: 'bao_cao',
            id_du_lieu: updatedBaoCao.id
          }
        );
      }

      // Nếu là cấp phòng từ chối, gửi thông báo cho viện trưởng và kế toán của viện
      if (userRole === 'cap_phong' && updatedBaoCao.id_vien) {
        // Lấy viện trưởng và kế toán của viện
        const vienTruongVaKeToan = await db.TaiKhoan.findAll({
          where: {
            id_vien: updatedBaoCao.id_vien,
            trang_thai: 1
          },
          include: [
            {
              model: db.Quyen,
              as: 'quyen',
              attributes: ['ten_quyen'],
              where: {
                ten_quyen: { [Op.in]: ['vien_truong', 'ke_toan_vien'] }
              }
            }
          ]
        });

        for (const user of vienTruongVaKeToan) {
          await sendNotificationToUser(
            io,
            user.id,
            {
              id_nguoi_gui: id_nguoi_phe_duyet,
              tieu_de: 'Báo cáo bị cấp phòng từ chối',
              noi_dung: `Báo cáo "${updatedBaoCao.tieu_de}" của Viện ${updatedBaoCao.vien?.ten_vien || ''} đã bị cấp phòng từ chối.${lyDoText}`,
              loai: 'canh_bao',
              loai_du_lieu: 'bao_cao',
              id_du_lieu: updatedBaoCao.id
            }
          );
        }
      }
    }

    res.json({
      success: true,
      message: message,
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi từ chối báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi từ chối báo cáo',
      error: error.message
    });
  }
};

// Upload file cho báo cáo
const uploadFileBaoCao = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file để upload'
      });
    }

    // Trả về đường dẫn file
    const filePath = `/uploads/bao-cao/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Upload file thành công',
      data: {
        filePath: filePath,
        fileName: req.file.originalname,
        fileSize: req.file.size
      }
    });
  } catch (error) {
    console.error('Lỗi khi upload file báo cáo:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload file',
      error: error.message
    });
  }
};

// Gửi báo cáo đã được viện trưởng duyệt lên cấp phòng
const guiLenCapPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.ten_quyen;

    // Chỉ viện trưởng mới có quyền gửi lên cấp phòng
    if (userRole !== 'vien_truong') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ viện trưởng mới có quyền gửi báo cáo lên cấp phòng'
      });
    }

    const baoCao = await db.BaoCao.findByPk(id);
    if (!baoCao) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo'
      });
    }

    // Chỉ có thể gửi lên cấp phòng khi đã được viện trưởng duyệt
    if (baoCao.trang_thai !== 'da_phe_duyet') {
      return res.status(400).json({
        success: false,
        message: 'Báo cáo phải được viện trưởng phê duyệt trước khi gửi lên cấp phòng'
      });
    }

    // Cập nhật trạng thái
    await baoCao.update({
      trang_thai: 'cho_cap_phong_duyet'
    });

    const updatedBaoCao = await db.BaoCao.findByPk(id, {
      include: [
        {
          model: db.Vien,
          as: 'vien',
          attributes: ['id', 'ten_vien'],
          required: false
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiTao',
          attributes: ['id', 'username', 'ho_ten']
        },
        {
          model: db.TaiKhoan,
          as: 'nguoiPheDuyet',
          attributes: ['id', 'username', 'ho_ten'],
          required: false
        }
      ]
    });

    // Gửi thông báo cho tất cả tài khoản cấp phòng
    const io = req.app.get('io');
    if (io) {
      const { sendNotificationToUser } = require('../socket/socketServer');
      
      // Lấy tất cả tài khoản cấp phòng
      const capPhongs = await db.TaiKhoan.findAll({
        where: {
          trang_thai: 1
        },
        include: [
          {
            model: db.Quyen,
            as: 'quyen',
            attributes: ['ten_quyen'],
            where: {
              ten_quyen: 'cap_phong'
            }
          }
        ]
      });

      for (const capPhong of capPhongs) {
        await sendNotificationToUser(
          io,
          capPhong.id,
          {
            id_nguoi_gui: req.user.id,
            tieu_de: 'Báo cáo mới cần cấp phòng duyệt',
            noi_dung: `Báo cáo "${updatedBaoCao.tieu_de}" của Viện ${updatedBaoCao.vien?.ten_vien || ''} đã được viện trưởng phê duyệt và cần cấp phòng duyệt`,
            loai: 'thong_bao',
            loai_du_lieu: 'bao_cao',
            id_du_lieu: updatedBaoCao.id
          }
        );
      }
    }

    res.json({
      success: true,
      message: 'Gửi báo cáo lên cấp phòng thành công',
      data: updatedBaoCao
    });
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo lên cấp phòng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi báo cáo lên cấp phòng',
      error: error.message
    });
  }
};

module.exports = {
  getAllBaoCao,
  getBaoCaoById,
  createBaoCao,
  updateBaoCao,
  deleteBaoCao,
  guiBaoCao,
  pheDuyetBaoCao,
  tuChoiBaoCao,
  guiLenCapPhong,
  uploadFileBaoCao
};


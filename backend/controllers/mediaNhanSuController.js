const db = require('../models');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Lấy media nhân sự theo ID nhân sự
const getMediaNhanSuByNhanSuId = async (req, res) => {
  try {
    const { id_nhan_su } = req.params;

    const mediaNhanSu = await db.MediaNhanSu.findOne({
      where: { id_nhan_su },
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten']
        }
      ]
    });

    if (!mediaNhanSu) {
      return res.json({
        success: true,
        data: null,
        message: 'Chưa có media cho nhân sự này'
      });
    }

    // Parse JSON fields nếu cần (để frontend dễ xử lý)
    const parseJsonField = (field) => {
      if (!field) return field;
      if (typeof field === 'string') {
        try {
          const trimmed = field.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            return JSON.parse(field);
          }
        } catch (e) {
          // Nếu không parse được, trả về nguyên bản
        }
      }
      return field;
    };

    const responseData = {
      ...mediaNhanSu.toJSON(),
      anh_ho_so: parseJsonField(mediaNhanSu.anh_ho_so),
      anh_bang_cap: parseJsonField(mediaNhanSu.anh_bang_cap),
      anh_bhyt: parseJsonField(mediaNhanSu.anh_bhyt),
      anh_hop_dong: parseJsonField(mediaNhanSu.anh_hop_dong),
      anh_xe: parseJsonField(mediaNhanSu.anh_xe),
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Lỗi khi lấy media nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy media nhân sự',
      error: error.message
    });
  }
};

// Tạo hoặc cập nhật media nhân sự
const upsertMediaNhanSu = async (req, res) => {
  try {
    const { id_nhan_su } = req.params;
    const { anh_ho_so, anh_bang_cap, anh_bhyt, anh_hop_dong, anh_xe } = req.body;

    // Kiểm tra nhân sự tồn tại
    const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
    if (!nhanSu) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự không tồn tại'
      });
    }

    // Tìm media hiện có hoặc tạo mới
    let mediaNhanSu = await db.MediaNhanSu.findOne({
      where: { id_nhan_su }
    });

    if (mediaNhanSu) {
      // Cập nhật
      await mediaNhanSu.update({
        anh_ho_so: anh_ho_so !== undefined ? anh_ho_so : mediaNhanSu.anh_ho_so,
        anh_bang_cap: anh_bang_cap !== undefined ? anh_bang_cap : mediaNhanSu.anh_bang_cap,
        anh_bhyt: anh_bhyt !== undefined ? anh_bhyt : mediaNhanSu.anh_bhyt,
        anh_hop_dong: anh_hop_dong !== undefined ? anh_hop_dong : mediaNhanSu.anh_hop_dong,
        anh_xe: anh_xe !== undefined ? anh_xe : mediaNhanSu.anh_xe,
        ngay_cap_nhat_ho_so: new Date()
      });
    } else {
      // Tạo mới
      mediaNhanSu = await db.MediaNhanSu.create({
        id_nhan_su,
        anh_ho_so: anh_ho_so || null,
        anh_bang_cap: anh_bang_cap || null,
        anh_bhyt: anh_bhyt || null,
        anh_hop_dong: anh_hop_dong || null,
        anh_xe: anh_xe || null,
        ngay_cap_nhat_ho_so: new Date()
      });
    }

    const updatedMedia = await db.MediaNhanSu.findByPk(mediaNhanSu.id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten']
        }
      ]
    });

    res.json({
      success: true,
      message: mediaNhanSu ? 'Cập nhật media thành công' : 'Tạo media thành công',
      data: updatedMedia
    });
  } catch (error) {
    console.error('Lỗi khi lưu media nhân sự:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lưu media nhân sự',
      error: error.message
    });
  }
};

// Helper: Lưu base64 thành file và trả về đường dẫn
const saveBase64ToFile = async (base64String, fileType, idNhanSu) => {
  try {
    // Tách base64 string
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Định dạng base64 không hợp lệ');
    }

    const imageType = matches[1]; // image/jpeg, image/png, etc.
    const imageData = matches[2]; // base64 data
    const ext = imageType.split('/')[1] || 'jpg'; // jpeg, png, etc.

    // Tạo thư mục uploads/media-nhan-su nếu chưa có
    const uploadDir = path.join(__dirname, '../uploads/media-nhan-su');
    if (!fsSync.existsSync(uploadDir)) {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }

    // Tạo tên file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${fileType}-${idNhanSu}-${uniqueSuffix}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Lưu file
    await fs.writeFile(filePath, imageData, 'base64');

    // Trả về đường dẫn URL (relative path)
    return `/uploads/media-nhan-su/${filename}`;
  } catch (error) {
    console.error('Lỗi khi lưu base64 thành file:', error);
    throw error;
  }
};

// Upload file (hỗ trợ cả multer và base64)
// Hỗ trợ upload nhiều ảnh cùng lúc
const uploadFile = async (req, res) => {
  try {
    const { id_nhan_su, file_type } = req.body;
    const files = req.files || []; // Files từ multer
    const { file_data, files_data } = req.body; // Base64 data (tương thích ngược)

    if (!id_nhan_su || !file_type) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin (id_nhan_su, file_type)'
      });
    }

    // Kiểm tra file_type hợp lệ
    const validFileTypes = ['anh_ho_so', 'anh_bang_cap', 'anh_bhyt', 'anh_hop_dong', 'anh_xe'];
    if (!validFileTypes.includes(file_type)) {
      return res.status(400).json({
        success: false,
        message: `file_type phải là một trong: ${validFileTypes.join(', ')}`
      });
    }

    // Kiểm tra nhân sự tồn tại
    const nhanSu = await db.NhanSu.findByPk(id_nhan_su);
    if (!nhanSu) {
      return res.status(400).json({
        success: false,
        message: 'Nhân sự không tồn tại'
      });
    }

    // Tìm hoặc tạo media
    let mediaNhanSu = await db.MediaNhanSu.findOne({
      where: { id_nhan_su }
    });

    let newFilePaths = [];

    // Xử lý upload từ multer (files) - ưu tiên
    if (files && files.length > 0) {
      // Lưu file từ multer
      for (const file of files) {
        const filePath = `/uploads/media-nhan-su/${file.filename}`;
        newFilePaths.push(filePath);
        console.log(`✅ File uploaded: ${file.filename} -> ${filePath}`);
      }
    } 
    // Xử lý base64 (tương thích ngược)
    else if (files_data && Array.isArray(files_data) && files_data.length > 0) {
      // Upload nhiều ảnh base64
      for (const base64Data of files_data) {
        const filePath = await saveBase64ToFile(base64Data, file_type, id_nhan_su);
        newFilePaths.push(filePath);
      }
    } else if (file_data) {
      // Upload một ảnh base64
      const filePath = await saveBase64ToFile(file_data, file_type, id_nhan_su);
      newFilePaths.push(filePath);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp file (multer) hoặc file_data/files_data (base64)'
      });
    }

    // Lấy danh sách ảnh hiện có (nếu có)
    let currentImages = [];
    if (mediaNhanSu && mediaNhanSu[file_type]) {
      try {
        const parsed = JSON.parse(mediaNhanSu[file_type]);
        if (Array.isArray(parsed)) {
          currentImages = parsed;
        } else {
          // Nếu là string đơn, chuyển thành array
          currentImages = [mediaNhanSu[file_type]];
        }
      } catch (e) {
        // Nếu không parse được, coi như string đơn
        currentImages = [mediaNhanSu[file_type]];
      }
    }

    // Thêm ảnh mới vào danh sách
    currentImages = [...currentImages, ...newFilePaths];
    const newFileData = currentImages.length === 1 ? currentImages[0] : JSON.stringify(currentImages);

    const updateData = {
      [file_type]: newFileData,
      ngay_cap_nhat_ho_so: new Date()
    };

    if (mediaNhanSu) {
      await mediaNhanSu.update(updateData);
    } else {
      mediaNhanSu = await db.MediaNhanSu.create({
        id_nhan_su,
        ...updateData
      });
    }

    const updatedMedia = await db.MediaNhanSu.findByPk(mediaNhanSu.id, {
      include: [
        {
          model: db.NhanSu,
          as: 'nhanSu',
          attributes: ['id', 'ho_ten']
        }
      ]
    });

    // Parse JSON fields để frontend dễ xử lý
    const parseJsonField = (field) => {
      if (!field) return field;
      if (typeof field === 'string') {
        try {
          const trimmed = field.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            return JSON.parse(field);
          }
        } catch (e) {
          // Nếu không parse được, trả về nguyên bản
        }
      }
      return field;
    };

    const responseData = {
      ...updatedMedia.toJSON(),
      anh_ho_so: parseJsonField(updatedMedia.anh_ho_so),
      anh_bang_cap: parseJsonField(updatedMedia.anh_bang_cap),
      anh_bhyt: parseJsonField(updatedMedia.anh_bhyt),
      anh_hop_dong: parseJsonField(updatedMedia.anh_hop_dong),
      anh_xe: parseJsonField(updatedMedia.anh_xe),
    };

    res.json({
      success: true,
      message: `Upload ${newFilePaths.length} file thành công`,
      data: responseData
    });
  } catch (error) {
    console.error('Lỗi khi upload file:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload file',
      error: error.message
    });
  }
};

module.exports = {
  getMediaNhanSuByNhanSuId,
  upsertMediaNhanSu,
  uploadFile
};


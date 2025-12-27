const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lưu vào thư mục uploads/media-tai-san
    const mediaDir = path.join(uploadDir, 'media-tai-san');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }
    cb(null, mediaDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filter: chấp nhận JPG, PNG, PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypes = /image\/jpeg|image\/jpg|image\/png|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;
  const mimetype = mimetypes.test(file.mimetype);

  if ((mimetype || extname) && allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file JPG, PNG, PDF, DOC, DOCX'));
  }
};

// Cấu hình multer
const uploadMediaTaiSan = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB mỗi file
  },
  fileFilter: fileFilter
});

module.exports = uploadMediaTaiSan;


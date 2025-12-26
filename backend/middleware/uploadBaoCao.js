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
    // Lưu vào thư mục uploads/bao-cao
    const baoCaoDir = path.join(uploadDir, 'bao-cao');
    if (!fs.existsSync(baoCaoDir)) {
      fs.mkdirSync(baoCaoDir, { recursive: true });
    }
    cb(null, baoCaoDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filter: chỉ chấp nhận file Excel và PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = /xlsx|xls|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   file.mimetype === 'application/vnd.ms-excel' ||
                   file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc PDF (.pdf)'));
  }
};

// Cấu hình multer
const uploadBaoCao = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB mỗi file
  },
  fileFilter: fileFilter
});

module.exports = uploadBaoCao;


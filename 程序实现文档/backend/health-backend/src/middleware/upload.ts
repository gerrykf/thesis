import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 上传目录配置（生产环境使用绝对路径，开发环境使用相对路径）
// UPLOAD_PATH 应该设置为 uploads 目录，代码会自动追加 avatars
const uploadDir = process.env.UPLOAD_PATH
  ? path.join(process.env.UPLOAD_PATH, "avatars") // 生产环境：拼接 avatars
  : path.join(__dirname, "../uploads/avatars"); // 开发环境：相对路径

console.log("[Upload] UPLOAD_PATH 环境变量:", process.env.UPLOAD_PATH);
console.log("[Upload] __dirname:", __dirname);

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('[Upload] 上传目录创建成功:', uploadDir);
  } catch (error) {
    console.error('[Upload] 上传目录创建失败:', uploadDir, error);
  }
}

console.log('[Upload] 上传目录:', uploadDir);

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名: 用户ID_时间戳.扩展名
    const userId = (req as any).user?.userId || 'unknown';
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 只允许图片格式
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持上传图片文件 (jpg, jpeg, png, gif, webp)'));
  }
};

// 创建 multer 实例
export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

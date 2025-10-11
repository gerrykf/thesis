const fs = require('fs');
const path = require('path');

/**
 * 递归复制目录
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
function copyDir(src, dest) {
  // 如果源目录不存在,创建空的目标目录
  if (!fs.existsSync(src)) {
    console.log(`⚠️  源目录不存在: ${src}`);
    console.log(`📁 创建空的目标目录: ${dest}`);
    fs.mkdirSync(dest, { recursive: true });
    return;
  }

  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 主函数
function main() {
  const rootDir = path.join(__dirname, '..');
  const srcUploads = path.join(rootDir, 'uploads');
  const distUploads = path.join(rootDir, 'dist', 'uploads');

  console.log('📦 开始复制uploads目录...');
  console.log(`   源目录: ${srcUploads}`);
  console.log(`   目标目录: ${distUploads}`);

  try {
    copyDir(srcUploads, distUploads);
    console.log('✅ uploads目录复制完成!');
  } catch (error) {
    console.error('❌ 复制失败:', error.message);
    process.exit(1);
  }
}

main();

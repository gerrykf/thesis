# 1panel 生产环境配置指南

## 问题现象

- ✅ 头像上传成功，数据库保存了路径：`/uploads/avatars/13_1762015881048.png`
- ❌ 访问图片返回 404：`https://healthmanage.xin/uploads/avatars/13_1762015881048.png`
- ✅ 文件在服务器上确实存在

## 问题原因

在1panel的Node.js运行环境中，`__dirname` 指向的是**编译后的dist目录**（开发环境可能是src目录），导致静态文件路径配置不正确。

## 解决方案

### 方案1：使用环境变量指定上传目录（推荐）

#### 步骤1：在1panel中设置环境变量

在 1panel -> 网站 -> 你的Node.js应用 -> 环境变量，添加：

```bash
UPLOAD_PATH=/www/wwwroot/your-project-path/uploads
```

**重要**：将 `/www/wwwroot/your-project-path` 替换为你的实际项目路径

#### 步骤2：验证环境变量是否生效

在1panel的应用日志中，应该能看到：

```
UPLOAD_PATH: /www/wwwroot/your-project-path/uploads
[Upload] 上传目录: /www/wwwroot/your-project-path/uploads/avatars
[Static] 静态文件目录: /www/wwwroot/your-project-path/uploads
```

#### 步骤3：确保目录存在且有权限

SSH登录到服务器，执行：

```bash
# 1. 切换到项目目录
cd /www/wwwroot/your-project-path

# 2. 创建上传目录（如果不存在）
mkdir -p uploads/avatars

# 3. 设置正确的权限
chmod -R 755 uploads
chown -R www:www uploads  # 或者 chown -R node:node uploads

# 4. 验证目录和文件是否存在
ls -la uploads/avatars/

# 5. 验证图片文件确实存在
ls -lh uploads/avatars/13_1762015881048.png
```

---

### 方案2：修改代码使用绝对路径

如果不想使用环境变量，可以直接在代码中硬编码绝对路径（不推荐，但快速）。

#### 修改 `src/middleware/upload.ts`

```typescript
// 生产环境使用绝对路径
const uploadDir = process.env.NODE_ENV === 'production'
  ? '/www/wwwroot/your-project-path/uploads/avatars'  // 替换为你的实际路径
  : path.join(__dirname, '../../uploads/avatars');

console.log('[Upload] 上传目录:', uploadDir);
```

#### 修改 `src/app.ts`

```typescript
// 生产环境使用绝对路径
const staticDir = process.env.NODE_ENV === 'production'
  ? '/www/wwwroot/your-project-path/uploads'  // 替换为你的实际路径
  : path.join(__dirname, '../uploads');

app.use('/uploads', express.static(staticDir));
console.log('[Static] 静态文件目录:', staticDir);
```

---

### 方案3：检查1panel的反向代理配置

如果上述方案都不行，可能是1panel的Nginx反向代理没有正确配置静态文件。

#### 步骤1：检查Nginx配置

在1panel中找到你的网站 -> Nginx配置，确保有以下配置：

```nginx
location /uploads/ {
    alias /www/wwwroot/your-project-path/uploads/;
    expires 30d;
    access_log off;
}

location / {
    proxy_pass http://127.0.0.1:3000;  # 你的Node.js应用端口
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**说明**：
- `/uploads/` 路径直接由Nginx提供静态文件服务（更高效）
- 其他请求转发给Node.js应用

#### 步骤2：重载Nginx配置

```bash
nginx -t          # 测试配置是否正确
nginx -s reload   # 重载配置
```

---

## 调试步骤

### 1. 确认项目路径

SSH登录服务器，执行：

```bash
pwd  # 查看当前目录
# 输出示例: /www/wwwroot/healthmanage.xin
```

### 2. 确认上传目录结构

```bash
tree -L 3 uploads/
# 或者
find uploads/ -type f -name "*.png" | head -5
```

### 3. 确认文件权限

```bash
ls -la uploads/
ls -la uploads/avatars/
```

预期输出应该类似：

```
drwxr-xr-x 2 www www 4096 Jan 16 10:30 avatars
-rw-r--r-- 1 www www 12345 Jan 16 10:30 13_1762015881048.png
```

### 4. 测试Node.js应用能否访问文件

在你的应用中添加一个测试路由（临时调试用）：

```typescript
// src/app.ts
app.get('/test-upload-path', (req: Request, res: Response) => {
  const fs = require('fs');
  const path = require('path');

  const uploadDir = process.env.UPLOAD_PATH
    ? path.resolve(process.env.UPLOAD_PATH, 'avatars')
    : path.join(__dirname, '../../uploads/avatars');

  const staticDir = process.env.UPLOAD_PATH
    ? process.env.UPLOAD_PATH
    : path.join(__dirname, '../uploads');

  res.json({
    __dirname,
    uploadDir,
    staticDir,
    uploadDirExists: fs.existsSync(uploadDir),
    staticDirExists: fs.existsSync(staticDir),
    files: fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [],
    env: {
      NODE_ENV: process.env.NODE_ENV,
      UPLOAD_PATH: process.env.UPLOAD_PATH
    }
  });
});
```

然后访问 `https://healthmanage.xin/test-upload-path` 查看输出。

### 5. 直接测试静态文件访问

```bash
# 在服务器上执行
curl -I https://healthmanage.xin/uploads/avatars/13_1762015881048.png

# 或者测试本地
curl -I http://127.0.0.1:3000/uploads/avatars/13_1762015881048.png
```

---

## 常见错误排查

### 错误1: 404 Not Found
**原因**:
- 静态文件目录配置不正确
- 文件不存在或路径错误
- Nginx配置问题

**解决**: 按照上述方案1或方案3配置

### 错误2: 403 Forbidden
**原因**: 文件权限不足

**解决**:
```bash
chmod -R 755 uploads
chown -R www:www uploads
```

### 错误3: ENOENT: no such file or directory
**原因**: 上传目录不存在

**解决**:
```bash
mkdir -p /www/wwwroot/your-project-path/uploads/avatars
```

---

## 最佳实践建议

1. **使用环境变量**：在1panel中配置 `UPLOAD_PATH` 环境变量
2. **使用Nginx提供静态文件**：比Node.js更高效
3. **定期清理旧文件**：避免磁盘占用过多
4. **设置正确的文件权限**：确保Node.js进程有读写权限

---

## 快速修复清单

```bash
# 1. SSH登录服务器
ssh root@your-server

# 2. 进入项目目录
cd /www/wwwroot/healthmanage.xin

# 3. 创建上传目录
mkdir -p uploads/avatars

# 4. 设置权限
chmod -R 755 uploads
chown -R www:www uploads

# 5. 在1panel中设置环境变量
# UPLOAD_PATH=/www/wwwroot/healthmanage.xin/uploads

# 6. 重启Node.js应用
# 在1panel中点击重启按钮

# 7. 验证日志输出
# 查看应用日志，确认路径是否正确

# 8. 测试访问
curl -I https://healthmanage.xin/uploads/avatars/13_1762015881048.png
```

---

**创建时间**: 2025-01-16
**适用场景**: 1panel + Node.js运行环境
**项目**: 健康管理系统

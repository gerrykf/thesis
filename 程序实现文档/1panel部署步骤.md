# 1panel 部署步骤 - 头像上传功能配置

## 问题修复总结

### 修复的文件

1. **src/middleware/upload.ts** - 上传目录配置
2. **src/app.ts** - 静态文件服务配置
3. **.env.development2** - 环境变量配置

### 修复内容

#### 1. 环境变量配置（.env.development2）

```bash
# ❌ 错误配置（多了 /avatars）
UPLOAD_PATH=/opt/1panel/www/sites/healthbackend/index/server_upload/uploads/avatars

# ✅ 正确配置（只到 uploads 目录）
UPLOAD_PATH=/opt/1panel/www/sites/healthbackend/index/server_upload/uploads
```

**原因**：代码会自动在 `UPLOAD_PATH` 后面追加 `/avatars`，所以环境变量只需要配置到 `uploads` 目录。

---

## 1panel 部署步骤

### 步骤1：上传代码到1panel

将整个项目上传到1panel的Node.js运行环境：
- 路径示例：`/opt/1panel/www/sites/healthbackend/index/`

### 步骤2：配置环境变量

在1panel管理面板中：
1. 进入 **网站 -> 你的Node.js项目 -> 环境变量**
2. 添加/修改以下环境变量：

```bash
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=1Panel-mysql-c9zl
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysql_ESQSJ2
DB_NAME=health_management

# JWT配置
JWT_SECRET=health_system_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=https://healthmanage.xin,http://healthmanage.xin

# 文件上传配置（重要！只到 uploads 目录）
UPLOAD_PATH=/opt/1panel/www/sites/healthbackend/index/server_upload/uploads
MAX_FILE_SIZE=5242880
```

### 步骤3：创建上传目录

SSH登录到服务器，执行：

```bash
# 1. 切换到项目目录
cd /opt/1panel/www/sites/healthbackend/index/server_upload

# 2. 创建上传目录
mkdir -p uploads/avatars

# 3. 设置权限（确保Node.js进程可以读写）
chmod -R 755 uploads
chown -R node:node uploads  # 或者使用你的Node.js运行用户

# 4. 验证目录创建成功
ls -la uploads/
```

### 步骤4：重启Node.js应用

在1panel管理面板中：
1. 进入 **网站 -> 你的Node.js项目**
2. 点击 **重启** 按钮

### 步骤5：验证配置

#### 查看应用日志

在1panel中查看应用日志，应该看到：

```
UPLOAD_PATH: /opt/1panel/www/sites/healthbackend/index/server_upload/uploads
[Upload] 最终上传目录: /opt/1panel/www/sites/healthbackend/index/server_upload/uploads/avatars
[Static] 静态文件目录: /opt/1panel/www/sites/healthbackend/index/server_upload/uploads
```

**重要检查点**：
- `[Upload] 最终上传目录` 应该以 `/avatars` 结尾 ✅
- `[Static] 静态文件目录` 应该是 `uploads` 目录（不含 `/avatars`）✅

#### 测试上传功能

1. 登录H5端或管理后台
2. 上传头像
3. 检查是否上传成功
4. 访问头像URL：`https://healthmanage.xin/uploads/avatars/xxx.png`

---

## 目录结构说明

```
/opt/1panel/www/sites/healthbackend/index/
├── server_upload/          # 项目代码目录
│   ├── src/
│   ├── dist/               # 编译后的代码（如果有）
│   ├── node_modules/
│   ├── package.json
│   ├── .env.development2   # 环境变量文件
│   └── uploads/            # 上传文件目录（重要！）
│       └── avatars/        # 头像文件存储
│           ├── 13_1762015881048.png
│           ├── 67_1762012345678.jpg
│           └── ...
```

---

## 访问路径映射关系

| 访问URL | 实际文件路径 |
|---------|-------------|
| `https://healthmanage.xin/uploads/avatars/13_xxx.png` | `/opt/1panel/www/sites/healthbackend/index/server_upload/uploads/avatars/13_xxx.png` |

**工作原理**：
1. 用户访问 `https://healthmanage.xin/uploads/avatars/13_xxx.png`
2. 请求到达Node.js应用
3. Express静态中间件 `app.use('/uploads', express.static(staticDir))`
4. staticDir = `/opt/.../uploads`
5. Express查找文件：`/opt/.../uploads/avatars/13_xxx.png` ✅

---

## 常见问题排查

### Q1: 上传成功但访问404

**原因**：静态文件目录配置不正确

**解决**：
1. 检查 `UPLOAD_PATH` 环境变量是否正确（不应包含 `/avatars`）
2. 检查应用日志中的 `[Static] 静态文件目录` 输出
3. 确认文件确实存在：`ls -la /opt/.../uploads/avatars/`

### Q2: 上传时报错 ENOENT

**原因**：上传目录不存在或权限不足

**解决**：
```bash
mkdir -p /opt/1panel/www/sites/healthbackend/index/server_upload/uploads/avatars
chmod -R 755 /opt/1panel/www/sites/healthbackend/index/server_upload/uploads
```

### Q3: 图片上传后显示不出来

**原因**：前端拼接URL的问题（已修复）

**验证**：
1. 检查 `.env.production` 是否配置了 `VITE_STATIC_BASE_URL=https://healthmanage.xin`
2. 前端重新构建并部署

### Q4: 权限问题 403 Forbidden

**原因**：Node.js进程没有读取文件的权限

**解决**：
```bash
# 查看当前权限
ls -la /opt/.../uploads/

# 修改权限
chmod -R 755 /opt/.../uploads
chown -R node:node /opt/.../uploads
```

---

## 快速验证清单

部署完成后，依次验证：

- [ ] 环境变量 `UPLOAD_PATH` 配置正确（不含 `/avatars`）
- [ ] 上传目录存在：`/opt/.../uploads/avatars/`
- [ ] 目录权限正确：`755`，所有者是Node.js运行用户
- [ ] 应用日志显示正确的路径
- [ ] 能够成功上传头像
- [ ] 数据库中保存了头像路径：`/uploads/avatars/xxx.png`
- [ ] 能够访问头像URL：`https://healthmanage.xin/uploads/avatars/xxx.png`

---

## 前端配置（H5端和管理后台）

### 步骤1：配置生产环境变量

**文件**：`frontend/h5-app/.env.production` 和 `frontend/health-manage/.env.production`

```bash
# 生产环境配置
NODE_ENV=production

# 后端API地址（生产环境）
VITE_API_BASE_URL=https://healthmanage.xin

# 静态资源地址（头像、文件等）
VITE_STATIC_BASE_URL=https://healthmanage.xin
```

### 步骤2：重新构建前端

```bash
# H5端
cd frontend/h5-app
npm run build

# 管理后台
cd frontend/health-manage
npm run build
```

### 步骤3：部署到1panel

将 `dist/` 目录上传到1panel的网站目录。

---

**最后更新时间**：2025-01-16
**版本**：v1.2
**状态**：已修复并测试通过

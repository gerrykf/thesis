# 健康管理系统技术难点实现指南

## 1. 用户头像上传完整实现链路（本地文件存储方案）

### 1.1 技术架构概览

本项目采用本地文件存储方案实现用户头像上传功能，完整技术链路如下：

```
前端上传 → Multer中间件 → 后端处理 → 本地存储 → 数据库记录 → 静态文件访问
```

**核心技术栈：**
- **前端**：Vue3 + Vant Uploader + FormData + Axios
- **后端**：Express + Multer + Node.js fs + MySQL
- **存储**：本地文件系统（/uploads/avatars/）
- **访问**：Express static + Vite proxy

### 1.2 数据库设计

#### 1.2.1 用户表字段
```sql
-- users 表中存储头像路径
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  gender ENUM('male', 'female', 'other'),
  birth_date DATE,
  height DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  avatar VARCHAR(255),  -- 存储头像相对路径，如：/uploads/avatars/1_1234567890.jpg
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 1.2.2 头像字段设计说明
- **字段类型**：VARCHAR(255)，足够存储完整路径
- **存储内容**：相对路径，格式为 `/uploads/avatars/{userId}_{timestamp}.{ext}`
- **路径示例**：`/uploads/avatars/1_1736320456789.jpg`
- **优势**：便于迁移、支持 CDN 替换、前端统一处理

### 1.3 后端实现

#### 1.3.1 Multer 文件上传中间件

**安装依赖：**
```bash
npm install multer
npm install --save-dev @types/multer
```

**中间件配置（src/middleware/upload.ts）：**
```typescript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 创建上传目录
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储引擎
const storage = multer.diskStorage({
  // 设置文件存储目录
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // 设置文件命名规则
  filename: function (req, file, cb) {
    const userId = (req as any).user?.userId || 'unknown';
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// 文件类型过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);  // 接受文件
  } else {
    cb(new Error('只支持上传图片文件 (jpg, jpeg, png, gif, webp)'));
  }
};

// 创建 Multer 实例
export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 限制文件大小为 5MB
  }
});
```

**技术要点：**
1. **存储策略**：使用 `diskStorage` 直接存储到磁盘
2. **文件命名**：`{userId}_{timestamp}.{ext}` 确保唯一性
3. **类型验证**：通过 `fileFilter` 限制只能上传图片
4. **大小限制**：`limits.fileSize` 限制最大 5MB

#### 1.3.2 头像上传控制器

**控制器实现（src/controllers/authController.ts）：**
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/database';
import path from 'path';
import fs from 'fs';

/**
 * 上传用户头像
 * POST /api/auth/avatar
 */
export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. 验证文件是否上传
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "请上传头像文件"
      });
      return;
    }

    const userId = req.user?.userId;
    // 2. 生成头像访问路径（相对路径）
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // 3. 查询用户旧头像（用于删除）
    const [rows] = await db.execute(
      "SELECT avatar FROM users WHERE id = ?",
      [userId]
    );
    const users = rows as any[];
    const oldAvatar = users[0]?.avatar;

    // 4. 更新数据库中的头像路径
    await db.execute(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [avatarUrl, userId]
    );

    // 5. 删除旧头像文件（如果存在且是本地文件）
    if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
      const oldAvatarPath = path.join(__dirname, '../../', oldAvatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
        console.log(`✅ 已删除旧头像: ${oldAvatar}`);
      }
    }

    // 6. 返回成功响应
    res.json({
      success: true,
      message: "头像上传成功",
      data: {
        avatarUrl: avatarUrl
      }
    });
  } catch (error) {
    console.error("头像上传失败:", error);

    // 7. 错误处理：删除已上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "服务器内部错误"
    });
  }
};
```

**流程说明：**
1. 验证 multer 是否成功接收文件
2. 构造相对路径格式的 avatarUrl
3. 查询数据库获取旧头像路径
4. 更新数据库记录新头像路径
5. 删除旧头像文件释放存储空间
6. 返回新头像 URL 给前端
7. 异常时清理已上传的文件

#### 1.3.3 路由配置

**路由注册（src/routes/authRoutes.ts）：**
```typescript
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadAvatar as uploadAvatarController } from '../controllers/authController';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload';

const router = express.Router();

// 头像上传路由
// POST /api/auth/avatar
router.post(
  '/avatar',
  authenticateToken,           // 1. JWT 认证中间件
  uploadMiddleware.single('avatar'),  // 2. Multer 文件上传中间件（字段名为 avatar）
  uploadAvatarController       // 3. 业务处理控制器
);

export default router;
```

**中间件执行顺序：**
1. `authenticateToken`：验证用户登录状态，获取 userId
2. `uploadMiddleware.single('avatar')`：处理文件上传，将文件信息挂载到 `req.file`
3. `uploadAvatarController`：执行业务逻辑

#### 1.3.4 静态文件访问配置

**Express 静态资源服务（src/app.ts）：**
```typescript
import express from 'express';
import path from 'path';

const app = express();

// 配置静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 示例访问：
// 存储路径：/uploads/avatars/1_1736320456789.jpg
// 访问 URL：http://localhost:3000/uploads/avatars/1_1736320456789.jpg
```

### 1.4 前端实现

#### 1.4.1 API 接口定义

**头像上传 API（src/api/auth.ts）：**
```typescript
import request from "@/utils/request";

/**
 * 上传用户头像
 * POST /api/auth/avatar
 */
export async function postAuthAvatar(
  file: File,
  options?: { [key: string]: any }
) {
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('avatar', file);  // 字段名必须与后端一致

  return request<{
    success?: boolean;
    message?: string;
    data?: { avatarUrl?: string };
  }>("/api/auth/avatar", {
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'  // 设置正确的 Content-Type
    },
    data: formData,
    ...(options || {}),
  });
}
```

**技术要点：**
- 使用 `FormData` 构造表单数据
- 字段名 `avatar` 必须与后端 `uploadMiddleware.single('avatar')` 一致
- Content-Type 设置为 `multipart/form-data`

#### 1.4.2 Vant Uploader 组件集成

**个人中心页面（src/views/my/index.vue）：**
```vue
<template>
  <div class="profile">
    <van-nav-bar title="个人中心" fixed placeholder />

    <div class="content">
      <!-- 用户信息 -->
      <div class="user-info">
        <!-- 头像上传区域 -->
        <div class="avatar-upload-wrapper">
          <van-uploader
            v-model="fileList"
            :max-count="1"
            :max-size="5 * 1024 * 1024"
            :before-read="beforeRead"
            :after-read="afterRead"
            :deletable="false"
            preview-size="80"
            @oversize="onOversize"
          >
            <template #default>
              <div class="avatar-wrapper">
                <!-- 显示头像 -->
                <van-image
                  v-if="avatarUrl && !isUploading"
                  round
                  width="80"
                  height="80"
                  :src="avatarUrl"
                  fit="cover"
                >
                  <template #error>
                    <div class="avatar-placeholder">
                      <van-icon name="user-o" size="40" />
                    </div>
                  </template>
                </van-image>

                <!-- 默认头像占位符 -->
                <div v-else-if="!isUploading" class="avatar-placeholder">
                  <van-icon name="user-o" size="40" />
                </div>

                <!-- 上传中状态 -->
                <div v-if="isUploading" class="avatar-uploading">
                  <van-loading type="spinner" size="30" color="#1989fa" />
                  <div class="upload-text">上传中...</div>
                </div>

                <!-- 遮罩层提示 -->
                <div class="avatar-mask">
                  <van-icon name="photograph" size="20" color="#fff" />
                </div>
              </div>
            </template>
          </van-uploader>
        </div>

        <div class="user-name">{{ userName }}</div>
        <div class="user-desc">健康生活，从今天开始</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onActivated } from 'vue';
import { showToast } from 'vant';
import type { UploaderFileListItem } from 'vant';
import { useUserStore } from '@/stores/user';
import { postAuthAvatar } from '@/api/auth';

const userStore = useUserStore();
const fileList = ref<UploaderFileListItem[]>([]);
const isUploading = ref(false);

// 从 store 获取用户信息
const userName = computed(() => userStore.nickname);

// 页面激活时刷新用户信息（包括首次挂载和从其他页面返回）
onActivated(() => {
  userStore.refreshUserInfo();
});

// 获取头像 URL（通过 Vite 代理访问）
const avatarUrl = computed(() => {
  const avatar = userStore.userInfo?.avatar;
  if (!avatar) return '';

  // 直接返回相对路径，Vite 代理会自动转发到后端
  return avatar;  // 例如：/uploads/avatars/1_1736320456789.jpg
});

// 文件读取前的校验
function beforeRead(file: File | File[]) {
  const fileToCheck = Array.isArray(file) ? file[0] : file;
  if (!fileToCheck) return false;

  // 验证文件类型
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedTypes.includes(fileToCheck.type)) {
    showToast('只支持上传 JPG、PNG、GIF、WEBP 格式的图片');
    return false;
  }

  return true;
}

// 文件超过大小限制
function onOversize() {
  showToast('图片大小不能超过 5MB');
}

// 文件读取完成后上传
async function afterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
  const fileItem = Array.isArray(file) ? file[0] : file;
  if (!fileItem?.file) return;

  // 设置上传状态
  isUploading.value = true;
  fileItem.status = 'uploading';
  fileItem.message = '上传中...';

  try {
    const res = await postAuthAvatar(fileItem.file);
    const data = res as any;

    if (data.success && data.data?.avatarUrl) {
      // 设置成功状态
      fileItem.status = 'done';
      fileItem.message = '';

      // 立即更新 store 中的头像（快速响应）
      userStore.updateAvatar(data.data.avatarUrl);

      // 从服务器刷新完整用户信息（确保数据一致性）
      userStore.refreshUserInfo();

      showToast('头像上传成功');

      // 清空文件列表，允许再次上传
      setTimeout(() => {
        fileList.value = [];
        isUploading.value = false;
      }, 1000);
    } else {
      // 设置失败状态
      fileItem.status = 'failed';
      fileItem.message = '上传失败';
      isUploading.value = false;
      showToast(data.message || '上传失败');
    }
  } catch (error: any) {
    // 设置失败状态
    fileItem.status = 'failed';
    fileItem.message = '上传失败';
    isUploading.value = false;
    console.error('上传头像失败:', error);
    showToast(error.message || '上传失败');
  }
}
</script>
```

**组件功能说明：**
1. **文件选择**：用户点击头像区域触发文件选择
2. **前置验证**：`beforeRead` 验证文件类型和大小
3. **上传处理**：`afterRead` 调用 API 上传文件
4. **状态展示**：显示上传中、成功、失败状态
5. **实时更新**：上传成功后立即更新头像显示

#### 1.4.3 Pinia Store 状态管理

**用户状态管理（src/stores/user.ts）：**
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAuthProfile } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<API.User | null>(null);
  const token = ref<string | null>(null);

  // 计算属性
  const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.username || '用户');

  /**
   * 设置用户信息
   */
  function setUserInfo(info: API.User) {
    userInfo.value = info;
    // 同步到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  /**
   * 刷新用户信息（从服务器获取最新信息）
   */
  async function refreshUserInfo() {
    try {
      const res = await getAuthProfile();
      const data = res as any;

      if (data.success && data.data) {
        setUserInfo(data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      return false;
    }
  }

  /**
   * 更新用户头像（仅更新头像字段）
   */
  function updateAvatar(avatarUrl: string) {
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        avatar: avatarUrl
      };
      // 同步到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    }
  }

  return {
    userInfo,
    token,
    nickname,
    setUserInfo,
    refreshUserInfo,
    updateAvatar
  };
});
```

**Store 功能说明：**
- `refreshUserInfo()`：从服务器获取最新用户信息
- `updateAvatar()`：快速更新本地头像显示
- 双重更新策略：先本地更新（快速响应） + 再服务器同步（数据一致）

#### 1.4.4 Vite 开发代理配置

**Vite 配置（vite.config.ts）：**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      // API 请求代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 不重写路径，保留 /api 前缀
      },
      // 上传文件访问代理
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 不重写路径，保留 /uploads 前缀
      }
    }
  }
});
```

**代理作用：**
- 前端开发服务器：`http://localhost:5173`
- 后端 API 服务器：`http://localhost:3000`
- 前端访问 `/uploads/avatars/1.jpg` → 自动代理到 `http://localhost:3000/uploads/avatars/1.jpg`

### 1.5 完整数据流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                     用户头像上传完整流程                          │
└─────────────────────────────────────────────────────────────────┘

1. 【前端 - 文件选择】
   用户点击头像 → 触发文件选择器 → 选择图片文件

2. 【前端 - 前置验证】
   beforeRead() → 验证文件类型 → 验证文件大小 → 返回 true/false

3. 【前端 - 读取文件】
   File Reader API → 读取文件内容 → 生成 File 对象

4. 【前端 - 构造请求】
   afterRead() → 创建 FormData → formData.append('avatar', file)

5. 【前端 - 发送请求】
   axios.post('/api/auth/avatar', formData, {
     headers: { 'Content-Type': 'multipart/form-data' }
   })

6. 【后端 - JWT 认证】
   authenticateToken 中间件 → 验证 token → 解析 userId

7. 【后端 - 文件接收】
   Multer 中间件 → 解析 multipart/form-data → 保存文件到磁盘
   ├─ 存储位置: /uploads/avatars/
   ├─ 文件命名: {userId}_{timestamp}.{ext}
   └─ 验证类型: image/jpeg, image/png, image/gif, image/webp

8. 【后端 - 数据库操作】
   uploadAvatar 控制器:
   ├─ 查询旧头像: SELECT avatar FROM users WHERE id = ?
   ├─ 更新新头像: UPDATE users SET avatar = ? WHERE id = ?
   └─ 删除旧文件: fs.unlinkSync(oldAvatarPath)

9. 【后端 - 返回响应】
   res.json({
     success: true,
     data: { avatarUrl: '/uploads/avatars/1_1736320456789.jpg' }
   })

10. 【前端 - 接收响应】
    axios 拦截器 → 解包数据 → 返回 data

11. 【前端 - 更新状态】
    userStore.updateAvatar(avatarUrl) → 更新 Pinia store
    userStore.refreshUserInfo() → 从服务器同步最新数据

12. 【前端 - 界面更新】
    computed avatarUrl 响应式更新 → van-image 重新渲染

13. 【文件访问】
    <van-image src="/uploads/avatars/1_1736320456789.jpg" />
    ↓
    Vite proxy: http://localhost:5173/uploads/avatars/1.jpg
    ↓
    转发到: http://localhost:3000/uploads/avatars/1.jpg
    ↓
    Express static 中间件返回文件
```

### 1.6 关键技术难点与解决方案

#### 难点 1：文件类型验证
**问题**：前端选择的文件可能不是图片格式
**解决方案**：
- 前端：`beforeRead` 验证 `file.type`
- 后端：Multer `fileFilter` 二次验证 `file.mimetype`
- 双重验证确保安全性

#### 难点 2：文件大小控制
**问题**：大文件上传占用带宽和存储空间
**解决方案**：
- 前端：Vant Uploader `max-size` 属性限制
- 后端：Multer `limits.fileSize` 限制
- 超出大小时提示用户并拒绝上传

#### 难点 3：旧文件清理
**问题**：用户多次上传头像会产生大量废弃文件
**解决方案**：
```typescript
// 更新头像前先查询旧头像路径
const [rows] = await db.execute("SELECT avatar FROM users WHERE id = ?", [userId]);
const oldAvatar = rows[0]?.avatar;

// 更新数据库后删除旧文件
if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
  const oldPath = path.join(__dirname, '../../', oldAvatar);
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
}
```

#### 难点 4：上传失败后的文件清理
**问题**：上传过程中如果数据库更新失败，已保存的文件成为垃圾文件
**解决方案**：
```typescript
try {
  // 上传和数据库操作
} catch (error) {
  // 异常时清理已上传的文件
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
  throw error;
}
```

#### 难点 5：跨域文件访问
**问题**：前端 5173 端口无法直接访问后端 3000 端口的静态文件
**解决方案**：
- 开发环境：Vite proxy 配置代理
- 生产环境：Nginx 反向代理统一域名

#### 难点 6：上传状态展示
**问题**：用户不知道上传是否成功
**解决方案**：
- 使用 Vant Uploader 的状态管理
- `fileItem.status`：'uploading' / 'done' / 'failed'
- 自定义 `isUploading` ref 控制 UI 显示
- 显示加载动画和进度提示

### 1.7 与 MinIO 方案的对比

| 对比项 | 本地存储方案 | MinIO 方案 |
|--------|-------------|-----------|
| **部署复杂度** | ⭐ 简单，无需额外服务 | ⭐⭐⭐ 需要部署 MinIO 服务 |
| **性能** | ⭐⭐ 受服务器带宽限制 | ⭐⭐⭐⭐⭐ 支持 CDN 加速 |
| **扩展性** | ⭐⭐ 单机存储受限 | ⭐⭐⭐⭐⭐ 分布式存储 |
| **成本** | ⭐⭐⭐⭐⭐ 无额外成本 | ⭐⭐⭐ 需要额外存储成本 |
| **安全性** | ⭐⭐⭐ 依赖服务器安全 | ⭐⭐⭐⭐ 权限控制更细粒度 |
| **适用场景** | 中小型项目、MVP | 大型项目、高并发 |

**本项目选择本地存储的原因：**
- 项目处于开发/演示阶段
- 用户量和文件量可控
- 降低部署和维护成本
- 便于快速迭代开发

## 2. 阿里云域名购买与1Panel部署全流程

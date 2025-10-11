# 健康管理系统 - 后端 API

基于 Node.js + Express + TypeScript + MySQL 的 RESTful API 服务

## 技术栈

- **运行环境**: Node.js 18+
- **开发语言**: TypeScript 5.9
- **Web 框架**: Express 5.1
- **数据库**: MySQL 8.0
- **认证方式**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **API 文档**: Swagger (swagger-jsdoc + swagger-ui-express)
- **数据验证**: express-validator + joi
- **日志记录**: morgan
- **包管理器**: pnpm 10.17

## 主要依赖说明

### 生产依赖 (dependencies)

#### 核心框架
- **express** (^5.1.0) - 快速、极简的 Web 框架
  - 用途：创建 HTTP 服务器、路由管理、中间件处理
  - 示例：
    ```typescript
    const app = express()
    app.get('/api/users', (req, res) => { ... })
    ```

#### 数据库
- **mysql2** (^3.15.1) - MySQL 客户端（支持 Promise）
  - 用途：连接 MySQL 数据库、执行 SQL 查询
  - 特点：支持 Prepared Statements、连接池
  - 示例：
    ```typescript
    import mysql from 'mysql2/promise'
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
    ```

#### 安全认证
- **bcryptjs** (^3.0.2) - 密码哈希库
  - 用途：加密用户密码、验证密码
  - 特点：自动加盐、防暴力破解
  - 示例：
    ```typescript
    const hash = await bcrypt.hash(password, 12)
    const isValid = await bcrypt.compare(password, hash)
    ```

- **jsonwebtoken** (^9.0.2) - JWT 令牌生成和验证
  - 用途：用户认证、授权管理
  - 配置：`.env` 中的 `JWT_SECRET` 和 `JWT_EXPIRES_IN`
  - 示例：
    ```typescript
    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' })
    const decoded = jwt.verify(token, JWT_SECRET)
    ```

- **helmet** (^8.1.0) - HTTP 头部安全中间件
  - 用途：设置安全的 HTTP 响应头
  - 防护：XSS、点击劫持、MIME 类型嗅探等
  - 使用：`app.use(helmet())`

- **cors** (^2.8.5) - 跨域资源共享
  - 用途：允许前端跨域访问 API
  - 配置：`.env` 中的 `CORS_ORIGIN`
  - 示例：
    ```typescript
    app.use(cors({
      origin: ['http://localhost:5173'],
      credentials: true
    }))
    ```

#### 数据验证
- **express-validator** (^7.2.1) - Express 验证中间件
  - 用途：请求参数验证、数据清洗
  - 示例：
    ```typescript
    body('username').isLength({ min: 3, max: 50 }),
    body('email').isEmail()
    ```

- **joi** (^18.0.1) - 数据模式验证库
  - 用途：复杂对象验证、Schema 定义
  - 场景：配置验证、业务逻辑验证

#### API 文档
- **swagger-jsdoc** (^6.2.8) - 从 JSDoc 注释生成 OpenAPI 规范
  - 用途：根据代码注释自动生成 API 文档
  - 配置：`src/app.ts` 中的 `swaggerOptions`
  - 示例：
    ```typescript
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: 用户登录
     *     tags: [Auth]
     */
    ```

- **swagger-ui-express** (^5.0.1) - Swagger UI 展示
  - 用途：提供可交互的 API 文档界面
  - 访问：http://localhost:3000/api-docs
  - 功能：在线测试 API、查看参数说明

#### 日志工具
- **morgan** (^1.10.1) - HTTP 请求日志中间件
  - 用途：记录所有 HTTP 请求
  - 输出：控制台 + 日志文件
  - 格式：`combined` (详细日志)、`dev` (开发日志)

#### 环境配置
- **dotenv** (^17.2.3) - 环境变量管理
  - 用途：从 `.env` 文件加载配置
  - 场景：数据库连接、JWT 密钥、端口配置
  - 使用：`dotenv.config()`

### 开发依赖 (devDependencies)

#### TypeScript
- **typescript** (^5.9.3) - TypeScript 编译器
  - 用途：类型检查、编译 TS 到 JS
  - 配置：`tsconfig.json`

- **ts-node** (^10.9.2) - 直接运行 TypeScript
  - 用途：开发时无需编译即可运行
  - 命令：`ts-node src/app.ts`

#### 类型定义
- **@types/express** (^5.0.3) - Express 类型定义
- **@types/cors** (^2.8.19) - CORS 类型定义
- **@types/jsonwebtoken** (^9.0.10) - JWT 类型定义
- **@types/morgan** (^1.9.10) - Morgan 类型定义
- **@types/node** (^24.6.2) - Node.js 类型定义
- **@types/swagger-jsdoc** (^6.0.4) - Swagger JSDoc 类型定义
- **@types/swagger-ui-express** (^4.1.8) - Swagger UI 类型定义

#### 开发工具
- **nodemon** (^3.1.10) - 文件监听和自动重启
  - 用途：代码修改后自动重启服务器
  - 配置：监听 `.ts` 文件变化
  - 命令：`pnpm run dev`

## 项目结构

```
backend/
├── src/
│   ├── app.ts                 # 应用入口
│   ├── config/                # 配置文件
│   │   └── database.ts        # 数据库连接配置
│   ├── controllers/           # 控制器（业务逻辑）
│   │   ├── authController.ts  # 认证控制器
│   │   ├── healthController.ts # 健康记录控制器
│   │   ├── goalsController.ts # 健康目标控制器
│   │   ├── foodController.ts  # 食物管理控制器
│   │   ├── dietController.ts  # 饮食记录控制器
│   │   ├── statsController.ts # 统计数据控制器
│   │   └── adminController.ts # 管理员控制器
│   ├── middleware/            # 中间件
│   │   ├── auth.ts            # JWT 认证中间件
│   │   ├── upload.ts          # 文件上传中间件
│   │   ├── errorHandler.ts   # 错误处理中间件
│   │   └── logger.ts          # 日志中间件
│   ├── routes/                # 路由定义
│   │   ├── authRoutes.ts      # 认证路由
│   │   ├── healthRoutes.ts    # 健康记录路由
│   │   ├── goalsRoutes.ts     # 健康目标路由
│   │   ├── foodRoutes.ts      # 食物管理路由
│   │   ├── dietRoutes.ts      # 饮食记录路由
│   │   ├── statsRoutes.ts     # 统计路由
│   │   └── adminRoutes.ts     # 管理员路由
│   ├── utils/                 # 工具函数
│   └── validators/            # 数据验证规则
├── dist/                      # 编译输出目录
│   ├── *.js                   # 编译后的JS文件
│   └── uploads/               # 上传文件（构建时复制）
├── scripts/                   # 构建脚本
│   └── copy-uploads.js        # 复制uploads到dist
├── uploads/                   # 用户上传文件
│   └── avatars/               # 用户头像
├── logs/                      # 日志文件
├── .env                       # 环境变量配置
├── .env.example               # 环境变量示例
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目配置
```

## 环境配置

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

项目支持多环境配置，包含以下环境文件：

- `.env` - 通用环境变量（已配置）
- `.env.development` - 开发环境配置（已配置）
- `.env.production` - 生产环境配置（已配置）

#### 开发环境 (.env.development)
```env
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_dev_password
DB_NAME=health_management

# JWT配置
JWT_SECRET=your_dev_jwt_secret
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173,http://localhost:8848
```

#### 生产环境 (.env.production)
```env
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=your_production_host
DB_PORT=3306
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=health_management

# JWT配置
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=https://healthmanage.xin
```

**注意**:
- 生产环境配置已设置，CORS_ORIGIN 为 `https://healthmanage.xin`
- 请根据实际部署情况修改数据库配置
- JWT_SECRET 在生产环境应使用强随机字符串

### 3. 初始化数据库

```bash
# 连接 MySQL
mysql -u root -p

# 执行初始化脚本
source /path/to/db/init_database.sql
```

### 4. 启动开发服务器

```bash
pnpm run dev
```

服务器将运行在 http://localhost:3000

## 可用命令

```bash
# 开发模式（自动重启）
pnpm run dev

# 编译 TypeScript 并复制 uploads 目录
pnpm run build

# 生产模式（需先 build）
pnpm run start

# PM2 管理命令
pnpm run pm2:start    # 构建并用PM2启动
pnpm run pm2:stop     # 停止PM2进程
pnpm run pm2:restart  # 重启PM2进程
pnpm run pm2:logs     # 查看PM2日志
pnpm run pm2:kill     # 杀死PM2进程

# 运行测试
pnpm test
```

## API 文档

启动服务器后访问：

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json
- **健康检查**: http://localhost:3000/health

## 主要 API 端点

### 认证模块 (Auth)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 健康记录 (Health)
- `GET /api/health/records` - 获取健康记录列表
- `POST /api/health/records` - 创建健康记录
- `GET /api/health/records/:id` - 获取单条记录
- `PUT /api/health/records/:id` - 更新记录
- `DELETE /api/health/records/:id` - 删除记录

### 健康目标 (Goals)
- `GET /api/goals` - 获取用户健康目标
- `POST /api/goals` - 创建健康目标
- `PUT /api/goals` - 更新健康目标
- `DELETE /api/goals` - 删除健康目标

### 食物管理 (Food)
- `GET /api/foods` - 获取食物列表
- `POST /api/foods` - 创建食物
- `GET /api/foods/:id` - 获取食物详情
- `PUT /api/foods/:id` - 更新食物
- `DELETE /api/foods/:id` - 删除食物

### 饮食记录 (Diet)
- `GET /api/diet/records` - 获取饮食记录
- `POST /api/diet/records` - 创建饮食记录
- `DELETE /api/diet/records/:id` - 删除记录

### 数据统计 (Stats)
- `GET /api/stats/overview` - 获取数据概览
- `GET /api/stats/weight-trend` - 体重趋势
- `GET /api/stats/calorie-trend` - 卡路里趋势
- `GET /api/stats/nutrition-summary` - 营养摘要

### 管理员 (Admin)
- `GET /api/admin/users` - 获取用户列表
- `PATCH /api/admin/users/:id/toggle-status` - 启用/禁用用户

## 认证机制

### JWT Token

所有需要认证的 API 请求需在 Header 中携带 Token：

```
Authorization: Bearer <your_jwt_token>
```

### Token 获取

通过登录接口获取：

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

响应：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

## 错误处理

API 统一返回格式：

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误描述",
  "errors": [ ... ]  // 可选，验证错误时包含
}
```

### HTTP 状态码

- `200 OK` - 请求成功
- `201 Created` - 创建成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器错误

## 数据库说明

### 主要数据表

- **users** - 用户表
- **health_records** - 健康记录表
- **user_goals** - 用户目标表
- **foods** - 食物数据表
- **food_categories** - 食物分类表
- **diet_records** - 饮食记录表
- **system_logs** - 系统日志表

详见数据库设计文档：`/db/数据库设计文档.md`

## 默认账号

### 管理员账号
- 用户名: `admin`
- 密码: `admin123456`
- 角色: `admin`

## 安全特性

1. **密码加密** - bcryptjs + 12轮盐值
2. **JWT 认证** - 7天有效期
3. **SQL 注入防护** - Prepared Statements
4. **XSS 防护** - Helmet 安全头
5. **CORS 配置** - 白名单限制
6. **参数验证** - express-validator
7. **错误日志** - Morgan 日志记录

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 异步函数使用 async/await
- 错误处理使用 try-catch
- 避免使用 `any` 类型

### API 设计
- RESTful 风格
- 统一响应格式
- 完整的 Swagger 注释
- 合理的 HTTP 状态码

### 安全规范
- 敏感信息存储在 `.env`
- 不提交 `.env` 到版本控制
- 定期更新依赖包
- 使用最小权限原则

## 日志说明

### 日志位置
- 访问日志：`logs/access.log`
- 应用日志：控制台输出

### 日志格式
```
::1 - - [05/Oct/2025:04:15:23 +0000] "POST /api/auth/login HTTP/1.1" 200 245
```

## 性能优化

1. **数据库连接池** - mysql2 连接池管理
2. **索引优化** - 主键、外键、常用查询字段
3. **分页查询** - 避免全表查询
4. **缓存策略** - （待实现）Redis 缓存

## 文件上传说明

### 支持的文件上传功能

本系统支持用户头像上传功能，使用 Multer 中间件处理文件上传。

### 上传文件的存储

- **开发环境**: 文件存储在 `uploads/avatars/` 目录
- **生产环境**:
  - 构建时会将 `uploads/` 目录复制到 `dist/uploads/`
  - 静态文件通过 Express static 中间件提供服务
  - 访问路径: `http://your-domain/uploads/avatars/filename.jpg`

### 文件上传配置

**限制说明**:
- 文件大小: 最大 5MB
- 文件类型: jpg, jpeg, png, gif, webp
- 文件命名: `{userId}_{timestamp}.{ext}`

**上传接口**: `POST /api/auth/upload-avatar`

### 部署注意事项

**重要**: 部署到服务器时，确保按以下步骤操作：

1. **构建项目** - `pnpm build` 会自动复制 uploads 目录到 dist
2. **部署 dist 目录** - 整个 dist 目录（包括 uploads）都需要部署
3. **静态文件路径** - 代码中配置的静态文件路径指向 `dist/uploads`

这样即使只部署 dist 目录，头像等上传文件也能正常访问。

## 部署说明

### 生产环境部署

```bash
# 1. 编译 TypeScript（自动复制uploads目录）
pnpm run build

# 2. 设置环境变量
export NODE_ENV=production

# 3. 启动服务
pnpm run start
```

### 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 方式1：使用npm script（推荐）
pnpm run pm2:start

# 方式2：手动启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs health-backend

# 重启服务
pnpm run pm2:restart
```

### 构建流程说明

执行 `pnpm build` 时会自动完成以下步骤：

1. **编译 TypeScript**: 将 `src/` 下的 `.ts` 文件编译为 `.js` 文件到 `dist/`
2. **复制 uploads**: 运行 `scripts/copy-uploads.js` 脚本，将 `uploads/` 目录复制到 `dist/uploads/`
3. **静态文件服务**: 编译后的代码会从 `dist/uploads/` 提供静态文件服务

这样确保部署时只需要 `dist/` 目录，所有必要的文件（代码+上传文件）都包含在内。

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 MySQL 服务是否启动
   - 验证 `.env` 中的数据库配置
   - 确认数据库已创建

2. **JWT 认证失败**
   - 检查 Token 是否过期
   - 验证 `JWT_SECRET` 配置
   - 确认 Authorization Header 格式

3. **端口占用**
   - 修改 `.env` 中的 `PORT` 配置
   - 或杀死占用进程：`lsof -ti:3000 | xargs kill`

## 系统要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- pnpm >= 8.0.0

## 更新日志

### 近期更新 (2025-10)

#### 构建优化
- ✅ 优化构建流程，支持dist目录独立部署
- ✅ 新增 `scripts/copy-uploads.js` 自动复制uploads到dist
- ✅ 修改静态文件路径配置，支持从dist提供服务
- ✅ 更新 `.gitignore`，允许跟踪 `dist/uploads/`

#### 环境配置
- ✅ 添加多环境支持（development/production）
- ✅ 配置生产环境域名：`https://healthmanage.xin`
- ✅ CORS支持前端H5(5173)和管理端(8848)

#### 文件上传
- ✅ 实现用户头像上传功能
- ✅ 使用Multer中间件处理文件上传
- ✅ 支持图片格式：jpg, jpeg, png, gif, webp
- ✅ 文件大小限制：5MB

#### API接口
- ✅ 完善用户认证模块（注册、登录、个人信息）
- ✅ 实现健康记录CRUD操作
- ✅ 添加健康目标管理
- ✅ 实现饮食记录和营养统计
- ✅ 添加数据统计分析功能
- ✅ 实现管理员用户管理

#### 文档完善
- ✅ 更新README，添加详细的依赖说明
- ✅ 完善部署流程文档
- ✅ 添加文件上传功能说明
- ✅ 补充环境配置详细说明

### 待实现功能

- [ ] Redis 缓存支持
- [ ] 数据导出功能
- [ ] 消息通知系统
- [ ] 第三方登录集成
- [ ] 数据备份功能

## License

MIT
test6
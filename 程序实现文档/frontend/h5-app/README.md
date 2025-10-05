# 健康管理 H5 移动端

基于 Vue3 + Vite + Vant4 的移动端健康管理应用

## 技术栈

- **框架**: Vue 3.5 + TypeScript 5.9
- **构建工具**: Vite 7.1
- **UI组件库**: Vant 4.9
- **路由**: Vue Router 4.5
- **状态管理**: Pinia 2.3
- **HTTP客户端**: Axios 1.12
- **移动端适配**: PostCSS + pxtorem + flexible.ts
- **API生成**: @umijs/openapi 1.14

## 主要依赖说明

### 生产依赖 (dependencies)

#### 核心框架
- **vue** (^3.5.22) - Vue.js 核心库，使用 Composition API
  - 用途：构建用户界面
  - 示例：`<script setup lang="ts">` 语法

- **vue-router** (^4.5.1) - 官方路由管理器
  - 用途：页面导航、路由守卫、参数传递
  - 示例：`router.push('/login')`, `const route = useRoute()`

- **pinia** (^2.3.1) - 新一代状态管理库
  - 用途：全局状态存储（用户信息、配置等）
  - 示例：
    ```typescript
    const userStore = useUserStore()
    userStore.setUserInfo(userData)
    ```

#### UI 组件
- **vant** (^4.9.21) - 移动端 UI 组件库
  - 提供：Button、Field、Form、Toast、Dialog 等 60+ 组件
  - 特点：轻量、可靠、支持按需引入
  - 示例：
    ```vue
    <van-button type="primary" @click="submit">提交</van-button>
    <van-field v-model="username" label="用户名" />
    ```

- **@vant/touch-emulator** (^1.4.0) - 触摸模拟器
  - 用途：在 PC 浏览器模拟移动端触摸事件
  - 场景：开发调试时无需真机

#### 网络请求
- **axios** (^1.12.2) - HTTP 请求库
  - 用途：与后端 API 通信
  - 特性：拦截器、自动转换 JSON、取消请求
  - 封装位置：`src/utils/request.ts`
  - 示例：
    ```typescript
    import { postAuthLogin } from '@/api/auth'
    const result = await postAuthLogin({ username, password })
    ```

### 开发依赖 (devDependencies)

#### 构建工具
- **vite** (^7.1.7) - 下一代前端构建工具
  - 特点：极速冷启动（ESM）、HMR 热更新、按需编译
  - 配置：`vite.config.ts`

- **@vitejs/plugin-vue** (^6.0.1) - Vite 的 Vue 插件
  - 用途：解析 .vue 单文件组件
  - 支持：`<script setup>`、`<style scoped>` 等

#### TypeScript
- **typescript** (~5.9.3) - 类型安全的 JavaScript 超集
  - 用途：类型检查、代码提示、重构支持

- **vue-tsc** (^3.1.0) - Vue TypeScript 编译器
  - 用途：构建时进行类型检查
  - 命令：`vue-tsc -b`

- **@types/node** (^24.6.0) - Node.js 类型定义
  - 用途：在 TS 中使用 path、fs 等 Node API

- **tslib** (^2.8.1) - TypeScript 运行时库
  - 用途：减少重复的辅助代码

- **ts-node** (^10.9.2) - 运行 TypeScript 文件
  - 用途：执行 openapi 配置脚本

#### 样式处理
- **sass** (^1.93.2) - CSS 预处理器
  - 用途：变量、嵌套、混入、函数
  - 示例：
    ```scss
    $primary-color: #1989fa;
    .container {
      .title { color: $primary-color; }
    }
    ```

- **autoprefixer** (^10.4.21) - 自动添加浏览器前缀
  - 示例：`display: flex` → `-webkit-box-flex`

- **postcss-pxtorem** (^6.1.0) - px 转 rem
  - 配置：rootValue=16, 忽略 Vant 组件
  - 示例：`width: 32px` → `width: 2rem`

- **@types/postcss-pxtorem** (^6.1.0) - postcss-pxtorem 类型定义

#### 组件自动导入
- **unplugin-vue-components** (^29.1.0) - 组件自动导入
  - 用途：无需手动 import，使用即导入
  - 生成：`components.d.ts` 类型文件

- **@vant/auto-import-resolver** (^1.3.0) - Vant 自动导入解析器
  - 配合 unplugin-vue-components 使用
  - 自动按需引入 Vant 组件

#### API 代码生成
- **@umijs/openapi** (^1.14.1) - OpenAPI/Swagger 代码生成器
  - 用途：根据后端 API 文档自动生成 TypeScript 接口
  - 配置：`openapi2ts.config.ts`
  - 命令：`pnpm run openapi`
  - 输出：`src/api/` 目录
  - 优势：类型安全、自动更新、减少手写代码

## 项目特性

- ✅ 375px 设计稿，完美适配移动端
- ✅ PC端居中显示，响应式布局
- ✅ PostCSS自动px转rem，开发更便捷
- ✅ Vant组件按需自动引入
- ✅ TypeScript类型支持
- ✅ 路由懒加载优化性能

## 目录结构

```
h5-app/
├── src/
│   ├── api/                    # API接口（自动生成）
│   │   ├── typings.d.ts        # API类型定义
│   │   ├── auth.ts             # 认证接口
│   │   ├── health.ts           # 健康记录接口
│   │   ├── diet.ts             # 饮食记录接口
│   │   ├── food.ts             # 食物管理接口
│   │   ├── stats.ts            # 数据统计接口
│   │   ├── admin.ts            # 管理员接口
│   │   └── index.ts            # 统一导出
│   ├── assets/                 # 静态资源
│   │   └── vue.svg             # Vue Logo
│   ├── components/             # 公共组件
│   │   └── HelloWorld.vue      # 示例组件
│   ├── router/                 # 路由配置
│   │   └── index.ts            # 路由定义
│   ├── stores/                 # Pinia状态管理
│   │   └── user.ts             # 用户状态管理
│   ├── styles/                 # 全局样式
│   │   ├── global.scss         # 全局样式
│   │   ├── variables.scss      # SCSS变量
│   │   └── mixins.scss         # SCSS混入
│   ├── types/                  # 类型定义
│   │   └── request.ts          # 请求相关类型
│   ├── utils/                  # 全局工具函数
│   │   ├── flexible.ts         # rem适配脚本
│   │   └── request.ts          # axios封装
│   ├── views/                  # 页面组件
│   │   ├── login/              # 登录页
│   │   │   ├── index.vue       # 登录页面主文件
│   │   │   └── utils/          # 页面级工具函数
│   │   │       ├── index.ts    # 统一导出
│   │   │       ├── types.ts    # 类型定义
│   │   │       ├── enums.ts    # 枚举定义
│   │   │       ├── options.ts  # 选项配置
│   │   │       ├── hooks.ts    # 组合式函数
│   │   │       └── tools.ts    # 工具函数
│   │   ├── register/           # 注册页
│   │   │   ├── index.vue
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── types.ts
│   │   │       ├── enums.ts
│   │   │       ├── options.ts
│   │   │       ├── hooks.ts
│   │   │       └── tools.ts
│   │   ├── home/               # 首页-今日概览
│   │   │   ├── index.vue
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── types.ts
│   │   │       ├── enums.ts
│   │   │       ├── options.ts
│   │   │       ├── hooks.ts
│   │   │       └── tools.ts
│   │   ├── health/             # 健康打卡
│   │   │   ├── index.vue
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── types.ts
│   │   │       ├── enums.ts
│   │   │       ├── options.ts
│   │   │       └── hooks.ts
│   │   ├── diet/               # 饮食记录
│   │   │   ├── index.vue
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       ├── types.ts
│   │   │       ├── enums.ts
│   │   │       ├── options.ts
│   │   │       └── hooks.ts
│   │   ├── history/            # 历史记录
│   │   │   ├── index.vue
│   │   │   └── utils/
│   │   │       ├── index.ts
│   │   │       └── types.ts
│   │   └── profile/            # 个人中心
│   │       ├── index.vue
│   │       └── utils/
│   │           ├── index.ts
│   │           └── types.ts
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── env.d.ts                # 环境变量类型定义
├── index.html                  # HTML模板
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
├── openapi2ts.config.ts        # OpenAPI代码生成配置
└── package.json                # 项目配置
```

### 目录说明

#### utils 文件夹职责划分

每个页面的 `utils/` 文件夹采用统一的模块化组织方式：

- **index.ts** - 统一导出入口，便于外部引用
- **types.ts** - TypeScript 类型定义和接口
- **enums.ts** - 枚举常量（如状态码、选项值等）
- **options.ts** - 配置项和选项数据（如下拉框选项、表单配置）
- **hooks.ts** - Vue 组合式函数（如 useLogin、useForm 等）
- **tools.ts** - 纯函数工具（如格式化、验证、计算等）

**示例：登录页 utils 组织**

```typescript
// types.ts - 类型定义
export interface LoginFormData {
  username: string
  password: string
  remember?: boolean
}

// enums.ts - 枚举
export enum LoginErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED'
}

// options.ts - 配置
export const loginFormRules = {
  username: [{ required: true, message: '请输入用户名' }]
}

// tools.ts - 工具函数
export function validateUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value)
}

// hooks.ts - 组合式函数
export function useLogin() {
  const formData = ref<LoginFormData>({ ... })
  const handleLogin = async () => { ... }
  return { formData, handleLogin }
}

// index.ts - 统一导出
export * from './types'
export * from './enums'
export * from './options'
export * from './hooks'
export * from './tools'
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问: http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 页面功能

### 1. 首页 (Home)
- 今日数据概览（体重、运动、睡眠、卡路里）
- 快捷操作入口
- 健康建议展示

### 2. 健康打卡 (Health)
- 日期选择
- 体重记录
- 运动时长记录
- 睡眠时长记录
- 备注信息

### 3. 饮食记录 (Diet)
- 早餐/午餐/晚餐分类
- 食物添加/删除
- 卡路里统计
- 进度条展示

### 4. 历史记录 (History)
- 健康打卡历史
- 饮食记录历史
- Tab切换展示

### 5. 个人中心 (Profile)
- 用户信息展示
- 功能设置入口
- 退出登录

## 移动端适配说明

### rem适配方案

项目使用 PostCSS + flexible.ts 实现移动端适配：

1. **开发时直接写px**: 按照375px设计稿直接写px值
2. **PostCSS自动转换**: 构建时自动将px转换为rem
3. **flexible.ts动态调整**: 运行时根据设备宽度动态设置根字体大小

### 示例

```css
/* 开发时编写 */
.header {
  height: 44px;
  padding: 16px;
  font-size: 18px;
}

/* 自动转换为 */
.header {
  height: 2.75rem;
  padding: 1rem;
  font-size: 1.125rem;
}
```

### 特殊处理

- Vant组件不转换（通过selectorBlackList配置）
- 1px边框不转换（通过minPixelValue配置）
- node_modules不转换

## 响应式布局

### PC端展示
- 375px容器居中
- 添加阴影和圆角
- 两侧留白

### 移动端展示
- 全屏显示
- 无阴影和圆角
- 自适应宽度

## Vite配置要点

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()], // Vant自动导入
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPxToRem({
          rootValue: 16,
          propList: ['*'],
          selectorBlackList: ['.van-'],
        })
      ]
    }
  }
})
```

## 注意事项

1. **开发时**: 直接按照375px设计稿写px值即可
2. **Vant组件**: 不需要手动导入，已配置自动导入
3. **路由跳转**: 使用`router.push()`而非`<router-link>`
4. **状态管理**: 简单状态用ref/reactive，复杂状态用Pinia
5. **类型支持**: 充分利用TypeScript类型提示

## 浏览器支持

- iOS Safari 10+
- Android Chrome 50+
- Chrome 70+
- Firefox 65+
- Safari 12+

## License

MIT

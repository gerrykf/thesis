# 健康管理 H5 移动端

基于 Vue3 + Vite + Vant4 的移动端健康管理应用

## 技术栈

- **框架**: Vue 3.5 + TypeScript
- **构建工具**: Vite 7.1
- **UI组件库**: Vant 4.9
- **路由**: Vue Router 4.5
- **状态管理**: Pinia 2.3
- **HTTP客户端**: Axios 1.12
- **移动端适配**: PostCSS + pxtorem + flexible.ts

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
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── utils/           # 工具函数
│   │   └── flexible.ts  # rem适配脚本
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页-今日概览
│   │   ├── Health.vue   # 健康打卡
│   │   ├── Diet.vue     # 饮食记录
│   │   ├── History.vue  # 历史记录
│   │   └── Profile.vue  # 个人中心
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── style.css        # 全局样式
├── index.html
├── vite.config.ts       # Vite配置
└── package.json
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

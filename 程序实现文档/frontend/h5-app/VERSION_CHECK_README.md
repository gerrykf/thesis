# 版本更新检测功能

## 功能介绍

这是一个用于检测前端代码更新的功能，当检测到新版本时会弹出精美的更新提示弹窗，提醒用户刷新页面以获取最新体验。

## 核心功能

- ✅ 自动检测版本更新（基于 HTML 文件的 script 标签 hash）
- ✅ 可配置轮询间隔（默认 10 秒）
- ✅ 精美的更新提示弹窗
- ✅ 支持用户选择"立即更新"或"暂不更新"
- ✅ 支持深色模式
- ✅ 完整的国际化支持（中文/英文）
- ✅ 开发环境和生产环境都可用（方便调试）

## 文件结构

```
src/
├── hooks/
│   └── useVersionCheck.ts          # 版本检测 Hook
├── components/
│   └── UpdateNotification.vue      # 更新通知弹窗组件
└── App.vue                          # 已集成版本检测
```

## 使用方法

### 1. 基础使用（已在 App.vue 中集成）

```vue
<template>
  <div>
    <!-- 你的应用内容 -->

    <!-- 更新通知弹窗 -->
    <UpdateNotification
      :show="hasUpdate"
      @ignore="ignoreUpdate"
      @update="applyUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { useVersionCheck } from '@/hooks/useVersionCheck'
import UpdateNotification from '@/components/UpdateNotification.vue'

const { hasUpdate, ignoreUpdate, applyUpdate } = useVersionCheck()
</script>
```

### 2. 自定义配置

```typescript
const { hasUpdate, ignoreUpdate, applyUpdate } = useVersionCheck({
  interval: 30000,     // 轮询间隔 30 秒
  immediate: true,     // 立即执行首次检查
  mode: 'hash'         // 使用 hash 模式（推荐）
})
```

### 3. 配置项说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `interval` | `number` | `10000` | 轮询间隔时间（毫秒） |
| `immediate` | `boolean` | `true` | 是否立即执行首次检查 |
| `mode` | `'etag' \| 'hash'` | `'hash'` | 检测模式 |

### 4. 检测模式说明

#### Hash 模式（推荐）✅
- 通过提取 HTML 中的 script 标签 src（包含 hash）来判断版本
- 不依赖服务器配置
- 更可靠，适用于所有部署环境
- **推荐使用**

#### ETag 模式
- 使用 HTTP 响应头的 ETag 字段判断版本
- 需要服务器正确配置 ETag
- 可能被 CDN 或服务器配置影响

## 工作原理

1. **首次加载**：获取当前 HTML 文件的版本标识（script src hash）
2. **定时轮询**：每隔设定时间（默认 10 秒）检查一次
3. **版本对比**：将新获取的版本标识与当前版本对比
4. **弹窗提示**：如果检测到版本变化，弹出更新提示
5. **用户操作**：
   - **立即更新**：刷新页面，加载新版本
   - **暂不更新**：关闭弹窗，继续使用旧版本，并继续轮询

## 调试说明

### 开启版本检查日志

版本检查功能会在控制台输出详细日志：

```
[VersionCheck] 版本检查已启用 (development 环境)
[VersionCheck] 开始轮询检查，间隔 10000ms
[VersionCheck] 当前版本: /assets/index-DoFQ...
```

### 手动触发更新检测

在浏览器控制台执行以下步骤：

1. 修改代码并重新构建
2. 等待 10 秒（或你设置的轮询间隔）
3. 观察控制台输出：
   ```
   [VersionCheck] 检测到新版本!
   [VersionCheck] 旧版本: /assets/index-DoFQ...
   [VersionCheck] 新版本: /assets/index-XYZ123...
   ```
4. 更新弹窗会自动显示

### 快速测试

如果想立即测试，可以修改轮询间隔为更短的时间（如 5 秒）：

```typescript
// src/hooks/useVersionCheck.ts
const {
  interval = 5000, // 改为 5 秒
  // ...
} = options;
```

## 生产环境配置

### 仅在生产环境启用

如果只想在生产环境启用版本检查，修改 `useVersionCheck.ts`：

```typescript
// 组件挂载时开始轮询
onMounted(() => {
  // 只在生产环境启用
  if (import.meta.env.MODE === "production") {
    startPolling();
    console.log(`[VersionCheck] 版本检查已启用 (${import.meta.env.MODE} 环境)`);
  } else {
    console.log("[VersionCheck] 开发环境，跳过版本检查");
  }
});
```

### 推荐的生产环境配置

```typescript
const { hasUpdate, ignoreUpdate, applyUpdate } = useVersionCheck({
  interval: 30000,     // 30 秒检查一次
  immediate: true,     // 页面加载后立即检查
  mode: 'hash'         // 使用 hash 模式
})
```

## 国际化支持

已添加的国际化 key：

```json
{
  "xin-ban-ben-yi-fa-bu": "新版本已发布",
  "fa-xian-xin-ban-ben-qing-shua-xin-ye-mian-yi-huo-qu-zui-xin-ti-yan": "发现新版本，请刷新页面以获取最新体验！",
  "zan-bu-geng-xin": "暂不更新",
  "li-ji-geng-xin": "立即更新",
  "zheng-zai-geng-xin": "正在更新...",
  "geng-xin-ke-neng-xu-yao-ji-miao-zhong": "更新可能需要几秒钟！"
}
```

## 样式定制

### 修改弹窗主题色

在 `UpdateNotification.vue` 中修改渐变色：

```scss
.update-icon {
  .icon-wrapper {
    background: linear-gradient(
      135deg,
      var(--gradient-primary-start) 0%,
      var(--gradient-primary-end) 100%
    );
  }
}
```

### 修改动画效果

```scss
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

## API 文档

### useVersionCheck()

返回值：

```typescript
{
  hasUpdate: Ref<boolean>,           // 是否有更新
  checking: Ref<boolean>,            // 是否正在检查
  checkVersion: () => Promise<void>, // 手动检查版本
  startPolling: () => void,          // 开始轮询
  stopPolling: () => void,           // 停止轮询
  ignoreUpdate: () => void,          // 忽略本次更新
  applyUpdate: () => void            // 应用更新（刷新页面）
}
```

### UpdateNotification 组件

Props：

```typescript
{
  show: boolean  // 是否显示弹窗
}
```

Events：

```typescript
{
  ignore: () => void  // 用户点击"暂不更新"
  update: () => void  // 用户点击"立即更新"
}
```

## 注意事项

1. **轮询间隔**：不建议设置过短的轮询间隔（< 10秒），避免频繁请求影响性能
2. **服务器配置**：确保服务器正确配置了缓存策略，避免 HTML 文件被缓存
3. **用户体验**：更新提示弹窗会强制用户做出选择（点击遮罩层不会关闭）
4. **开发调试**：目前配置为开发环境也启用，方便调试，上线前可改为仅生产环境启用

## 常见问题

### Q: 为什么检测不到更新？

A: 可能的原因：
1. HTML 文件被浏览器缓存
2. 服务器返回了缓存的 HTML
3. 构建后的 hash 没有变化（代码没有实际修改）

解决方法：
- 检查服务器的缓存配置
- 确保 HTML 文件设置了正确的 Cache-Control
- 使用 Chrome DevTools 的 "Disable cache" 选项

### Q: 如何测试版本更新？

A:
1. 修改任意源代码
2. 重新执行 `npm run build`
3. 部署新版本到服务器
4. 在旧版本页面等待轮询触发
5. 观察更新弹窗

### Q: 可以禁用版本检查吗？

A: 可以，在 `App.vue` 中注释掉相关代码：

```vue
<!-- 注释掉这部分 -->
<!--
<UpdateNotification
  :show="hasUpdate"
  @ignore="ignoreUpdate"
  @update="applyUpdate"
/>
-->
```

## 更新日志

- **2025-01-XX**: 初始版本
  - 支持 Hash 和 ETag 两种检测模式
  - 精美的更新提示弹窗
  - 完整的国际化支持
  - 开发环境和生产环境都可用

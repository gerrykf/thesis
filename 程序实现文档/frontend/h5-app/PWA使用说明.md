# PWA (Progressive Web App) 使用说明

## 功能概述

本应用已支持 PWA（渐进式 Web 应用）功能，用户可以将应用安装到设备主屏幕，获得类似原生应用的体验。

## 主要特性

### ✅ 已实现功能

1. **安装提示**
   - 自动检测浏览器是否支持 PWA 安装
   - 用户首次访问应用 3 秒后显示安装提示
   - 精美的安装引导 UI，包含应用图标、功能介绍
   - 支持"立即安装"和"稍后再说"选项

2. **智能提醒机制**
   - 用户选择"稍后再说"后，7 天内不再显示提示
   - 已安装用户自动隐藏安装提示
   - 支持跨标签页状态同步

3. **应用配置 (manifest.json)**
   - 应用名称：健康管理系统
   - 显示模式：独立窗口（standalone）
   - 主题颜色：#1989fa（科技蓝）
   - 方向锁定：竖屏（portrait）
   - 支持应用图标和启动画面

4. **响应式设计**
   - 移动端：底部滑出式提示卡片
   - 桌面端：居中弹窗式提示
   - 支持暗黑模式适配

5. **国际化支持**
   - 中文和英文双语支持
   - 所有提示文本均支持多语言切换

## 文件结构

```
h5-app/
├── public/
│   ├── manifest.json                 # PWA 配置文件
│   ├── pwa-icon-192.png             # 应用图标 192x192 (待替换)
│   └── pwa-icon-512.png             # 应用图标 512x512 (待替换)
├── src/
│   ├── components/
│   │   └── PwaInstallPrompt.vue     # PWA 安装提示组件
│   ├── App.vue                      # 主应用（已集成提示组件）
│   └── locales/
│       ├── zh-CN.json               # 中文国际化文本
│       └── en-US.json               # 英文国际化文本
└── index.html                       # 已添加 manifest 和 meta 标签
```

## 配置说明

### 1. manifest.json

```json
{
  "name": "健康管理系统",
  "short_name": "健康管理",
  "description": "智能健康管理与饮食追踪应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1989fa",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/pwa-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/pwa-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**配置说明：**
- `display: "standalone"`: 独立窗口模式，隐藏浏览器 UI
- `orientation: "portrait"`: 锁定为竖屏模式
- `theme_color`: 状态栏颜色
- `icons`: 支持 `any` 和 `maskable` 两种用途，确保在所有平台显示正常

### 2. 核心代码说明

**PwaInstallPrompt.vue 组件核心逻辑：**

```typescript
// 检测是否应该显示提示
function shouldShowPrompt(): boolean {
  // 1. 检查是否已经是PWA模式
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return false;
  }

  // 2. 检查iOS设备独立模式
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = (window.navigator as any).standalone;
  if (isIOS && isInStandaloneMode) {
    return false;
  }

  // 3. 检查用户是否最近关闭过提示（7天内）
  const dismissedTime = localStorage.getItem(STORAGE_KEY);
  if (dismissedTime) {
    const timePassed = Date.now() - parseInt(dismissedTime);
    if (timePassed < DISMISS_DURATION) {
      return false;
    }
  }

  return true;
}

// 处理安装
async function handleInstall() {
  if (!deferredPrompt.value) return;

  // 触发浏览器安装提示
  deferredPrompt.value.prompt();

  // 等待用户响应
  const { outcome } = await deferredPrompt.value.userChoice;

  console.log(`PWA安装结果: ${outcome}`);
  deferredPrompt.value = null;
  showPrompt.value = false;
}
```

## 图标替换指南

### 📦 需要替换的图标文件

在 `public/` 目录下创建或替换以下图标文件：

1. **pwa-icon-192.png** (192x192 像素)
   - 用途：主屏幕图标、任务切换器
   - 格式：PNG，透明背景
   - 建议：使用圆角矩形或圆形图标

2. **pwa-icon-512.png** (512x512 像素)
   - 用途：启动画面、应用商店
   - 格式：PNG，透明背景
   - 建议：高质量图标，清晰锐利

### 🎨 图标设计建议

1. **图标内容**
   - 使用应用的核心标识（如心形+十字医疗标志）
   - 简洁明了，易于识别
   - 避免过多文字

2. **颜色方案**
   - 主色：#1989fa（科技蓝）
   - 辅助色：白色
   - 背景：可以是纯色或渐变

3. **maskable 图标**
   - 确保重要内容在中心 80% 的安全区域内
   - 四周留有适当的边距（至少 10%）

### 🔧 在线图标生成工具

推荐使用以下工具生成 PWA 图标：

1. **PWA Asset Generator**
   - 网址：https://www.pwabuilder.com/imageGenerator
   - 功能：上传一张图片自动生成全套 PWA 图标

2. **RealFaviconGenerator**
   - 网址：https://realfavicongenerator.net/
   - 功能：生成多平台适配图标

3. **Figma / Sketch / Adobe XD**
   - 使用设计工具手动创建，导出为 PNG

### 📝 替换步骤

1. 准备好 512x512 的高质量图标源文件
2. 使用在线工具或图像编辑软件生成不同尺寸
3. 将生成的图标文件放入 `public/` 目录
4. 确保文件名与 `manifest.json` 中配置一致
5. 测试图标在不同设备上的显示效果

## 浏览器兼容性

### ✅ 完全支持
- **Chrome/Edge** (79+): 完整的 PWA 支持，包括安装提示
- **Safari** (iOS 11.3+, macOS): 支持添加到主屏幕，需手动操作
- **Firefox** (79+): 支持 PWA 安装
- **Samsung Internet** (4.0+): 完整支持

### ⚠️ 部分支持
- **Safari (iOS)**:
  - 不支持 `beforeinstallprompt` 事件
  - 需要用户手动通过"分享"→"添加到主屏幕"
  - 组件会自动隐藏安装提示

### ❌ 不支持
- IE 11 及更早版本
- 旧版本浏览器（Chrome < 79）

## iOS 设备安装指南

由于 iOS Safari 不支持自动安装提示，用户需要手动安装：

### 安装步骤：

1. 在 Safari 浏览器中打开应用
2. 点击底部工具栏的"分享"按钮 📤
3. 滑动找到"添加到主屏幕"
4. 编辑应用名称（可选）
5. 点击"添加"

安装后，应用图标会出现在主屏幕上，点击即可快速启动。

## 测试指南

### 本地测试

1. **HTTPS 要求**
   ```bash
   # PWA 需要 HTTPS 环境（localhost 除外）
   npm run dev  # 开发环境可以使用 http://localhost
   ```

2. **Chrome DevTools 测试**
   - 打开 Chrome DevTools
   - 切换到 "Application" 标签
   - 左侧选择 "Manifest" 检查配置
   - 左侧选择 "Service Workers" 检查服务状态

3. **安装提示测试**
   ```javascript
   // 在控制台清除安装记录
   localStorage.removeItem('pwa_install_prompt_dismissed');
   // 刷新页面，3秒后应显示安装提示
   ```

### 生产环境部署

1. **确保 HTTPS**
   ```nginx
   # Nginx 配置示例
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           root /path/to/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

2. **正确的 MIME 类型**
   ```nginx
   location ~ \.json$ {
       add_header Content-Type application/json;
   }
   ```

3. **缓存策略**
   ```nginx
   # manifest.json 不缓存，确保及时更新
   location = /manifest.json {
       add_header Cache-Control "no-cache, no-store, must-revalidate";
   }

   # 图标文件可以长期缓存
   location ~* \.(png|jpg|jpeg|svg|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## 用户体验优化建议

### 1. 首次加载优化
- ✅ 已实现 3 秒延迟显示，避免打扰用户
- 建议：在用户完成首次核心操作后再显示提示

### 2. 提示时机
- ✅ 当前在应用启动后 3 秒显示
- 可优化：在用户浏览 2-3 个页面后显示
- 可优化：在用户完成首次打卡后显示

### 3. 视觉设计
- ✅ 响应式设计，适配移动端和桌面端
- ✅ 精美的动画效果
- ✅ 暗黑模式适配

## 常见问题

### Q1: 安装提示不显示？
**可能原因：**
- 已经在 PWA 模式下运行
- 7 天内用户点击过"稍后再说"
- 浏览器不支持（如 iOS Safari）
- 不在 HTTPS 环境下

**解决方法：**
```javascript
// 清除本地记录并刷新
localStorage.removeItem('pwa_install_prompt_dismissed');
location.reload();
```

### Q2: iOS 设备为什么没有安装提示？
**答：** iOS Safari 不支持 `beforeinstallprompt` 事件，组件会自动检测并隐藏提示。iOS 用户需要手动通过"添加到主屏幕"安装。

### Q3: 如何卸载 PWA？
**Android/Chrome:**
1. 长按应用图标
2. 选择"应用信息"
3. 点击"卸载"

**iOS:**
1. 长按应用图标
2. 点击"删除 App"

### Q4: 图标显示不正确？
**检查清单：**
- [ ] 图标文件路径是否正确
- [ ] 图标尺寸是否符合要求（192x192, 512x512）
- [ ] manifest.json 配置是否正确
- [ ] 清除浏览器缓存后重试

## 性能指标

PWA 应用应达到以下性能标准：

- ⚡ **首次内容绘制 (FCP)**: < 1.8s
- ⚡ **最大内容绘制 (LCP)**: < 2.5s
- ⚡ **首次输入延迟 (FID)**: < 100ms
- ⚡ **累积布局偏移 (CLS)**: < 0.1

使用 Chrome Lighthouse 进行测试：
1. 打开 Chrome DevTools
2. 切换到 "Lighthouse" 标签
3. 选择 "Progressive Web App"
4. 点击 "Generate report"

## 下一步优化方向

### 🔄 Service Worker（计划中）
- 离线缓存策略
- 后台同步
- 推送通知

### 📱 更多平台适配
- Android App Bundle
- Windows 11 PWA 支持
- macOS 应用商店

### 🎯 高级功能
- 安装后引导教程
- 更新提示机制
- 分享功能集成

## 技术支持

如遇到问题或需要帮助，请联系开发团队或查阅以下资源：

- PWA 官方文档：https://web.dev/progressive-web-apps/
- MDN Web Docs：https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- Google Workbox：https://developers.google.com/web/tools/workbox

---

**最后更新：** 2025-01-30
**版本：** 1.0.0

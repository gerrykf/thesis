# 样式系统使用指南

## 目录结构

```
styles/
├── variables.scss   # 设计变量（颜色、字体、间距等）
├── mixins.scss      # SCSS混入（可复用的样式函数）
├── global.scss      # 全局样式和工具类
└── README.md        # 本文件
```

## 1. 设计变量 (variables.scss)

### 颜色系统
```scss
$primary-color: #1989fa;      // 主色调
$success-color: #07c160;      // 成功/辅色
$warning-color: #ff976a;      // 警告色
$danger-color: #ee0a24;       // 危险色
$text-color: #323233;         // 主文本色
$text-color-2: #646566;       // 次要文本色
```

### 间距系统 (8px基础单位)
```scss
$space-xs: 8px;
$space-sm: 12px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;
```

### 圆角系统 (4px基础单位)
```scss
$radius-xs: 4px;
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
```

### 字体系统
```scss
$font-size-base: 16px;        // 基础字号
$font-size-lg: 18px;
$font-size-xl: 20px;
```

## 2. SCSS混入 (mixins.scss)

### Flex布局
```scss
@include flex-center;         // 居中对齐
@include flex-between;        // 两端对齐
@include flex-start;          // 左对齐
@include flex-column;         // 纵向排列
```

### 文本省略
```scss
@include ellipsis(1);         // 单行省略
@include ellipsis(2);         // 两行省略
@include ellipsis(3);         // 三行省略
```

### 卡片样式
```scss
@include card($space-md, $radius-md);  // 标准卡片
@include card(20px, 12px);             // 自定义内边距和圆角
```

### 渐变背景
```scss
@include gradient-bg(#667eea, #764ba2);           // 默认135度
@include gradient-bg(#667eea, #764ba2, 90deg);    // 自定义角度
```

### 按钮样式
```scss
@include button-primary;      // 主按钮样式
@include button-secondary;    // 次要按钮样式
```

### 响应式断点
```scss
@include mobile {             // 移动端 (<= 768px)
  // 样式
}

@include pc {                 // PC端 (>= 769px)
  // 样式
}
```

### 其他实用混入
```scss
@include absolute-center;     // 绝对定位居中
@include safe-area-bottom;    // 安全区域适配
@include scrollbar;           // 自定义滚动条
@include skeleton-loading;    // 骨架屏动画
```

## 3. 全局工具类 (global.scss)

### Flex布局
```html
<div class="flex-center">居中</div>
<div class="flex-between">两端对齐</div>
<div class="flex-column">纵向</div>
```

### 文本省略
```html
<div class="ellipsis-1">单行省略</div>
<div class="ellipsis-2">两行省略</div>
```

### 间距工具类
```html
<!-- Margin -->
<div class="m-md">margin: 16px</div>
<div class="mt-lg">margin-top: 24px</div>
<div class="mb-sm">margin-bottom: 12px</div>

<!-- Padding -->
<div class="p-md">padding: 16px</div>
<div class="pt-lg">padding-top: 24px</div>
<div class="pb-xl">padding-bottom: 32px</div>
```

### 文本对齐
```html
<div class="text-left">左对齐</div>
<div class="text-center">居中</div>
<div class="text-right">右对齐</div>
```

### 字体大小
```html
<span class="text-xs">10px</span>
<span class="text-sm">12px</span>
<span class="text-base">16px</span>
<span class="text-lg">18px</span>
```

### 文本颜色
```html
<span class="text-primary">主色</span>
<span class="text-success">成功色</span>
<span class="text-danger">危险色</span>
<span class="text-secondary">次要文本</span>
```

### 背景颜色
```html
<div class="bg-primary">主色背景</div>
<div class="bg-white">白色背景</div>
<div class="bg-gray">灰色背景</div>
```

### 圆角
```html
<div class="radius-xs">4px圆角</div>
<div class="radius-sm">8px圆角</div>
<div class="radius-md">12px圆角</div>
<div class="radius-round">圆形</div>
```

### 阴影
```html
<div class="shadow-sm">小阴影</div>
<div class="shadow-md">中阴影</div>
<div class="shadow-lg">大阴影</div>
```

## 4. 在组件中使用

### Vue组件中使用SCSS变量和混入

```vue
<template>
  <div class="my-component">
    <div class="header">标题</div>
    <div class="content">内容</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.my-component {
  padding: $space-md;

  .header {
    @include flex-between;
    height: 44px;
    font-size: $font-size-lg;
    color: $primary-color;
  }

  .content {
    @include card;
    margin-top: $space-md;

    @include mobile {
      padding: $space-sm;
    }
  }
}
</style>
```

### 使用全局工具类

```vue
<template>
  <div class="flex-between p-md">
    <span class="text-lg text-primary">标题</span>
    <button class="radius-sm bg-primary">按钮</button>
  </div>
</template>

<style scoped>
/* 无需导入，工具类已全局注册 */
</style>
```

## 5. 最佳实践

### ✅ 推荐做法

1. **优先使用设计变量**
```scss
// Good
color: $primary-color;
padding: $space-md;
border-radius: $radius-sm;

// Bad
color: #1989fa;
padding: 16px;
border-radius: 8px;
```

2. **复用SCSS混入**
```scss
// Good
@include flex-center;
@include ellipsis(2);

// Bad
display: flex;
align-items: center;
justify-content: center;
```

3. **组合使用工具类**
```html
<!-- Good -->
<div class="flex-between p-md bg-white radius-md">

<!-- Bad -->
<div style="display: flex; padding: 16px; ...">
```

### ❌ 避免的做法

1. 硬编码颜色、尺寸值
2. 重复编写相同的样式代码
3. 不使用设计系统规范

## 6. 设计规范总结

- **字体**: 系统默认字体，基础字号16px
- **颜色**: 主色#1989fa，辅色#07c160
- **图标**: Vant内置图标，必要时自定义SVG
- **间距**: 8px基础单位 (8, 12, 16, 24, 32...)
- **圆角**: 4px基础单位 (4, 8, 12, 16...)
- **按钮**: 高度44px，圆角8px

## 7. 扩展自定义

如需添加新的变量或混入，请在相应文件中添加并遵循命名规范：

- 变量: `$[category]-[name]` (如 `$color-primary`, `$space-md`)
- 混入: `@mixin [action]-[target]` (如 `@mixin flex-center`)
- 工具类: `.[property]-[value]` (如 `.text-center`, `.m-md`)

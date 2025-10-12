# H5 应用国际化使用指南

## 📋 功能概述

项目已完成国际化配置，支持中英文切换，包括：

- ✅ Vue I18n 集成
- ✅ Vant 组件库国际化
- ✅ 语言切换功能
- ✅ TypeScript 类型支持
- ✅ 本地存储语言设置
- ✅ i18n Ally 插件支持

## 🗂️ 目录结构

```
src/
├── i18n/
│   ├── index.ts           # i18n 主配置文件
│   ├── types.ts           # TypeScript 类型定义
│   └── vant.ts            # Vant 组件库国际化配置
├── locales/
│   ├── zh-CN.json         # 中文语言包
│   └── en-US.json         # 英文语言包
└── components/
    └── LanguageSwitcher.vue  # 语言切换组件
```

## 🚀 使用方法

### 1. 在组件中使用

#### Composition API (推荐)

```vue
<template>
  <div>
    <h1>{{ t('home.welcome') }}</h1>
    <p>{{ t('common.loading') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 切换语言
function switchLanguage(lang: 'zh-CN' | 'en-US') {
  locale.value = lang
}
</script>
```

#### Options API

```vue
<template>
  <div>
    <h1>{{ $t('home.welcome') }}</h1>
  </div>
</template>

<script>
export default {
  methods: {
    switchLanguage(lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
```

### 2. 带参数的翻译

在语言包中定义：
```json
{
  "greeting": "你好，{name}！"
}
```

在组件中使用：
```vue
<template>
  <div>{{ t('greeting', { name: '张三' }) }}</div>
</template>
```

### 3. 复数形式

```json
{
  "items": "没有物品 | 1个物品 | {count} 个物品"
}
```

```vue
<template>
  <div>{{ t('items', count) }}</div>
</template>
```

## 🔧 添加新语言

### 1. 创建语言文件

在 `src/locales/` 目录下创建新的语言文件，如 `ja-JP.json`：

```json
{
  "common": {
    "confirm": "確認",
    "cancel": "キャンセル"
  }
}
```

### 2. 更新配置

修改 `src/i18n/index.ts`：

```typescript
// 导入新语言包
import jaJP from '../locales/ja-JP.json'

// 添加到支持语言列表
export const SUPPORT_LOCALES = ['zh-CN', 'en-US', 'ja-JP'] as const

// 添加显示名称
export const LOCALE_NAMES: Record<SupportLocale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語'
}

// 添加到消息配置
const i18nOptions: I18nOptions = {
  // ...
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP
  }
}
```

### 3. 配置 Vant 语言（如果支持）

修改 `src/i18n/vant.ts`：

```typescript
import jaJP from 'vant/es/locale/lang/ja-JP'

const vantLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP
}
```

## 🌐 语言切换位置

已在以下位置添加语言切换功能：

1. **登录页面** - 右上角显示 LanguageSwitcher 组件
2. **设置页面** - "语言 / Language" 选项，点击弹出语言选择菜单

## 🛠️ VS Code 插件配置

### 安装 i18n Ally

在 VS Code 中搜索安装 `i18n Ally` 插件。

### 配置说明

已创建配置文件：
- `.vscode/settings.json` - i18n Ally 配置
- `.vscode/i18n-ally-custom-framework.yml` - 自定义框架配置

### 主要功能

- **内联翻译预览**：在代码中直接显示翻译文本
- **快速跳转**：点击 key 跳转到语言文件
- **自动提取**：选中文本自动提取到语言包
- **在线翻译**：支持 Google/DeepL 等翻译服务

## 📝 最佳实践

### 1. 命名规范

使用嵌套结构，按模块组织：

```json
{
  "pages": {
    "home": {
      "title": "首页",
      "welcome": "欢迎"
    },
    "profile": {
      "title": "个人中心"
    }
  },
  "common": {
    "confirm": "确认",
    "cancel": "取消"
  }
}
```

### 2. Key 命名建议

- 使用小驼峰命名：`userName`, `submitBtn`
- 或使用点分隔：`user.name`, `button.submit`
- 避免使用整句作为 key

### 3. 占位符使用

```json
{
  "welcome": "欢迎，{name}！今天是 {date}",
  "itemCount": "共 {count} 项"
}
```

### 4. 组件库国际化

Vant 组件的国际化会自动跟随应用语言切换，无需额外配置。

## 🔍 常见问题

### Q: 如何获取当前语言？

```typescript
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
console.log(locale.value) // 'zh-CN'
```

### Q: 如何在 JS/TS 文件中使用翻译？

```typescript
import i18n from '@/i18n'

const message = i18n.global.t('common.confirm')
```

### Q: 翻译缺失时显示什么？

会显示 key 本身，如 `common.notExist`。可在开发环境启用警告：

```typescript
const i18nOptions: I18nOptions = {
  missingWarn: true,
  fallbackWarn: true
}
```

## 📦 依赖包

- `vue-i18n@9` - Vue 3 国际化库
- `vant` - UI 组件库（已包含多语言支持）

## 🔄 下一步

1. 使用 i18n Ally 插件提取现有代码中的中文文案
2. 补充完整的英文翻译
3. 根据业务需求添加更多语言支持
4. 配置自动化翻译流程

## 📚 参考文档

- [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
- [Vant 国际化](https://vant-ui.github.io/vant/#/zh-CN/locale)
- [i18n Ally 使用指南](https://github.com/lokalise/i18n-ally)

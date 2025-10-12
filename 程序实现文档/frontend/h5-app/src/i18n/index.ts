import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'
import { setVantLocale } from './vant'
import './types'

// 支持的语言列表
export const SUPPORT_LOCALES = ['zh-CN', 'en-US'] as const
export type SupportLocale = typeof SUPPORT_LOCALES[number]

// 语言显示名称
export const LOCALE_NAMES: Record<SupportLocale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}

// 默认语言
const DEFAULT_LOCALE: SupportLocale = 'zh-CN'

// 获取浏览器语言
function getBrowserLocale(): SupportLocale {
  const browserLocale = navigator.language
  // 检查是否在支持的语言列表中
  if (SUPPORT_LOCALES.includes(browserLocale as SupportLocale)) {
    return browserLocale as SupportLocale
  }
  // 检查语言代码（例如 'en' 匹配 'en-US'）
  const languageCode = browserLocale.split('-')[0]
  const matchedLocale = SUPPORT_LOCALES.find(locale =>
    locale.startsWith(languageCode||'')
  )
  return matchedLocale || DEFAULT_LOCALE
}

// 获取保存的语言设置
function getSavedLocale(): SupportLocale {
  const saved = localStorage.getItem('locale')
  if (saved && SUPPORT_LOCALES.includes(saved as SupportLocale)) {
    return saved as SupportLocale
  }
  return getBrowserLocale()
}

// 保存语言设置
export function saveLocale(locale: SupportLocale) {
  localStorage.setItem('locale', locale)
}

// i18n 配置
const i18nOptions: I18nOptions = {
  legacy: false, // 使用 Composition API 模式
  locale: getSavedLocale(), // 初始语言
  fallbackLocale: DEFAULT_LOCALE, // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  globalInjection: true, // 全局注入 $t 函数
  missingWarn: false, // 关闭缺失翻译警告
  fallbackWarn: false // 关闭回退警告
}

// 创建 i18n 实例
const i18n = createI18n(i18nOptions)

// 初始化 Vant 语言
setVantLocale(getSavedLocale())

export default i18n

import { Locale } from 'vant'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'
import type { SupportLocale } from './index'

// Vant 语言映射
const vantLocales: Record<SupportLocale, any> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 设置 Vant 语言
export function setVantLocale(locale: SupportLocale) {
  const vantLocale = vantLocales[locale]
  if (vantLocale) {
    Locale.use(locale, vantLocale)
  }
}

// 获取当前 Vant 语言
export function getCurrentVantLocale() {
  return Locale.messages()
}

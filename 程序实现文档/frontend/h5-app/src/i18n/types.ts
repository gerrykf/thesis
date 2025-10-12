// i18n 类型定义
import type zhCN from '../locales/zh-CN.json'

// 消息类型（基于中文语言包）
export type MessageSchema = typeof zhCN

// 为 vue-i18n 提供全局类型
declare module 'vue-i18n' {
  // 定义 i18n 的消息类型
  export interface DefineLocaleMessage extends MessageSchema {}
}

/**
 * Home模块类型定义
 */

/**
 * 健康数据类型
 */
export interface HealthData {
  weight: number
  exercise: number
  sleep: number
  calories: number
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  id?: string
  name: string
  avatar?: string
}

/**
 * 健康建议类型
 */
export interface HealthTip {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * 快捷操作项类型
 */
export interface QuickAction {
  icon: string
  text: string
  path?: string
  action?: () => void
}

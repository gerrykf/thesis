/**
 * Profile个人中心模块类型定义
 */

/**
 * 用户设置类型
 */
export interface UserSettings {
  notifications: boolean
  darkMode: boolean
  language: string
  calorieTarget: number
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  id: string
  title: string
  icon: string
  path?: string
  action?: () => void
}

/**
 * 用户统计数据
 */
export interface UserStats {
  totalDays: number
  avgWeight: number
  avgExercise: number
  avgSleep: number
}

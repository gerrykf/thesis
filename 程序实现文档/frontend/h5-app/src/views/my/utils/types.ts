/**
 * Profile个人中心模块类型定义
 */

/**
 * 个人资料表单数据
 */
export interface ProfileFormData {
  /** 昵称 */
  nickname?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 性别 */
  gender?: 'male' | 'female'
  /** 出生日期 */
  birth_date?: string
  /** 身高(cm) */
  height?: number
  /** 目标体重(kg) */
  target_weight?: number
}

/**
 * 性别选项
 */
export interface GenderOption {
  text: string
  value: 'male' | 'female'
}

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

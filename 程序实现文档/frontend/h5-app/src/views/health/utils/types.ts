/**
 * Health健康打卡模块类型定义
 */

/**
 * 健康打卡表单数据类型
 */
export interface HealthFormData {
  date: string
  weight: string
  exercise: string
  sleep: string
  note: string
}

/**
 * 健康记录类型
 */
export interface HealthRecord {
  id: string
  userId: string
  date: string
  weight: number
  exercise: number
  sleep: number
  note?: string
  bmi?: number
  createdAt: string
  updatedAt: string
}

/**
 * BMI分类类型
 */
export interface BMICategory {
  min: number
  max: number
  label: string
  description: string
  color: string
}

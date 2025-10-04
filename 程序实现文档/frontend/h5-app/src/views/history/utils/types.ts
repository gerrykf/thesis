/**
 * History历史记录模块类型定义
 */

/**
 * 记录类型枚举
 */
export type RecordType = 'health' | 'diet'

/**
 * 健康记录项
 */
export interface HealthRecordItem {
  id: string
  date: string
  weight: number
  exercise: number
  sleep: number
  note?: string
}

/**
 * 饮食记录项
 */
export interface DietRecordItem {
  id: string
  date: string
  calories: number
  meals: {
    breakfast: number
    lunch: number
    dinner: number
  }
}

/**
 * 历史记录查询参数
 */
export interface HistoryQuery {
  type: RecordType
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

/**
 * Goals模块工具函数统一导出
 */

export * from './types'
export * from './enums'
export * from './options'
export * from './hooks'

import type { GoalType, GoalStatus } from './types'
import { goalTypeTextMap, goalStatusTextMap, goalStatusColorMap } from './options'

/**
 * 获取目标类型中文名称
 */
export function getGoalTypeText(type: GoalType): string {
  return goalTypeTextMap[type] || type
}

/**
 * 获取目标状态中文名称
 */
export function getStatusText(status: GoalStatus): string {
  return goalStatusTextMap[status] || status
}

/**
 * 获取目标状态颜色
 */
export function getStatusColor(status: GoalStatus): string {
  return goalStatusColorMap[status] || '#969799'
}

/**
 * 计算目标完成百分比
 */
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 计算剩余天数
 */
export function calculateRemainingDays(targetDate: string): number {
  const today = new Date()
  const target = new Date(targetDate)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Goals模块配置选项
 */

import type { GoalType, GoalStatus } from './types'

/**
 * 目标类型到单位的映射
 */
export const goalTypeUnitMap: Record<GoalType, string> = {
  weight: 'kg',
  exercise: '分钟',
  calories: 'kcal',
  custom: ''
}

/**
 * 目标类型中文名称映射
 */
export const goalTypeTextMap: Record<GoalType, string> = {
  weight: '体重',
  exercise: '运动',
  calories: '卡路里',
  custom: '自定义'
}

/**
 * 目标状态中文名称映射
 */
export const goalStatusTextMap: Record<GoalStatus, string> = {
  active: '进行中',
  completed: '已完成',
  paused: '已暂停',
  cancelled: '已取消'
}

/**
 * 目标状态颜色映射
 */
export const goalStatusColorMap: Record<GoalStatus, string> = {
  active: '#1989fa',
  completed: '#07c160',
  paused: '#ff976a',
  cancelled: '#969799'
}

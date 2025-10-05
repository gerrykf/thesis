/**
 * Goals模块类型定义
 */

/**
 * 目标类型枚举
 */
export type GoalType = 'weight' | 'exercise' | 'calories' | 'custom'

/**
 * 目标状态枚举
 */
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'

/**
 * 用户目标数据（数据库存储）
 */
export interface UserGoal {
  id: number
  user_id: number
  goal_type: GoalType
  goal_name: string
  target_value: number
  current_value: number
  unit: string
  start_date: string
  target_date?: string
  status: GoalStatus
  description?: string
  created_at: string
  updated_at: string
}

/**
 * 创建目标表单数据
 */
export interface CreateGoalFormData {
  goal_type: GoalType
  goal_name: string
  target_value: string
  current_value: string
  unit: string
  start_date: string
  target_date: string
  description: string
}

/**
 * 更新目标表单数据
 */
export interface UpdateGoalFormData {
  goal_name?: string
  target_value?: number
  current_value?: number
  unit?: string
  target_date?: string
  status?: GoalStatus
  description?: string
}

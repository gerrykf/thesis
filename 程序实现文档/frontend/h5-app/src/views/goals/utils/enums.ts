/**
 * Goals模块枚举定义
 */

/**
 * 目标类型枚举
 */
export enum GoalTypeEnum {
  WEIGHT = 'weight',
  EXERCISE = 'exercise',
  CALORIES = 'calories',
  CUSTOM = 'custom'
}

/**
 * 目标状态枚举
 */
export enum GoalStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled'
}

/**
 * Diet模块枚举定义
 */

/**
 * 餐次枚举
 */
export const MealType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
} as const

export type MealType = typeof MealType[keyof typeof MealType]

/**
 * 卡路里摄入状态枚举
 */
export const CalorieStatus = {
  LOW: 'low',           // 偏低 <60%
  INSUFFICIENT: 'insufficient', // 不足 60-80%
  NORMAL: 'normal',     // 正常 80-120%
  HIGH: 'high',         // 偏高 120-150%
  EXCESSIVE: 'excessive' // 过高 >150%
} as const

export type CalorieStatus = typeof CalorieStatus[keyof typeof CalorieStatus]

/**
 * 营养素类型枚举
 */
export const NutrientType = {
  PROTEIN: 'protein',   // 蛋白质
  FAT: 'fat',          // 脂肪
  CARBS: 'carbs',      // 碳水化合物
  FIBER: 'fiber',      // 纤维
  VITAMIN: 'vitamin'   // 维生素
} as const

export type NutrientType = typeof NutrientType[keyof typeof NutrientType]

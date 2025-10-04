/**
 * Diet饮食记录模块类型定义
 */

import type { MealType as MealTypeEnum } from './enums'

export type MealType = MealTypeEnum

/**
 * 食物项类型
 */
export interface Food {
  id?: string
  name: string
  calories: number
  protein?: number
  fat?: number
  carbs?: number
}

/**
 * 餐次记录类型
 */
export interface MealRecord {
  type: MealType
  foods: Food[]
  totalCalories: number
}

/**
 * 饮食记录类型
 */
export interface DietRecord {
  id: string
  userId: string
  date: string
  breakfast: Food[]
  lunch: Food[]
  dinner: Food[]
  snack?: Food[]
  totalCalories: number
  createdAt: string
  updatedAt: string
}

/**
 * 营养统计类型
 */
export interface NutritionStats {
  calories: number
  protein: number
  fat: number
  carbs: number
}

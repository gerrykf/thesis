/**
 * Diet模块工具函数集合
 */

import type { Food, MealType } from './types'
import { mealConfig, commonFoods, calorieTargets } from './options'

/**
 * 格式化日期
 */
export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期数组
 */
export function formatDateArray(dateArray: string[]): string {
  const [year, month, day] = dateArray
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 获取餐次名称
 */
export function getMealTypeName(mealType: MealType): string {
  return mealConfig[mealType]?.name || ''
}

/**
 * 获取餐次图标
 */
export function getMealTypeIcon(mealType: MealType): string {
  return mealConfig[mealType]?.icon || ''
}

/**
 * 计算食物列表总卡路里
 */
export function calculateTotalCalories(foods: Food[]): number {
  return foods.reduce((sum, food) => sum + food.calories, 0)
}

/**
 * 计算卡路里百分比
 */
export function calculateCaloriesPercentage(current: number, target: number = calorieTargets.default): number {
  return Math.min((current / target) * 100, 100)
}

/**
 * 验证食物名称
 */
export function validateFoodName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 50
}

/**
 * 验证卡路里
 */
export function validateCalories(calories: number | string): boolean {
  const num = typeof calories === 'string' ? parseFloat(calories) : calories
  return !isNaN(num) && num > 0 && num <= 10000
}

/**
 * 获取卡路里摄入评价
 */
export function getCaloriesComment(calories: number, target: number = calorieTargets.default): string {
  const percentage = (calories / target) * 100
  if (percentage < 60) return '摄入偏低'
  if (percentage < 80) return '摄入不足'
  if (percentage < 120) return '摄入合理'
  if (percentage < 150) return '摄入偏高'
  return '摄入过高'
}

/**
 * 生成饮食建议
 */
export function generateDietTips(
  totalCalories: number,
  breakfastCalories: number,
  _lunchCalories: number,
  dinnerCalories: number
): string[] {
  const tips: string[] = []

  if (totalCalories < calorieTargets.weightLoss) {
    tips.push('总摄入偏低，注意营养均衡')
  } else if (totalCalories > calorieTargets.muscleGain) {
    tips.push('总摄入偏高，建议适当控制饮食')
  }

  if (totalCalories > 0) {
    const breakfastPercentage = (breakfastCalories / totalCalories) * 100
    if (breakfastPercentage < 20) {
      tips.push('早餐摄入不足，建议增加早餐营养')
    }

    const dinnerPercentage = (dinnerCalories / totalCalories) * 100
    if (dinnerPercentage > 40) {
      tips.push('晚餐摄入偏高，建议晚餐清淡')
    }
  }

  if (breakfastCalories === 0) {
    tips.push('记得吃早餐，早餐很重要哦')
  }

  if (tips.length === 0) {
    tips.push('饮食记录良好，保持健康饮食习惯！')
  }

  return tips
}

/**
 * 搜索食物
 */
export function searchFoods(keyword: string): Food[] {
  if (!keyword.trim()) return []
  return commonFoods.filter(food =>
    food.name.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * 创建空食物对象
 */
export function createEmptyFood(): Food {
  return {
    name: '',
    calories: 0
  }
}

// 导出所有
export * from './types'
export { CalorieStatus, NutrientType } from './enums'
export * from './options'
export * from './hooks'

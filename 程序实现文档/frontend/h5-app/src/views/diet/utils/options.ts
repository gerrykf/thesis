/**
 * Diet模块配置选项
 */

import type { Food, MealType } from './types'

/**
 * 餐次配置
 */
export const mealConfig = {
  breakfast: {
    name: '早餐',
    icon: '🌅',
    recommendedRatio: 0.3 // 建议占总热量的30%
  },
  lunch: {
    name: '午餐',
    icon: '🌞',
    recommendedRatio: 0.4 // 建议占总热量的40%
  },
  dinner: {
    name: '晚餐',
    icon: '🌙',
    recommendedRatio: 0.3 // 建议占总热量的30%
  },
  snack: {
    name: '加餐',
    icon: '🍎',
    recommendedRatio: 0.1 // 建议占总热量的10%
  }
}

/**
 * 推荐食物列表
 */
export const recommendedFoods: Record<MealType, Food[]> = {
  breakfast: [
    { name: '牛奶', calories: 150, protein: 8, fat: 8, carbs: 12 },
    { name: '全麦面包', calories: 170, protein: 6, fat: 2, carbs: 32 },
    { name: '鸡蛋', calories: 80, protein: 7, fat: 5, carbs: 1 },
    { name: '豆浆', calories: 120, protein: 9, fat: 4, carbs: 15 },
    { name: '燕麦粥', calories: 130, protein: 5, fat: 2, carbs: 25 }
  ],
  lunch: [
    { name: '米饭', calories: 200, protein: 4, fat: 1, carbs: 45 },
    { name: '鸡胸肉', calories: 165, protein: 31, fat: 4, carbs: 0 },
    { name: '西兰花', calories: 35, protein: 3, fat: 0, carbs: 7 },
    { name: '番茄炒蛋', calories: 150, protein: 8, fat: 10, carbs: 8 },
    { name: '蔬菜沙拉', calories: 100, protein: 2, fat: 7, carbs: 8 }
  ],
  dinner: [
    { name: '小米粥', calories: 90, protein: 3, fat: 1, carbs: 18 },
    { name: '清蒸鱼', calories: 120, protein: 22, fat: 3, carbs: 0 },
    { name: '炒青菜', calories: 50, protein: 2, fat: 3, carbs: 5 },
    { name: '豆腐汤', calories: 80, protein: 8, fat: 4, carbs: 4 },
    { name: '水果', calories: 60, protein: 1, fat: 0, carbs: 15 }
  ],
  snack: [
    { name: '苹果', calories: 52, protein: 0, fat: 0, carbs: 14 },
    { name: '香蕉', calories: 90, protein: 1, fat: 0, carbs: 23 },
    { name: '坚果', calories: 150, protein: 5, fat: 13, carbs: 6 },
    { name: '酸奶', calories: 100, protein: 5, fat: 3, carbs: 12 }
  ]
}

/**
 * 常见食物数据库
 */
export const commonFoods: Food[] = [
  { name: '白米饭', calories: 200, protein: 4, fat: 1, carbs: 45 },
  { name: '馒头', calories: 220, protein: 7, fat: 1, carbs: 47 },
  { name: '鸡蛋', calories: 80, protein: 7, fat: 5, carbs: 1 },
  { name: '牛奶', calories: 150, protein: 8, fat: 8, carbs: 12 },
  { name: '香蕉', calories: 90, protein: 1, fat: 0, carbs: 23 },
  { name: '苹果', calories: 52, protein: 0, fat: 0, carbs: 14 },
  { name: '鸡胸肉', calories: 165, protein: 31, fat: 4, carbs: 0 },
  { name: '牛肉', calories: 250, protein: 26, fat: 15, carbs: 0 },
  { name: '鱼肉', calories: 120, protein: 22, fat: 3, carbs: 0 },
  { name: '豆腐', calories: 80, protein: 8, fat: 4, carbs: 4 }
]

/**
 * 卡路里目标配置
 */
export const calorieTargets = {
  default: 1500,
  weightLoss: 1200,
  maintenance: 1800,
  muscleGain: 2200
}

/**
 * 营养素推荐比例
 */
export const nutrientRatios = {
  protein: 0.3,  // 蛋白质30%
  fat: 0.3,      // 脂肪30%
  carbs: 0.4     // 碳水40%
}

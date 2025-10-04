/**
 * Health模块工具函数集合
 */

import type { HealthFormData } from './types'
import { validationRules, successMessages, bmiCategories } from './options'

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期数组为字符串
 */
export function formatDateArray(dateArray: string[]): string {
  const [year, month, day] = dateArray
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 获取日期选择器最小日期（一年前）
 */
export function getMinDate(): Date {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  return date
}

/**
 * 获取日期选择器最大日期（今天）
 */
export function getMaxDate(): Date {
  return new Date()
}

/**
 * 验证体重输入
 */
export function validateWeight(weight: string): boolean {
  const num = parseFloat(weight)
  const rule = validationRules.weight
  return !isNaN(num) && num > rule.min && num < rule.max
}

/**
 * 验证运动时长输入
 */
export function validateExercise(exercise: string): boolean {
  if (!exercise) return true
  const num = parseFloat(exercise)
  const rule = validationRules.exercise
  return !isNaN(num) && num >= rule.min && num <= rule.max
}

/**
 * 验证睡眠时长输入
 */
export function validateSleep(sleep: string): boolean {
  if (!sleep) return true
  const num = parseFloat(sleep)
  const rule = validationRules.sleep
  return !isNaN(num) && num >= rule.min && num <= rule.max
}

/**
 * 验证整个表单数据
 */
export function validateFormData(formData: HealthFormData): { valid: boolean; message: string } {
  if (!formData.date) {
    return { valid: false, message: '请选择日期' }
  }

  if (!formData.weight || !validateWeight(formData.weight)) {
    return { valid: false, message: validationRules.weight.message }
  }

  if (formData.exercise && !validateExercise(formData.exercise)) {
    return { valid: false, message: validationRules.exercise.message }
  }

  if (formData.sleep && !validateSleep(formData.sleep)) {
    return { valid: false, message: validationRules.sleep.message }
  }

  return { valid: true, message: '' }
}

/**
 * 计算BMI指数
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

/**
 * 获取BMI评价
 */
export function getBMIComment(bmi: number): string {
  const category = bmiCategories.find(cat => bmi >= cat.min && bmi < cat.max)
  return category?.label || '未知'
}

/**
 * 获取BMI分类
 */
export function getBMICategory(bmi: number) {
  return bmiCategories.find(cat => bmi >= cat.min && bmi < cat.max)
}

/**
 * 生成打卡成功消息
 */
export function generateSuccessMessage(): string {
  const message = successMessages[Math.floor(Math.random() * successMessages.length)]
  return message ?? '打卡成功！'
}

/**
 * 创建空表单数据
 */
export function createEmptyFormData(): HealthFormData {
  return {
    date: formatDate(),
    weight: '',
    exercise: '',
    sleep: '',
    note: ''
  }
}

// 导出所有类型和配置
export * from './types'
export * from './enums'
export * from './options'
export * from './hooks'

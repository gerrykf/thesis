/**
 * Health模块配置选项
 */

import type { BMICategory } from './types'

/**
 * BMI分类配置
 */
export const bmiCategories: BMICategory[] = [
  {
    min: 0,
    max: 18.5,
    label: '偏瘦',
    description: '建议增加营养摄入',
    color: '#ff976a'
  },
  {
    min: 18.5,
    max: 24,
    label: '正常',
    description: '保持当前状态',
    color: '#07c160'
  },
  {
    min: 24,
    max: 28,
    label: '偏胖',
    description: '建议适当控制饮食',
    color: '#ff976a'
  },
  {
    min: 28,
    max: 100,
    label: '肥胖',
    description: '建议增加运动，控制饮食',
    color: '#ee0a24'
  }
]

/**
 * 表单验证规则
 */
export const validationRules = {
  weight: {
    min: 0,
    max: 300,
    message: '请输入有效的体重 (0-300kg)'
  },
  exercise: {
    min: 0,
    max: 1440,
    message: '请输入有效的运动时长 (0-1440分钟)'
  },
  sleep: {
    min: 0,
    max: 24,
    message: '请输入有效的睡眠时长 (0-24小时)'
  }
}

/**
 * 成功提示消息列表
 */
export const successMessages = [
  '打卡成功！坚持就是胜利！',
  '又完成一天的记录，棒棒的！',
  '健康生活，从每日打卡开始！',
  '数据已记录，继续保持！',
  '今日打卡完成，明天继续加油！',
  '你真棒！又坚持了一天！',
  '健康记录已保存，加油！'
]

/**
 * 日期选择器配置
 */
export const datePickerConfig = {
  minDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
  maxDate: new Date()
}

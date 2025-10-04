/**
 * Home模块工具函数
 */

import { greetingConfig, healthScoreConfig } from './options'
import type { HealthData } from './types'

/**
 * 格式化日期为中文格式
 * @param date 待格式化的日期对象，默认为当前日期
 * @returns 中文格式的日期字符串，如"2025年10月4日"
 */
export function formatChineseDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * 获取当前星期几
 * @param date 待查询的日期对象，默认为当前日期
 * @returns 中文格式的星期字符串，如"星期一"
 */
export function getWeekday(date: Date = new Date()): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const day = date.getDay()
  return weekdays[day] ?? '星期日'
}

/**
 * 获取问候语
 * @returns 根据当前时间返回对应的问候语，如"早上好"、"下午好"
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  const config = greetingConfig.find(item => hour >= item.start && hour < item.end)
  return config?.text ?? '你好'
}

/**
 * 计算健康评分
 * @param data 健康数据对象，包含体重、运动、睡眠、卡路里等指标
 * @returns 综合健康评分，范围0-100
 */
export function calculateHealthScore(data: HealthData): number {
  let score = 0
  const config = healthScoreConfig

  // 体重评分
  if (data.weight >= config.weight.idealMin && data.weight <= config.weight.idealMax) {
    score += config.weight.score
  } else if (data.weight >= config.weight.min && data.weight <= config.weight.max) {
    score += config.weight.score * 0.6
  } else {
    score += config.weight.score * 0.2
  }

  // 运动评分
  if (data.exercise >= config.exercise.recommended) {
    score += config.exercise.score
  } else if (data.exercise >= config.exercise.recommended * 0.5) {
    score += config.exercise.score * 0.6
  } else {
    score += config.exercise.score * 0.2
  }

  // 睡眠评分
  if (data.sleep >= config.sleep.idealMin && data.sleep <= config.sleep.idealMax) {
    score += config.sleep.score
  } else if (data.sleep >= config.sleep.idealMin - 1 && data.sleep <= config.sleep.idealMax + 1) {
    score += config.sleep.score * 0.6
  } else {
    score += config.sleep.score * 0.2
  }

  // 卡路里评分
  if (data.calories >= config.calories.idealMin && data.calories <= config.calories.idealMax) {
    score += config.calories.score
  } else if (data.calories >= config.calories.min && data.calories <= config.calories.max) {
    score += config.calories.score * 0.6
  } else {
    score += config.calories.score * 0.2
  }

  return Math.round(score)
}

/**
 * 获取健康评价
 * @param score 健康评分，范围0-100
 * @returns 健康等级评价，如"优秀"、"良好"、"一般"、"需要改善"
 */
export function getHealthComment(score: number): string {
  if (score >= 80) return '优秀'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  return '需要改善'
}

/**
 * 生成健康建议
 * @param data 健康数据对象，包含体重、运动、睡眠、卡路里等指标
 * @returns 健康建议文本数组，针对不达标的指标提供改善建议
 */
export function generateHealthTips(data: HealthData): string[] {
  const tips: string[] = []
  const config = healthScoreConfig

  if (data.sleep < config.sleep.idealMin) {
    tips.push('睡眠时间不足，建议保证7-8小时睡眠')
  }

  if (data.exercise < config.exercise.recommended) {
    tips.push('运动量偏少，建议每天至少运动30分钟')
  }

  if (data.calories < config.calories.idealMin) {
    tips.push('卡路里摄入过低，注意营养均衡')
  }

  if (data.calories > config.calories.idealMax) {
    tips.push('卡路里摄入过高，注意控制饮食')
  }

  if (data.weight > config.weight.idealMax) {
    tips.push('体重偏高，建议适当控制饮食并增加运动')
  }

  if (data.weight < config.weight.idealMin && data.weight > 0) {
    tips.push('体重偏低，建议增加营养摄入')
  }

  if (tips.length === 0) {
    tips.push('保持良好的生活习惯，继续加油！')
  }

  return tips
}

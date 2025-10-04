/**
 * Home模块配置选项
 */

import type { QuickAction, HealthTip } from './types'

/**
 * 快捷操作列表
 */
export const quickActions: QuickAction[] = [
  {
    icon: 'add-o',
    text: '健康打卡',
    path: '/health'
  },
  {
    icon: 'goods-collect-o',
    text: '饮食记录',
    path: '/diet'
  },
  {
    icon: 'chart-trending-o',
    text: '数据分析',
    path: '/analysis'
  },
  {
    icon: 'setting-o',
    text: '目标设置',
    path: '/settings'
  }
]

/**
 * 默认健康建议列表
 */
export const defaultHealthTips: HealthTip[] = [
  {
    id: '1',
    title: '保持充足睡眠',
    description: '建议每天睡眠7-8小时',
    icon: 'smile-o'
  },
  {
    id: '2',
    title: '适量运动',
    description: '每天至少运动30分钟',
    icon: 'fire-o'
  },
  {
    id: '3',
    title: '均衡饮食',
    description: '多吃蔬菜水果，少油少盐',
    icon: 'gift-o'
  }
]

/**
 * 健康评分配置
 */
export const healthScoreConfig = {
  weight: {
    min: 40,
    max: 100,
    idealMin: 60,
    idealMax: 70,
    score: 25
  },
  exercise: {
    min: 0,
    recommended: 30,
    score: 25
  },
  sleep: {
    min: 0,
    max: 24,
    idealMin: 7,
    idealMax: 8,
    score: 25
  },
  calories: {
    min: 800,
    max: 3000,
    idealMin: 1500,
    idealMax: 2000,
    score: 25
  }
}

/**
 * 问候语配置
 */
export const greetingConfig = [
  { start: 0, end: 6, text: '夜深了' },
  { start: 6, end: 9, text: '早上好' },
  { start: 9, end: 12, text: '上午好' },
  { start: 12, end: 14, text: '中午好' },
  { start: 14, end: 18, text: '下午好' },
  { start: 18, end: 22, text: '晚上好' },
  { start: 22, end: 24, text: '夜深了' }
]

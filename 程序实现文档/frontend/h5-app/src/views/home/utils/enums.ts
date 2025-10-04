/**
 * Home模块枚举定义
 */

/**
 * 健康评级枚举
 */
export const HealthRating = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  NORMAL: 'normal',
  POOR: 'poor'
} as const

export type HealthRating = typeof HealthRating[keyof typeof HealthRating]

/**
 * 时段枚举
 */
export const TimeOfDay = {
  DAWN: 'dawn',           // 凌晨 0-6
  MORNING: 'morning',     // 早上 6-9
  FORENOON: 'forenoon',   // 上午 9-12
  NOON: 'noon',           // 中午 12-14
  AFTERNOON: 'afternoon', // 下午 14-18
  EVENING: 'evening',     // 晚上 18-22
  NIGHT: 'night'          // 深夜 22-24
} as const

export type TimeOfDay = typeof TimeOfDay[keyof typeof TimeOfDay]

/**
 * 数据统计周期枚举
 */
export const StatsPeriod = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
} as const

export type StatsPeriod = typeof StatsPeriod[keyof typeof StatsPeriod]

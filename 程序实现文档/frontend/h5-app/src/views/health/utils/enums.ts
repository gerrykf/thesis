/**
 * Health模块枚举定义
 */

/**
 * BMI分类枚举
 */
export const BMILevel = {
  UNDERWEIGHT: 'underweight',  // 偏瘦
  NORMAL: 'normal',             // 正常
  OVERWEIGHT: 'overweight',     // 偏胖
  OBESE: 'obese'                // 肥胖
} as const

export type BMILevel = typeof BMILevel[keyof typeof BMILevel]

/**
 * 运动强度枚举
 */
export const ExerciseIntensity = {
  LIGHT: 'light',       // 轻度 <30分钟
  MODERATE: 'moderate', // 中度 30-60分钟
  HIGH: 'high'          // 高强度 >60分钟
} as const

export type ExerciseIntensity = typeof ExerciseIntensity[keyof typeof ExerciseIntensity]

/**
 * 睡眠质量枚举
 */
export const SleepQuality = {
  POOR: 'poor',         // 差 <6小时
  NORMAL: 'normal',     // 一般 6-7小时
  GOOD: 'good',         // 良好 7-8小时
  EXCELLENT: 'excellent' // 优秀 8-9小时
} as const

export type SleepQuality = typeof SleepQuality[keyof typeof SleepQuality]

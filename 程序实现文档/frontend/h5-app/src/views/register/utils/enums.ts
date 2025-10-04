/**
 * Register模块枚举定义
 */

/**
 * 注册步骤枚举
 */
export const RegisterStep = {
  INFO: 'info',           // 信息填写
  VERIFY: 'verify',       // 验证
  SUCCESS: 'success'      // 完成
} as const

export type RegisterStep = typeof RegisterStep[keyof typeof RegisterStep]

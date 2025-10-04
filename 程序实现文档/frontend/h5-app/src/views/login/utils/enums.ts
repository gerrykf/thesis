/**
 * Login模块枚举定义
 */

/**
 * 登录方式枚举
 */
export const LoginType = {
  PASSWORD: 'password',    // 密码登录
  SMS: 'sms',             // 短信验证码登录
  WECHAT: 'wechat',       // 微信登录
  QQ: 'qq'                // QQ登录
} as const

export type LoginType = typeof LoginType[keyof typeof LoginType]

/**
 * 登录状态枚举
 */
export const LoginStatus = {
  IDLE: 'idle',           // 空闲
  LOADING: 'loading',     // 登录中
  SUCCESS: 'success',     // 成功
  ERROR: 'error'          // 失败
} as const

export type LoginStatus = typeof LoginStatus[keyof typeof LoginStatus]

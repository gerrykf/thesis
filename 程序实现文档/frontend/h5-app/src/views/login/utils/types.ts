/**
 * Login模块类型定义
 */

/**
 * 登录表单数据类型
 */
export interface LoginFormData {
  username: string
  password: string
  remember?: boolean
}

/**
 * 登录响应数据类型
 */
export interface LoginResponse {
  token: string
  userInfo: {
    id: string
    username: string
    nickname?: string
    avatar?: string
  }
}

/**
 * 表单验证结果类型
 */
export interface ValidationResult {
  valid: boolean
  message: string
}

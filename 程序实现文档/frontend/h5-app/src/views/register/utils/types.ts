/**
 * Register模块类型定义
 */

/**
 * 注册表单数据类型
 */
export interface RegisterFormData {
  username: string
  password: string
  confirmPassword: string
  agree: boolean
}

/**
 * 注册响应数据类型
 */
export interface RegisterResponse {
  success: boolean
  message: string
  userId?: string
}

/**
 * 表单验证结果类型
 */
export interface ValidationResult {
  valid: boolean
  message: string
}

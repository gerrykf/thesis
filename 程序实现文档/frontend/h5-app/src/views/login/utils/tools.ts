/**
 * Login模块工具函数
 */

import { validationRules } from './options'
import type { LoginFormData, ValidationResult } from './types'

/**
 * 验证用户名
 * @param username 用户名
 * @returns 验证结果
 */
export function validateUsername(username: string): ValidationResult {
  const rule = validationRules.username

  if (!username) {
    return { valid: false, message: '请输入用户名' }
  }

  if (username.length < rule.minLength || username.length > rule.maxLength) {
    return { valid: false, message: rule.message }
  }

  if (!rule.pattern.test(username)) {
    return { valid: false, message: rule.message }
  }

  return { valid: true, message: '' }
}

/**
 * 验证密码
 * @param password 密码
 * @returns 验证结果
 */
export function validatePassword(password: string): ValidationResult {
  const rule = validationRules.password

  if (!password) {
    return { valid: false, message: '请输入密码' }
  }

  if (password.length < rule.minLength || password.length > rule.maxLength) {
    return { valid: false, message: rule.message }
  }

  return { valid: true, message: '' }
}

/**
 * 验证手机号
 * @param phone 手机号
 * @returns 验证结果
 */
export function validatePhone(phone: string): ValidationResult {
  const rule = validationRules.phone

  if (!phone) {
    return { valid: false, message: '请输入手机号' }
  }

  if (!rule.pattern.test(phone)) {
    return { valid: false, message: rule.message }
  }

  return { valid: true, message: '' }
}

/**
 * 验证验证码
 * @param code 验证码
 * @returns 验证结果
 */
export function validateCode(code: string): ValidationResult {
  const rule = validationRules.code

  if (!code) {
    return { valid: false, message: '请输入验证码' }
  }

  if (!rule.pattern.test(code)) {
    return { valid: false, message: rule.message }
  }

  return { valid: true, message: '' }
}

/**
 * 验证登录表单
 * @param formData 登录表单数据
 * @returns 验证结果
 */
export function validateLoginForm(formData: LoginFormData): ValidationResult {
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.valid) {
    return usernameValidation
  }

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.valid) {
    return passwordValidation
  }

  return { valid: true, message: '' }
}

/**
 * 保存登录信息到本地存储
 * @param token 登录令牌
 * @param remember 是否记住登录
 * @param username 用户名
 * @param password 密码
 */
export function saveLoginInfo(
  token: string,
  remember: boolean = false,
  username?: string,
  password?: string
): void {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('token', token)

  // 如果勾选记住密码，保存用户名和密码
  if (remember && username && password) {
    localStorage.setItem('rememberedUsername', username)
    localStorage.setItem('rememberedPassword', password)
    localStorage.setItem('rememberMe', 'true')
  } else {
    // 如果没有勾选，清除已保存的用户名密码
    localStorage.removeItem('rememberedUsername')
    localStorage.removeItem('rememberedPassword')
    localStorage.removeItem('rememberMe')
  }
}

/**
 * 获取记住的登录信息
 * @returns 记住的用户名和密码
 */
export function getRememberedLoginInfo(): {
  username: string
  password: string
  remember: boolean
} | null {
  const rememberMe = localStorage.getItem('rememberMe') === 'true'

  if (!rememberMe) {
    return null
  }

  const username = localStorage.getItem('rememberedUsername')
  const password = localStorage.getItem('rememberedPassword')

  if (username && password) {
    return {
      username,
      password,
      remember: true
    }
  }

  return null
}

/**
 * 获取登录令牌
 * @returns 登录令牌
 */
export function getToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

/**
 * 清除登录信息
 * @param clearRemembered 是否清除记住的密码，默认 false（保留记住的密码）
 */
export function clearLoginInfo(clearRemembered: boolean = false): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  localStorage.removeItem('userInfo')

  // 只有明确指定时才清除记住的密码
  if (clearRemembered) {
    localStorage.removeItem('rememberedUsername')
    localStorage.removeItem('rememberedPassword')
    localStorage.removeItem('rememberMe')
  }
}

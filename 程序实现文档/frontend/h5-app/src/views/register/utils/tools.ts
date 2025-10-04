/**
 * Register模块工具函数
 */

import { validationRules } from './options'
import type { RegisterFormData, ValidationResult } from './types'

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
 * 验证密码强度
 * @param password 密码
 * @returns 验证结果
 */
export function validatePassword(password: string): ValidationResult {
  const rule = validationRules.password

  if (!password) {
    return { valid: false, message: '请输入密码' }
  }

  if (password.length < rule.minLength || password.length > rule.maxLength) {
    return { valid: false, message: '密码长度必须在6-20位之间' }
  }

  return { valid: true, message: '' }
}

/**
 * 验证确认密码
 * @param password 密码
 * @param confirmPassword 确认密码
 * @returns 验证结果
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, message: '请再次输入密码' }
  }

  if (password !== confirmPassword) {
    return { valid: false, message: '两次输入的密码不一致' }
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
 * 验证注册表单
 * @param formData 注册表单数据
 * @returns 验证结果
 */
export function validateRegisterForm(formData: RegisterFormData): ValidationResult {
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.valid) {
    return usernameValidation
  }

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.valid) {
    return passwordValidation
  }

  const confirmPasswordValidation = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  )
  if (!confirmPasswordValidation.valid) {
    return confirmPasswordValidation
  }

  if (!formData.agree) {
    return { valid: false, message: '请阅读并同意用户协议和隐私政策' }
  }

  return { valid: true, message: '' }
}

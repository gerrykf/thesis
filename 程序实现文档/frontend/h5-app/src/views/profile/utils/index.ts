/**
 * Profile模块工具函数
 */

export * from './types'
export * from './hooks'
import type { GenderOption, ProfileFormData } from './types'

/**
 * 性别选项常量
 */
export const GENDER_OPTIONS: GenderOption[] = [
  { text: '男', value: 'male' },
  { text: '女', value: 'female' }
]

/**
 * 获取性别显示文本
 */
export function getGenderText(gender?: 'male' | 'female'): string {
  if (gender === 'male') return '男'
  if (gender === 'female') return '女'
  return ''
}

/**
 * 验证手机号
 */
export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 格式化日期字符串为数组 (用于日期选择器)
 */
export function parseDateToArray(dateStr?: string): string[] {
  if (!dateStr) {
    const now = new Date()
    return [
      String(now.getFullYear()),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ]
  }

  const date = new Date(dateStr)
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ]
}

/**
 * 格式化日期数组为字符串
 */
export function formatDateArrayToString(dateArray: string[]): string {
  return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`
}

/**
 * 将 API 用户数据转换为表单数据
 */
export function transformUserToFormData(user: API.User): ProfileFormData {
  return {
    nickname: user.nickname,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birth_date: user.birth_date,
    height: user.height,
    target_weight: user.target_weight
  }
}

/**
 * 将表单数据转换为 API 更新请求数据
 */
export function transformFormDataToUpdateRequest(formData: ProfileFormData): API.UpdateProfileRequest {
  return {
    nickname: formData.nickname,
    email: formData.email || undefined,
    phone: formData.phone || undefined,
    gender: formData.gender,
    birth_date: formData.birth_date,
    height: formData.height ? Number(formData.height) : undefined,
    target_weight: formData.target_weight ? Number(formData.target_weight) : undefined
  }
}

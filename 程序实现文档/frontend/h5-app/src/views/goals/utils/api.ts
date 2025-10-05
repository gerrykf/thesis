/**
 * Goals模块API函数
 */

import request from '@/utils/request'
import type { UserGoal, CreateGoalFormData, UpdateGoalFormData } from './types'

/**
 * 获取用户所有目标
 */
export async function getUserGoals(): Promise<UserGoal[]> {
  try {
    const response = await request<{ success: boolean; data: UserGoal[] }>({
      url: '/api/goals',
      method: 'GET'
    })
    return (response.data as any)?.data || []
  } catch (error) {
    console.error('获取用户目标失败:', error)
    return []
  }
}

/**
 * 创建用户目标
 */
export async function createUserGoal(data: CreateGoalFormData): Promise<boolean> {
  try {
    const response = await request<{ success: boolean }>({
      url: '/api/goals',
      method: 'POST',
      data: {
        goal_type: data.goal_type,
        goal_name: data.goal_name,
        target_value: parseFloat(data.target_value),
        current_value: parseFloat(data.current_value),
        unit: data.unit,
        start_date: data.start_date,
        target_date: data.target_date || undefined,
        description: data.description || undefined
      }
    })
    return !!(response.data as any)?.success
  } catch (error) {
    console.error('创建用户目标失败:', error)
    return false
  }
}

/**
 * 更新用户目标
 */
export async function updateUserGoal(id: number, data: UpdateGoalFormData): Promise<boolean> {
  try {
    const response = await request<{ success: boolean }>({
      url: `/api/goals/${id}`,
      method: 'PUT',
      data
    })
    return !!(response.data as any)?.success
  } catch (error) {
    console.error('更新用户目标失败:', error)
    return false
  }
}

/**
 * 删除用户目标
 */
export async function deleteUserGoal(id: number): Promise<boolean> {
  try {
    const response = await request<{ success: boolean }>({
      url: `/api/goals/${id}`,
      method: 'DELETE'
    })
    return !!(response.data as any)?.success
  } catch (error) {
    console.error('删除用户目标失败:', error)
    return false
  }
}

/**
 * Home模块自定义Hooks
 */

import { ref, computed, onMounted } from 'vue'
import type { HealthData } from './types'
import {
  formatChineseDate,
  getWeekday,
  getGreeting,
  calculateHealthScore,
  generateHealthTips
} from './index'

/**
 * 使用日期信息Hook
 */
export function useDateInfo() {
  const currentDate = computed(() => formatChineseDate())
  const weekday = computed(() => getWeekday())
  const greeting = ref(getGreeting())

  // 每分钟更新问候语
  onMounted(() => {
    const timer = setInterval(() => {
      greeting.value = getGreeting()
    }, 60000)

    return () => clearInterval(timer)
  })

  return {
    currentDate,
    weekday,
    greeting
  }
}

/**
 * 使用健康数据Hook
 */
export function useHealthData(initialData?: HealthData) {
  const healthData = ref<HealthData>(initialData || {
    weight: 0,
    exercise: 0,
    sleep: 0,
    calories: 0
  })

  const healthScore = computed(() => calculateHealthScore(healthData.value))
  const healthTips = computed(() => generateHealthTips(healthData.value))

  /**
   * 更新健康数据
   */
  function updateHealthData(data: Partial<HealthData>) {
    healthData.value = { ...healthData.value, ...data }
  }

  /**
   * 重置健康数据
   */
  function resetHealthData() {
    healthData.value = {
      weight: 0,
      exercise: 0,
      sleep: 0,
      calories: 0
    }
  }

  return {
    healthData,
    healthScore,
    healthTips,
    updateHealthData,
    resetHealthData
  }
}

/**
 * 使用今日数据Hook
 */
export function useTodayData() {
  const loading = ref(false)
  const todayData = ref<HealthData>({
    weight: 0,
    exercise: 0,
    sleep: 0,
    calories: 0
  })

  const isDataComplete = computed(() => {
    return todayData.value.weight > 0 &&
           todayData.value.exercise > 0 &&
           todayData.value.sleep > 0 &&
           todayData.value.calories > 0
  })

  /**
   * 加载今日数据
   */
  async function loadTodayData() {
    loading.value = true
    try {
      // 导入 API
      const { getStatsOverview } = await import('@/api/stats')
      const { getHealthRecords } = await import('@/api/health')
      const { getUserGoals } = await import('@/views/goals/utils/api')

      // 获取今日日期（本地时间）
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const today = `${year}-${month}-${day}`

      // 并行请求统计概览、今日健康记录和用户目标
      const [overviewRes, recordsRes, goalsRes] = await Promise.all([
        getStatsOverview({ days: 1 }),
        getHealthRecords({ start_date: today, end_date: today, limit: 1 }),
        getUserGoals()
      ])

      const overview = overviewRes as {
        success?: boolean
        data?: {
          health_records_count?: number
          diet_records_count?: number
          avg_weight?: number
          avg_exercise_duration?: number
          avg_sleep_hours?: number
          total_calories?: number
          avg_daily_calories?: number
        }
      }
      const records = recordsRes as { success?: boolean; data?: { records?: API.HealthRecord[] } }

      // 体重数据优先级：今日健康记录 > 第一条进行中目标的当前体重 > 0
      let weightValue = 0

      // 1. 先从第一条进行中的目标获取当前体重
      if (goalsRes && goalsRes.length > 0) {
        const activeGoal = goalsRes.find(goal => goal.status === 'active')
        if (activeGoal && activeGoal.goal_type === 'weight') {
          weightValue = activeGoal.current_value || 0
        }
      }

      // 2. 如果存在今日健康记录，则覆盖体重数据
      if (records.success && records.data?.records && records.data.records.length > 0) {
        const record = records.data.records[0]
        if (record) {
          if (record.weight) {
            weightValue = record.weight
          }
          todayData.value.exercise = record.exercise_duration || 0
          todayData.value.exercise_type = record.exercise_type || ''
          todayData.value.sleep = record.sleep_hours || 0
          todayData.value.sleep_quality = record.sleep_quality || ''
          todayData.value.mood = record.mood || ''
        }
      }

      todayData.value.weight = weightValue

      // 从统计概览获取卡路里数据
      if (overview.success && overview.data) {
        todayData.value.calories = overview.data.avg_daily_calories || 0
      }
    } catch (error) {
      console.error('加载今日数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据
   */
  function refreshData() {
    loadTodayData()
  }

  onMounted(() => {
    loadTodayData()
  })

  return {
    todayData,
    isDataComplete,
    loadTodayData,
    refreshData,
    loading
  }
}

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
  const todayData = ref<HealthData>({
    weight: 65.5,
    exercise: 30,
    sleep: 8,
    calories: 1200
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
    // TODO: 从API获取今日数据
    // const data = await api.getTodayData()
    // todayData.value = data
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
    refreshData
  }
}

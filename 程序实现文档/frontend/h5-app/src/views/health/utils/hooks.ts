/**
 * Health模块自定义Hooks
 */

import { ref, computed } from 'vue'
import type { HealthFormData } from './types'
import { validateFormData, formatDate, createEmptyFormData } from './index'
import { getHealthRecords } from '@/api/health'

/**
 * 使用健康表单Hook
 */
export function useHealthForm() {
  const formData = ref<HealthFormData>(createEmptyFormData())
  const isSubmitting = ref(false)

  /**
   * 验证表单
   */
  const validation = computed(() => validateFormData(formData.value))

  /**
   * 重置表单
   */
  function resetForm() {
    formData.value = createEmptyFormData()
  }

  /**
   * 设置表单数据
   */
  function setFormData(data: Partial<HealthFormData>) {
    formData.value = { ...formData.value, ...data }
  }

  return {
    formData,
    isSubmitting,
    validation,
    resetForm,
    setFormData
  }
}

/**
 * 使用日期选择Hook
 */
export function useDatePicker() {
  const showPicker = ref(false)
  const selectedDate = ref(formatDate())
  const currentDate = ref([
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  ])

  /**
   * 打开日期选择器
   */
  function openPicker() {
    showPicker.value = true
  }

  /**
   * 关闭日期选择器
   */
  function closePicker() {
    showPicker.value = false
  }

  /**
   * 确认日期选择
   */
  function confirmDate(dateArray: number[]) {
    const [year, month, day] = dateArray
    selectedDate.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    closePicker()
  }

  return {
    showPicker,
    selectedDate,
    currentDate,
    openPicker,
    closePicker,
    confirmDate
  }
}

/**
 * 使用历史记录列表Hook
 */
export function useHistoryList() {
  const records = ref<API.HealthRecord[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const page = ref(1)
  const pageSize = 15
  const total = ref(0)

  /**
   * 加载历史记录
   */
  async function loadRecords() {
    if (finished.value && !refreshing.value) return

    loading.value = true
    try {
      const response = await getHealthRecords({
        page: page.value,
        limit: pageSize
      })

      const data = (response as any).data
      if (data && data.records) {
        const newRecords = data.records as API.HealthRecord[]

        if (refreshing.value) {
          records.value = newRecords
          refreshing.value = false
        } else {
          records.value.push(...newRecords)
        }

        total.value = data.total || 0

        // 判断是否还有更多数据
        if (records.value.length >= total.value) {
          finished.value = true
        } else {
          page.value++
        }
      } else {
        finished.value = true
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
      finished.value = true
    } finally {
      loading.value = false
    }
  }

  /**
   * 下拉刷新
   */
  async function onRefresh() {
    page.value = 1
    finished.value = false
    refreshing.value = true
    records.value = []
    await loadRecords()
  }

  /**
   * 删除记录
   */
  function removeRecord(id: number) {
    const index = records.value.findIndex(r => r.id === id)
    if (index > -1) {
      records.value.splice(index, 1)
      total.value--
    }
  }

  return {
    records,
    loading,
    finished,
    refreshing,
    total,
    loadRecords,
    onRefresh,
    removeRecord
  }
}

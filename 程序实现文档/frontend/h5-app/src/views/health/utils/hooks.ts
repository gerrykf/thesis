/**
 * Health模块自定义Hooks
 */

import { ref, computed } from 'vue'
import type { HealthFormData } from './types'
import { validateFormData, formatDate, createEmptyFormData } from './index'

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

/**
 * History历史记录模块自定义Hooks
 */

import { ref } from 'vue'
import { getHealthRecords } from '@/api/health'
import { getDietRecords } from '@/api/diet'

/**
 * 使用健康记录列表Hook
 */
export function useHealthRecords() {
  const records = ref<API.HealthRecord[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const page = ref(1)
  const pageSize = 15
  const total = ref(0)

  // 日期筛选参数
  const startDate = ref<string>('')
  const endDate = ref<string>('')

  /**
   * 加载健康记录
   */
  async function loadRecords() {
    // 如果已经加载完成或正在刷新，不再加载
    if (finished.value) return

    console.log('健康记录 - 开始加载，页码:', page.value, '日期范围:', startDate.value, '-', endDate.value)
    loading.value = true

    try {
      const params: API.getHealthRecordsParams = {
        page: page.value,
        limit: pageSize
      }

      // 添加日期筛选参数
      if (startDate.value) {
        params.start_date = startDate.value
      }
      if (endDate.value) {
        params.end_date = endDate.value
      }

      const response = await getHealthRecords(params)

      const data = (response as any).data
      console.log('健康记录 - API响应:', data)

      if (data && data.records) {
        const newRecords = data.records as API.HealthRecord[]
        console.log('健康记录 - 页码:', page.value, '本次记录数:', newRecords.length, '总数:', data.total)

        if (refreshing.value) {
          records.value = newRecords
          refreshing.value = false
        } else {
          records.value.push(...newRecords)
        }

        total.value = data.total || 0

        // 加载完成，页码+1
        page.value++

        // 如果本次返回的数据少于请求的数量，说明没有更多数据了
        if (newRecords.length < pageSize) {
          finished.value = true
          console.log('健康记录 - 已加载完所有数据')
        }
      } else {
        finished.value = true
        console.log('健康记录 - 无数据返回')
      }
    } catch (error) {
      console.error('加载健康记录失败:', error)
      finished.value = true
    } finally {
      loading.value = false
      console.log('健康记录 - 加载完成，loading:', loading.value, 'finished:', finished.value)
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
   * 设置日期筛选并重新加载
   */
  function setDateRange(start: string, end: string) {
    startDate.value = start
    endDate.value = end
    page.value = 1
    finished.value = false
    records.value = []
    loadRecords()
  }

  /**
   * 清除日期筛选
   */
  function clearDateRange() {
    startDate.value = ''
    endDate.value = ''
    page.value = 1
    finished.value = false
    records.value = []
    loadRecords()
  }

  return {
    records,
    loading,
    finished,
    refreshing,
    total,
    startDate,
    endDate,
    loadRecords,
    onRefresh,
    setDateRange,
    clearDateRange
  }
}

/**
 * 使用饮食记录列表Hook
 */
export function useDietRecords() {
  const records = ref<API.DietRecord[]>([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const page = ref(1)
  const pageSize = 15
  const total = ref(0)

  // 日期筛选参数
  const startDate = ref<string>('')
  const endDate = ref<string>('')

  /**
   * 加载饮食记录
   */
  async function loadRecords() {
    // 如果已经加载完成，不再加载
    if (finished.value) return

    console.log('饮食记录 - 开始加载，页码:', page.value, '日期范围:', startDate.value, '-', endDate.value)
    loading.value = true

    try {
      const params: API.getDietRecordsParams = {
        page: page.value,
        limit: pageSize
      }

      // 添加日期筛选参数
      if (startDate.value) {
        params.start_date = startDate.value
      }
      if (endDate.value) {
        params.end_date = endDate.value
      }

      const response = await getDietRecords(params)

      const data = (response as any).data
      console.log('饮食记录 - API响应:', data)

      if (data && data.records) {
        const newRecords = data.records as API.DietRecord[]
        console.log('饮食记录 - 页码:', page.value, '本次记录数:', newRecords.length, '总数:', data.total)

        if (refreshing.value) {
          records.value = newRecords
          refreshing.value = false
        } else {
          records.value.push(...newRecords)
        }

        total.value = data.total || 0

        // 加载完成，页码+1
        page.value++

        // 如果本次返回的数据少于请求的数量，说明没有更多数据了
        if (newRecords.length < pageSize) {
          finished.value = true
          console.log('饮食记录 - 已加载完所有数据')
        }
      } else {
        finished.value = true
        console.log('饮食记录 - 无数据返回')
      }
    } catch (error) {
      console.error('加载饮食记录失败:', error)
      finished.value = true
    } finally {
      loading.value = false
      console.log('饮食记录 - 加载完成，loading:', loading.value, 'finished:', finished.value)
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
   * 设置日期筛选并重新加载
   */
  function setDateRange(start: string, end: string) {
    startDate.value = start
    endDate.value = end
    page.value = 1
    finished.value = false
    records.value = []
    loadRecords()
  }

  /**
   * 清除日期筛选
   */
  function clearDateRange() {
    startDate.value = ''
    endDate.value = ''
    page.value = 1
    finished.value = false
    records.value = []
    loadRecords()
  }

  return {
    records,
    loading,
    finished,
    refreshing,
    total,
    startDate,
    endDate,
    loadRecords,
    onRefresh,
    setDateRange,
    clearDateRange
  }
}

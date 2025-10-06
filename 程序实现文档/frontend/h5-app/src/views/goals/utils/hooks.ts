/**
 * Goals模块自定义Hooks
 */

import { ref, watch } from 'vue'
import { showToast, showSuccessToast, showConfirmDialog } from 'vant'
import { getGoals, postGoals, putGoalsId, deleteGoalsId } from '@/api/goals'
import type { UserGoal, CreateGoalFormData, GoalType, GoalStatus } from './types'
import { goalTypeUnitMap } from './options'

/**
 * 目标列表管理Hook
 */
export function useGoalList() {
  const goals = ref<UserGoal[]>([])
  const refreshing = ref(false)

  async function loadGoals() {
    const response = await getGoals()
    goals.value = (response.data as any) || []
  }

  async function onRefresh() {
    await loadGoals()
    refreshing.value = false
  }

  return {
    goals,
    refreshing,
    loadGoals,
    onRefresh
  }
}

/**
 * 添加目标表单Hook
 */
export function useAddGoalForm() {
  const showAddDialog = ref(false)
  const addForm = ref<CreateGoalFormData>({
    goal_type: 'weight' as GoalType,
    goal_name: '',
    target_value: '',
    current_value: '',
    unit: 'kg',
    start_date: '',
    target_date: '',
    description: ''
  })

  const showStartDatePicker = ref(false)
  const showTargetDatePicker = ref(false)
  const startDatePickerValue = ref<string[]>([])
  const targetDatePickerValue = ref<string[]>([])

  // 监听目标类型变化，自动更新单位
  watch(
    () => addForm.value.goal_type,
    (newType) => {
      addForm.value.unit = goalTypeUnitMap[newType] || ''
    }
  )

  async function handleAddGoal(onSuccess?: () => void) {
    // 验证
    if (!addForm.value.goal_name) {
      showToast('请输入目标名称')
      return
    }
    if (!addForm.value.target_value) {
      showToast('请输入目标值')
      return
    }
    if (!addForm.value.current_value) {
      showToast('请输入当前值')
      return
    }
    if (!addForm.value.start_date) {
      showToast('请选择开始日期')
      return
    }

    const response = await postGoals({
      goal_type: addForm.value.goal_type,
      goal_name: addForm.value.goal_name,
      target_value: parseFloat(addForm.value.target_value),
      current_value: parseFloat(addForm.value.current_value),
      unit: addForm.value.unit,
      start_date: addForm.value.start_date,
      target_date: addForm.value.target_date || undefined,
      description: addForm.value.description || undefined
    })

    if ((response as any)?.success) {
      showSuccessToast('目标创建成功')
      showAddDialog.value = false
      // 重置表单
      resetAddForm()
      onSuccess?.()
    } else {
      showToast('目标创建失败')
    }
  }

  function resetAddForm() {
    const todayStr = getBeijingDateString()
    addForm.value = {
      goal_type: 'weight',
      goal_name: '',
      target_value: '',
      current_value: '',
      unit: 'kg',
      start_date: todayStr,
      target_date: todayStr,
      description: ''
    }
  }

  return {
    showAddDialog,
    addForm,
    showStartDatePicker,
    showTargetDatePicker,
    startDatePickerValue,
    targetDatePickerValue,
    handleAddGoal,
    resetAddForm
  }
}

/**
 * 编辑目标表单Hook
 */
export function useEditGoalForm() {
  const showEditDialog = ref(false)
  const currentEditGoal = ref<UserGoal | null>(null)
  const editForm = ref<{
    goal_name: string
    target_value: string
    current_value: string
    target_date: string
    status: GoalStatus
    description: string
  }>({
    goal_name: '',
    target_value: '',
    current_value: '',
    target_date: '',
    status: 'active',
    description: ''
  })

  const showEditTargetDatePicker = ref(false)
  const editTargetDatePickerValue = ref<string[]>([])

  function openEditDialog(goal: UserGoal) {
    currentEditGoal.value = goal
    editForm.value = {
      goal_name: goal.goal_name,
      target_value: goal.target_value.toString(),
      current_value: goal.current_value.toString(),
      target_date: goal.target_date || '',
      status: goal.status,
      description: goal.description || ''
    }
    showEditDialog.value = true
  }

  async function handleUpdateGoal(onSuccess?: () => void) {
    if (!currentEditGoal.value) return

    const response = await putGoalsId(
      { id: currentEditGoal.value.id },
      {
        goal_name: editForm.value.goal_name,
        target_value: parseFloat(editForm.value.target_value),
        current_value: parseFloat(editForm.value.current_value),
        target_date: editForm.value.target_date || undefined,
        status: editForm.value.status,
        description: editForm.value.description || undefined
      }
    )

    if ((response as any)?.success) {
      showSuccessToast('目标更新成功')
      showEditDialog.value = false
      onSuccess?.()
    } else {
      showToast('目标更新失败')
    }
  }

  async function handleDeleteGoal(onSuccess?: () => void) {
    if (!currentEditGoal.value) return

    try {
      await showConfirmDialog({
        title: '确认删除',
        message: '确定要删除这个目标吗？'
      })

      const response = await deleteGoalsId({ id: currentEditGoal.value.id })
      if ((response as any)?.success) {
        showSuccessToast('目标删除成功')
        showEditDialog.value = false
        onSuccess?.()
      } else {
        showToast('目标删除失败')
      }
    } catch {
      // 用户取消删除
    }
  }

  return {
    showEditDialog,
    currentEditGoal,
    editForm,
    showEditTargetDatePicker,
    editTargetDatePickerValue,
    openEditDialog,
    handleUpdateGoal,
    handleDeleteGoal
  }
}

/**
 * 获取北京时间的日期字符串 (YYYY-MM-DD)
 */
function getBeijingDateString(): string {
  const now = new Date()
  // 获取UTC时间戳
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  // 转换为北京时间 (UTC+8)
  const beijingTime = new Date(utcTime + 8 * 3600000)
  const year = beijingTime.getFullYear()
  const month = String(beijingTime.getMonth() + 1).padStart(2, '0')
  const day = String(beijingTime.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

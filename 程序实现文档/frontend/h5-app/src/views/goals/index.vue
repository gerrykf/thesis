<template>
  <div class="goals">
    <van-nav-bar title="我的目标" fixed>
      <template #left>
        <van-icon name="arrow-left" @click="goBack" />
      </template>
      <template #right>
        <van-icon name="plus" @click="showAddDialog = true" />
      </template>
    </van-nav-bar>

    <div class="content" style="padding-top: 46px;">
      <!-- 目标列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div v-if="goals.length > 0" class="goals-list">
          <div
            v-for="goal in goals"
            :key="goal.id"
            class="goal-card"
            @click="handleEditGoal(goal)"
          >
            <div class="goal-header">
              <div class="goal-type-badge" :class="`type-${goal.goal_type}`">
                {{ getGoalTypeText(goal.goal_type) }}
              </div>
              <div class="goal-status" :class="`status-${goal.status}`">
                {{ getStatusText(goal.status) }}
              </div>
            </div>
            <div class="goal-title">{{ goal.goal_name }}</div>
            <div class="goal-progress">
              <van-progress
                :percentage="getProgressPercentage(goal)"
                :show-pivot="false"
                :stroke-width="8"
                color="#667eea"
              />
              <div class="progress-text">
                <span class="current">{{ goal.current_value }}{{ goal.unit }}</span>
                <span class="separator">/</span>
                <span class="target">{{ goal.target_value }}{{ goal.unit }}</span>
              </div>
            </div>
            <div v-if="goal.target_date" class="goal-footer">
              <span class="date-label">目标日期:</span>
              <span class="date-value">{{ formatDate(goal.target_date) }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <van-empty v-else description="暂无目标，点击右上角添加" />
      </van-pull-refresh>
    </div>

    <!-- 添加目标弹窗 -->
    <van-popup v-model:show="showAddDialog" position="bottom" :style="{ height: '80%' }">
      <div class="dialog-header">
        <van-button text @click="showAddDialog = false">取消</van-button>
        <span class="title">添加目标</span>
        <van-button text type="primary" @click="handleAddGoal">保存</van-button>
      </div>
      <div class="dialog-content">
        <van-form ref="addFormRef">
          <van-field
            v-model="addForm.goal_name"
            name="goal_name"
            label="目标名称"
            placeholder="请输入目标名称"
            :rules="[{ required: true, message: '请输入目标名称' }]"
          />
          <van-field name="goal_type" label="目标类型">
            <template #input>
              <van-radio-group v-model="addForm.goal_type" direction="horizontal">
                <van-radio name="weight">体重</van-radio>
                <van-radio name="exercise">运动</van-radio>
                <van-radio name="calories">卡路里</van-radio>
                <van-radio name="custom">自定义</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="addForm.current_value"
            name="current_value"
            type="number"
            label="当前值"
            placeholder="请输入当前值"
            :rules="[{ required: true, message: '请输入当前值' }]"
          />
          <van-field
            v-model="addForm.target_value"
            name="target_value"
            type="number"
            label="目标值"
            placeholder="请输入目标值"
            :rules="[{ required: true, message: '请输入目标值' }]"
          />
          <van-field
            v-model="addForm.unit"
            name="unit"
            label="单位"
            placeholder="如：kg、分钟、kcal"
            :rules="[{ required: true, message: '请输入单位' }]"
          />
          <van-field
            v-model="addForm.start_date"
            is-link
            readonly
            name="start_date"
            label="开始日期"
            placeholder="选择开始日期"
            @click="showStartDatePicker = true"
          />
          <van-field
            v-model="addForm.target_date"
            is-link
            readonly
            name="target_date"
            label="目标日期"
            placeholder="选择目标日期（可选）"
            @click="showTargetDatePicker = true"
          />
          <van-field
            v-model="addForm.description"
            rows="2"
            autosize
            label="描述"
            type="textarea"
            maxlength="200"
            placeholder="请输入目标描述（可选）"
            show-word-limit
          />
        </van-form>
      </div>
    </van-popup>

    <!-- 编辑目标弹窗 -->
    <van-popup v-model:show="showEditDialog" position="bottom" :style="{ height: '80%' }">
      <div class="dialog-header">
        <van-button text @click="showEditDialog = false">取消</van-button>
        <span class="title">编辑目标</span>
        <van-button text type="danger" @click="handleDeleteGoal">删除</van-button>
      </div>
      <div class="dialog-content">
        <van-form ref="editFormRef">
          <van-field
            v-model="editForm.goal_name"
            name="goal_name"
            label="目标名称"
            placeholder="请输入目标名称"
          />
          <van-field
            v-model="editForm.current_value"
            name="current_value"
            type="number"
            label="当前值"
            placeholder="请输入当前值"
          />
          <van-field
            v-model="editForm.target_value"
            name="target_value"
            type="number"
            label="目标值"
            placeholder="请输入目标值"
          />
          <van-field
            v-model="editForm.target_date"
            is-link
            readonly
            name="target_date"
            label="目标日期"
            placeholder="选择目标日期"
            @click="handleShowEditDatePicker"
          />
          <van-field name="status" label="状态">
            <template #input>
              <van-radio-group v-model="editForm.status" direction="horizontal">
                <van-radio name="active">进行中</van-radio>
                <van-radio name="completed">已完成</van-radio>
                <van-radio name="paused">已暂停</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="editForm.description"
            rows="2"
            autosize
            label="描述"
            type="textarea"
            maxlength="200"
            placeholder="请输入目标描述"
            show-word-limit
          />
        </van-form>
        <div class="form-actions">
          <van-button block type="primary" @click="handleUpdateGoal">保存修改</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showStartDatePicker" position="bottom">
      <van-date-picker
        v-model="startDatePickerValue"
        @confirm="onStartDateConfirm"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showTargetDatePicker" position="bottom">
      <van-date-picker
        v-model="targetDatePickerValue"
        @confirm="onTargetDateConfirm"
        @cancel="showTargetDatePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showEditTargetDatePicker" position="bottom">
      <van-date-picker
        v-model="editTargetDatePickerValue"
        @confirm="onEditTargetDateConfirm"
        @cancel="showEditTargetDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showConfirmDialog } from 'vant'
import { getUserGoals, createUserGoal, updateUserGoal, deleteUserGoal } from './utils/api'
import type { UserGoal, CreateGoalFormData, GoalType, GoalStatus } from './utils/types'

const router = useRouter()
const goals = ref<UserGoal[]>([])
const refreshing = ref(false)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentEditGoal = ref<UserGoal | null>(null)

// 添加表单
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

// 编辑表单
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

// 日期选择器
const showStartDatePicker = ref(false)
const showTargetDatePicker = ref(false)
const showEditTargetDatePicker = ref(false)
const startDatePickerValue = ref<string[]>([])
const targetDatePickerValue = ref<string[]>([])
const editTargetDatePickerValue = ref<string[]>([])

// 监听目标类型变化，自动更新单位
watch(
  () => addForm.value.goal_type,
  (newType) => {
    const unitMap: Record<GoalType, string> = {
      weight: 'kg',
      exercise: '分钟',
      calories: 'kcal',
      custom: ''
    }
    addForm.value.unit = unitMap[newType] || ''
  }
)

onMounted(() => {
  loadGoals()
  // 设置默认开始日期和目标日期为今天
  const today = new Date()
  const todayStr = formatDate(today.toISOString())
  addForm.value.start_date = todayStr
  addForm.value.target_date = todayStr
})

async function loadGoals() {
  const data = await getUserGoals()
  goals.value = data
}

async function onRefresh() {
  await loadGoals()
  refreshing.value = false
}

function getGoalTypeText(type: GoalType): string {
  const map = {
    weight: '体重',
    exercise: '运动',
    calories: '卡路里',
    custom: '自定义'
  }
  return map[type] || type
}

function getStatusText(status: GoalStatus): string {
  const map = {
    active: '进行中',
    completed: '已完成',
    paused: '已暂停',
    cancelled: '已取消'
  }
  return map[status] || status
}

function getProgressPercentage(goal: UserGoal): number {
  if (goal.target_value === 0) return 0
  const percentage = (goal.current_value / goal.target_value) * 100
  return Math.min(Math.max(percentage, 0), 100)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function onStartDateConfirm(value: { selectedValues: string[] }) {
  addForm.value.start_date = value.selectedValues.join('-')
  showStartDatePicker.value = false
}

function onTargetDateConfirm(value: { selectedValues: string[] }) {
  addForm.value.target_date = value.selectedValues.join('-')
  showTargetDatePicker.value = false
}

function onEditTargetDateConfirm(value: { selectedValues: string[] }) {
  editForm.value.target_date = value.selectedValues.join('-')
  showEditTargetDatePicker.value = false
}

function handleShowEditDatePicker() {
  // 初始化日期选择器的值
  if (editForm.value.target_date) {
    const dateParts = editForm.value.target_date.split('-')
    editTargetDatePickerValue.value = dateParts
  } else {
    // 如果没有目标日期，使用今天
    const today = new Date()
    editTargetDatePickerValue.value = [
      String(today.getFullYear()),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ]
  }
  showEditTargetDatePicker.value = true
}

async function handleAddGoal() {
  if (!addForm.value.goal_name) {
    showToast('请输入目标名称')
    return
  }
  if (!addForm.value.current_value || !addForm.value.target_value) {
    showToast('请输入当前值和目标值')
    return
  }
  if (!addForm.value.unit) {
    showToast('请输入单位')
    return
  }
  if (!addForm.value.start_date) {
    showToast('请选择开始日期')
    return
  }

  const success = await createUserGoal(addForm.value)
  if (success) {
    showSuccessToast('目标创建成功')
    showAddDialog.value = false
    // 重置表单
    const todayStr = formatDate(new Date().toISOString())
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
    loadGoals()
  } else {
    showToast('目标创建失败')
  }
}

function handleEditGoal(goal: UserGoal) {
  currentEditGoal.value = goal
  editForm.value = {
    goal_name: goal.goal_name,
    target_value: String(goal.target_value),
    current_value: String(goal.current_value),
    target_date: goal.target_date ? formatDate(goal.target_date) : '',
    status: goal.status,
    description: goal.description || ''
  }
  showEditDialog.value = true
}

async function handleUpdateGoal() {
  if (!currentEditGoal.value) return

  const success = await updateUserGoal(currentEditGoal.value.id, {
    goal_name: editForm.value.goal_name,
    target_value: parseFloat(editForm.value.target_value),
    current_value: parseFloat(editForm.value.current_value),
    target_date: editForm.value.target_date || undefined,
    status: editForm.value.status,
    description: editForm.value.description || undefined
  })

  if (success) {
    showSuccessToast('目标更新成功')
    showEditDialog.value = false
    loadGoals()
  } else {
    showToast('目标更新失败')
  }
}

async function handleDeleteGoal() {
  if (!currentEditGoal.value) return

  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个目标吗？'
    })

    const success = await deleteUserGoal(currentEditGoal.value.id)
    if (success) {
      showSuccessToast('目标删除成功')
      showEditDialog.value = false
      loadGoals()
    } else {
      showToast('目标删除失败')
    }
  } catch {
    // 用户取消删除
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.goals {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md;
  padding-bottom: 80px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.goal-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-sm;
}

.goal-type-badge {
  font-size: $font-size-xs;
  padding: 4px $space-sm;
  border-radius: $radius-sm;
  color: $white;

  &.type-weight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.type-exercise {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.type-calories {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.type-custom {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }
}

.goal-status {
  font-size: $font-size-xs;
  padding: 4px $space-sm;
  border-radius: $radius-sm;

  &.status-active {
    color: #52c41a;
    background: #f6ffed;
  }

  &.status-completed {
    color: #1890ff;
    background: #e6f7ff;
  }

  &.status-paused {
    color: #faad14;
    background: #fffbe6;
  }

  &.status-cancelled {
    color: #8c8c8c;
    background: #fafafa;
  }
}

.goal-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-color;
  margin-bottom: $space-md;
}

.goal-progress {
  margin-bottom: $space-sm;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: $space-xs;
  font-size: $font-size-sm;

  .current {
    color: $primary-color;
    font-weight: bold;
  }

  .separator {
    color: $text-color-3;
  }

  .target {
    color: $text-color-2;
  }
}

.goal-footer {
  font-size: $font-size-sm;
  color: $text-color-2;
  margin-top: $space-sm;

  .date-label {
    margin-right: $space-xs;
  }

  .date-value {
    color: $text-color;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md $space-lg;
  border-bottom: 1px solid $border-color;

  .title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }
}

.dialog-content {
  padding: $space-md;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.form-actions {
  padding: $space-lg 0;
}
</style>

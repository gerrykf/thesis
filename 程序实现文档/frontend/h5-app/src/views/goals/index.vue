<template>
  <div class="goals">
    <van-nav-bar title="我的目标" fixed placeholder>
      <template #left>
        <van-icon name="arrow-left" @click="goBack" />
      </template>
      <template #right>
        <van-icon name="plus" @click="showAddDialog = true" />
      </template>
    </van-nav-bar>

    <div class="content">
      <!-- 目标列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div v-if="goals.length > 0" class="goals-list">
          <div
            v-for="goal in goals"
            :key="goal.id"
            class="goal-card"
            @click="onEditGoal(goal)"
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
        <van-button plain @click="() => showAddDialog = false">取消</van-button>
        <span class="title">添加目标</span>
        <van-button plain type="primary" @click="onAddGoal">保存</van-button>
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
              <div class="goal-type-tags">
                <van-tag
                  v-for="type in goalTypes"
                  :key="type.value"
                  :type="addForm.goal_type === type.value ? type.color : 'default'"
                  size="large"
                  :plain="addForm.goal_type !== type.value"
                  @click="addForm.goal_type = type.value"
                >
                  {{ type.label }}
                </van-tag>
              </div>
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
            :model-value="formattedAddStartDate"
            is-link
            readonly
            name="start_date"
            label="开始日期"
            placeholder="选择开始日期"
            @click="() => showStartDatePicker = true"
          />
          <van-field
            :model-value="formattedAddTargetDate"
            is-link
            readonly
            name="target_date"
            label="目标日期"
            placeholder="选择目标日期（可选）"
            @click="() => showTargetDatePicker = true"
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
        <van-button plain @click="() => showEditDialog = false">取消</van-button>
        <span class="title">编辑目标</span>
        <van-button plain type="danger" @click="onDeleteGoal">删除</van-button>
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
            :model-value="formattedEditTargetDate"
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
          <van-button block type="primary" @click="onUpdateGoal">保存修改</van-button>
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
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  useGoalList,
  useAddGoalForm,
  useEditGoalForm,
  getGoalTypeText,
  getStatusText,
  calculateProgress,
  formatDate
} from './utils'
import type { UserGoal } from './utils'

const router = useRouter()

// 目标类型选项
const goalTypes = [
  { value: 'weight', label: '体重', color: 'primary' },
  { value: 'exercise', label: '运动', color: 'success' },
  { value: 'calories', label: '卡路里', color: 'warning' },
  { value: 'custom', label: '自定义', color: 'default' }
]

// 使用Hooks
const { goals, refreshing, loadGoals, onRefresh } = useGoalList()
const {
  showAddDialog,
  addForm,
  showStartDatePicker,
  showTargetDatePicker,
  startDatePickerValue,
  targetDatePickerValue,
  handleAddGoal,
  resetAddForm
} = useAddGoalForm()
const {
  showEditDialog,
  editForm,
  showEditTargetDatePicker,
  editTargetDatePickerValue,
  openEditDialog,
  handleUpdateGoal,
  handleDeleteGoal
} = useEditGoalForm()

// 格式化编辑表单中的目标日期显示
const formattedEditTargetDate = computed(() => {
  return formatDate(editForm.value.target_date)
})

// 格式化添加表单中的开始日期显示
const formattedAddStartDate = computed(() => {
  return formatDate(addForm.value.start_date)
})

// 格式化添加表单中的目标日期显示
const formattedAddTargetDate = computed(() => {
  return formatDate(addForm.value.target_date)
})

onMounted(() => {
  loadGoals()
  resetAddForm()
})

function getProgressPercentage(goal: UserGoal): number {
  return calculateProgress(goal.current_value, goal.target_value)
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
    // 处理接口返回的日期，可能是 YYYY-MM-DD 或 ISO 8601 格式
    let dateStr = editForm.value.target_date
    // 如果是 ISO 8601 格式（包含 T），只取日期部分
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0]||''
    }
    const dateParts = dateStr.split('-')
    editTargetDatePickerValue.value = dateParts
  } else {
    // 如果没有目标日期，使用北京时间今天
    const now = new Date()
    // 获取UTC时间戳
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
    // 转换为北京时间 (UTC+8)
    const beijingTime = new Date(utcTime + 8 * 3600000)
    editTargetDatePickerValue.value = [
      String(beijingTime.getFullYear()),
      String(beijingTime.getMonth() + 1).padStart(2, '0'),
      String(beijingTime.getDate()).padStart(2, '0')
    ]
  }
  showEditTargetDatePicker.value = true
}

// 调用hook中的添加目标函数
async function onAddGoal() {
  await handleAddGoal(loadGoals)
}

// 调用hook中的编辑目标函数
function onEditGoal(goal: UserGoal) {
  openEditDialog(goal)
}

// 调用hook中的更新目标函数
async function onUpdateGoal() {
  await handleUpdateGoal(loadGoals)
}

// 调用hook中的删除目标函数
async function onDeleteGoal() {
  await handleDeleteGoal(loadGoals)
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
  padding: $space-md 0;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.goal-type-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .van-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      transform: scale(0.95);
    }
  }
}

.form-actions {
  padding: $space-lg 0;
}
</style>

<template>
  <div class="date-filter">
    <!-- 筛选按钮 -->
    <div class="filter-trigger" @click="showPopup = true">
      <van-icon name="filter-o" />
      <span class="trigger-text">{{ currentFilterText }}</span>
      <van-icon name="arrow-down" />
    </div>

    <!-- 筛选弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '65%' }">
      <div class="filter-popup">
        <div class="popup-header">
          <span class="header-title">选择日期范围</span>
          <van-icon name="cross" @click="showPopup = false" />
        </div>

        <div class="popup-content">
          <!-- 快捷选项 -->
          <div class="quick-options">
            <div
              v-for="option in quickOptions"
              :key="option.value"
              class="quick-option"
              :class="{ active: selectedQuickOption === option.value }"
              @click="handleQuickSelect(option)"
            >
              <span class="option-icon">{{ option.icon }}</span>
              <span class="option-label">{{ option.label }}</span>
            </div>
          </div>

          <!-- 自定义日期选择 -->
          <div v-if="selectedQuickOption === 'custom'" class="custom-date-section">
            <div class="date-row">
              <span class="date-label">开始日期</span>
              <div class="date-input" @click="showStartDatePicker = true">
                {{ formattedStartDate || '请选择' }}
              </div>
            </div>
            <div class="date-row">
              <span class="date-label">结束日期</span>
              <div class="date-input" @click="showEndDatePicker = true">
                {{ formattedEndDate || '请选择' }}
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <van-button block plain @click="handleReset">清除筛选</van-button>
            <van-button block type="primary" @click="handleConfirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 开始日期选择器 -->
    <van-popup v-model:show="showStartDatePicker" position="bottom">
      <van-date-picker
        v-model="startDatePickerValue"
        title="选择开始日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onStartDateConfirm"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <!-- 结束日期选择器 -->
    <van-popup v-model:show="showEndDatePicker" position="bottom">
      <van-date-picker
        v-model="endDatePickerValue"
        title="选择结束日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onEndDateConfirm"
        @cancel="showEndDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface QuickOption {
  value: string
  label: string
  icon: string
  days?: number
}

const props = defineProps<{
  modelValue?: { startDate: string; endDate: string }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { startDate: string; endDate: string }): void
  (e: 'change', value: { startDate: string; endDate: string }): void
  (e: 'clear'): void
}>()

// 弹窗状态
const showPopup = ref(false)
const showStartDatePicker = ref(false)
const showEndDatePicker = ref(false)

// 选中的快捷选项
const selectedQuickOption = ref<string>('')

// 日期值
const tempStartDate = ref<string>('')
const tempEndDate = ref<string>('')

// 日期选择器值
const startDatePickerValue = ref<string[]>([])
const endDatePickerValue = ref<string[]>([])

// 日期范围限制
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

// 快捷选项配置
const quickOptions: QuickOption[] = [
  { value: 'today', label: '今天', icon: '📅', days: 0 },
  { value: 'currentWeek', label: '本周', icon: '📆' },
  { value: 'week', label: '最近7天', icon: '📊', days: 7 },
  { value: 'month', label: '最近30天', icon: '📈', days: 30 },
  { value: 'custom', label: '自定义', icon: '⚙️' }
]

// 当前筛选文本
const currentFilterText = computed(() => {
  if (!props.modelValue?.startDate || !props.modelValue?.endDate) {
    return '筛选日期'
  }

  const start = props.modelValue.startDate
  const end = props.modelValue.endDate

  // 如果是同一天
  if (start === end) {
    const today = formatDate(new Date())
    if (start === today) {
      return '今天'
    }
    return formatDisplayDate(start)
  }

  // 检查是否是本周
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setDate(today.getDate() - daysFromMonday)

  const weekStart = formatDate(monday)
  const weekEnd = formatDate(today)

  if (start === weekStart && end === weekEnd) {
    return '本周'
  }

  // 检查是否是最近7天
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  const sevenDaysStart = formatDate(sevenDaysAgo)

  if (start === sevenDaysStart && end === weekEnd) {
    return '最近7天'
  }

  // 检查是否是最近30天
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)
  const thirtyDaysStart = formatDate(thirtyDaysAgo)

  if (start === thirtyDaysStart && end === weekEnd) {
    return '最近30天'
  }

  // 自定义范围
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
})

// 格式化显示日期
const formattedStartDate = computed(() => {
  return tempStartDate.value ? formatDisplayDate(tempStartDate.value) : ''
})

const formattedEndDate = computed(() => {
  return tempEndDate.value ? formatDisplayDate(tempEndDate.value) : ''
})

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化显示日期（MM月DD日）
 */
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
  }
  return dateStr
}

/**
 * 处理快捷选项点击
 */
function handleQuickSelect(option: QuickOption) {
  selectedQuickOption.value = option.value

  if (option.value !== 'custom') {
    const today = new Date()
    const endDate = formatDate(today)

    let startDate: string
    if (option.value === 'today') {
      // 今天
      startDate = endDate
    } else if (option.value === 'currentWeek') {
      // 本周（周一到今天）
      const dayOfWeek = today.getDay()
      const monday = new Date(today)
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      monday.setDate(today.getDate() - daysFromMonday)
      startDate = formatDate(monday)
    } else {
      // 最近N天
      const start = new Date(today)
      start.setDate(start.getDate() - (option.days! - 1))
      startDate = formatDate(start)
    }

    tempStartDate.value = startDate
    tempEndDate.value = endDate
  }
}

/**
 * 开始日期确认
 */
function onStartDateConfirm(value: { selectedValues: string[] }) {
  tempStartDate.value = value.selectedValues.join('-')
  showStartDatePicker.value = false
}

/**
 * 结束日期确认
 */
function onEndDateConfirm(value: { selectedValues: string[] }) {
  tempEndDate.value = value.selectedValues.join('-')
  showEndDatePicker.value = false
}

/**
 * 确认筛选
 */
function handleConfirm() {
  if (!tempStartDate.value || !tempEndDate.value) {
    return
  }

  const result = {
    startDate: tempStartDate.value,
    endDate: tempEndDate.value
  }

  emit('update:modelValue', result)
  emit('change', result)
  showPopup.value = false
}

/**
 * 清除筛选
 */
function handleReset() {
  tempStartDate.value = ''
  tempEndDate.value = ''
  selectedQuickOption.value = ''

  emit('update:modelValue', { startDate: '', endDate: '' })
  emit('clear')
  showPopup.value = false
}

/**
 * 初始化日期选择器值
 */
function initDatePickerValue() {
  const today = new Date()
  startDatePickerValue.value = [
    String(today.getFullYear()),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ]
  endDatePickerValue.value = [...startDatePickerValue.value]
}

// 初始化
initDatePickerValue()
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/mixins.scss' as *;

.date-filter {
  .filter-trigger {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: $white;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.25);

    &:active {
      transform: scale(0.96);
      box-shadow: 0 1px 3px rgba(102, 126, 234, 0.25);
    }

    .van-icon {
      font-size: 14px;
    }

    .trigger-text {
      font-weight: 500;
      font-size: 13px;
    }
  }
}

.filter-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $white;

  .popup-header {
    @include flex-between;
    align-items: center;
    padding: $space-md $space-lg;
    border-bottom: 1px solid $border-color;

    .header-title {
      font-size: $font-size-base;
      font-weight: 600;
      color: $text-color;
    }

    .van-icon {
      font-size: 18px;
      color: $text-color-2;
      cursor: pointer;

      &:active {
        opacity: 0.7;
      }
    }
  }

  .popup-content {
    flex: 1;
    padding: $space-md;
    overflow-y: auto;

    .quick-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-sm;
      margin-bottom: $space-md;

      .quick-option:last-child {
        grid-column: 2 / 3; // 让"自定义"居中
      }

      .quick-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 10px;
        background: $background-color;
        border: 2px solid transparent;
        border-radius: $radius-md;
        cursor: pointer;
        transition: all 0.3s;

        &:active {
          transform: scale(0.95);
        }

        &.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-color: $primary-color;

          .option-label {
            color: $primary-color;
            font-weight: 600;
          }
        }

        .option-icon {
          font-size: 20px;
        }

        .option-label {
          font-size: 13px;
          color: $text-color;
          transition: all 0.3s;
        }
      }
    }

    .custom-date-section {
      background: $background-color;
      border-radius: $radius-md;
      padding: $space-md;
      margin-bottom: $space-md;

      .date-row {
        @include flex-between;
        align-items: center;
        padding: $space-sm 0;

        &:not(:last-child) {
          border-bottom: 1px solid $border-color;
        }

        .date-label {
          font-size: $font-size-sm;
          color: $text-color-2;
        }

        .date-input {
          font-size: $font-size-sm;
          color: $primary-color;
          font-weight: 500;
          cursor: pointer;
          padding: 6px $space-sm;
          background: $white;
          border-radius: $radius-sm;

          &:active {
            opacity: 0.7;
          }
        }
      }
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-sm;

      .van-button {
        height: 40px;
        font-size: 13px;
        font-weight: 500;
      }
    }
  }
}
</style>

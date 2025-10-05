<template>
  <div class="health">
    <van-nav-bar title="健康打卡" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 日期选择 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.date"
            is-link
            readonly
            label="📅 日期"
            placeholder="选择日期"
            @click="showDatePicker = true"
          />
        </van-cell-group>

        <!-- 体重 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.weight"
            type="text"
            inputmode="decimal"
            label="⚖️ 体重(kg)"
            placeholder="请输入体重，如：65.5"
            :rules="[{ required: true, message: '请输入体重' }]"
          />
        </van-cell-group>

        <!-- 运动时长 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.exercise_duration"
            type="number"
            label="🏃 运动(分钟)"
            placeholder="请输入运动时长"
          />
        </van-cell-group>

        <!-- 运动类型 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.exercise_type"
            label="🎯 运动类型"
            placeholder="如：跑步、游泳、瑜伽等"
          />
        </van-cell-group>

        <!-- 睡眠时长 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.sleep_hours"
            type="text"
            inputmode="decimal"
            label="😴 睡眠(小时)"
            placeholder="请输入睡眠时长，如：7.5"
          />
        </van-cell-group>

        <!-- 睡眠质量 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.sleep_quality"
            is-link
            readonly
            label="🌙 睡眠质量"
            placeholder="请选择睡眠质量"
            @click="showSleepQualityPicker = true"
          />
        </van-cell-group>

        <!-- 心情状态 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.mood"
            is-link
            readonly
            label="😊 心情状态"
            placeholder="请选择心情状态"
            @click="showMoodPicker = true"
          />
        </van-cell-group>

        <!-- 备注 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.notes"
            rows="3"
            autosize
            label="📝 备注"
            type="textarea"
            placeholder="今天感觉如何？"
          />
        </van-cell-group>

        <!-- 提交按钮 -->
        <div style="margin: 24px 16px;">
          <van-button round block type="primary" native-type="submit">
            保存打卡
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 睡眠质量选择器 -->
    <van-popup v-model:show="showSleepQualityPicker" position="bottom">
      <van-picker
        :columns="sleepQualityOptions"
        @confirm="onSleepQualityConfirm"
        @cancel="showSleepQualityPicker = false"
      />
    </van-popup>

    <!-- 心情状态选择器 -->
    <van-popup v-model:show="showMoodPicker" position="bottom">
      <van-picker
        :columns="moodOptions"
        @confirm="onMoodConfirm"
        @cancel="showMoodPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast, showLoadingToast, closeToast } from 'vant'
import { postHealthRecords, getHealthRecords } from '@/api/health'

const router = useRouter()
const route = useRoute()

// 表单数据接口
interface HealthFormData {
  date: string
  weight: string
  exercise_duration: string
  exercise_type: string
  sleep_hours: string
  sleep_quality: string
  mood: string
  notes: string
}

// 初始化表单数据
const formData = ref<HealthFormData>({
  date: new Date().toISOString().split('T')[0] || '',
  weight: '',
  exercise_duration: '',
  exercise_type: '',
  sleep_hours: '',
  sleep_quality: '',
  mood: '',
  notes: ''
})

// 记录ID (用于编辑)
const recordId = ref<number | null>(null)

// 日期选择器
const showDatePicker = ref(false)
const currentDate = ref([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate())
])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

// 睡眠质量选择器
const showSleepQualityPicker = ref(false)
const sleepQualityOptions = [
  { text: '优秀', value: 'excellent' },
  { text: '良好', value: 'good' },
  { text: '一般', value: 'fair' },
  { text: '较差', value: 'poor' }
]

// 心情状态选择器
const showMoodPicker = ref(false)
const moodOptions = [
  { text: '很好', value: 'excellent' },
  { text: '不错', value: 'good' },
  { text: '一般', value: 'fair' },
  { text: '较差', value: 'poor' }
]

function onDateConfirm(value: any) {
  const selectedValues = value.selectedValues || value
  formData.value.date = `${selectedValues[0]}-${String(selectedValues[1]).padStart(2, '0')}-${String(selectedValues[2]).padStart(2, '0')}`
  showDatePicker.value = false
}

function onSleepQualityConfirm(value: any) {
  const selected = value.selectedOptions?.[0] || value
  formData.value.sleep_quality = selected.text
  showSleepQualityPicker.value = false
}

function onMoodConfirm(value: any) {
  const selected = value.selectedOptions?.[0] || value
  formData.value.mood = selected.text
  showMoodPicker.value = false
}

function onClickLeft() {
  router.back()
}

// 加载现有记录
async function loadRecord(date: string, id?: string) {
  try {
    const response = await getHealthRecords({
      start_date: date,
      end_date: date,
      limit: 1
    })

    // 尝试不同的数据路径
    const records = response.data?.data?.records || (response.data as any)?.records || []

    if (records && records.length > 0) {
      let record: any
      if (id) {
        recordId.value = parseInt(id)
        record = records.find((r: any) => r.id === recordId.value)
      } else {
        record = records[0]
        recordId.value = record.id
      }

      if (record) {
        fillFormData(record)
      }
    }
  } catch (error) {
    console.error('加载记录失败:', error)
  }
}

function fillFormData(record: any, preserveDate: boolean = true) {
  // 保存当前日期（如果需要保留）
  const currentDate = preserveDate ? formData.value.date : ''

  // 处理ISO日期格式
  let dateStr = record.record_date || ''
  if (typeof dateStr === 'string' && dateStr.includes('T')) {
    // 将ISO格式转换为本地日期
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dateStr = `${year}-${month}-${day}`
  }

  // 如果需要保留日期且当前日期不为空，则使用当前日期；否则使用记录的日期
  formData.value.date = (preserveDate && currentDate) ? currentDate : dateStr

  formData.value.weight = record.weight ? String(record.weight) : ''
  formData.value.exercise_duration = record.exercise_duration ? String(record.exercise_duration) : ''
  formData.value.exercise_type = record.exercise_type || ''
  formData.value.sleep_hours = record.sleep_hours ? String(record.sleep_hours) : ''

  // 转换睡眠质量和心情显示文本
  const qualityMap: Record<string, string> = {
    'excellent': '优秀',
    'good': '良好',
    'fair': '一般',
    'poor': '较差'
  }
  const moodMap: Record<string, string> = {
    'excellent': '很好',
    'good': '不错',
    'fair': '一般',
    'poor': '较差'
  }

  formData.value.sleep_quality = qualityMap[record.sleep_quality || ''] || ''
  formData.value.mood = moodMap[record.mood || ''] || ''
  formData.value.notes = record.notes || ''
}

async function onSubmit() {
  // 验证必填字段
  if (!formData.value.date) {
    showToast('请选择日期')
    return
  }

  if (!formData.value.weight) {
    showToast('请输入体重')
    return
  }

  // 验证数值字段格式
  const weight = parseFloat(formData.value.weight)
  if (isNaN(weight) || weight <= 0) {
    showToast('请输入有效的体重')
    return
  }

  // 显示加载提示
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 准备提交数据 - 需要将中文转换回英文值
    const qualityValueMap: Record<string, string> = {
      '优秀': 'excellent',
      '良好': 'good',
      '一般': 'fair',
      '较差': 'poor'
    }
    const moodValueMap: Record<string, string> = {
      '很好': 'excellent',
      '不错': 'good',
      '一般': 'fair',
      '较差': 'poor'
    }

    const submitData: any = {
      record_date: formData.value.date,
      weight: weight,
      exercise_duration: formData.value.exercise_duration ? parseInt(formData.value.exercise_duration) : undefined,
      exercise_type: formData.value.exercise_type || undefined,
      sleep_hours: formData.value.sleep_hours ? parseFloat(formData.value.sleep_hours) : undefined,
      sleep_quality: qualityValueMap[formData.value.sleep_quality] || undefined,
      mood: moodValueMap[formData.value.mood] || undefined,
      notes: formData.value.notes || undefined
    }

    console.log('准备提交的数据:', submitData)

    // 创建或更新记录（后端POST接口会自动判断）
    const response = await postHealthRecords(submitData)

    closeToast()

    if (response.data) {
      showSuccessToast('打卡成功！')

      setTimeout(() => {
        router.push('/health')
      }, 1000)
    } else {
      showToast('打卡失败，请重试')
    }
  } catch (error: any) {
    closeToast()
    console.error('打卡失败:', error)
    showToast(error.message || '打卡失败，请重试')
  }
}

// 重置表单（保留日期）
function resetForm(keepDate: string) {
  formData.value = {
    date: keepDate,
    weight: '',
    exercise_duration: '',
    exercise_type: '',
    sleep_hours: '',
    sleep_quality: '',
    mood: '',
    notes: ''
  }
  recordId.value = null
}

// 初始化表单数据的函数
async function initializeForm() {
  // 从路由参数获取日期和ID
  const dateParam = route.query.date as string | undefined
  const idParam = route.query.id as string | undefined

  if (dateParam) {
    // 先重置表单，只保留日期
    resetForm(dateParam)

    const dateParts = dateParam.split('-')
    currentDate.value = [dateParts[0] || '', dateParts[1] || '', dateParts[2] || '']

    // 然后尝试加载该日期的记录（如果存在的话）
    await loadRecord(dateParam, idParam)
  }
}

onMounted(() => {
  initializeForm()
})

// 页面激活时重新初始化（从日历返回时）
onActivated(() => {
  initializeForm()
})
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.health {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md;
  padding-bottom: 70px;
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}

:deep(.van-field__label) {
  font-size: $font-size-base;
}
</style>

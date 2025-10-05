<template>
  <div class="health">
    <van-nav-bar title="健康打卡" left-arrow @click-left="onClickLeft" fixed />

    <div class="content" style="padding-top: 46px;">
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
            type="number"
            label="⚖️ 体重(kg)"
            placeholder="请输入体重"
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
            type="number"
            label="😴 睡眠(小时)"
            placeholder="请输入睡眠时长"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

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
  date: new Date().toISOString().split('T')[0],
  weight: '',
  exercise_duration: '',
  exercise_type: '',
  sleep_hours: '',
  sleep_quality: '',
  mood: '',
  notes: ''
})

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
  formData.value.sleep_quality = selected.value
  showSleepQualityPicker.value = false
}

function onMoodConfirm(value: any) {
  const selected = value.selectedOptions?.[0] || value
  formData.value.mood = selected.value
  showMoodPicker.value = false
}

function onClickLeft() {
  router.back()
}

function onSubmit() {
  // 验证必填字段
  if (!formData.value.weight) {
    showToast('请输入体重')
    return
  }

  console.log('提交数据:', formData.value)

  // TODO: 调用API提交数据

  showSuccessToast('打卡成功！')

  setTimeout(() => {
    router.push('/home')
  }, 1000)
}
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

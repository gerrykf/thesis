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
            v-model="formData.exercise"
            type="number"
            label="🏃 运动(分钟)"
            placeholder="请输入运动时长"
          />
        </van-cell-group>

        <!-- 睡眠时长 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.sleep"
            type="number"
            label="😴 睡眠(小时)"
            placeholder="请输入睡眠时长"
          />
        </van-cell-group>

        <!-- 备注 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.note"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import {
  formatDateArray,
  getMinDate,
  getMaxDate,
  validateFormData,
  generateSuccessMessage,
  createEmptyFormData,
  type HealthFormData
} from './utils'

const router = useRouter()

const formData = ref<HealthFormData>(createEmptyFormData())

const showDatePicker = ref(false)
const currentDate = ref([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate())
])
const minDate = getMinDate()
const maxDate = getMaxDate()

function onDateConfirm(value: any) {
  formData.value.date = formatDateArray(value)
  showDatePicker.value = false
}

function onClickLeft() {
  router.back()
}

function onSubmit() {
  const validation = validateFormData(formData.value)

  if (!validation.valid) {
    showToast(validation.message)
    return
  }

  console.log('提交数据:', formData.value)

  const successMessage = generateSuccessMessage()

  showSuccessToast('打卡成功！' + successMessage)

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

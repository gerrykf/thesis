<template>
  <div class="profile-edit">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow fixed placeholder @click-left="onBack" />

    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 昵称 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.nickname"
            name="nickname"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[{ required: true, message: '请输入昵称' }]"
          />
        </van-cell-group>

        <!-- 性别 -->
        <van-cell-group inset>
          <van-field
            v-model="genderText"
            is-link
            readonly
            name="gender"
            label="性别"
            placeholder="请选择性别"
            @click="showGenderPicker = true"
          />
        </van-cell-group>

        <!-- 出生日期 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.birth_date"
            is-link
            readonly
            name="birth_date"
            label="出生日期"
            placeholder="请选择出生日期"
            @click="showDatePicker = true"
          />
        </van-cell-group>

        <!-- 身高 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.height"
            type="number"
            name="height"
            label="身高"
            placeholder="请输入身高"
            :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入正确的身高' }]"
          >
            <template #right-icon>
              <span class="unit">cm</span>
            </template>
          </van-field>
        </van-cell-group>

        <!-- 目标体重 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.target_weight"
            type="number"
            name="target_weight"
            label="目标体重"
            placeholder="请输入目标体重"
            :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入正确的体重' }]"
          >
            <template #right-icon>
              <span class="unit">kg</span>
            </template>
          </van-field>
        </van-cell-group>

        <!-- 联系方式 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.email"
            type="email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱' }]"
          />
          <van-field
            v-model="formData.phone"
            type="tel"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
          />
        </van-cell-group>

        <!-- 提交按钮 -->
        <div style="margin: 24px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            保存
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useProfileEdit } from './utils'

const router = useRouter()
const userStore = useUserStore()

// 使用自定义 Hook
const {
  loading,
  showGenderPicker,
  showDatePicker,
  formData,
  currentDate,
  genderText,
  genderOptions,
  loadProfile,
  onGenderConfirm,
  onDateConfirm,
  submitForm
} = useProfileEdit()

// 日期选择器配置
const minDate = new Date(1950, 0, 1)
const maxDate = new Date()

onMounted(() => {
  loadProfile()
})

/**
 * 提交表单
 */
async function onSubmit() {
  const success = await submitForm()

  if (success) {
    // 更新 store 中的用户信息
    if (userStore.userInfo) {
      userStore.setUserInfo({
        ...userStore.userInfo,
        nickname: formData.value.nickname,
        email: formData.value.email,
        phone: formData.value.phone,
        gender: formData.value.gender,
        birth_date: formData.value.birth_date,
        height: formData.value.height,
        target_weight: formData.value.target_weight
      })
    }

    // 延迟返回
    setTimeout(() => {
      router.back()
    }, 1000)
  }
}

/**
 * 返回
 */
function onBack() {
  router.back()
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.profile-edit {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md 0 70px;
}

:deep(.van-cell-group) {
  margin-bottom: $space-md;
}

.unit {
  margin-left: $space-xs;
  font-size: $font-size-sm;
  color: $text-color-3;
}
</style>

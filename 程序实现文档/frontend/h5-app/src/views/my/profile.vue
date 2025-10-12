<template>
  <div class="profile-edit">
    <van-nav-bar :title="t('ge-ren-zi-liao')" :left-text="t('common.back')" left-arrow fixed placeholder @click-left="onBack" />

    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 昵称 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.nickname"
            name="nickname"
            :label="t('ni-cheng')"
            :placeholder="t('qing-shu-ru-ni-cheng')"
            :disabled="!!formData.nickname"
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
            :label="t('xing-bie')"
            :placeholder="t('qing-xuan-ze-xing-bie')"
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
            :label="t('chu-sheng-ri-qi')"
            :placeholder="t('qing-xuan-ze-chu-sheng-ri-qi')"
            @click="showDatePicker = true"
          />
        </van-cell-group>

        <!-- 身高 -->
        <van-cell-group inset>
          <van-field
            v-model="formData.height"
            type="number"
            name="height"
            :label="t('shen-gao')"
            :placeholder="t('qing-shu-ru-shen-gao')"
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
            :label="t('mu-biao-ti-zhong')"
            :placeholder="t('qing-shu-ru-mu-biao-ti-zhong')"
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
            :label="t('you-xiang')"
            :placeholder="t('qing-shu-ru-you-xiang')"
            :rules="[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱' }]"
          />
          <van-field
            v-model="formData.phone"
            type="tel"
            name="phone"
            :label="t('shou-ji-hao')"
            :placeholder="t('qing-shu-ru-shou-ji-hao')"
            :rules="[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
          />
        </van-cell-group>

        <!-- 提交按钮 -->
        <div style="margin: 24px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            {{ t('common.save') }} </van-button>
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
        :title="t('xuan-ze-chu-sheng-ri-qi')"
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
import { useI18n } from 'vue-i18n'

const {t} = useI18n()

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

.locked-tip {
  font-size: $font-size-xs;
  color: $text-color-3;
  margin-left: $space-xs;
}
</style>

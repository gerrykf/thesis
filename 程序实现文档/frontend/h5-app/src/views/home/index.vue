<template>
  <div class="home">
    <van-nav-bar title="今日概览" fixed placeholder />

    <div class="content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h2>{{ greeting }}，{{ userName }}</h2>
        <p class="date">{{ currentDate }} {{ weekday }}</p>
      </div>

      <!-- 今日打卡状态 -->
      <div class="check-in-card">
        <div class="card-header">
          <div class="title-row">
            <h3>📊 今日打卡</h3>
            <van-tag v-if="hasCheckedIn" type="success" size="medium">已打卡</van-tag>
            <van-tag v-else type="warning" size="medium">未打卡</van-tag>
          </div>
        </div>

        <!-- 已打卡：显示简要数据 -->
        <div v-if="hasCheckedIn" class="checked-in-data">
          <div class="data-row">
            <span class="label">💪 状态</span>
            <span class="value">{{ moodIcon }} {{ moodDisplay }}</span>
          </div>
          <div class="data-row">
            <span class="label">⚖️ 体重</span>
            <span class="value">{{ todayData.weight }}kg</span>
          </div>
          <div class="data-row" v-if="todayData.exercise">
            <span class="label">🏃 运动</span>
            <span class="value">{{ exerciseDisplay }} · {{ exerciseTypeDisplay }}</span>
          </div>
          <div class="data-row">
            <span class="label">😴 睡眠</span>
            <span class="value">{{ sleepDisplay }} · {{ sleepQualityText }}</span>
          </div>
        </div>

        <!-- 未打卡：显示提示 -->
        <div v-else class="not-checked-in">
          <div class="tip-icon">📝</div>
          <p class="tip-text">今天还没有打卡哦，记录一下吧！</p>
          <van-button type="primary" size="small" round @click="goToHealth">
            立即打卡
          </van-button>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <h3>🎯 快捷操作</h3>
        <van-grid :column-num="2" :border="false">
          <van-grid-item icon="add-o" text="健康打卡" @click="goToHealth" />
          <van-grid-item icon="goods-collect-o" text="饮食记录" @click="goToDiet" />
          <van-grid-item icon="chart-trending-o" text="数据分析" @click="showToast('功能开发中')" />
          <van-grid-item icon="setting-o" text="目标设置" @click="goToGoals" />
        </van-grid>
      </div>

      <!-- 健康建议 -->
      <div class="tips-section">
        <h3>💡 健康建议</h3>
        <van-cell-group inset>
          <van-cell
            v-for="(tip, index) in healthTips"
            :key="index"
            :title="tip"
            icon="info-o"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import {
  formatChineseDate,
  getWeekday,
  getGreeting,
  generateHealthTips,
  useTodayData
} from './utils'

const router = useRouter()
const userStore = useUserStore()

const greeting = computed(() => getGreeting())
const currentDate = computed(() => formatChineseDate())
const weekday = computed(() => getWeekday())

// 从 Pinia store 获取用户名
const userName = computed(() => userStore.nickname)

// 使用今日数据 Hook
const { todayData } = useTodayData()

const healthTips = computed(() => generateHealthTips(todayData.value))

// 是否已打卡
const hasCheckedIn = computed(() => {
  return todayData.value.weight > 0
})

// 格式化运动时长显示
const exerciseDisplay = computed(() => {
  const minutes = todayData.value.exercise
  if (!minutes) return '未运动'
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}小时`
    }
    return `${hours}小时${remainingMinutes}分钟`
  }
  return `${minutes}分钟`
})

// 运动类型显示
const exerciseTypeDisplay = computed(() => {
  return todayData.value.exercise_type || '其他运动'
})

// 睡眠时长显示
const sleepDisplay = computed(() => {
  const hours = todayData.value.sleep
  return hours ? `${hours}小时` : '未记录'
})

// 睡眠质量文本
const sleepQualityText = computed(() => {
  const qualityMap: Record<string, string> = {
    'excellent': '优秀',
    'good': '良好',
    'fair': '一般',
    'poor': '较差'
  }
  return qualityMap[todayData.value.sleep_quality || ''] || '未评价'
})

// 心情状态显示
const moodDisplay = computed(() => {
  const moodMap: Record<string, string> = {
    'excellent': '心情很好',
    'good': '心情不错',
    'fair': '心情一般',
    'poor': '心情欠佳'
  }
  return moodMap[todayData.value.mood || ''] || '未记录'
})

// 心情图标
const moodIcon = computed(() => {
  const iconMap: Record<string, string> = {
    'excellent': '😄',
    'good': '😊',
    'fair': '😐',
    'poor': '😔'
  }
  return iconMap[todayData.value.mood || ''] || '😶'
})

function goToHealth() {
  router.push('/health')
}

function goToDiet() {
  router.push('/diet')
}

function goToGoals() {
  router.push('/goals')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/mixins.scss' as *;

.home {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-md;
  padding-bottom: 70px;
}

.welcome-section {
  margin-bottom: $space-lg;

  h2 {
    font-size: $font-size-xxl;
    margin-bottom: $space-xs;
    color: $text-color;
  }

  .date {
    color: $text-color-2;
    font-size: $font-size-md;
  }
}

.check-in-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-lg;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .card-header {
    margin-bottom: $space-md;

    .title-row {
      @include flex-between;
      align-items: center;

      h3 {
        font-size: $font-size-lg;
        color: $text-color;
      }
    }
  }

  .checked-in-data {
    .data-row {
      @include flex-between;
      padding: $space-sm 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: $font-size-base;
        color: $text-color-2;
      }

      .value {
        font-size: $font-size-base;
        color: $text-color;
        font-weight: 500;
      }
    }
  }

  .not-checked-in {
    text-align: center;
    padding: $space-xl 0;

    .tip-icon {
      font-size: 48px;
      margin-bottom: $space-md;
    }

    .tip-text {
      font-size: $font-size-base;
      color: $text-color-2;
      margin-bottom: $space-lg;
    }
  }
}

.quick-actions {
  margin-bottom: $space-lg;

  h3 {
    font-size: $font-size-lg;
    margin-bottom: $space-sm;
    color: $text-color;
  }
}

.tips-section {
  margin-bottom: $space-lg;

  h3 {
    font-size: $font-size-lg;
    margin-bottom: $space-sm;
    color: $text-color;
  }

  :deep(.van-cell-group--inset) {
    margin: 0;
  }
}
</style>

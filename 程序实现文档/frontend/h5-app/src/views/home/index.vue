<template>
  <div class="home">
    <van-nav-bar title="今日概览" fixed />

    <div class="content" style="padding-top: 46px;">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h2>{{ greeting }}，{{ userName }}</h2>
        <p class="date">{{ currentDate }} {{ weekday }}</p>
      </div>

      <!-- 今日数据卡片 -->
      <div class="data-card">
        <div class="card-header">
          <h3>📊 今日数据</h3>
          <span class="health-score">健康评分: {{ healthScore }}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">⚖️</div>
            <div class="stat-value">{{ todayData.weight || '--' }}kg</div>
            <div class="stat-label">体重</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🏃</div>
            <div class="stat-value">{{ exerciseDisplay }}</div>
            <div class="stat-label">{{ exerciseTypeDisplay }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">😴</div>
            <div class="stat-value">{{ sleepDisplay }}</div>
            <div class="stat-label">{{ sleepQualityDisplay }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">{{ moodIcon }}</div>
            <div class="stat-value">{{ moodDisplay }}</div>
            <div class="stat-label">心情</div>
          </div>
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
  calculateHealthScore,
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
const { todayData, loading, refreshData } = useTodayData()

const healthScore = computed(() => calculateHealthScore(todayData.value))
const healthTips = computed(() => generateHealthTips(todayData.value))

// 格式化运动时长显示
const exerciseDisplay = computed(() => {
  const minutes = todayData.value.exercise
  if (!minutes) return '--'
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
  return todayData.value.exercise_type || '运动'
})

// 睡眠时长显示
const sleepDisplay = computed(() => {
  const hours = todayData.value.sleep
  return hours ? `${hours}小时` : '--'
})

// 睡眠质量显示
const sleepQualityDisplay = computed(() => {
  const qualityMap: Record<string, string> = {
    'excellent': '睡眠·优秀',
    'good': '睡眠·良好',
    'fair': '睡眠·一般',
    'poor': '睡眠·较差'
  }
  return qualityMap[todayData.value.sleep_quality] || '睡眠'
})

// 心情状态显示
const moodDisplay = computed(() => {
  const moodMap: Record<string, string> = {
    'excellent': '很好',
    'good': '不错',
    'fair': '一般',
    'poor': '较差'
  }
  return moodMap[todayData.value.mood] || '未记录'
})

// 心情图标
const moodIcon = computed(() => {
  const iconMap: Record<string, string> = {
    'excellent': '😄',
    'good': '😊',
    'fair': '😐',
    'poor': '😔'
  }
  return iconMap[todayData.value.mood] || '😶'
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

.data-card {
  @include gradient-bg(#667eea, #764ba2);
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-lg;
  color: $white;

  .card-header {
    @include flex-between;
    margin-bottom: $space-md;

    h3 {
      font-size: $font-size-lg;
    }

    .health-score {
      font-size: $font-size-sm;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px $space-sm;
      border-radius: $radius-sm;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-sm;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    padding: $space-md;
    text-align: center;

    .stat-icon {
      font-size: 32px;
      margin-bottom: $space-xs;
    }

    .stat-value {
      font-size: $font-size-xl;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: $font-size-sm;
      opacity: 0.9;
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

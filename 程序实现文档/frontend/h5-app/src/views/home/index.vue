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
            <div class="stat-value">{{ todayData.weight }}kg</div>
            <div class="stat-label">体重</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🏃</div>
            <div class="stat-value">{{ todayData.exercise }}min</div>
            <div class="stat-label">运动</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">😴</div>
            <div class="stat-value">{{ todayData.sleep }}h</div>
            <div class="stat-label">睡眠</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ todayData.calories }}</div>
            <div class="stat-label">卡路里</div>
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
          <van-grid-item icon="setting-o" text="目标设置" @click="showToast('功能开发中')" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import {
  formatChineseDate,
  getWeekday,
  getGreeting,
  calculateHealthScore,
  generateHealthTips,
  type HealthData
} from './utils'

const router = useRouter()

const userName = ref('用户')
const greeting = ref(getGreeting())
const currentDate = computed(() => formatChineseDate())
const weekday = computed(() => getWeekday())

const todayData = ref<HealthData>({
  weight: 65.5,
  exercise: 30,
  sleep: 8,
  calories: 1200
})

const healthScore = computed(() => calculateHealthScore(todayData.value))
const healthTips = computed(() => generateHealthTips(todayData.value))

function goToHealth() {
  router.push('/health')
}

function goToDiet() {
  router.push('/diet')
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
}
</style>

<template>
  <div class="home">
    <van-nav-bar title="今日概览" fixed placeholder />

    <div class="content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <div class="welcome-row">
          <h2>{{ greeting }}，{{ userName }}</h2>
          <p class="date">{{ currentDate }} {{ weekday }}</p>
        </div>
      </div>

      <!-- 健康建议 - 迷你版轮播 -->
      <div v-if="healthTips.length > 0" class="mini-tips">
        <van-swipe
          :autoplay="3000"
          :show-indicators="false"
          :loop="true"
          class="tips-swipe"
        >
          <van-swipe-item v-for="(tip, index) in healthTips" :key="index">
            <div class="mini-tip-item">
              <van-icon name="bulb-o" class="tip-icon" />
              <span class="tip-text">{{ tip }}</span>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 今日打卡状态 -->
      <div class="check-in-card">
        <div class="card-header">
          <div class="title-row">
            <h3>📊 今日打卡</h3>
            <van-tag v-if="hasCheckedIn" type="success" size="medium"
              >已打卡</van-tag
            >
            <van-tag v-else type="warning" size="medium">去打卡</van-tag>
          </div>
        </div>

        <!-- 已打卡：显示简要数据 - 网格布局 -->
        <div v-if="hasCheckedIn" class="checked-in-data">
          <div class="data-grid">
            <div class="data-card mood">
              <div class="card-icon">{{ moodIcon }}</div>
              <div class="card-info">
                <div class="card-value">{{ moodDisplay }}</div>
              </div>
            </div>
            <div class="data-card weight">
              <div class="card-icon">⚖️</div>
              <div class="card-info">
                <div class="card-value">
                  {{ todayData.weight }}<span class="unit">kg</span>
                </div>
              </div>
            </div>
            <div class="data-card exercise" v-if="todayData.exercise">
              <div class="card-icon">🏃</div>
              <div class="card-info">
                <div class="card-value">{{ exerciseDisplay }}</div>
                <div class="card-extra">{{ exerciseTypeDisplay }}</div>
              </div>
            </div>
            <div class="data-card sleep">
              <div class="card-icon">😴</div>
              <div class="card-info">
                <div class="card-value">{{ sleepDisplay }}</div>
                <div class="card-extra">{{ sleepQualityText }}</div>
              </div>
            </div>
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

      <!-- 今日摄入量 -->
      <div class="nutrition-card">
        <div class="card-header">
          <h3>🍽️ 今日摄入</h3>
          <span class="view-more" @click="goToDiet">查看详情 ›</span>
        </div>

        <div v-if="hasNutritionData" class="nutrition-data">
          <!-- 热量进度条 -->
          <div class="nutrition-item calories">
            <div class="item-header">
              <span class="label">热量</span>
              <span class="value"
                >{{ todayCalories }} <span class="unit">kcal</span></span
              >
            </div>
            <van-progress
              :percentage="caloriesProgress"
              :pivot-text="caloriesProgress + '%'"
              color="linear-gradient(to right, #ff6034, #ee0a24)"
              track-color="#f5f5f5"
            />
          </div>

          <!-- 三大营养素 -->
          <div class="macros-grid">
            <div class="macro-item protein">
              <div class="macro-icon">💪</div>
              <div class="macro-label">蛋白质</div>
              <div class="macro-value">{{ todayProtein }}g</div>
            </div>
            <div class="macro-item carbs">
              <div class="macro-icon">🍚</div>
              <div class="macro-label">碳水</div>
              <div class="macro-value">{{ todayCarbs }}g</div>
            </div>
            <div class="macro-item fat">
              <div class="macro-icon">🥑</div>
              <div class="macro-label">脂肪</div>
              <div class="macro-value">{{ todayFat }}g</div>
            </div>
          </div>
        </div>

        <div v-else class="no-nutrition-data">
          <div class="empty-icon">🍴</div>
          <p class="empty-text">今天还没有饮食记录</p>
          <van-button type="primary" size="small" round @click="goToDiet">
            添加记录
          </van-button>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <van-grid :column-num="4" :border="false" :gutter="6">
          <van-grid-item icon="add-o" text="打卡" @click="goToHealth" />
          <van-grid-item icon="goods-collect-o" text="饮食" @click="goToDiet" />
          <van-grid-item
            icon="chart-trending-o"
            text="分析"
            @click="goToAnalysis"
          />
          <van-grid-item icon="setting-o" text="目标" @click="goToGoals" />
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getDietSummary } from "@/api/diet";
import {
  formatChineseDate,
  getWeekday,
  getGreeting,
  generateHealthTips,
  useTodayData,
} from "./utils";

const router = useRouter();
const userStore = useUserStore();

const greeting = computed(() => getGreeting());
const currentDate = computed(() => formatChineseDate());
const weekday = computed(() => getWeekday());

// 从 Pinia store 获取用户名
const userName = computed(() => userStore.nickname);

// 使用今日数据 Hook
const { todayData, hasCheckedInToday, refreshData } = useTodayData();

const healthTips = computed(() => generateHealthTips(todayData.value));

// 今日营养摄入数据
const nutritionData = ref<{
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbs?: number;
}>({});

// 加载今日营养数据
async function loadNutritionData() {
  try {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const response = await getDietSummary({ date: dateStr });
    nutritionData.value = (response as any).data || {};
  } catch (error) {
    console.error("加载营养数据失败:", error);
  }
}

// 刷新所有数据
function refreshAllData() {
  refreshData();
  loadNutritionData();
}

onMounted(() => {
  loadNutritionData();
});

// 页面激活时刷新数据
onActivated(() => {
  refreshAllData();
});

// 是否有营养数据
const hasNutritionData = computed(() => {
  return (nutritionData.value.total_calories || 0) > 0;
});

// 今日热量
const todayCalories = computed(() => {
  return Math.round(nutritionData.value.total_calories || 0);
});

// 今日蛋白质
const todayProtein = computed(() => {
  return Math.round(nutritionData.value.total_protein || 0);
});

// 今日碳水
const todayCarbs = computed(() => {
  return Math.round(nutritionData.value.total_carbs || 0);
});

// 今日脂肪
const todayFat = computed(() => {
  return Math.round(nutritionData.value.total_fat || 0);
});

// 热量进度百分比（假设目标是2000kcal）
const caloriesProgress = computed(() => {
  const target = 2000;
  const current = nutritionData.value.total_calories || 0;
  return Math.min(Math.round((current / target) * 100), 100);
});

// 是否已打卡 - 使用 hook 返回的标记
const hasCheckedIn = computed(() => {
  return hasCheckedInToday.value;
});

// 格式化运动时长显示
const exerciseDisplay = computed(() => {
  const minutes = todayData.value.exercise;
  if (!minutes) return "未运动";
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}小时`;
    }
    return `${hours}小时${remainingMinutes}分钟`;
  }
  return `${minutes}分钟`;
});

// 运动类型显示
const exerciseTypeDisplay = computed(() => {
  return todayData.value.exercise_type || "其他运动";
});

// 睡眠时长显示
const sleepDisplay = computed(() => {
  const hours = todayData.value.sleep;
  return hours ? `${hours}小时` : "未记录";
});

// 睡眠质量文本
const sleepQualityText = computed(() => {
  const qualityMap: Record<string, string> = {
    excellent: "优秀",
    good: "良好",
    fair: "一般",
    poor: "较差",
  };
  return qualityMap[todayData.value.sleep_quality || ""] || "未评价";
});

// 心情状态显示
const moodDisplay = computed(() => {
  const moodMap: Record<string, string> = {
    excellent: "心情很好",
    good: "心情不错",
    fair: "心情一般",
    poor: "心情欠佳",
  };
  return moodMap[todayData.value.mood || ""] || "未记录";
});

// 心情图标
const moodIcon = computed(() => {
  const iconMap: Record<string, string> = {
    excellent: "😄",
    good: "😊",
    fair: "😐",
    poor: "😔",
  };
  return iconMap[todayData.value.mood || ""] || "😶";
});

function goToHealth() {
  router.push("/health");
}

function goToDiet() {
  router.push("/diet");
}

function goToGoals() {
  router.push("/goals");
}

function goToAnalysis() {
  router.push("/analysis");
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.home {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-sm;
  padding-bottom: 70px;
}

// 迷你健康建议轮播
.mini-tips {
  margin-bottom: $space-sm;

  .tips-swipe {
    height: 40px;

    :deep(.van-swipe__track) {
      height: 100%;
    }

    :deep(.van-swipe-item) {
      height: 100%;
    }
  }

  .mini-tip-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px $space-sm;
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    color: #333;
    line-height: 1.4;
    height: 100%;

    .tip-icon {
      font-size: 20px;
      color: #f39c12;
      flex-shrink: 0;
    }

    .tip-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
  }
}

.welcome-section {
  margin-bottom: $space-xs;

  .welcome-row {
    display: flex;
    align-items: baseline;
    gap: $space-sm;
    flex-wrap: wrap;
  }

  h2 {
    font-size: $font-size-lg;
    margin: 0;
    color: $text-color;
    white-space: nowrap;
  }

  .date {
    color: $text-color-2;
    font-size: $font-size-xs;
    margin: 0;
    white-space: nowrap;
  }
}

.check-in-card {
  background: $white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .card-header {
    margin-bottom: $space-sm;

    .title-row {
      @include flex-between;
      align-items: center;

      h3 {
        font-size: $font-size-base;
        color: $text-color;
      }
    }
  }

  .checked-in-data {
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 6px;
    }

    .data-card {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px;
      background: $background-color;
      border-radius: $radius-sm;
      transition: all 0.3s;
      margin: 4px 0;

      &:active {
        transform: scale(0.98);
      }

      .card-icon {
        font-size: 35px;
        flex-shrink: 0;
      }

      .card-info {
        flex: 1;
        min-width: 0;

        .card-value {
          font-size: $font-size-base;
          color: $text-color;
          font-weight: 600;
          line-height: 1.2;

          .unit {
            font-size: $font-size-xs;
            font-weight: 400;
            color: $text-color-2;
            margin-left: 1px;
          }
        }

        .card-extra {
          font-size: $font-size-xs;
          color: $text-color-3;
          line-height: 1.2;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .not-checked-in {
    text-align: center;
    padding: $space-md 0;

    .tip-icon {
      font-size: 46px;
      margin-bottom: $space-xs;
    }

    .tip-text {
      font-size: $font-size-sm;
      color: $text-color-2;
      margin-bottom: $space-md;
    }
  }
}

.quick-actions {
  margin-bottom: $space-sm;

  :deep(.van-grid) {
    .van-grid-item__content {
      padding: $space-sm 6px;
      background: $white;
      border-radius: $radius-md;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:active {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .van-grid-item__icon {
      font-size: 35px;
      color: $primary-color;
    }

    .van-grid-item__text {
      margin-top: 6px;
      font-size: $font-size-xs;
      color: $text-color;
      font-weight: 500;
    }
  }
}

.tips-section {
  margin-bottom: $space-lg;

  .section-header {
    @include flex-between;
    align-items: center;
    margin-bottom: $space-md;

    h3 {
      font-size: $font-size-lg;
      color: $text-color;
      margin: 0;
    }

    .tip-count {
      font-size: $font-size-sm;
      color: $text-color-3;
      padding: 4px $space-sm;
      background: $background-color;
      border-radius: $radius-md;
    }
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: $space-sm;

    .tip-card {
      display: flex;
      align-items: flex-start;
      gap: $space-md;
      padding: $space-md;
      background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%);
      border-radius: $radius-lg;
      border-left: 3px solid $primary-color;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .tip-icon {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $primary-color;
        border-radius: 50%;
        color: $white;

        :deep(.van-icon) {
          font-size: 16px;
        }
      }

      .tip-content {
        flex: 1;
        min-width: 0;

        .tip-text {
          margin: 0;
          font-size: $font-size-base;
          color: $text-color;
          line-height: 1.6;
          word-break: break-all;
        }
      }
    }
  }
}

.nutrition-card {
  background: $white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .card-header {
    @include flex-between;
    align-items: center;
    margin-bottom: $space-sm;

    h3 {
      font-size: $font-size-base;
      color: $text-color;
    }

    .view-more {
      font-size: $font-size-xs;
      color: $primary-color;
      cursor: pointer;

      &:active {
        opacity: 0.7;
      }
    }
  }

  .nutrition-data {
    .nutrition-item {
      margin-bottom: $space-sm;

      .item-header {
        @include flex-between;
        margin-bottom: 4px;

        .label {
          font-size: $font-size-sm;
          color: $text-color-2;
        }

        .value {
          font-size: $font-size-lg;
          color: $text-color;
          font-weight: 600;

          .unit {
            font-size: $font-size-xs;
            font-weight: 400;
            color: $text-color-2;
            margin-left: 2px;
          }
        }
      }
    }

    .macros-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-xs;

      .macro-item {
        text-align: center;
        padding: $space-sm;
        background: $background-color;
        border-radius: $radius-sm;

        .macro-icon {
          font-size: 24px;
          margin-bottom: 2px;
        }

        .macro-label {
          font-size: $font-size-xs;
          color: $text-color-2;
          margin-bottom: 2px;
        }

        .macro-value {
          font-size: $font-size-base;
          color: $text-color;
          font-weight: 600;
        }
      }
    }
  }

  .no-nutrition-data {
    text-align: center;
    padding: $space-md 0;

    .empty-icon {
      font-size: 32px;
      margin-bottom: $space-xs;
    }

    .empty-text {
      font-size: $font-size-sm;
      color: $text-color-2;
      margin-bottom: $space-md;
    }
  }
}
</style>

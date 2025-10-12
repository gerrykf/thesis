<template>
  <div class="home">
    <van-nav-bar :title="t('jin-ri-gai-lan')" fixed placeholder />

    <!-- Vue3 Tour 引导 -->
    <v-tour
      name="homeTour"
      :steps="tourSteps"
      :callbacks="tourCallbacks"
      :options="tourOptions"
    ></v-tour>

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
      <div class="check-in-card" data-v-step="1">
        <div class="card-header">
          <div class="title-row">
            <h3>{{ t('jin-ri-da-ka') }}</h3>
            <van-tag v-if="hasCheckedIn" type="success" size="medium"
              >{{ t('yi-da-ka') }}</van-tag
            >
            <van-tag v-else type="warning" size="medium">{{ t('qu-da-ka') }}</van-tag>
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
          <p class="tip-text">{{ t('jin-tian-huan-mei-you-da-kao-ji-lu-yi-xia-ba') }}</p>
          <van-button type="primary" size="small" round @click="goToHealth">
            {{ t('li-ji-da-ka') }} </van-button>
        </div>
      </div>

      <!-- 今日摄入量 -->
      <div class="nutrition-card" data-v-step="2">
        <div class="card-header">
          <h3>{{ t('jin-ri-she-ru') }}</h3>
          <span class="view-more" @click="goToDiet">{{ t('cha-kan-xiang-qing') }}</span>
        </div>

        <div v-if="hasNutritionData" class="nutrition-data">
          <!-- 热量进度条 -->
          <div class="nutrition-item calories">
            <div class="item-header">
              <span class="label">{{ t('re-liang') }}</span>
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
              <div class="macro-label">{{ t('dan-bai-zhi') }}</div>
              <div class="macro-value">{{ t('todayprotein-g', [todayProtein]) }}</div>
            </div>
            <div class="macro-item carbs">
              <div class="macro-icon">🍚</div>
              <div class="macro-label">{{ t('tan-shui') }}</div>
              <div class="macro-value">{{ t('todaycarbs-g', [todayCarbs]) }}</div>
            </div>
            <div class="macro-item fat">
              <div class="macro-icon">🥑</div>
              <div class="macro-label">{{ t('zhi-fang') }}</div>
              <div class="macro-value">{{ t('todayfat-g', [todayFat]) }}</div>
            </div>
          </div>
        </div>

        <div v-else class="no-nutrition-data">
          <div class="empty-icon">🍴</div>
          <p class="empty-text">{{ t('jin-tian-huan-mei-you-yin-shi-ji-lu') }}</p>
          <van-button type="primary" size="small" round @click="goToDiet">
            {{ t('tian-jia-ji-lu') }} </van-button>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions" data-v-step="3">
        <van-grid :column-num="4" :border="false" :gutter="6">
          <van-grid-item icon="add-o" :text="t('da-ka')" @click="goToHealth" />
          <van-grid-item icon="goods-collect-o" :text="t('yin-shi')" @click="goToDiet" />
          <van-grid-item
            icon="chart-trending-o"
            :text="t('fen-xi')"
            @click="goToAnalysis"
          />
          <van-grid-item icon="setting-o" :text="t('mu-biao')" @click="goToGoals" />
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onActivated, getCurrentInstance } from "vue";
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
import { useI18n } from "vue-i18n";

const {t} = useI18n();

const router = useRouter();
const userStore = useUserStore();
const instance = getCurrentInstance();

// Vue3 Tour 引导配置
const tourSteps = ref([
  {
    target: '[data-v-step="1"]',
    header: {
      title: t('jin-ri-da-ka-0'),
    },
    content:
      t('zai-zhe-li-cha-kan-jin-tian-de-jian-kang-da-ka-shu-ju-bao-kuo-ti-zhong-yun-dong-shui-mian-he-xin-qing-zhuang-tai-dian-ji-li-ji-da-ka-an-niu-kai-shi-ji-lu'),
    params: {
      placement: "bottom",
      highlight: true,
    },
  },
  {
    target: '[data-v-step="2"]',
    header: {
      title: t('jin-ri-she-ru-0'),
    },
    content:
      t('zhe-li-xian-shi-jin-tian-de-yin-shi-ying-yang-she-ru-qing-kuang-bao-kuo-ka-lu-li-dan-bai-zhi-tan-shui-he-zhi-fang-dian-ji-tian-jia-ji-lu-kai-shi-ji-lu-yin-shi'),
    params: {
      placement: "bottom",
      highlight: true,
    },
  },
  {
    target: '[data-v-step="3"]',
    header: {
      title: t('kuai-jie-cao-zuo'),
    },
    content:
      t('tong-guo-kuai-jie-an-niu-kuai-su-fang-wen-ge-ge-gong-neng-da-ka-ji-lu-jian-kang-shu-ju-yin-shi-guan-li-ying-yang-she-ru-fen-xi-cha-kan-shu-ju-qu-shi-mu-biao-she-zhi-jian-kang-ji-hua'),
    params: {
      placement: "top",
      highlight: true,
    },
  },
]);

const tourOptions = ref({
  useKeyboardNavigation: true,
  labels: {
    buttonSkip: t('tiao-guo'),
    buttonPrevious: t('shang-yi-bu'),
    buttonNext: t('xia-yi-bu'),
    buttonStop: t('wan-cheng'),
  },
});

const tourCallbacks = ref({
  onStop: () => {
    // 引导结束后,标记用户已完成引导
    localStorage.setItem("homeTourCompleted", "true");
  },
  onSkip: () => {
    // 跳过引导也标记为已完成
    localStorage.setItem("homeTourCompleted", "true");
  },
});

// 检查是否需要显示引导
function checkAndStartTour() {
  const tourCompleted = localStorage.getItem("homeTourCompleted");
  if (!tourCompleted) {
    // 延迟一下让页面完全渲染并等待 tour 组件初始化
    setTimeout(() => {
      if (instance?.proxy?.$tours?.homeTour) {
        instance.proxy.$tours.homeTour.start();
      }
    }, 1000);
  }
}

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
  // 检查并启动引导
  checkAndStartTour();
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
  if (!minutes) return t('wei-yun-dong');
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return t('hours-xiao-shi', [hours]);
    }
    return t('hours-xiao-shi-remainingminutes-fen-zhong', [hours, remainingMinutes]);
  }
  return t('minutes-fen-zhong', [minutes]);
});

// 运动类型显示
const exerciseTypeDisplay = computed(() => {
  return todayData.value.exercise_type || t('qi-ta-yun-dong');
});

// 睡眠时长显示
const sleepDisplay = computed(() => {
  const hours = todayData.value.sleep;
  return hours ? t('hours-xiao-shi-0', [hours]) : t('wei-ji-lu');
});

// 睡眠质量文本
const sleepQualityText = computed(() => {
  const qualityMap: Record<string, string> = {
    excellent: t('you-xiu'),
    good: t('liang-hao'),
    fair: t('yi-ban'),
    poor: t('jiao-cha'),
  };
  return qualityMap[todayData.value.sleep_quality || ""] || t('wei-ping-jia');
});

// 心情状态显示
const moodDisplay = computed(() => {
  const moodMap: Record<string, string> = {
    excellent: t('xin-qing-hen-hao'),
    good: t('xin-qing-bu-cuo'),
    fair: t('xin-qing-yi-ban'),
    poor: t('xin-qing-qian-jia'),
  };
  return moodMap[todayData.value.mood || ""] || t('wei-ji-lu-0');
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
          line-height: 1.3;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
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

// Vue3 Tour 自定义样式
:deep(.v-tour__target--highlighted) {
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4) !important;
  position: relative;
  z-index: 9999;
}

:deep(.v-step) {
  background: $white !important;
  border-radius: $radius-md !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  padding: $space-md !important;
  max-width: 375px !important;
  z-index: 10000 !important;

  .v-step__header {
    margin-bottom: $space-sm !important;

    h3 {
      font-size: $font-size-lg !important;
      color: $text-color !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }
  }

  .v-step__content {
    font-size: $font-size-sm !important;
    color: $text-color-2 !important;
    line-height: 1.6 !important;
    margin-bottom: $space-md !important;
  }

  .v-step__buttons {
    display: flex !important;
    justify-content: space-between !important;
    gap: $space-sm !important;

    button {
      flex: 1 !important;
      padding: 9px $space-md !important;
      border-radius: $radius-sm !important;
      font-size: $font-size-sm !important;
      line-height: 6px;
      border: none !important;
      cursor: pointer !important;
      transition: all 0.3s !important;

      &.v-step__button-skip {
        background: $background-color !important;
        color: $text-color-2 !important;

        &:active {
          opacity: 0.7 !important;
        }
      }

      &.v-step__button-previous {
        background: $background-color !important;
        color: $text-color !important;

        &:active {
          opacity: 0.7 !important;
        }
      }

      &.v-step__button-next,
      &.v-step__button-stop {
        background: $primary-color !important;
        color: $white !important;

        &:active {
          opacity: 0.8 !important;
        }
      }
    }
  }

  .v-step__arrow {
    border-color: $white !important;

    &--dark {
      border-color: $white !important;
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

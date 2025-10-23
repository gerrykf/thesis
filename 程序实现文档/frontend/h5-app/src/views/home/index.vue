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
      <WelcomeSection />

      <!-- 健康建议 - 迷你版轮播 -->
      <HealthTipsSwiper :health-tips="healthTips" />

      <!-- 今日打卡状态 -->
      <CheckInCard
        :has-checked-in="hasCheckedIn"
        :today-data="todayData"
        @go-to-health="goToHealth"
      />

      <!-- 今日摄入量 -->
      <NutritionCard
        :nutrition-data="nutritionData"
        @go-to-diet="goToDiet"
      />

      <!-- 快捷操作 -->
      <QuickActions
        @go-to-health="goToHealth"
        @go-to-diet="goToDiet"
        @go-to-analysis="goToAnalysis"
        @go-to-goals="goToGoals"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onActivated, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { getDietSummary } from "@/api/diet";
import { generateHealthTips, useTodayData } from "./utils";
import { useI18n } from "vue-i18n";
import WelcomeSection from "./components/WelcomeSection.vue";
import HealthTipsSwiper from "./components/HealthTipsSwiper.vue";
import CheckInCard from "./components/CheckInCard.vue";
import NutritionCard from "./components/NutritionCard.vue";
import QuickActions from "./components/QuickActions.vue";

const { t } = useI18n();

const router = useRouter();
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

// 是否已打卡 - 使用 hook 返回的标记
const hasCheckedIn = computed(() => {
  return hasCheckedInToday.value;
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

.home {
  min-height: 100vh;
  background: $background-color;
}

.content {
  padding: $space-sm;
  padding-bottom: 70px;
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
</style>

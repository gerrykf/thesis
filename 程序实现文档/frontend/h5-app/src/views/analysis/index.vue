<template>
  <div class="analysis">
    <van-nav-bar
      :title="t('utils.quickActions.dataAnalysis')"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="content">
      <!-- 时间范围选择 -->
      <div class="date-selector">
        <van-tabs v-model:active="activeTab" @change="onTabChange">
          <van-tab :title="t('7-tian')" name="7" />
          <van-tab :title="t('30-tian')" name="30" />
          <van-tab :title="t('90-tian')" name="90" />
        </van-tabs>
      </div>

      <!-- 数据概览卡片 -->
      <overview-card :overview="overview" :days="Number(activeTab)" />

      <!-- 图表区域 -->
      <div class="charts-section">
        <weight-chart :data="weightData" />
        <nutrition-chart :data="nutritionData" />
        <exercise-chart :data="exerciseData" />
        <sleep-chart :data="sleepData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showLoadingToast, closeToast, showToast } from "vant";
import {
  getStatsWeightTrend,
  getStatsCaloriesTrend,
  getStatsExerciseTrend,
  getStatsSleepQuality,
  getStatsOverview,
} from "@/api/stats";
import OverviewCard from "./components/OverviewCard.vue";
import WeightChart from "./components/WeightChart.vue";
import NutritionChart from "./components/NutritionChart.vue";
import ExerciseChart from "./components/ExerciseChart.vue";
import SleepChart from "./components/SleepChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const activeTab = ref("30");

function onClickLeft() {
  router.back();
}

// 数据状态
const weightData = ref<Array<{ record_date: string; weight: number }>>([]);
const nutritionData = ref<
  Array<{
    record_date: string;
    total_calories: number;
    total_protein: number;
    total_fat: number;
    total_carbs: number;
  }>
>([]);
const exerciseData = ref<
  Array<{
    record_date: string;
    exercise_duration: number;
    exercise_type?: string;
  }>
>([]);
const sleepData = ref<
  Array<{
    record_date: string;
    sleep_hours: number;
    sleep_quality?: string;
  }>
>([]);

const overview = ref<{
  avg_weight?: number;
  avg_exercise_duration?: number;
  avg_sleep_hours?: number;
  avg_daily_calories?: number;
  health_records_count?: number;
  diet_records_count?: number;
  total_calories?: number;
}>();

onMounted(() => {
  loadAllData();
});

/**
 * Tab 切换事件
 */
function onTabChange() {
  loadAllData();
}

/**
 * 加载所有数据
 */
async function loadAllData() {
  showLoadingToast({
    message: t("common.loading"),
    forbidClick: true,
    duration: 0,
  });

  try {
    const days = Number(activeTab.value);

    // 并行加载所有数据
    const [weightRes, nutritionRes, exerciseRes, sleepRes, overviewRes] =
      await Promise.all([
        getStatsWeightTrend({ days }),
        getStatsCaloriesTrend({ days }),
        getStatsExerciseTrend({ days }),
        getStatsSleepQuality({ days }),
        getStatsOverview({ days }),
      ]);

    // 处理体重数据
    if ((weightRes as any).data) {
      weightData.value = ((weightRes as any).data || []).map((item: any) => ({
        record_date: item.record_date,
        weight: Number(item.weight),
      }));
    }

    // 处理营养数据
    if ((nutritionRes as any).data) {
      nutritionData.value = ((nutritionRes as any).data || []).map(
        (item: any) => ({
          record_date: item.record_date,
          total_calories: Number(item.total_calories || 0),
          total_protein: Number(item.total_protein || 0),
          total_fat: Number(item.total_fat || 0),
          total_carbs: Number(item.total_carbs || 0),
        })
      );
    }

    // 处理运动数据
    if ((exerciseRes as any).data) {
      exerciseData.value = ((exerciseRes as any).data || []).map(
        (item: any) => ({
          record_date: item.record_date,
          exercise_duration: Number(item.exercise_duration || 0),
          exercise_type: item.exercise_type,
        })
      );
    }

    // 处理睡眠数据
    if ((sleepRes as any).data?.sleep_trend) {
      sleepData.value = ((sleepRes as any).data.sleep_trend || []).map(
        (item: any) => ({
          record_date: item.record_date,
          sleep_hours: Number(item.sleep_hours || 0),
          sleep_quality: item.sleep_quality,
        })
      );
    }

    // 处理概览数据
    if ((overviewRes as any).data) {
      overview.value = (overviewRes as any).data;
    }

    closeToast();
  } catch (error) {
    console.error("加载数据失败:", error);
    closeToast();
    showToast({
      message: t("jia-zai-shu-ju-shi-bai"),
      icon: "fail",
    });
  }
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;

.analysis {
  min-height: 100vh;
  background: $background-color;

  // 确保导航栏在最上层
  :deep(.van-nav-bar) {
    z-index: 999;
  }
}

.content {
  padding: 0 0 70px 0;
}

.date-selector {
  background: $white;
  margin-bottom: $space-md;

  :deep(.van-tabs__wrap) {
    position: sticky;
    top: 46px;
    z-index: 99;
  }

  :deep(.van-tabs__line) {
    background: $primary-color;
  }
}

:deep(.overview-card) {
  margin: 0 $space-md $space-lg;
}

.charts-section {
  padding: 0 $space-md;
}
</style>

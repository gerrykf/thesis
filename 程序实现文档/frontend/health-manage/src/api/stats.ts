// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取热量摄入趋势 获取用户每日热量摄入趋势数据 GET /api/stats/calories-trend */
export async function getStatsCaloriesTrend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsCaloriesTrendParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      record_date?: string;
      total_calories?: number;
      total_protein?: number;
      total_fat?: number;
      total_carbs?: number;
    }[];
  }>("/api/stats/calories-trend", {
    method: "GET",
    params: {
      // days has a default value: 30
      days: "30",
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取运动趋势 获取用户运动时长趋势数据 GET /api/stats/exercise-trend */
export async function getStatsExerciseTrend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsExerciseTrendParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      record_date?: string;
      exercise_duration?: number;
      exercise_type?: string;
    }[];
  }>("/api/stats/exercise-trend", {
    method: "GET",
    params: {
      // days has a default value: 30
      days: "30",
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取营养分析 获取用户营养摄入分析和三大营养素比例 GET /api/stats/nutrition-analysis */
export async function getStatsNutritionAnalysis(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsNutritionAnalysisParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      total_calories?: number;
      total_protein?: number;
      total_fat?: number;
      total_carbs?: number;
      protein_percentage?: number;
      fat_percentage?: number;
      carbs_percentage?: number;
    };
  }>("/api/stats/nutrition-analysis", {
    method: "GET",
    params: {
      // days has a default value: 7
      days: "7",
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取统计概览 获取用户健康数据的统计概览 GET /api/stats/overview */
export async function getStatsOverview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsOverviewParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      health_records_count?: number;
      diet_records_count?: number;
      avg_weight?: number;
      avg_exercise_duration?: number;
      avg_sleep_hours?: number;
      total_calories?: number;
      avg_daily_calories?: number;
    };
  }>("/api/stats/overview", {
    method: "GET",
    params: {
      // days has a default value: 7
      days: "7",
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取睡眠质量统计 获取用户睡眠质量分布统计 GET /api/stats/sleep-quality */
export async function getStatsSleepQuality(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsSleepQualityParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      sleep_trend?: {
        record_date?: string;
        sleep_hours?: number;
        sleep_quality?: string;
      }[];
      quality_distribution?: Record<string, any>;
    };
  }>("/api/stats/sleep-quality", {
    method: "GET",
    params: {
      // days has a default value: 30
      days: "30",
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取体重趋势 获取用户体重变化趋势数据 GET /api/stats/weight-trend */
export async function getStatsWeightTrend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStatsWeightTrendParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: { record_date?: string; weight?: number }[];
  }>("/api/stats/weight-trend", {
    method: "GET",
    params: {
      // days has a default value: 30
      days: "30",
      ...params,
    },
    ...(options || {}),
  });
}

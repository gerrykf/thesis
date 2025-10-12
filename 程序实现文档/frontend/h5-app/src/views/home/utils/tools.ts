/**
 * Home模块工具函数
 */

import i18n from "@/i18n";
import { greetingConfig, healthScoreConfig } from "./options";
import type { HealthData } from "./types";

/**
 * 格式化日期为中文格式
 * @param date 待格式化的日期对象，默认为当前日期
 * @returns 中文格式的日期字符串，如"2025年10月4日"
 */
export function formatChineseDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${i18n.global.t("year")}${month}${i18n.global.t(
    "yue"
  )}${day}${i18n.global.t("ri")}`;
}

/**
 * 获取当前星期几
 * @param date 待查询的日期对象，默认为当前日期
 * @returns 中文格式的星期字符串，如"星期一"
 */
export function getWeekday(date: Date = new Date()): string {
  const weekdays = [
    i18n.global.t("utils.weekdays.sunday"),
    i18n.global.t("utils.weekdays.monday"),
    i18n.global.t("utils.weekdays.tuesday"),
    i18n.global.t("utils.weekdays.wednesday"),
    i18n.global.t("utils.weekdays.thursday"),
    i18n.global.t("utils.weekdays.friday"),
    i18n.global.t("utils.weekdays.saturday"),
  ];
  const day = date.getDay();
  return weekdays[day] ?? i18n.global.t("utils.weekdays.sunday");
}

/**
 * 获取问候语
 * @returns 根据当前时间返回对应的问候语，如"早上好"、"下午好"
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  const config = greetingConfig.find(
    (item) => hour >= item.start && hour < item.end
  );
  return config?.text ?? "你好";
}

/**
 * 计算健康评分
 * @param data 健康数据对象，包含体重、运动、睡眠、卡路里等指标
 * @returns 综合健康评分，范围0-100
 */
export function calculateHealthScore(data: HealthData): number {
  let score = 0;
  const config = healthScoreConfig;

  // 体重评分
  if (
    data.weight >= config.weight.idealMin &&
    data.weight <= config.weight.idealMax
  ) {
    score += config.weight.score;
  } else if (
    data.weight >= config.weight.min &&
    data.weight <= config.weight.max
  ) {
    score += config.weight.score * 0.6;
  } else {
    score += config.weight.score * 0.2;
  }

  // 运动评分
  if (data.exercise >= config.exercise.recommended) {
    score += config.exercise.score;
  } else if (data.exercise >= config.exercise.recommended * 0.5) {
    score += config.exercise.score * 0.6;
  } else {
    score += config.exercise.score * 0.2;
  }

  // 睡眠评分
  if (
    data.sleep >= config.sleep.idealMin &&
    data.sleep <= config.sleep.idealMax
  ) {
    score += config.sleep.score;
  } else if (
    data.sleep >= config.sleep.idealMin - 1 &&
    data.sleep <= config.sleep.idealMax + 1
  ) {
    score += config.sleep.score * 0.6;
  } else {
    score += config.sleep.score * 0.2;
  }

  // 卡路里评分
  if (
    data.calories >= config.calories.idealMin &&
    data.calories <= config.calories.idealMax
  ) {
    score += config.calories.score;
  } else if (
    data.calories >= config.calories.min &&
    data.calories <= config.calories.max
  ) {
    score += config.calories.score * 0.6;
  } else {
    score += config.calories.score * 0.2;
  }

  return Math.round(score);
}

/**
 * 获取健康评价
 * @param score 健康评分，范围0-100
 * @returns 健康等级评价，如"优秀"、"良好"、"一般"、"需要改善"
 */
export function getHealthComment(score: number): string {
  if (score >= 80) return i18n.global.t("utils.healthComment.excellent");
  if (score >= 60) return i18n.global.t("utils.healthComment.good");
  if (score >= 40) return i18n.global.t("utils.healthComment.average");
  return i18n.global.t("utils.healthComment.needsImprovement");
}

/**
 * 生成健康建议
 * @param data 健康数据对象，包含体重、运动、睡眠、卡路里等指标
 * @returns 健康建议文本数组，针对不达标的指标提供改善建议
 */
export function generateHealthTips(data: HealthData): string[] {
  const tips: string[] = [];
  const config = healthScoreConfig;

  if (data.sleep < config.sleep.idealMin) {
    tips.push(i18n.global.t("utils.healthTips.insufficientSleep"));
  }

  if (data.exercise < config.exercise.recommended) {
    tips.push(i18n.global.t("utils.healthTips.insufficientExercise"));
  }

  if (data.calories < config.calories.idealMin) {
    tips.push(i18n.global.t("utils.healthTips.lowCalories"));
  }

  if (data.calories > config.calories.idealMax) {
    tips.push(i18n.global.t("utils.healthTips.highCalories"));
  }

  if (data.weight > config.weight.idealMax) {
    tips.push(i18n.global.t("utils.healthTips.overweight"));
  }

  if (data.weight < config.weight.idealMin && data.weight > 0) {
    tips.push(i18n.global.t("utils.healthTips.underweight"));
  }

  if (tips.length === 0) {
    tips.push(i18n.global.t("utils.healthTips.keepItUp"));
  }

  return tips;
}

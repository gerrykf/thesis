/**
 * Home模块配置选项
 */

import i18n from "@/i18n";
import type { QuickAction, HealthTip } from "./types";

/**
 * 快捷操作列表
 */
export const quickActions: QuickAction[] = [
  {
    icon: "add-o",
    text: i18n.global.t("utils.quickActions.healthCheckIn"),
    path: "/health",
  },
  {
    icon: "goods-collect-o",
    text: i18n.global.t("utils.quickActions.dietRecord"),
    path: "/diet",
  },
  {
    icon: "chart-trending-o",
    text: i18n.global.t("utils.quickActions.dataAnalysis"),
    path: "/analysis",
  },
  {
    icon: "setting-o",
    text: i18n.global.t("utils.quickActions.goalSetting"),
    path: "/settings",
  },
];

/**
 * 默认健康建议列表
 */
export const defaultHealthTips: HealthTip[] = [
  {
    id: "1",
    title: i18n.global.t("utils.defaultHealthTips.sleep.title"),
    description: i18n.global.t("utils.defaultHealthTips.sleep.description"),
    icon: "smile-o",
  },
  {
    id: "2",
    title: i18n.global.t("utils.defaultHealthTips.exercise.title"),
    description: i18n.global.t("utils.defaultHealthTips.exercise.description"),
    icon: "fire-o",
  },
  {
    id: "3",
    title: i18n.global.t("utils.defaultHealthTips.diet.title"),
    description: i18n.global.t("utils.defaultHealthTips.diet.description"),
    icon: "gift-o",
  },
];

/**
 * 健康评分配置
 */
export const healthScoreConfig = {
  weight: {
    min: 40,
    max: 100,
    idealMin: 60,
    idealMax: 70,
    score: 25,
  },
  exercise: {
    min: 0,
    recommended: 30,
    score: 25,
  },
  sleep: {
    min: 0,
    max: 24,
    idealMin: 7,
    idealMax: 8,
    score: 25,
  },
  calories: {
    min: 800,
    max: 3000,
    idealMin: 1500,
    idealMax: 2000,
    score: 25,
  },
};

/**
 * 问候语配置
 */
export const greetingConfig = [
  { start: 0, end: 6, text: i18n.global.t("utils.greeting.lateNight") },
  { start: 6, end: 9, text: i18n.global.t("utils.greeting.morning") },
  { start: 9, end: 12, text: i18n.global.t("utils.greeting.forenoon") },
  { start: 12, end: 14, text: i18n.global.t("utils.greeting.noon") },
  { start: 14, end: 18, text: i18n.global.t("utils.greeting.afternoon") },
  { start: 18, end: 22, text: i18n.global.t("utils.greeting.evening") },
  { start: 22, end: 24, text: i18n.global.t("utils.greeting.lateNight") },
];

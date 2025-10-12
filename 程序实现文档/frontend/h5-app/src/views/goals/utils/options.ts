/**
 * Goals模块配置选项
 */

import i18n from "@/i18n";
import type { GoalType, GoalStatus } from "./types";

/**
 * 目标类型到单位的映射
 */
export const goalTypeUnitMap: Record<GoalType, string> = {
  weight: "kg",
  exercise: i18n.global.t("fen-zhong"),
  calories: "kcal",
  custom: "",
};

/**
 * 目标类型中文名称映射
 */
export const goalTypeTextMap: Record<GoalType, string> = {
  weight: i18n.global.t("ti-zhong"),
  exercise: i18n.global.t("yun-dong"),
  calories: i18n.global.t("re-liang"),
  custom: i18n.global.t("zi-ding-yi"),
};

/**
 * 目标状态中文名称映射
 */
export const goalStatusTextMap: Record<GoalStatus, string> = {
  active: i18n.global.t("jin-hang-zhong"),
  completed: i18n.global.t("yi-wan-cheng"),
  paused: i18n.global.t("yi-zan-ting"),
  cancelled: i18n.global.t("yi-qu-xiao"),
};

/**
 * 目标状态颜色映射
 */
export const goalStatusColorMap: Record<GoalStatus, string> = {
  active: '#1989fa',
  completed: '#07c160',
  paused: '#ff976a',
  cancelled: '#969799'
}

/**
 * History模块工具函数
 */

import i18n from "@/i18n";

export * from "./types";
export * from "./hooks";

/**
 * 格式化日期范围
 */
export function formatDateRange(start: string, end: string): string {
  return `${start} ${i18n.global.t("dao")} ${end}`;
}

/**
 * 获取最近N天的日期列表
 */
export function getRecentDays(days: number = 7): string[] {
  const result: string[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    if (dateStr) {
      result.push(dateStr)
    }
  }
  return result
}

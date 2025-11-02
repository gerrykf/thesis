/**
 * 日期时间工具函数
 * 统一使用北京时间（Asia/Shanghai，UTC+8）
 */

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 扩展 dayjs 插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区为北京时间
const BEIJING_TIMEZONE = "Asia/Shanghai";

/**
 * 格式化日期时间为北京时间
 * @param dateString 日期字符串
 * @param format 格式化模板，默认为 "YYYY-MM-DD HH:mm:ss"
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(
  dateString: string | null | undefined,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string {
  if (!dateString) return "-";

  try {
    // 如果后端返回的是普通日期字符串（无时区信息），直接格式化
    // 因为后端存储的已经是北京时间（UTC+8）
    // 不要再用 .tz() 转换，否则会重复加 8 小时
    return dayjs(dateString).format(format);
  } catch (error) {
    console.error("日期格式化失败:", error);
    return "-";
  }
}

/**
 * 格式化日期为北京时间（不含时间）
 * @param dateString 日期字符串
 * @param format 格式化模板，默认为 "YYYY-MM-DD"
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateString: string | null | undefined,
  format: string = "YYYY-MM-DD"
): string {
  if (!dateString) return "-";

  try {
    // 后端返回的已经是北京时间，直接格式化
    return dayjs(dateString).format(format);
  } catch (error) {
    console.error("日期格式化失败:", error);
    return "-";
  }
}

/**
 * 格式化时间（仅时间部分）
 * @param dateString 日期字符串
 * @param format 格式化模板，默认为 "HH:mm:ss"
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  dateString: string | null | undefined,
  format: string = "HH:mm:ss"
): string {
  if (!dateString) return "-";

  try {
    // 后端返回的已经是北京时间，直接格式化
    return dayjs(dateString).format(format);
  } catch (error) {
    console.error("时间格式化失败:", error);
    return "-";
  }
}

/**
 * 格式化为相对时间（如：2小时前）
 * @param dateString 日期字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    // 后端返回的已经是北京时间，直接使用
    const targetTime = dayjs(dateString);
    const now = dayjs();

    const diffMinutes = now.diff(targetTime, "minute");
    const diffHours = now.diff(targetTime, "hour");
    const diffDays = now.diff(targetTime, "day");

    if (diffMinutes < 1) {
      return "刚刚";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error("相对时间格式化失败:", error);
    return "-";
  }
}

/**
 * 获取当前北京时间
 * @param format 格式化模板，默认为 "YYYY-MM-DD HH:mm:ss"
 * @returns 格式化后的当前时间
 */
export function getNow(format: string = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs().tz(BEIJING_TIMEZONE).format(format);
}

/**
 * 获取北京时间的 dayjs 对象
 * @param dateString 可选的日期字符串
 * @returns dayjs 对象（北京时区）
 */
export function getBeijingTime(dateString?: string | null) {
  if (dateString) {
    return dayjs(dateString).tz(BEIJING_TIMEZONE);
  }
  return dayjs().tz(BEIJING_TIMEZONE);
}

/**
 * 计算年龄（基于北京时间）
 * @param birthday 生日字符串
 * @returns 年龄
 */
export function calculateAge(birthday: string | null | undefined): number {
  if (!birthday) return 0;

  try {
    const today = dayjs();
    const birthDate = dayjs(birthday);

    let age = today.year() - birthDate.year();
    const monthDiff = today.month() - birthDate.month();

    if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
      age--;
    }

    return age;
  } catch (error) {
    console.error("年龄计算失败:", error);
    return 0;
  }
}

// 导出常用格式
export const DATE_FORMATS = {
  DATE: "YYYY-MM-DD",
  TIME: "HH:mm:ss",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
  DATETIME_SHORT: "MM-DD HH:mm",
  DATE_CN: "YYYY年MM月DD日",
  DATETIME_CN: "YYYY年MM月DD日 HH:mm:ss"
};

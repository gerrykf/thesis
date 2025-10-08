// 用户管理模块工具函数

import { sleepQualityOptions, moodOptions } from "./options";
import { SleepQuality, Mood } from "./enums";

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("zh-CN");
}

/**
 * 格式化日期为短格式
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDateShort(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("zh-CN");
}

/**
 * 获取睡眠质量文本
 * @param quality 睡眠质量值
 * @returns 睡眠质量文本
 */
export function getSleepQualityText(quality: number): string {
  const option = sleepQualityOptions.find(item => item.value === quality);
  return option?.label || "未知";
}

/**
 * 获取睡眠质量标签类型
 * @param quality 睡眠质量值
 * @returns 标签类型
 */
export function getSleepQualityType(quality: number): string {
  const option = sleepQualityOptions.find(item => item.value === quality);
  return option?.type || "info";
}

/**
 * 获取心情文本
 * @param mood 心情值
 * @returns 心情文本
 */
export function getMoodText(mood: number): string {
  const option = moodOptions.find(item => item.value === mood);
  return option?.label || "未知";
}

/**
 * 获取心情标签类型
 * @param mood 心情值
 * @returns 标签类型
 */
export function getMoodType(mood: number): string {
  const option = moodOptions.find(item => item.value === mood);
  return option?.type || "info";
}

/**
 * 获取用户角色文本
 * @param role 用户角色
 * @returns 角色文本
 */
export function getUserRoleText(role: string): string {
  const roleMap = {
    admin: "管理员",
    user: "普通用户"
  };
  return roleMap[role as keyof typeof roleMap] || "未知";
}

/**
 * 获取用户角色标签类型
 * @param role 用户角色
 * @returns 标签类型
 */
export function getUserRoleType(role: string): string {
  const typeMap = {
    admin: "danger",
    user: "primary"
  };
  return typeMap[role as keyof typeof typeMap] || "info";
}

/**
 * 获取用户状态文本
 * @param isActive 用户状态
 * @returns 状态文本
 */
export function getUserStatusText(isActive: boolean): string {
  return isActive ? "启用" : "禁用";
}

/**
 * 获取用户状态标签类型
 * @param isActive 用户状态
 * @returns 标签类型
 */
export function getUserStatusType(isActive: boolean): string {
  return isActive ? "success" : "info";
}

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证邮箱格式
 * @param email 邮箱
 * @returns 是否有效
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 脱敏手机号
 * @param phone 手机号
 * @returns 脱敏后的手机号
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

/**
 * 脱敏邮箱
 * @param email 邮箱
 * @returns 脱敏后的邮箱
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [username, domain] = email.split("@");
  if (username.length <= 2) return email;
  const maskedUsername =
    username.charAt(0) +
    "*".repeat(username.length - 2) +
    username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

/**
 * 生成随机颜色
 * @returns 随机颜色值
 */
export function generateRandomColor(): string {
  const colors = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 计算年龄
 * @param birthday 生日
 * @returns 年龄
 */
export function calculateAge(birthday: string): number {
  if (!birthday) return 0;
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * 导出用户数据为CSV
 * @param users 用户列表
 */
export function exportUsersToCSV(users: API.User[]): void {
  const headers = [
    "ID",
    "用户名",
    "昵称",
    "邮箱",
    "手机号",
    "角色",
    "状态",
    "注册时间"
  ];
  const csvContent = [
    headers.join(","),
    ...users.map(user =>
      [
        user.id,
        user.username,
        user.nickname || "",
        user.email || "",
        user.phone || "",
        getUserRoleText(user.role || ""),
        getUserStatusText(user.is_active || false),
        formatDate(user.created_at || "")
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `users_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

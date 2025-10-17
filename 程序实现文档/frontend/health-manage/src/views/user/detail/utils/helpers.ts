/**
 * 用户详情页面工具函数
 */

// 格式化日期
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("zh-CN");
};

// 格式化日期时间
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("zh-CN");
};

// 获取性别文本
export const getGenderText = (gender: string): string => {
  const map: Record<string, string> = {
    male: "男",
    female: "女"
  };
  return map[gender] || "-";
};

// 获取睡眠质量类型
export const getSleepQualityType = (quality: string): any => {
  const map: Record<string, string> = {
    excellent: "success",
    good: "primary",
    fair: "warning",
    poor: "danger"
  };
  return map[quality] || "info";
};

// 获取睡眠质量文本
export const getSleepQualityText = (quality: string): string => {
  const map: Record<string, string> = {
    excellent: "优秀",
    good: "良好",
    fair: "一般",
    poor: "较差"
  };
  return map[quality] || quality;
};

// 获取心情类型
export const getMoodType = (mood: string): any => {
  const map: Record<string, string> = {
    excellent: "success",
    good: "primary",
    fair: "warning",
    poor: "danger"
  };
  return map[mood] || "info";
};

// 获取心情文本
export const getMoodText = (mood: string): string => {
  const map: Record<string, string> = {
    excellent: "很好",
    good: "不错",
    fair: "一般",
    poor: "较差"
  };
  return map[mood] || mood;
};

// 获取餐次文本
export const getMealTypeText = (mealType: string): string => {
  const map: Record<string, string> = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "加餐"
  };
  return map[mealType] || mealType;
};

// 获取餐次标签类型
export const getMealTypeTagType = (mealType: string): any => {
  const map: Record<string, string> = {
    breakfast: "success",
    lunch: "primary",
    dinner: "warning",
    snack: "info"
  };
  return map[mealType] || "info";
};

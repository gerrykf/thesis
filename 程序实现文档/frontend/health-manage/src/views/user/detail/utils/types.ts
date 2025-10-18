/**
 * 用户详情页面类型定义
 */

// 用户信息类型
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  height: number;
  target_weight: number;
  avatar: string;
  role: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

// 健康统计数据类型
export interface HealthStats {
  totalRecords: number;
  dietRecords: number;
  activeGoals: number;
  activeDays: number;
}

// 健康记录类型
export interface HealthRecord {
  id: number;
  record_date: string;
  weight?: number;
  exercise_duration?: number;
  exercise_type?: string;
  sleep_hours?: number;
  sleep_quality?: string;
  mood?: string;
  notes?: string;
}

// 饮食记录类型
export interface DietRecord {
  id: number;
  user_id: number;
  food_id: number;
  record_date: string;
  meal_type: string;
  meal_time?: string;
  quantity: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sodium?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  food_name: string;
  category?: string;
  food_calories_per_100g?: number;
  food_protein_per_100g?: number;
  food_fat_per_100g?: number;
  food_carbs_per_100g?: number;
  food_fiber_per_100g?: number;
}

// 角色选项类型
export interface RoleOption {
  id: number;
  name: string;
  code: string;
}

// 编辑表单类型
export interface EditUserForm {
  nickname: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "";
  birth_date: string;
  height: number | null;
  target_weight: number | null;
  role_id: number | null;
}

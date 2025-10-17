// 用户管理模块类型定义

export interface UserListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  nickname?: string;
  role?: string;
  is_active?: boolean;
  createdStartDate?: string;
  createdEndDate?: string;
  loginStartDate?: string;
  loginEndDate?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  adminUsers: number;
}

export interface UserInfo extends API.User {
  // 扩展用户信息字段
}

export interface HealthStats {
  totalRecords?: number;
  dietRecords?: number;
  activeGoals?: number;
  activeDays?: number;
}

export interface SearchForm {
  username: string;
  nickname: string;
  role: string;
  is_active: boolean | null;
  createdDateRange: [string, string] | null;
  loginDateRange: [string, string] | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 表格操作类型
export type TableAction = "view" | "edit" | "delete" | "toggle-status";

// 用户状态操作结果
export interface UserActionResult {
  success: boolean;
  message?: string;
  data?: any;
}

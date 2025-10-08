// 用户管理模块枚举定义

// 用户角色枚举
export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

// 睡眠质量枚举
export enum SleepQuality {
  EXCELLENT = 5,
  GOOD = 4,
  FAIR = 3,
  POOR = 2,
  TERRIBLE = 1
}

// 心情枚举
export enum Mood {
  VERY_HAPPY = 5,
  HAPPY = 4,
  NEUTRAL = 3,
  SAD = 2,
  VERY_SAD = 1
}

// 表格操作枚举
export enum TableActionType {
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete",
  TOGGLE_STATUS = "toggle-status"
}

// 统计卡片类型枚举
export enum StatCardType {
  TOTAL_USERS = "total-users",
  ACTIVE_USERS = "active-users",
  NEW_USERS = "new-users",
  ADMIN_USERS = "admin-users"
}

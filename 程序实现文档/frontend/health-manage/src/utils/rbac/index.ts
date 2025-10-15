/**
 * RBAC (Role-Based Access Control) 权限管理工具
 * 统一导出角色和权限相关的枚举和工具函数
 */

// 导出角色相关
export {
  RoleCode,
  RoleId,
  RoleNames,
  RoleDescriptions,
  getRoleIdByCode,
  getRoleCodeById,
  isAdminRole,
  isSuperAdminRole
} from "./roles";

// 导出权限相关
export {
  HomePermission,
  HealthPermission,
  FoodPermission,
  DietPermission,
  UserPermission,
  RolePermission,
  PermissionGroups,
  PermissionDescriptions,
  isPermissionInGroup,
  getPermissionGroup
} from "./permissions";

export type { Permission } from "./permissions";

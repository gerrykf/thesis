/**
 * 权限枚举
 * 统一管理系统中的权限标识
 * 对应数据库 menus 表的 permission 字段
 */

/**
 * 首页权限
 */
export enum HomePermission {
  /** 用户欢迎页 */
  WELCOME = "home.welcome",
  /** 管理员仪表盘 */
  DASHBOARD = "home.dashboard"
}

/**
 * 健康管理权限
 */
export enum HealthPermission {
  /** 查看自己的健康记录 */
  VIEW_OWN = "health.view.own",
  /** 查看所有健康记录 */
  VIEW_ALL = "health.view.all",
  /** 我的健康记录 */
  RECORDS = "health.records",
  /** 所有健康记录 */
  ALL_RECORDS = "health.all-records",
  /** 新增健康记录 */
  ADD = "health.add",
  /** 编辑健康记录 */
  EDIT = "health.edit",
  /** 删除健康记录 */
  DELETE = "health.delete"
}

/**
 * 食物管理权限
 */
export enum FoodPermission {
  /** 食物列表 */
  LIST = "food.list",
  /** 查看食物 */
  VIEW = "food.view",
  /** 新增食物 */
  ADD = "food.add",
  /** 编辑食物 */
  EDIT = "food.edit",
  /** 删除食物 */
  DELETE = "food.delete"
}

/**
 * 饮食计划权限
 */
export enum DietPermission {
  /** 饮食计划 */
  PLAN = "diet.plan",
  /** 查看饮食计划 */
  VIEW = "diet.view",
  /** 生成饮食计划 */
  GENERATE = "diet.generate",
  /** 管理饮食计划 */
  MANAGE = "diet.manage"
}

/**
 * 用户管理权限
 */
export enum UserPermission {
  /** 用户列表 */
  LIST = "user.list",
  /** 查看用户 */
  VIEW = "user.view",
  /** 编辑用户 */
  EDIT = "user.edit",
  /** 删除用户 */
  DELETE = "user.delete",
  /** 修改用户角色 */
  ROLE_CHANGE = "user.role.change"
}

/**
 * 角色管理权限
 */
export enum RolePermission {
  /** 角色管理 */
  MANAGE = "role.manage",
  /** 查看角色 */
  VIEW = "role.view",
  /** 新增角色 */
  ADD = "role.add",
  /** 编辑角色 */
  EDIT = "role.edit",
  /** 删除角色 */
  DELETE = "role.delete",
  /** 权限配置 */
  PERMISSION = "role.permission"
}

/**
 * 所有权限的联合类型
 */
export type Permission =
  | HomePermission
  | HealthPermission
  | FoodPermission
  | DietPermission
  | UserPermission
  | RolePermission;

/**
 * 权限分组
 */
export const PermissionGroups = {
  /** 首页权限 */
  home: HomePermission,
  /** 健康管理权限 */
  health: HealthPermission,
  /** 食物管理权限 */
  food: FoodPermission,
  /** 饮食计划权限 */
  diet: DietPermission,
  /** 用户管理权限 */
  user: UserPermission,
  /** 角色管理权限 */
  role: RolePermission
};

/**
 * 权限描述映射
 */
export const PermissionDescriptions: Record<string, string> = {
  // 首页权限
  [HomePermission.WELCOME]: "访问用户欢迎页",
  [HomePermission.DASHBOARD]: "访问管理员仪表盘",

  // 健康管理权限
  [HealthPermission.VIEW_OWN]: "查看自己的健康记录",
  [HealthPermission.VIEW_ALL]: "查看所有用户的健康记录",
  [HealthPermission.RECORDS]: "访问我的健康记录页面",
  [HealthPermission.ALL_RECORDS]: "访问所有健康记录页面",
  [HealthPermission.ADD]: "新增健康记录",
  [HealthPermission.EDIT]: "编辑健康记录",
  [HealthPermission.DELETE]: "删除健康记录",

  // 食物管理权限
  [FoodPermission.LIST]: "访问食物列表页面",
  [FoodPermission.VIEW]: "查看食物详情",
  [FoodPermission.ADD]: "新增食物",
  [FoodPermission.EDIT]: "编辑食物",
  [FoodPermission.DELETE]: "删除食物",

  // 饮食计划权限
  [DietPermission.PLAN]: "访问饮食计划页面",
  [DietPermission.VIEW]: "查看饮食计划",
  [DietPermission.GENERATE]: "生成饮食计划",
  [DietPermission.MANAGE]: "管理饮食计划",

  // 用户管理权限
  [UserPermission.LIST]: "访问用户列表页面",
  [UserPermission.VIEW]: "查看用户详情",
  [UserPermission.EDIT]: "编辑用户信息",
  [UserPermission.DELETE]: "删除用户",
  [UserPermission.ROLE_CHANGE]: "修改用户角色",

  // 角色管理权限
  [RolePermission.MANAGE]: "访问角色管理页面",
  [RolePermission.VIEW]: "查看角色信息",
  [RolePermission.ADD]: "新增角色",
  [RolePermission.EDIT]: "编辑角色",
  [RolePermission.DELETE]: "删除角色",
  [RolePermission.PERMISSION]: "配置角色权限"
};

/**
 * 检查权限是否属于某个分组
 */
export function isPermissionInGroup(
  permission: string,
  group: keyof typeof PermissionGroups
): boolean {
  return permission.startsWith(`${group}.`);
}

/**
 * 获取权限所属分组
 */
export function getPermissionGroup(
  permission: string
): keyof typeof PermissionGroups | null {
  const prefix = permission.split(".")[0];
  return Object.keys(PermissionGroups).includes(prefix)
    ? (prefix as keyof typeof PermissionGroups)
    : null;
}

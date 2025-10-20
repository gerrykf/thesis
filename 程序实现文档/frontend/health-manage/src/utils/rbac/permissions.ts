/**
 * 权限枚举
 * 统一管理系统中的权限标识
 * 对应数据库 menus 表的 permission 字段
 */

/**
 * 首页权限
 */
export enum HomePermission {
  /** 管理员仪表盘 */
  DASHBOARD = "home.dashboard"
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
 * 用户管理权限
 */
export enum UserPermission {
  /** 用户列表 */
  LIST = "user.list",
  /** 查看用户详情 */
  VIEW = "user.view",
  /** 编辑用户 */
  ADD = "user.add",
  /** 编辑用户 */
  EDIT = "user.edit",
  /** 删除用户 */
  DELETE = "user.delete",
  /** 修改用户角色 */
  ROLE_CHANGE = "user.role.change",
  /** 访问用户仪表盘 */
  DASHBOARD = "user.dashboard",
  /** 禁用用户 */
  DISABLE = "user.disable"
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

export enum MenuPermission {
  /** 菜单管理 */
  MANAGE = "menu.manage",
  /** 查看菜单 */
  VIEW = "menu.view",
  ADD_MENU = "menu.add_menu",
  /** 新增菜单 */
  ADD = "menu.add",
  /** 编辑菜单 */
  EDIT = "menu.edit",
  /** 删除菜单 */
  DELETE = "menu.delete"
}

export enum OnlinePermission {
  /** 在线用户管理 */
  MANAGE = "online.manage",
  /** 查看在线用户 */
  VIEW = "online.view",
  /** 强制下线 */
  FORCE_LOGOUT = "online.force_logout"
}

export enum LoginLogPermission {
  /** 登录日志管理 */
  MANAGE = "login_log.manage",
  /** 查看登录日志 */
  VIEW = "login_log.view",
  CLEAR_ALL = "login_log.clear_all",
  /** 批量删除登录日志 */
  PATCH = "login_log.patch"
}

export enum OperationLogPermission {
  /** 操作日志管理 */
  MANAGE = "operation_log.manage",
  /** 查看操作日志 */
  VIEW = "operation_log.view",
  CLEAR_ALL = "operation_log.clear_all",
  /** 批量删除操作日志 */
  PATCH = "operation_log.patch"
}

/**
 * 所有权限的联合类型
 */
export type Permission =
  | HomePermission
  | FoodPermission
  | UserPermission
  | RolePermission
  | MenuPermission
  | OnlinePermission
  | LoginLogPermission
  | OperationLogPermission;

/**
 * 权限分组
 */
export const PermissionGroups = {
  /** 首页权限 */
  home: HomePermission,
  /** 食物管理权限 */
  food: FoodPermission,
  /** 用户管理权限 */
  user: UserPermission,
  /** 角色管理权限 */
  role: RolePermission,
  /** 菜单管理权限 */
  menu: MenuPermission,
  /** 在线用户管理权限 */
  online: OnlinePermission,
  /** 登录日志管理权限 */
  login_log: LoginLogPermission,
  /** 操作日志管理权限 */
  operation_log: OperationLogPermission
};

/**
 * 权限描述映射
 */
export const PermissionDescriptions: Record<string, string> = {
  // 首页权限
  [HomePermission.DASHBOARD]: "访问管理员仪表盘",

  // 食物管理权限
  [FoodPermission.LIST]: "访问食物列表页面",
  [FoodPermission.VIEW]: "查看食物详情",
  [FoodPermission.ADD]: "新增食物",
  [FoodPermission.EDIT]: "编辑食物",
  [FoodPermission.DELETE]: "删除食物",

  // 用户管理权限
  [UserPermission.LIST]: "访问用户列表页面",
  [UserPermission.VIEW]: "查看用户详情",
  [UserPermission.EDIT]: "编辑用户信息",
  [UserPermission.DELETE]: "删除用户",
  [UserPermission.ROLE_CHANGE]: "修改用户角色",
  [UserPermission.DASHBOARD]: "访问用户仪表盘",
  [UserPermission.DISABLE]: "禁用或启用用户",

  // 角色管理权限
  [RolePermission.MANAGE]: "访问角色管理页面",
  [RolePermission.VIEW]: "查看角色详情",
  [RolePermission.ADD]: "新增角色",
  [RolePermission.EDIT]: "编辑角色",
  [RolePermission.DELETE]: "删除角色",
  [RolePermission.PERMISSION]: "配置角色权限",

  // 菜单管理权限
  [MenuPermission.MANAGE]: "访问菜单管理页面",
  [MenuPermission.VIEW]: "查看菜单详情",
  [MenuPermission.ADD_MENU]: "新增菜单项",
  [MenuPermission.ADD]: "新增菜单",
  [MenuPermission.EDIT]: "编辑菜单",
  [MenuPermission.DELETE]: "删除菜单",

  // 在线用户管理权限
  [OnlinePermission.MANAGE]: "访问在线用户管理页面",
  [OnlinePermission.VIEW]: "查看在线用户列表",
  [OnlinePermission.FORCE_LOGOUT]: "强制用户下线",

  // 登录日志管理权限
  [LoginLogPermission.MANAGE]: "访问登录日志管理页面",
  [LoginLogPermission.VIEW]: "查看登录日志",
  [LoginLogPermission.CLEAR_ALL]: "清空所有登录日志",
  [LoginLogPermission.PATCH]: "批量删除登录日志",

  // 操作日志管理权限
  [OperationLogPermission.MANAGE]: "访问操作日志管理页面",
  [OperationLogPermission.VIEW]: "查看操作日志",
  [OperationLogPermission.CLEAR_ALL]: "清空所有操作日志",
  [OperationLogPermission.PATCH]: "批量删除操作日志"
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

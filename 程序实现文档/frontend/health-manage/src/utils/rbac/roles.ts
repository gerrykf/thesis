/**
 * 角色枚举
 * 统一管理系统中的角色标识
 */

/**
 * 角色代码枚举
 * 对应数据库 roles 表的 code 字段
 */
export enum RoleCode {
  /** 普通用户 */
  USER = "user",
  /** 管理员 */
  ADMIN = "admin",
  /** 超级管理员 */
  SUPER_ADMIN = "super_admin"
}

/**
 * 角色ID枚举
 * 对应数据库 roles 表的 id 字段
 */
export enum RoleId {
  /** 普通用户 */
  USER = 1,
  /** 管理员 */
  ADMIN = 2,
  /** 超级管理员 */
  SUPER_ADMIN = 3
}

/**
 * 角色名称映射
 */
export const RoleNames: Record<RoleCode, string> = {
  [RoleCode.USER]: "普通用户",
  [RoleCode.ADMIN]: "管理员",
  [RoleCode.SUPER_ADMIN]: "超级管理员"
};

/**
 * 角色描述映射
 */
export const RoleDescriptions: Record<RoleCode, string> = {
  [RoleCode.USER]: "普通用户角色，可以管理自己的健康数据",
  [RoleCode.ADMIN]: "管理员角色，可以管理所有数据和用户",
  [RoleCode.SUPER_ADMIN]: "超级管理员角色，拥有所有权限，可以管理用户角色"
};

/**
 * 根据角色代码获取角色ID
 */
export function getRoleIdByCode(code: RoleCode): RoleId {
  const mapping: Record<RoleCode, RoleId> = {
    [RoleCode.USER]: RoleId.USER,
    [RoleCode.ADMIN]: RoleId.ADMIN,
    [RoleCode.SUPER_ADMIN]: RoleId.SUPER_ADMIN
  };
  return mapping[code];
}

/**
 * 根据角色ID获取角色代码
 */
export function getRoleCodeById(id: RoleId): RoleCode {
  const mapping: Record<RoleId, RoleCode> = {
    [RoleId.USER]: RoleCode.USER,
    [RoleId.ADMIN]: RoleCode.ADMIN,
    [RoleId.SUPER_ADMIN]: RoleCode.SUPER_ADMIN
  };
  return mapping[id];
}

/**
 * 检查是否为管理员角色（包括管理员和超级管理员）
 */
export function isAdminRole(role: RoleCode | string): boolean {
  return role === RoleCode.ADMIN || role === RoleCode.SUPER_ADMIN;
}

/**
 * 检查是否为超级管理员
 */
export function isSuperAdminRole(role: RoleCode | string): boolean {
  return role === RoleCode.SUPER_ADMIN;
}

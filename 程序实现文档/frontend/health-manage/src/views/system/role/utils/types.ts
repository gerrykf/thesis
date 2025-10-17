// 角色管理类型定义

export interface Role {
  id: number;
  name: string;
  code: string;
  status: number;
  remark?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleFormData {
  name: string;
  code: string;
  remark?: string;
  status?: 0 | 1;
}

export interface Menu {
  id: number;
  parent_id: number;
  title: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  type: number; // 1:菜单 2:按钮
  permission?: string;
  status: number;
  children?: Menu[];
}

export interface RoleMenus {
  roleId: number;
  menuIds: number[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleListResponse {
  success: boolean;
  data: {
    roles: Role[];
    pagination: PaginationData;
  };
}

export interface MenuListResponse {
  success: boolean;
  data: Menu[];
}

export interface RoleMenusResponse {
  success: boolean;
  data: {
    menuIds: number[];
  };
}

export type FormItemProps = Role;

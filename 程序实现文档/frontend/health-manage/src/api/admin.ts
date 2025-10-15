// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取食物列表(后台管理端) 获取食物列表，返回所有字段包括中英文字段，用于后台管理端编辑 GET /api/admin/foods */
export async function getAdminFoods(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminFoodsParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/admin/foods", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // limit has a default value: 20
      limit: "20",

      ...params,
    },
    ...(options || {}),
  });
}

/** 创建食物(后台管理端) 创建新食物 POST /api/admin/foods */
export async function postAdminFoods(
  body: API.CreateFoodRequest,
  options?: { [key: string]: any }
) {
  return request<any>("/api/admin/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取食物详情(后台管理端) 获取食物详情，返回所有字段 GET /api/admin/foods/${param0} */
export async function getAdminFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminFoodsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/foods/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新食物(后台管理端) 更新食物信息 PUT /api/admin/foods/${param0} */
export async function putAdminFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminFoodsIdParams,
  body: API.CreateFoodRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/foods/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除食物(后台管理端) 软删除食物 DELETE /api/admin/foods/${param0} */
export async function deleteAdminFoodsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminFoodsIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/foods/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取食物分类列表(后台管理端) 获取所有食物分类 GET /api/admin/foods/categories */
export async function getAdminFoodsCategories(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/admin/foods/categories", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取系统日志 获取系统操作日志(需要管理员权限) GET /api/admin/logs */
export async function getAdminLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminLogsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      logs?: {
        id?: number;
        user_id?: number;
        action?: string;
        resource?: string;
        resource_id?: number;
        ip_address?: string;
        response_status?: number;
        created_at?: string;
      }[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  }>("/api/admin/logs", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // limit has a default value: 50
      limit: "50",

      ...params,
    },
    ...(options || {}),
  });
}

/** 获取系统统计 获取系统整体统计数据(需要管理员权限) GET /api/admin/stats/system */
export async function getAdminStatsSystem(options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    data?: {
      total_users?: number;
      active_users?: number;
      total_health_records?: number;
      total_diet_records?: number;
      total_foods?: number;
    };
  }>("/api/admin/stats/system", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取用户统计 获取用户统计数据(需要管理员权限) GET /api/admin/stats/users */
export async function getAdminStatsUsers(options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    data?: {
      totalUsers?: number;
      activeUsers?: number;
      adminUsers?: number;
      newUsersToday?: number;
    };
  }>("/api/admin/stats/users", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取用户列表 获取所有用户列表(需要管理员权限) GET /api/admin/users */
export async function getAdminUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUsersParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      users?: API.User[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  }>("/api/admin/users", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // limit has a default value: 20
      limit: "20",

      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户详情 获取指定用户的详细信息(需要管理员权限) GET /api/admin/users/${param0} */
export async function getAdminUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUsersIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; data?: API.User }>(
    `/api/admin/users/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新用户信息 更新指定用户的信息(需要管理员权限) PUT /api/admin/users/${param0} */
export async function putAdminUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminUsersIdParams,
  body: {
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 性别 */
    gender?: "male" | "female" | "other";
    /** 出生日期 */
    birth_date?: string;
    /** 身高(cm) */
    height?: number;
    /** 目标体重(kg) */
    target_weight?: number;
    /** 账号状态 */
    is_active?: boolean;
    /** 用户角色 */
    role?: "user" | "admin";
  },
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/admin/users/${param0}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 删除用户 删除指定用户及其所有相关数据(需要管理员权限) DELETE /api/admin/users/${param0} */
export async function deleteAdminUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminUsersIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/admin/users/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取用户健康记录 获取指定用户的健康记录列表(需要管理员权限) GET /api/admin/users/${param0}/health-records */
export async function getAdminUsersIdHealthRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUsersIdHealthRecordsParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    success?: boolean;
    data?: {
      records?: API.HealthRecord[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>(`/api/admin/users/${param0}/health-records`, {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // pageSize has a default value: 10
      pageSize: "10",

      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取用户健康统计 获取指定用户的健康统计数据(需要管理员权限) GET /api/admin/users/${param0}/health-stats */
export async function getAdminUsersIdHealthStats(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUsersIdHealthStatsParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    success?: boolean;
    data?: {
      totalRecords?: number;
      dietRecords?: number;
      activeGoals?: number;
      activeDays?: number;
    };
  }>(`/api/admin/users/${param0}/health-stats`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 切换用户状态 启用或禁用用户账号(需要管理员权限) PATCH /api/admin/users/${param0}/toggle-status */
export async function patchAdminUsersIdToggleStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchAdminUsersIdToggleStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/admin/users/${param0}/toggle-status`,
    {
      method: "PATCH",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取用户列表 管理员获取用户列表 GET /api/admin/users */
export async function getUserList(
  params: {
    page?: number;
    pageSize?: number;
    username?: string;
    nickname?: string;
    role?: string;
    is_active?: boolean;
  },
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      users?: API.User[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>("/api/admin/users", {
    method: "GET",
    params,
    ...(options || {}),
  });
}

/** 获取用户详情 管理员获取用户详情 GET /api/admin/users/:id */
export async function getUserDetail(
  userId: number,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: API.User;
  }>(`/api/admin/users/${userId}`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 更新用户状态 管理员更新用户状态 PUT /api/admin/users/:id */
export async function updateUserStatus(
  userId: number,
  body: {
    is_active: boolean;
  },
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
  }>(`/api/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 管理员删除用户 DELETE /api/admin/users/:id */
export async function deleteUser(
  userId: number,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    message?: string;
  }>(`/api/admin/users/${userId}`, {
    method: "DELETE",
    ...(options || {}),
  });
}

/** 获取用户统计数据 获取用户统计信息 GET /api/admin/stats/users */
export async function getUserStats(options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    data?: {
      totalUsers?: number;
      activeUsers?: number;
      newUsersToday?: number;
      adminUsers?: number;
    };
  }>("/api/admin/stats/users", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取用户健康统计 获取指定用户的健康数据统计 GET /api/admin/users/:id/health-stats */
export async function getUserHealthStats(
  userId: number,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      totalRecords?: number;
      dietRecords?: number;
      activeGoals?: number;
      activeDays?: number;
    };
  }>(`/api/admin/users/${userId}/health-stats`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取用户健康记录 获取指定用户的健康记录列表 GET /api/admin/users/:id/health-records */
export async function getUserHealthRecords(
  userId: number,
  params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  },
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      records?: API.HealthRecord[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>(`/api/admin/users/${userId}/health-records`, {
    method: "GET",
    params,
    ...(options || {}),
  });
}
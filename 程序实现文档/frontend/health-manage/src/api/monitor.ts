// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取登录日志列表 获取用户登录日志列表，支持分页和多条件筛选 GET /api/monitor/login-logs */
export async function getMonitorLoginLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMonitorLoginLogsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      list?: {
        id?: number;
        user_id?: number;
        username?: string;
        ip?: string;
        address?: string;
        system?: string;
        browser?: string;
        status?: number;
        behavior?: string;
        error_message?: string;
        login_time?: string;
      }[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>("/api/monitor/login-logs", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // pageSize has a default value: 10
      pageSize: "10",

      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除登录日志 根据ID列表批量删除登录日志 POST /api/monitor/login-logs/batch-delete */
export async function postMonitorLoginLogsBatchDelete(
  body: {
    /** 要删除的日志ID列表 */
    ids: number[];
  },
  options?: { [key: string]: any }
) {
  return request<{ success?: boolean; message?: string }>(
    "/api/monitor/login-logs/batch-delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 清空所有登录日志 清空所有登录日志记录 DELETE /api/monitor/login-logs/clear */
export async function deleteMonitorLoginLogsClear(options?: {
  [key: string]: any;
}) {
  return request<{ success?: boolean; message?: string }>(
    "/api/monitor/login-logs/clear",
    {
      method: "DELETE",
      ...(options || {}),
    }
  );
}

/** 获取在线用户列表 获取当前在线用户列表，支持分页和用户名搜索 GET /api/monitor/online-users */
export async function getMonitorOnlineUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMonitorOnlineUsersParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      list?: {
        id?: number;
        user_id?: number;
        username?: string;
        ip?: string;
        address?: string;
        system?: string;
        browser?: string;
        login_time?: string;
        last_active_time?: string;
        expires_at?: string;
      }[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>("/api/monitor/online-users", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // pageSize has a default value: 10
      pageSize: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** 强制用户下线 根据在线用户ID强制用户下线 DELETE /api/monitor/online-users/${param0} */
export async function deleteMonitorOnlineUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMonitorOnlineUsersIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<{ success?: boolean; message?: string }>(
    `/api/monitor/online-users/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取操作日志列表 获取用户操作日志列表，支持分页和多条件筛选 GET /api/monitor/operation-logs */
export async function getMonitorOperationLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMonitorOperationLogsParams,
  options?: { [key: string]: any }
) {
  return request<{
    success?: boolean;
    data?: {
      list?: {
        id?: number;
        user_id?: number;
        username?: string;
        module?: string;
        summary?: string;
        action?: string;
        ip_address?: string;
        address?: string;
        system?: string;
        browser?: string;
        status?: number;
        operating_time?: string;
        created_at?: string;
      }[];
      total?: number;
      page?: number;
      pageSize?: number;
    };
  }>("/api/monitor/operation-logs", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // pageSize has a default value: 10
      pageSize: "10",

      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除操作日志 根据ID列表批量删除操作日志 POST /api/monitor/operation-logs/batch-delete */
export async function postMonitorOperationLogsBatchDelete(
  body: {
    /** 要删除的日志ID列表 */
    ids: number[];
  },
  options?: { [key: string]: any }
) {
  return request<{ success?: boolean; message?: string }>(
    "/api/monitor/operation-logs/batch-delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 清空所有操作日志 清空所有操作日志记录 DELETE /api/monitor/operation-logs/clear */
export async function deleteMonitorOperationLogsClear(options?: {
  [key: string]: any;
}) {
  return request<{ success?: boolean; message?: string }>(
    "/api/monitor/operation-logs/clear",
    {
      method: "DELETE",
      ...(options || {}),
    }
  );
}

// 简化的导出别名，便于在组件中使用
export const getOnlineUsers = getMonitorOnlineUsers;
export const forceOfflineUser = (id: number) =>
  deleteMonitorOnlineUsersId({ id });

export const getLoginLogs = getMonitorLoginLogs;
export const batchDeleteLoginLogs = postMonitorLoginLogsBatchDelete;
export const clearAllLoginLogs = deleteMonitorLoginLogsClear;

export const getOperationLogs = getMonitorOperationLogs;
export const batchDeleteOperationLogs = postMonitorOperationLogsBatchDelete;
export const clearAllOperationLogs = deleteMonitorOperationLogsClear;

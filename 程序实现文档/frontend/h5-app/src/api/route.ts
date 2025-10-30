// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取异步路由（动态路由） 根据用户角色获取动态路由配置 GET /api/get-async-routes */
export async function getGetAsyncRoutes(options?: { [key: string]: any }) {
  return request<{ success?: boolean; data?: Record<string, any>[] }>(
    "/api/get-async-routes",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

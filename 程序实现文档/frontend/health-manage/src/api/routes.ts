import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

/**
 * 获取异步路由（动态路由）
 * 根据用户角色从后端获取该用户有权限访问的路由配置
 */
export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/api/get-async-routes");
};

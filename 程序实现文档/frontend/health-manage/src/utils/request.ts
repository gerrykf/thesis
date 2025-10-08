import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: "/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从认证系统获取token
    const tokenData = getToken();
    if (tokenData?.accessToken) {
      config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T | Promise<never> => {
    const { data } = response;

    // 如果返回的状态码为200，说明接口请求成功
    if (response.status === 200 || response.status === 201) {
      return data;
    }

    // 其他状态码都当作错误处理
    const errorData = data as { message?: string };
    ElMessage.error(errorData.message || "请求失败");
    return Promise.reject(new Error(errorData.message || "请求失败"));
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          ElMessage.error("未授权，请重新登录");
          // 清除本地存储
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          // 跳转到登录页
          window.location.href = "/login";
          break;
        case 403:
          ElMessage.error("拒绝访问");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器错误");
          break;
        default:
          ElMessage.error(data?.message || "请求失败");
      }
    } else if (error.request) {
      ElMessage.error("网络错误，请检查网络连接");
    } else {
      ElMessage.error("请求失败");
    }

    return Promise.reject(error);
  }
);

export default request;

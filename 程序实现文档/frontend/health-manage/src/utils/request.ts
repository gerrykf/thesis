import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

// 扩展 AxiosInstance 类型，使其返回解包后的数据
interface CustomAxiosInstance extends AxiosInstance {
  <T = any>(config: InternalAxiosRequestConfig): Promise<T>;
  <T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  request<T = any>(config: InternalAxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  options<T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
}

// 创建 axios 实例
const request = axios.create({
  baseURL: "/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
}) as CustomAxiosInstance;

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从认证系统获取token
    const tokenData = getToken();
    if (tokenData?.accessToken) {
      config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
    }

    // 标识客户端类型为管理端
    config.headers["X-Client-Type"] = "admin";

    // 处理 OpenAPI 生成的 requestType: "form"
    // OpenAPI 生成器会为 multipart/form-data 接口生成 requestType: "form"
    // 但 axios 不支持这个属性，需要转换为正确的配置
    const configAny = config as any;
    if (configAny.requestType === "form") {
      // 删除 requestType 属性
      delete configAny.requestType;

      // 如果 data 是 FormData，让 axios 自动设置 Content-Type
      if (config.data instanceof FormData) {
        // 删除手动设置的 Content-Type，让浏览器自动设置（包含 boundary）
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  error => {
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
  error => {
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

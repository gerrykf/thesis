import i18n from "@/i18n";
import router from "@/router";
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { showToast } from "vant";

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 标识客户端类型为 H5
    config.headers["X-Client-Type"] = "h5";

    // 自动携带语言参数 (通过标准的 Accept-Language Header)
    const locale = localStorage.getItem("locale") || "zh-CN";
    config.headers["Accept-Language"] = locale;

    // 如果是 FormData，让浏览器自动设置 Content-Type (包含 boundary)
    // 否则设置为 application/json
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
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
    showToast(errorData.message || "请求失败");
    return Promise.reject(new Error(errorData.message || "请求失败"));
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 检查是否是强制下线消息
          const message = data?.message || i18n.global.t("http.error.401");
          if (message.includes("强制下线") || message.includes("已被")) {
            showToast({
              message: message,
              duration: 3000
            });
          } else {
            showToast(message);
          }

          // 清除本地存储
          localStorage.clear();
          sessionStorage.clear();

          // 延迟跳转到登录页
          setTimeout(() => {
            router.replace("/login");
          }, 1000);
          break;
        case 403:
          showToast(i18n.global.t("http.error.403"));
          break;
        case 404:
          showToast(i18n.global.t("http.error.404"));
          break;
        case 500:
          showToast(i18n.global.t("http.error.500"));
          break;
        default:
          showToast(data?.message || i18n.global.t("error.requestFailed"));
      }
    } else if (error.request) {
      showToast(i18n.global.t("error.networkError"));
    } else {
      showToast(i18n.global.t("error.requestFailed"));
    }

    return Promise.reject(error);
  }
);

export default request;

/**
 * H5用户在线心跳检测
 * 定期检查用户是否被强制下线
 */

import router from "@/router";
import { showToast } from "vant";

let heartbeatTimer: number | null = null;
let isCheckingHeartbeat = false;

/**
 * 检查用户在线状态
 */
async function checkOnlineStatus(): Promise<boolean> {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Client-Type": "h5"
      }
    });

    // 如果返回 401，说明被强制下线
    if (response.status === 401) {
      const data = await response.json();
      const message = data?.message || "您的账号已被强制下线";

      // 显示强制下线消息
      showToast({
        message: message,
        duration: 3000
      });

      // 清除所有本地存储
      localStorage.clear();
      sessionStorage.clear();

      // 延迟跳转到登录页
      setTimeout(() => {
        router.replace("/login");
      }, 1000);

      return false;
    }

    return response.ok;
  } catch (error) {
    console.error("心跳检测失败:", error);
    return true; // 网络错误不强制下线
  }
}

/**
 * 启动心跳检测
 * @param interval 检测间隔（毫秒），默认30秒
 */
export function startHeartbeat(interval: number = 30000): void {
  // 避免重复启动
  if (heartbeatTimer) {
    return;
  }

  console.log("[Heartbeat] 启动心跳检测，间隔:", interval / 1000, "秒");

  // 立即执行一次
  checkOnlineStatus();

  // 定时执行
  heartbeatTimer = window.setInterval(async () => {
    // 防止并发执行
    if (isCheckingHeartbeat) {
      return;
    }

    isCheckingHeartbeat = true;
    try {
      await checkOnlineStatus();
    } finally {
      isCheckingHeartbeat = false;
    }
  }, interval);
}

/**
 * 停止心跳检测
 */
export function stopHeartbeat(): void {
  if (heartbeatTimer) {
    console.log("[Heartbeat] 停止心跳检测");
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    isCheckingHeartbeat = false;
  }
}

/**
 * 重置心跳检测（停止后重新启动）
 */
export function resetHeartbeat(interval?: number): void {
  stopHeartbeat();
  startHeartbeat(interval);
}

/**
 * Service Worker 注册和管理工具
 */

import { showToast, showFailToast, showSuccessToast } from 'vant';

// 扩展 ServiceWorkerRegistration 类型以支持后台同步
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

// Service Worker 更新回调类型
export interface ServiceWorkerCallbacks {
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  onUpdated?: (registration: ServiceWorkerRegistration) => void;
  onUpdateFound?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 注册 Service Worker
 */
export async function registerServiceWorker(
  swPath: string = '/sw.js',
  callbacks: ServiceWorkerCallbacks = {}
): Promise<ServiceWorkerRegistration | undefined> {
  // 检查浏览器是否支持 Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] 浏览器不支持 Service Worker');
    showToast('浏览器不支持离线功能');
    return undefined;
  }

  try {
    // 注册 Service Worker
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/'
    });

    console.log('[SW] Service Worker 注册成功:', registration.scope);

    // 注册成功回调
    callbacks.onRegistered?.(registration);

    // 监听更新
    registration.addEventListener('updatefound', () => {
      console.log('[SW] 发现新版本');
      callbacks.onUpdateFound?.(registration);

      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          console.log('[SW] Service Worker 状态:', newWorker.state);

          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 有新版本可用
            console.log('[SW] 新版本已安装，等待激活');
            callbacks.onUpdated?.(registration);
          }
        });
      }
    });

    // 定期检查更新（每小时）
    setInterval(() => {
      registration.update().catch(err => {
        console.warn('[SW] 检查更新失败:', err);
      });
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('[SW] Service Worker 注册失败:', error);
    showFailToast('离线功能注册失败');
    callbacks.onError?.(error as Error);
    return undefined;
  }
}

/**
 * 注销 Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('[SW] Service Worker 注销:', success);
    if (success) {
      showSuccessToast('离线功能已关闭');
    }
    return success;
  } catch (error) {
    console.error('[SW] Service Worker 注销失败:', error);
    showFailToast('注销失败');
    return false;
  }
}

/**
 * 跳过等待，立即激活新的 Service Worker
 */
export function skipWaiting(): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready.then(registration => {
    if (registration.waiting) {
      // 向 waiting 的 Service Worker 发送消息
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

/**
 * 监听网络状态变化
 */
export function setupNetworkListeners(callbacks: ServiceWorkerCallbacks): void {
  window.addEventListener('online', () => {
    console.log('[SW] 网络已连接');
    showSuccessToast('网络已连接');
    callbacks.onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('[SW] 网络已断开');
    showToast('网络已断开，已进入离线模式');
    callbacks.onOffline?.();
  });
}

/**
 * 检查是否有新版本更新
 */
export async function checkForUpdates(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return registration.waiting !== null;
  } catch (error) {
    console.error('[SW] 检查更新失败:', error);
    return false;
  }
}

/**
 * 清除所有缓存
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] 已清除所有缓存');
    showSuccessToast('缓存已清除');
  } catch (error) {
    console.error('[SW] 清除缓存失败:', error);
    showFailToast('清除缓存失败');
  }
}

/**
 * 获取缓存大小（估算）
 */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window) || !('storage' in navigator)) {
    return 0;
  }

  try {
    if ('estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  } catch (error) {
    console.error('[SW] 获取缓存大小失败:', error);
    return 0;
  }
}

/**
 * 格式化缓存大小
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${units[i]}`;
}

/**
 * 请求后台同步权限并注册同步标签
 */
export async function registerBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] 浏览器不支持 Service Worker');
    showToast('浏览器不支持后台同步');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithSync;

    if (!registration.sync) {
      console.warn('[SW] 浏览器不支持后台同步');
      showToast('浏览器不支持后台同步');
      return false;
    }

    await registration.sync.register(tag);
    console.log('[SW] 后台同步已注册:', tag);
    showSuccessToast('后台同步已启用');
    return true;
  } catch (error) {
    console.error('[SW] 后台同步注册失败:', error);
    showFailToast('后台同步注册失败');
    return false;
  }
}

/**
 * 请求推送通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[SW] 浏览器不支持通知');
    showToast('浏览器不支持通知功能');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    console.log('[SW] 通知权限:', permission);
    if (permission === 'granted') {
      showSuccessToast('通知权限已授予');
    } else if (permission === 'denied') {
      showToast('通知权限被拒绝');
    }
    return permission;
  }

  return Notification.permission;
}

/**
 * 订阅推送通知
 */
export async function subscribePushNotification(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[SW] 浏览器不支持推送通知');
    showToast('浏览器不支持推送通知');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // 检查是否已有订阅
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // 创建新订阅
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
      });
      console.log('[SW] 推送通知订阅成功');
      showSuccessToast('推送通知已开启');
    }

    return subscription;
  } catch (error) {
    console.error('[SW] 推送通知订阅失败:', error);
    showFailToast('推送通知订阅失败');
    return null;
  }
}

/**
 * 取消推送通知订阅
 */
export async function unsubscribePushNotification(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const success = await subscription.unsubscribe();
      console.log('[SW] 推送通知取消订阅:', success);
      if (success) {
        showSuccessToast('推送通知已关闭');
      }
      return success;
    }

    return false;
  } catch (error) {
    console.error('[SW] 取消推送通知订阅失败:', error);
    showFailToast('取消订阅失败');
    return false;
  }
}

/**
 * 将 VAPID 公钥转换为 Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * 显示本地通知（测试用）
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/pwa-icon/192.png',
      badge: '/pwa-icon/192.png',
      ...options
    });
  } catch (error) {
    console.error('[SW] 显示通知失败:', error);
  }
}

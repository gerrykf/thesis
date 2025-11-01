// Service Worker 版本号
const CACHE_VERSION = 'v1.0.1';  // 修复 POST 请求缓存错误
const CACHE_NAME = `health-app-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-icon/192.png',
  '/pwa-icon/512.png',
  '/logo.ico',
];

// API 缓存名称
const API_CACHE_NAME = `health-app-api-${CACHE_VERSION}`;

// 需要离线支持的 API 路径模式
const API_PATTERNS = [
  /\/api\/health\/records/,
  /\/api\/diet\/records/,
  /\/api\/goals/,
  /\/api\/user\/profile/,
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中...', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 缓存静态资源');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] 缓存失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 删除旧版本的缓存
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('[Service Worker] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 立即控制所有页面
        return self.clients.claim();
      })
  );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 忽略非 HTTP(S) 请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 判断是否是 API 请求
  const isApiRequest = API_PATTERNS.some(pattern => pattern.test(url.pathname));

  if (isApiRequest) {
    // API 请求：网络优先，失败时返回缓存
    event.respondWith(networkFirstStrategy(request));
  } else {
    // 静态资源：缓存优先，失败时访问网络
    event.respondWith(cacheFirstStrategy(request));
  }
});

/**
 * 缓存优先策略 (Cache First)
 * 适用于：静态资源、不常变化的内容
 */
async function cacheFirstStrategy(request) {
  try {
    // 先查找缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 缓存未命中，请求网络
    const networkResponse = await fetch(request);

    // 如果是成功响应且是 GET 请求，存入缓存
    // Cache API 只支持 GET 请求，不支持 POST/PUT/DELETE 等
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] 请求失败:', request.url, error);

    // 返回离线页面或默认响应
    return new Response('离线模式 - 资源不可用', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain; charset=utf-8'
      })
    });
  }
}

/**
 * 网络优先策略 (Network First)
 * 适用于：API 请求、动态数据
 */
async function networkFirstStrategy(request) {
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request);

    // 如果是成功的 GET 请求，存入缓存
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] 网络请求失败，尝试返回缓存:', request.url);

    // 网络失败，返回缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // 添加离线标记头
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-From-Cache', 'true');

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      });
    }

    // 无缓存可用
    return new Response(JSON.stringify({
      error: '离线模式 - 数据不可用',
      offline: true
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8'
      })
    });
  }
}

// 后台同步 - 同步待上传的数据
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 后台同步:', event.tag);

  if (event.tag === 'sync-health-data') {
    event.waitUntil(syncHealthData());
  } else if (event.tag === 'sync-diet-data') {
    event.waitUntil(syncDietData());
  }
});

/**
 * 同步健康数据
 */
async function syncHealthData() {
  try {
    // 从 IndexedDB 读取待同步的数据
    const pendingData = await getPendingHealthData();

    if (pendingData.length === 0) {
      console.log('[Service Worker] 没有待同步的健康数据');
      return;
    }

    console.log('[Service Worker] 同步健康数据:', pendingData.length, '条');

    // 逐条上传
    for (const data of pendingData) {
      try {
        const response = await fetch('/api/health/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify(data.record)
        });

        if (response.ok) {
          // 上传成功，从 IndexedDB 删除
          await removePendingHealthData(data.id);
          console.log('[Service Worker] 健康数据同步成功:', data.id);
        }
      } catch (error) {
        console.error('[Service Worker] 健康数据同步失败:', data.id, error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] 后台同步健康数据失败:', error);
  }
}

/**
 * 同步饮食数据
 */
async function syncDietData() {
  try {
    const pendingData = await getPendingDietData();

    if (pendingData.length === 0) {
      console.log('[Service Worker] 没有待同步的饮食数据');
      return;
    }

    console.log('[Service Worker] 同步饮食数据:', pendingData.length, '条');

    for (const data of pendingData) {
      try {
        const response = await fetch('/api/diet/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify(data.record)
        });

        if (response.ok) {
          await removePendingDietData(data.id);
          console.log('[Service Worker] 饮食数据同步成功:', data.id);
        }
      } catch (error) {
        console.error('[Service Worker] 饮食数据同步失败:', data.id, error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] 后台同步饮食数据失败:', error);
  }
}

// IndexedDB 辅助函数（占位实现）
async function getPendingHealthData() {
  // TODO: 从 IndexedDB 读取待同步的健康数据
  return [];
}

async function removePendingHealthData(id) {
  // TODO: 从 IndexedDB 删除已同步的健康数据
}

async function getPendingDietData() {
  // TODO: 从 IndexedDB 读取待同步的饮食数据
  return [];
}

async function removePendingDietData(id) {
  // TODO: 从 IndexedDB 删除已同步的饮食数据
}

// 推送通知
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 收到推送通知:', event);

  let notificationData = {
    title: '健康管理提醒',
    body: '您有新的健康提醒',
    icon: '/pwa-icon/192.png',
    badge: '/pwa-icon/192.png',
    data: {}
  };

  // 解析推送数据
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  // 显示通知
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      vibrate: [200, 100, 200],
      tag: 'health-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: '查看详情'
        },
        {
          action: 'dismiss',
          title: '关闭'
        }
      ]
    })
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知被点击:', event);

  event.notification.close();

  // 处理操作按钮
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // 只关闭通知
    return;
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // 如果已有窗口打开，聚焦它
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          // 否则打开新窗口
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// 消息通信
self.addEventListener('message', (event) => {
  console.log('[Service Worker] 收到消息:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => Promise.all(
          cacheNames.map(name => caches.delete(name))
        ))
    );
  }
});

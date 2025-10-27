import { ref, onMounted, onUnmounted } from "vue";

interface VersionCheckOptions {
  /**
   * 轮询间隔时间（毫秒），默认 30000ms (30秒)
   */
  interval?: number;
  /**
   * 是否立即检查，默认 true
   */
  immediate?: boolean;
  /**
   * 检测方式：'etag' | 'hash'
   * - etag: 使用 HTTP ETag 检测
   * - hash: 使用 index.html 内容 hash 检测
   * 默认 'hash'，因为 ETag 可能被 CDN 或服务器配置影响
   */
  mode?: "etag" | "hash";
}

/**
 * 版本检测 Hook
 * 用于检测前端代码是否有更新
 *
 * @example
 * ```ts
 * const { hasUpdate, checkVersion, ignoreUpdate } = useVersionCheck({
 *   interval: 30000, // 30秒检查一次
 *   immediate: true, // 立即执行首次检查
 *   mode: 'hash' // 使用内容 hash 检测
 * })
 * ```
 */
export function useVersionCheck(options: VersionCheckOptions = {}) {
  const {
    interval = 30000, // 默认 30 秒
    immediate = true,
    mode = "etag",
  } = options;

  // 是否有更新
  const hasUpdate = ref(false);
  // 是否正在检查
  const checking = ref(false);
  // 当前版本标识（ETag 或 Hash）
  const currentVersion = ref<string>("");
  // 定时器
  let timer: any | null = null;

  /**
   * 获取 HTML 文档的 ETag
   */
  async function getETag(): Promise<string | null> {
    try {
      const response = await fetch(
        `${window.location.origin}${window.location.pathname}`,
        {
          method: "HEAD",
          cache: "no-cache",
        }
      );
      return response.headers.get("etag");
    } catch (error) {
      console.error("Failed to get ETag:", error);
      return null;
    }
  }

  /**
   * 获取 HTML 文档内容的 Hash
   * 更可靠的方式，因为不依赖服务器配置
   */
  async function getContentHash(): Promise<string | null> {
    try {
      const response = await fetch(
        `${window.location.origin}${window.location.pathname}?t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      const html = await response.text();

      // 提取 script 标签的 src（包含 hash）
      const scriptRegex = /<script[^>]+src="([^"]+)"/g;
      const scripts: string[] = [];
      let match;

      while ((match = scriptRegex.exec(html)) !== null) {
        if (match[1]) {
          scripts.push(match[1]);
        }
      }

      // 将所有 script src 组合成一个字符串作为版本标识
      return scripts.join("|");
    } catch (error) {
      console.error("Failed to get content hash:", error);
      return null;
    }
  }

  /**
   * 获取当前版本标识
   */
  async function getCurrentVersion(): Promise<string | null> {
    if (mode === "etag") {
      return await getETag();
    } else {
      return await getContentHash();
    }
  }

  /**
   * 检查版本更新
   */
  async function checkVersion() {
    // 避免重复检查
    if (checking.value) return;

    checking.value = true;

    try {
      const version = await getCurrentVersion();

      if (!version) {
        checking.value = false;
        return;
      }

      // 首次获取版本信息
      if (!currentVersion.value) {
        currentVersion.value = version;
        console.log(`[VersionCheck] 当前版本: ${version.substring(0, 20)}...`);
      } else if (currentVersion.value !== version) {
        // 版本发生变化
        console.log(`[VersionCheck] 检测到新版本!`);
        console.log(
          `[VersionCheck] 旧版本: ${currentVersion.value.substring(0, 20)}...`
        );
        console.log(`[VersionCheck] 新版本: ${version.substring(0, 20)}...`);
        hasUpdate.value = true;

        // 停止轮询
        stopPolling();
      }
    } catch (error) {
      console.error("[VersionCheck] 检查版本失败:", error);
    } finally {
      checking.value = false;
    }
  }

  /**
   * 开始轮询检查
   */
  function startPolling() {
    // 清除旧的定时器
    stopPolling();

    // 立即执行一次检查
    if (immediate) {
      checkVersion();
    }

    // 设置定时器
    timer = setInterval(() => {
      checkVersion();
    }, interval);

    console.log(`[VersionCheck] 开始轮询检查，间隔 ${interval}ms`);
  }

  /**
   * 停止轮询检查
   */
  function stopPolling() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      console.log("[VersionCheck] 停止轮询检查");
    }
  }

  /**
   * 忽略本次更新（继续使用旧版本）
   */
  function ignoreUpdate() {
    hasUpdate.value = false;
    // 继续轮询
    startPolling();
  }

  /**
   * 刷新页面以应用更新
   */
  function applyUpdate() {
    window.location.reload();
  }

  // 组件挂载时开始轮询
  onMounted(() => {
    // 只在生产环境启用test
    if (import.meta.env.MODE === "production") {
      startPolling();
    } else {
      console.log("[VersionCheck] 开发环境，跳过版本检查");
    }
  });

  // 组件卸载时停止轮询
  onUnmounted(() => {
    stopPolling();
  });

  return {
    hasUpdate,
    checking,
    checkVersion,
    startPolling,
    stopPolling,
    ignoreUpdate,
    applyUpdate,
  };
}

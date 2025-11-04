/**
 * IP 地址缓存模块
 * 缓存IP地理位置查询结果，避免重复调用外部API
 */

import { getAddressFromIP } from './ipAddress';

interface CacheEntry {
  address: string;
  expireAt: number;
}

class IPAddressCache {
  private cache: Map<string, CacheEntry>;
  private readonly cacheDuration: number; // 缓存时长（毫秒）
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(cacheDurationMinutes: number = 60) {
    this.cache = new Map();
    this.cacheDuration = cacheDurationMinutes * 60 * 1000;
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * 获取IP地址对应的地理位置（使用缓存）
   * @param ip IP地址
   * @returns 地理位置字符串
   */
  async getAddress(ip: string | undefined): Promise<string> {
    if (!ip) return '未知';

    // 检查缓存
    const cached = this.cache.get(ip);
    if (cached && cached.expireAt > Date.now()) {
      console.log(`[IPCache] 缓存命中: ${ip} -> ${cached.address}`);
      return cached.address;
    }

    // 缓存未命中或已过期，查询API
    console.log(`[IPCache] 缓存未命中，查询API: ${ip}`);
    const address = await getAddressFromIP(ip);

    // 存入缓存
    this.cache.set(ip, {
      address,
      expireAt: Date.now() + this.cacheDuration
    });

    return address;
  }

  /**
   * 清除过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [ip, entry] of this.cache.entries()) {
      if (entry.expireAt <= now) {
        this.cache.delete(ip);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`[IPCache] 清理了 ${removedCount} 个过期缓存条目，当前缓存数: ${this.cache.size}`);
    }
  }

  /**
   * 启动定期清理任务
   */
  private startCleanup(): void {
    // 每30分钟清理一次过期缓存
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30 * 60 * 1000);
  }

  /**
   * 停止清理任务（用于程序退出时）
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([ip, entry]) => ({
        ip,
        address: entry.address,
        expiresIn: Math.max(0, entry.expireAt - Date.now())
      }))
    };
  }

  /**
   * 手动清空缓存
   */
  clear(): void {
    this.cache.clear();
    console.log('[IPCache] 缓存已清空');
  }
}

// 导出单例实例
export const ipCache = new IPAddressCache(60); // 缓存60分钟

// 优雅关闭时清理
process.on('SIGTERM', () => {
  ipCache.stopCleanup();
});

process.on('SIGINT', () => {
  ipCache.stopCleanup();
});

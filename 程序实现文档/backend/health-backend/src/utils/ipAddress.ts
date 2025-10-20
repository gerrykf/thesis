/**
 * IP 地址工具函数
 */

// IP 地理位置信息接口
interface IPLocationData {
  status: string;
  country?: string;
  regionName?: string;
  city?: string;
}

/**
 * 根据 IP 地址获取地理位置
 * @param ip IP 地址
 * @returns 地理位置字符串
 */
export async function getAddressFromIP(ip: string | undefined): Promise<string> {
  if (!ip) return '未知';

  // 本地 IP 地址
  const localIPs = ['127.0.0.1', 'localhost', '::1', '::ffff:127.0.0.1'];
  if (localIPs.includes(ip)) {
    return '本地';
  }

  // 内网 IP 地址
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return '内网';
  }

  try {
    // 使用 Node.js 内置的 fetch API（Node.js 18+）
    // 使用免费的 IP 地理位置查询 API（ip-api.com）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

    const response = await fetch(
      `http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json() as IPLocationData;
      if (data.status === 'success') {
        // 返回格式：国家 省份 城市
        const parts = [data.country, data.regionName, data.city].filter(Boolean);
        return parts.join(' ') || '未知';
      }
    }
  } catch (error: any) {
    // 超时或其他错误
    if (error.name !== 'AbortError') {
      console.error('获取IP地址位置失败:', error.message);
    }
  }

  return '未知';
}

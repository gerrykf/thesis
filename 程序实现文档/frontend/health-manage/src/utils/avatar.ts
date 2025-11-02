/**
 * 头像URL处理工具函数
 */

/**
 * 获取完整的头像URL
 * @param avatar 头像路径（可能是相对路径或完整URL）
 * @returns 完整的头像URL
 */
export function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) {
    return "";
  }

  // 如果是完整URL（http/https开头），直接返回
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  // 开发环境：vite 代理会自动转发到后端，直接返回相对路径
  // 生产环境：需要拼接完整的后端地址
  const staticBaseUrl = import.meta.env.VITE_STATIC_BASE_URL;

  if (staticBaseUrl) {
    // 生产环境：拼接完整URL
    return `${staticBaseUrl}${avatar}`;
  }

  // 开发环境：返回原始路径（通过vite代理访问）
  return avatar;
}

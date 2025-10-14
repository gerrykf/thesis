/**
 * API 工具函数
 * 用于处理 API 响应和类型转换
 */

// 类型工具：解包 Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

// 类型工具：解包 AxiosResponse
type UnwrapAxiosResponse<T> = T extends { data: infer U } ? U : T;

/**
 * 类型安全的 API 响应解包函数
 *
 * 由于响应拦截器已经解包了 AxiosResponse（通过 return data），
 * 但 TypeScript 类型定义还认为返回的是 AxiosResponse<T>，
 * 所以需要这个函数来告诉 TypeScript 实际的返回类型。
 *
 * @example
 * ```typescript
 * // 不使用 unwrap - 需要 as any
 * const response = (await getAdminUsers(params)) as any;
 *
 * // 使用 unwrap - 类型安全
 * const response = await unwrap(getAdminUsers(params));
 * if (response?.success && response.data) {
 *   // TypeScript 知道 response 的完整类型
 * }
 * ```
 *
 * @param promise - API 调用返回的 Promise
 * @returns 解包后的 Promise，类型为实际响应数据类型
 */
export function unwrap<T>(
  promise: Promise<T>
): Promise<UnwrapAxiosResponse<Awaited<T>>> {
  return promise as Promise<UnwrapAxiosResponse<Awaited<T>>>;
}

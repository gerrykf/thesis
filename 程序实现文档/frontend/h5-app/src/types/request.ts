/**
 * API 请求选项类型
 */
export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  timeout?: number
  signal?: AbortSignal
  [key: string]: unknown
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  response?: {
    status?: number
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
  request?: unknown
  message?: string
}

import { db } from '../config/database';
import type { AuthRequest } from '../middleware/auth';

/**
 * 操作日志记录工具
 */

interface OperationLogOptions {
  userId?: number;
  module?: string;
  summary?: string;
  action: string;
  resource?: string;
  resourceId?: number;
  method?: string;
  url?: string;
  ipAddress?: string;
  userAgent?: string;
  requestData?: any;
  responseStatus?: number;
  status?: number;
  responseTime?: number;
  errorMessage?: string;
}

/**
 * 记录操作日志
 */
export async function logOperation(options: OperationLogOptions): Promise<void> {
  try {
    const {
      userId,
      module,
      summary,
      action,
      resource,
      resourceId,
      method,
      url,
      ipAddress,
      userAgent,
      requestData,
      responseStatus,
      status = 1,
      responseTime,
      errorMessage
    } = options;

    await db.execute(
      `INSERT INTO system_logs (
        user_id, module, summary, action, resource, resource_id,
        method, url, ip_address, user_agent, request_data,
        response_status, status, response_time, error_message,
        operating_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId || null,
        module || null,
        summary || null,
        action,
        resource || null,
        resourceId || null,
        method || null,
        url || null,
        ipAddress || null,
        userAgent || null,
        requestData ? JSON.stringify(requestData) : null,
        responseStatus || null,
        status,
        responseTime || null,
        errorMessage || null
      ]
    );
  } catch (error) {
    console.error('记录操作日志失败:', error);
    // 不抛出错误，避免影响主业务流程
  }
}

/**
 * 从请求中提取操作日志信息
 */
export function extractLogInfoFromRequest(req: AuthRequest): Partial<OperationLogOptions> {
  return {
    userId: req.user?.userId,
    method: req.method,
    url: req.originalUrl,
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip,
    userAgent: req.headers['user-agent']
  };
}

/**
 * 快捷记录函数：从请求对象记录操作日志
 */
export async function logOperationFromRequest(
  req: AuthRequest,
  options: Omit<OperationLogOptions, 'userId' | 'method' | 'url' | 'ipAddress' | 'userAgent'>
): Promise<void> {
  const baseInfo = extractLogInfoFromRequest(req);
  await logOperation({ ...baseInfo, ...options });
}

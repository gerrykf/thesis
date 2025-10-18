import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import type { AuthRequest } from './auth';

/**
 * 操作日志中间件
 * 自动记录所有管理端接口的操作日志
 */

// 不需要记录日志的路径（查询类接口）
const SKIP_LOG_PATHS = [
  '/api/admin/menus',
  '/api/admin/roles',
  '/api/admin/users',
  '/api/admin/foods',
  '/api/monitor/online-users',
  '/api/monitor/login-logs',
  '/api/monitor/operation-logs',
  '/api/get-async-routes'
];

// 操作类型映射
const ACTION_MAP: Record<string, string> = {
  'POST': '新增',
  'PUT': '修改',
  'PATCH': '更新',
  'DELETE': '删除'
};

// 模块映射（根据路径提取）
function extractModule(path: string): string | null {
  if (path.includes('/users')) return '用户管理';
  if (path.includes('/roles')) return '角色管理';
  if (path.includes('/menus')) return '菜单管理';
  if (path.includes('/foods')) return '食物管理';
  if (path.includes('/monitor')) return '系统监控';
  if (path.includes('/login')) return '用户登录';
  return null;
}

// 提取操作摘要
function extractSummary(method: string, path: string, body: any): string | null {
  const actionType = ACTION_MAP[method] || method;

  if (path.includes('/users') && method === 'POST') {
    return `${actionType}用户: ${body.username || '未知'}`;
  }
  if (path.includes('/users') && method === 'PUT') {
    return `${actionType}用户信息`;
  }
  if (path.includes('/users') && method === 'DELETE') {
    return `${actionType}用户`;
  }
  if (path.includes('/users') && path.includes('/toggle-status')) {
    return '切换用户状态';
  }
  if (path.includes('/users') && path.includes('/role')) {
    return '修改用户角色';
  }

  // 角色相关（注意顺序：先判断子路径，再判断通用路径）
  if (path.includes('/roles') && path.includes('/menus')) {
    return '更新角色权限';
  }
  if (path.includes('/roles') && path.includes('/status')) {
    return '切换角色状态';
  }
  if (path.includes('/roles') && method === 'POST') {
    return `${actionType}角色: ${body.name || '未知'}`;
  }
  if (path.includes('/roles') && method === 'PUT') {
    return `${actionType}角色信息`;
  }
  if (path.includes('/roles') && method === 'DELETE') {
    return `${actionType}角色`;
  }

  if (path.includes('/menus') && method === 'POST') {
    return `${actionType}菜单: ${body.title || '未知'}`;
  }
  if (path.includes('/menus') && method === 'PUT') {
    return `${actionType}菜单`;
  }
  if (path.includes('/menus') && method === 'DELETE') {
    return `${actionType}菜单`;
  }

  if (path.includes('/foods') && method === 'POST') {
    return `${actionType}食物: ${body.name || body.name_zh || '未知'}`;
  }
  if (path.includes('/foods') && method === 'PUT') {
    return `${actionType}食物`;
  }
  if (path.includes('/foods') && method === 'DELETE') {
    return `${actionType}食物`;
  }

  if (path.includes('/login')) {
    return '用户登录';
  }

  return `${actionType}操作`;
}

// 提取资源类型和ID
function extractResource(path: string): { resource: string | null; resourceId: number | null } {
  const pathParts = path.split('/');

  if (path.includes('/users/')) {
    const idMatch = path.match(/\/users\/(\d+)/);
    return { resource: 'user', resourceId: idMatch ? parseInt(idMatch[1]) : null };
  }
  if (path.includes('/roles/')) {
    const idMatch = path.match(/\/roles\/(\d+)/);
    return { resource: 'role', resourceId: idMatch ? parseInt(idMatch[1]) : null };
  }
  if (path.includes('/menus/')) {
    const idMatch = path.match(/\/menus\/(\d+)/);
    return { resource: 'menu', resourceId: idMatch ? parseInt(idMatch[1]) : null };
  }
  if (path.includes('/foods/')) {
    const idMatch = path.match(/\/foods\/(\d+)/);
    return { resource: 'food', resourceId: idMatch ? parseInt(idMatch[1]) : null };
  }

  return { resource: null, resourceId: null };
}

export const operationLogger = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  // 只记录管理端接口
  if (!req.originalUrl.startsWith('/api/admin') &&
      !req.originalUrl.startsWith('/api/monitor') &&
      !req.originalUrl.includes('/login')) {
    return next();
  }

  // 跳过 GET 请求（查询类操作不记录）
  if (req.method === 'GET') {
    return next();
  }

  // 保存原始的 res.json 方法
  const originalJson = res.json.bind(res);
  let responseStatus = 200;
  let responseBody: any = null;

  // 重写 res.json 方法以捕获响应
  res.json = function(body: any): Response {
    responseBody = body;
    responseStatus = res.statusCode;
    return originalJson(body);
  };

  // 继续处理请求
  res.on('finish', async () => {
    try {
      const responseTime = Date.now() - startTime;
      const module = extractModule(req.originalUrl);
      const summary = extractSummary(req.method, req.originalUrl, req.body);
      const { resource, resourceId } = extractResource(req.originalUrl);
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip;
      const userAgent = req.headers['user-agent'];

      // 提取系统和浏览器信息
      let system = null;
      let browser = null;
      if (userAgent) {
        if (userAgent.includes('Windows')) system = 'Windows';
        else if (userAgent.includes('Mac')) system = 'MacOS';
        else if (userAgent.includes('Linux')) system = 'Linux';

        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
      }

      // 记录操作日志
      await db.execute(
        `INSERT INTO system_logs (
          user_id, module, summary, action, resource, resource_id,
          method, url, ip_address, \`system\`, browser, user_agent,
          request_data, response_status, status, response_time,
          error_message, operating_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          req.user?.userId || null,
          module,
          summary,
          req.method.toLowerCase(),
          resource,
          resourceId,
          req.method,
          req.originalUrl,
          ipAddress,
          system,
          browser,
          userAgent,
          JSON.stringify(req.body),
          responseStatus,
          responseBody?.success ? 1 : 0,
          responseTime,
          responseBody?.success ? null : responseBody?.message
        ]
      );
    } catch (error) {
      console.error('记录操作日志失败:', error);
      // 不影响主流程
    }
  });

  next();
};

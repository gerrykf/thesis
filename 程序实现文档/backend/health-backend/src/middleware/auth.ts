import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
  clientType?: 'h5' | 'admin'; // 客户端类型
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('[Auth] 请求路径:', req.path);
    console.log('[Auth] Authorization header:', authHeader ? '存在' : '缺失');

    if (!token) {
      console.log('[Auth] Token 缺失');
      res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log('[Auth] Token 解码成功, userId:', decoded.userId);

    // 验证用户是否存在且激活
    const [rows] = await db.execute(
      'SELECT id, username, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    const users = rows as any[];
    console.log('[Auth] 数据库查询结果:', users.length > 0 ? `找到用户 ${users[0].username}` : '用户不存在');

    if (users.length === 0 || !users[0].is_active) {
      console.log('[Auth] 用户验证失败:', users.length === 0 ? '用户不存在' : '用户已被禁用');
      res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: users[0].role
    };

    // 识别客户端类型（通过自定义请求头）
    const clientType = req.headers['x-client-type'] as string;
    req.clientType = clientType === 'h5' ? 'h5' : 'admin';
    console.log('[Auth] 客户端类型:', req.clientType, ', header值:', clientType);
    console.log('[Auth] 认证成功, 用户:', req.user.username, ', 角色:', req.user.role);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: '令牌已过期'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: '无效的令牌'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '令牌验证失败'
      });
    }
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
    return;
  }
  next();
};

// 支持单个角色或多个角色
// 可选参数 requireAdminClient: 是否要求必须是管理端客户端访问
export const requireRole = (...roles: string[]) => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userRole = req.user?.role;
  console.log('[RequireRole] 需要角色:', roles, ', 用户角色:', userRole);

  if (!userRole || !roles.includes(userRole)) {
    console.log('[RequireRole] 权限验证失败');
    res.status(403).json({
      success: false,
      message: `需要${roles.join('或')}权限`
    });
    return;
  }
  console.log('[RequireRole] 权限验证通过');
  next();
};

// 要求必须是管理端客户端访问
export const requireAdminClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log('[RequireAdminClient] 客户端类型:', req.clientType);
  if (req.clientType !== 'admin') {
    console.log('[RequireAdminClient] 客户端类型验证失败');
    res.status(403).json({
      success: false,
      message: '该接口仅限管理端访问'
    });
    return;
  }
  console.log('[RequireAdminClient] 客户端类型验证通过');
  next();
};

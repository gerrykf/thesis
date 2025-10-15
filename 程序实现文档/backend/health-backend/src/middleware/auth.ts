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

    if (!token) {
      res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // 验证用户是否存在且激活
    const [rows] = await db.execute(
      'SELECT id, username, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    const users = rows as any[];
    if (users.length === 0 || !users[0].is_active) {
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

  if (!userRole || !roles.includes(userRole)) {
    res.status(403).json({
      success: false,
      message: `需要${roles.join('或')}权限`
    });
    return;
  }
  next();
};

// 要求必须是管理端客户端访问
export const requireAdminClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.clientType !== 'admin') {
    res.status(403).json({
      success: false,
      message: '该接口仅限管理端访问'
    });
    return;
  }
  next();
};

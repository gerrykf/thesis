import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 获取用户列表
 *     tags: [Admin]
 *     description: 获取所有用户列表(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每页数量
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词(用户名或昵称)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: 用户角色筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       500:
 *         description: 服务器内部错误
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const role = req.query.role as string;

    let query = `
      SELECT id, username, nickname, email, phone, gender, role, is_active,
             created_at, last_login_at
      FROM users
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      query += ' AND (username LIKE ? OR nickname LIKE ? OR email LIKE ?)';
      countQuery += ' AND (username LIKE ? OR nickname LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
      countParams.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [users] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags: [Admin]
 *     description: 获取指定用户的详细信息(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const [rows] = await db.execute(
      `SELECT id, username, nickname, email, phone, gender, birth_date,
              height, target_weight, avatar, role, is_active, created_at, last_login_at
       FROM users WHERE id = ?`,
      [userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}/toggle-status:
 *   patch:
 *     summary: 切换用户状态
 *     tags: [Admin]
 *     description: 启用或禁用用户账号(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 用户状态已更新
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    // 检查用户是否存在
    const [rows] = await db.execute(
      'SELECT id, is_active FROM users WHERE id = ?',
      [userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    const newStatus = !users[0].is_active;

    await db.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [newStatus, userId]
    );

    res.json({
      success: true,
      message: `用户已${newStatus ? '启用' : '禁用'}`,
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('切换用户状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/admin/stats/system:
 *   get:
 *     summary: 获取系统统计
 *     tags: [Admin]
 *     description: 获取系统整体统计数据(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_users:
 *                       type: integer
 *                       description: 总用户数
 *                     active_users:
 *                       type: integer
 *                       description: 活跃用户数
 *                     total_health_records:
 *                       type: integer
 *                       description: 总健康记录数
 *                     total_diet_records:
 *                       type: integer
 *                       description: 总饮食记录数
 *                     total_foods:
 *                       type: integer
 *                       description: 总食物数
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       500:
 *         description: 服务器内部错误
 */
export const getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 用户统计
    const [userStats] = await db.execute(
      'SELECT COUNT(*) as total, SUM(is_active) as active FROM users'
    );

    // 健康记录统计
    const [healthStats] = await db.execute(
      'SELECT COUNT(*) as total FROM health_records'
    );

    // 饮食记录统计
    const [dietStats] = await db.execute(
      'SELECT COUNT(*) as total FROM diet_records'
    );

    // 食物统计
    const [foodStats] = await db.execute(
      'SELECT COUNT(*) as total FROM foods WHERE is_active = true'
    );

    const userData = (userStats as any[])[0];
    const healthData = (healthStats as any[])[0];
    const dietData = (dietStats as any[])[0];
    const foodData = (foodStats as any[])[0];

    res.json({
      success: true,
      data: {
        total_users: userData.total || 0,
        active_users: userData.active || 0,
        total_health_records: healthData.total || 0,
        total_diet_records: dietData.total || 0,
        total_foods: foodData.total || 0
      }
    });
  } catch (error) {
    console.error('获取系统统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: 获取系统日志
 *     tags: [Admin]
 *     description: 获取系统操作日志(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: 每页数量
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: 操作类型筛选
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           action:
 *                             type: string
 *                           resource:
 *                             type: string
 *                           resource_id:
 *                             type: integer
 *                           ip_address:
 *                             type: string
 *                           response_status:
 *                             type: integer
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       500:
 *         description: 服务器内部错误
 */
export const getSystemLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const action = req.query.action as string;
    const userId = req.query.user_id as string;

    let query = 'SELECT * FROM system_logs WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM system_logs WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (action) {
      query += ' AND action = ?';
      countQuery += ' AND action = ?';
      params.push(action);
      countParams.push(action);
    }

    if (userId) {
      query += ' AND user_id = ?';
      countQuery += ' AND user_id = ?';
      params.push(userId);
      countParams.push(userId);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [logs] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取系统日志错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

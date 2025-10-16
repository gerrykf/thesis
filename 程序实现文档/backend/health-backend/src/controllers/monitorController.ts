import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * 在线用户管理
 */

/**
 * @swagger
 * /api/monitor/online-users:
 *   get:
 *     summary: 获取在线用户列表
 *     tags: [Monitor]
 *     description: 获取当前在线用户列表，支持分页和用户名搜索
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
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名（模糊搜索）
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
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           ip:
 *                             type: string
 *                           address:
 *                             type: string
 *                           system:
 *                             type: string
 *                           browser:
 *                             type: string
 *                           login_time:
 *                             type: string
 *                             format: date-time
 *                           last_active_time:
 *                             type: string
 *                             format: date-time
 *                           expires_at:
 *                             type: string
 *                             format: date-time
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getOnlineUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const username = req.query.username as string;

    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereClause = 'WHERE expires_at > NOW()'; // 只显示未过期的在线用户
    const queryParams: any[] = [];

    if (username) {
      whereClause += ' AND username LIKE ?';
      queryParams.push(`%${username}%`);
    }

    // 查询总数
    const [countResult] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM online_users ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // 查询列表数据
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT
        id,
        user_id,
        username,
        ip,
        address,
        \`system\`,
        browser,
        login_time,
        last_active_time,
        expires_at
       FROM online_users
       ${whereClause}
       ORDER BY login_time DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: rows,
        total,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('获取在线用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取在线用户列表失败'
    });
  }
};

/**
 * @swagger
 * /api/monitor/online-users/{id}:
 *   delete:
 *     summary: 强制用户下线
 *     tags: [Monitor]
 *     description: 根据在线用户ID强制用户下线
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 在线用户ID
 *     responses:
 *       200:
 *         description: 强制下线成功
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
 *                   example: 强制下线成功
 *       404:
 *         description: 在线用户不存在
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const forceOfflineUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 删除在线用户记录
    const [result] = await db.execute<ResultSetHeader>(
      'DELETE FROM online_users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: '在线用户不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '强制下线成功'
    });
  } catch (error) {
    console.error('强制下线用户错误:', error);
    res.status(500).json({
      success: false,
      message: '强制下线失败'
    });
  }
};

/**
 * 登录日志管理
 */

/**
 * @swagger
 * /api/monitor/login-logs:
 *   get:
 *     summary: 获取登录日志列表
 *     tags: [Monitor]
 *     description: 获取用户登录日志列表，支持分页和多条件筛选
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
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名（模糊搜索）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 登录状态（0-失败，1-成功）
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 开始时间
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 结束时间
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
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           ip:
 *                             type: string
 *                           address:
 *                             type: string
 *                           system:
 *                             type: string
 *                           browser:
 *                             type: string
 *                           status:
 *                             type: integer
 *                             description: 登录状态（0-失败，1-成功）
 *                           behavior:
 *                             type: string
 *                             description: 登录行为
 *                           error_message:
 *                             type: string
 *                             description: 错误信息
 *                           login_time:
 *                             type: string
 *                             format: date-time
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getLoginLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const username = req.query.username as string;
    const status = req.query.status as string;
    const startTime = req.query.startTime as string;
    const endTime = req.query.endTime as string;

    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (username) {
      whereClause += ' AND username LIKE ?';
      queryParams.push(`%${username}%`);
    }

    if (status !== undefined && status !== '') {
      whereClause += ' AND status = ?';
      queryParams.push(parseInt(status));
    }

    if (startTime) {
      whereClause += ' AND login_time >= ?';
      queryParams.push(startTime);
    }

    if (endTime) {
      whereClause += ' AND login_time <= ?';
      queryParams.push(endTime);
    }

    // 查询总数
    const [countResult] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM login_logs ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // 查询列表数据
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT
        id,
        user_id,
        username,
        ip,
        address,
        \`system\`,
        browser,
        status,
        behavior,
        error_message,
        login_time
       FROM login_logs
       ${whereClause}
       ORDER BY login_time DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: rows,
        total,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('获取登录日志列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取登录日志列表失败'
    });
  }
};

/**
 * @swagger
 * /api/monitor/login-logs/batch-delete:
 *   post:
 *     summary: 批量删除登录日志
 *     tags: [Monitor]
 *     description: 根据ID列表批量删除登录日志
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 要删除的日志ID列表
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 成功删除 5 条记录
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const batchDeleteLoginLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: '请提供要删除的日志ID列表'
      });
      return;
    }

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM login_logs WHERE id IN (${placeholders})`,
      ids
    );

    res.json({
      success: true,
      message: `成功删除 ${result.affectedRows} 条记录`
    });
  } catch (error) {
    console.error('批量删除登录日志错误:', error);
    res.status(500).json({
      success: false,
      message: '批量删除登录日志失败'
    });
  }
};

/**
 * @swagger
 * /api/monitor/login-logs/clear:
 *   delete:
 *     summary: 清空所有登录日志
 *     tags: [Monitor]
 *     description: 清空所有登录日志记录
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 清空成功
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
 *                   example: 成功清空 100 条记录
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const clearAllLoginLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [result] = await db.execute<ResultSetHeader>(
      'DELETE FROM login_logs'
    );

    res.json({
      success: true,
      message: `成功清空 ${result.affectedRows} 条记录`
    });
  } catch (error) {
    console.error('清空登录日志错误:', error);
    res.status(500).json({
      success: false,
      message: '清空登录日志失败'
    });
  }
};

/**
 * 操作日志管理
 */

/**
 * @swagger
 * /api/monitor/operation-logs:
 *   get:
 *     summary: 获取操作日志列表
 *     tags: [Monitor]
 *     description: 获取用户操作日志列表，支持分页和多条件筛选
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
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名（模糊搜索）
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *         description: 所属模块（模糊搜索）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 操作状态（0-失败，1-成功）
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 开始时间
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 结束时间
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
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           module:
 *                             type: string
 *                             description: 所属模块
 *                           summary:
 *                             type: string
 *                             description: 操作概要
 *                           action:
 *                             type: string
 *                             description: 操作动作
 *                           ip_address:
 *                             type: string
 *                             description: 操作IP
 *                           address:
 *                             type: string
 *                             description: 操作地点
 *                           system:
 *                             type: string
 *                             description: 操作系统
 *                           browser:
 *                             type: string
 *                             description: 浏览器类型
 *                           status:
 *                             type: integer
 *                             description: 操作状态（0-失败，1-成功）
 *                           operating_time:
 *                             type: string
 *                             format: date-time
 *                             description: 操作时间
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getOperationLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const username = req.query.username as string;
    const module = req.query.module as string;
    const status = req.query.status as string;
    const startTime = req.query.startTime as string;
    const endTime = req.query.endTime as string;

    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (username) {
      whereClause += ' AND username LIKE ?';
      queryParams.push(`%${username}%`);
    }

    if (module) {
      whereClause += ' AND module LIKE ?';
      queryParams.push(`%${module}%`);
    }

    if (status !== undefined && status !== '') {
      whereClause += ' AND status = ?';
      queryParams.push(parseInt(status));
    }

    if (startTime) {
      whereClause += ' AND operating_time >= ?';
      queryParams.push(startTime);
    }

    if (endTime) {
      whereClause += ' AND operating_time <= ?';
      queryParams.push(endTime);
    }

    // 查询总数
    const [countResult] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM system_logs ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // 查询列表数据
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT
        id,
        user_id,
        username,
        module,
        summary,
        \`action\`,
        ip_address,
        address,
        \`system\`,
        browser,
        status,
        operating_time,
        created_at
       FROM system_logs
       ${whereClause}
       ORDER BY operating_time DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: rows,
        total,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('获取操作日志列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取操作日志列表失败'
    });
  }
};

/**
 * @swagger
 * /api/monitor/operation-logs/batch-delete:
 *   post:
 *     summary: 批量删除操作日志
 *     tags: [Monitor]
 *     description: 根据ID列表批量删除操作日志
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 要删除的日志ID列表
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 成功删除 5 条记录
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const batchDeleteOperationLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: '请提供要删除的日志ID列表'
      });
      return;
    }

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM system_logs WHERE id IN (${placeholders})`,
      ids
    );

    res.json({
      success: true,
      message: `成功删除 ${result.affectedRows} 条记录`
    });
  } catch (error) {
    console.error('批量删除操作日志错误:', error);
    res.status(500).json({
      success: false,
      message: '批量删除操作日志失败'
    });
  }
};

/**
 * @swagger
 * /api/monitor/operation-logs/clear:
 *   delete:
 *     summary: 清空所有操作日志
 *     tags: [Monitor]
 *     description: 清空所有操作日志记录
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 清空成功
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
 *                   example: 成功清空 100 条记录
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const clearAllOperationLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [result] = await db.execute<ResultSetHeader>(
      'DELETE FROM system_logs'
    );

    res.json({
      success: true,
      message: `成功清空 ${result.affectedRows} 条记录`
    });
  } catch (error) {
    console.error('清空操作日志错误:', error);
    res.status(500).json({
      success: false,
      message: '清空操作日志失败'
    });
  }
};
// force reload

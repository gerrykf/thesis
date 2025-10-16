import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * 在线用户管理
 */

// 获取在线用户列表
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
        system,
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

// 强制下线用户
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

// 获取登录日志列表
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
        system,
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

// 批量删除登录日志
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

// 清空所有登录日志
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

// 获取操作日志列表
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
        action,
        ip_address,
        address,
        system,
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

// 批量删除操作日志
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

// 清空所有操作日志
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

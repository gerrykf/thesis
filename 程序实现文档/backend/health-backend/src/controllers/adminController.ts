import { Response } from "express";
import { db } from "../config/database";
import { AuthRequest } from "../middleware/auth";

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
 *       - in: query
 *         name: createdStartDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 创建时间开始日期(YYYY-MM-DD)
 *       - in: query
 *         name: createdEndDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 创建时间结束日期(YYYY-MM-DD)
 *       - in: query
 *         name: loginStartDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 最后登录开始日期(YYYY-MM-DD)
 *       - in: query
 *         name: loginEndDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 最后登录结束日期(YYYY-MM-DD)
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
export const getUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit =
      parseInt(req.query.pageSize as string) ||
      parseInt(req.query.limit as string) ||
      20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const createdStartDate = req.query.createdStartDate as string;
    const createdEndDate = req.query.createdEndDate as string;
    const loginStartDate = req.query.loginStartDate as string;
    const loginEndDate = req.query.loginEndDate as string;

    // 构建WHERE条件
    let whereConditions = "";
    const conditions: string[] = [];

    if (search) {
      conditions.push(
        `(username LIKE '%${search}%' OR nickname LIKE '%${search}%' OR email LIKE '%${search}%')`
      );
    }

    if (role) {
      conditions.push(`role = '${role}'`);
    }

    // 创建时间筛选
    if (createdStartDate) {
      conditions.push(`DATE(created_at) >= '${createdStartDate}'`);
    }

    if (createdEndDate) {
      conditions.push(`DATE(created_at) <= '${createdEndDate}'`);
    }

    // 最后登录时间筛选
    if (loginStartDate) {
      conditions.push(`DATE(last_login_at) >= '${loginStartDate}'`);
    }

    if (loginEndDate) {
      conditions.push(`DATE(last_login_at) <= '${loginEndDate}'`);
    }

    if (conditions.length > 0) {
      whereConditions = " WHERE " + conditions.join(" AND ");
    }

    const [users] = await db.execute(
      `SELECT id, username, nickname, email, phone, gender, role, is_active, created_at, last_login_at
       FROM users${whereConditions}
       ORDER BY last_login_at DESC, created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM users${whereConditions}`
    );
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取用户列表错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error)?.message
          : undefined,
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
export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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
        message: "用户不存在",
      });
      return;
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("获取用户详情错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
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
export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    // 检查用户是否存在
    const [rows] = await db.execute(
      "SELECT id, is_active FROM users WHERE id = ?",
      [userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: "用户不存在",
      });
      return;
    }

    const newStatus = !users[0].is_active;

    await db.execute("UPDATE users SET is_active = ? WHERE id = ?", [
      newStatus,
      userId,
    ]);

    res.json({
      success: true,
      message: `用户已${newStatus ? "启用" : "禁用"}`,
      data: { is_active: newStatus },
    });
  } catch (error) {
    console.error("切换用户状态错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
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
export const getSystemStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // 用户统计
    const [userStats] = await db.execute(
      "SELECT COUNT(*) as total, SUM(is_active) as active FROM users"
    );

    // 健康记录统计
    const [healthStats] = await db.execute(
      "SELECT COUNT(*) as total FROM health_records"
    );

    // 饮食记录统计
    const [dietStats] = await db.execute(
      "SELECT COUNT(*) as total FROM diet_records"
    );

    // 食物统计
    const [foodStats] = await db.execute(
      "SELECT COUNT(*) as total FROM foods WHERE is_active = true"
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
        total_foods: foodData.total || 0,
      },
    });
  } catch (error) {
    console.error("获取系统统计错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
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
export const getSystemLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const action = req.query.action as string;
    const userId = req.query.user_id as string;

    let query = "SELECT * FROM system_logs WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM system_logs WHERE 1=1";
    const params: any[] = [];
    const countParams: any[] = [];

    if (action) {
      query += " AND action = ?";
      countQuery += " AND action = ?";
      params.push(action);
      countParams.push(action);
    }

    if (userId) {
      query += " AND user_id = ?";
      countQuery += " AND user_id = ?";
      params.push(userId);
      countParams.push(userId);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取系统日志错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: 更新用户信息
 *     tags: [Admin]
 *     description: 更新指定用户的信息(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 昵称
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: 性别
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 description: 出生日期
 *               height:
 *                 type: number
 *                 description: 身高(cm)
 *               target_weight:
 *                 type: number
 *                 description: 目标体重(kg)
 *               is_active:
 *                 type: boolean
 *                 description: 账号状态
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: 用户角色
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 用户信息更新成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
export const updateUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const allowedFields = [
      "is_active",
      "nickname",
      "email",
      "phone",
      "gender",
      "birth_date",
      "height",
      "target_weight",
      "role",
    ];

    // 检查用户是否存在
    const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if ((userCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "用户不存在",
      });
      return;
    }

    // 构建更新字段
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(req.body[key]);
      }
    });

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        message: "没有有效的更新字段",
      });
      return;
    }

    // 添加用户ID到参数数组
    updateValues.push(userId);

    await db.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: "用户信息更新成功",
    });
  } catch (error) {
    console.error("更新用户信息错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     tags: [Admin]
 *     description: 删除指定用户及其所有相关数据(需要管理员权限)
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
 *                   example: 用户删除成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限或禁止删除自己
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user?.userId;

    // 防止管理员删除自己
    if (currentUserId && parseInt(userId) === currentUserId) {
      res.status(403).json({
        success: false,
        message: "不能删除自己的账号",
      });
      return;
    }

    // 检查用户是否存在
    const [userCheck] = await db.execute(
      "SELECT id, username FROM users WHERE id = ?",
      [userId]
    );

    if ((userCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "用户不存在",
      });
      return;
    }

    // 开始事务删除用户及其相关数据
    await db.execute("START TRANSACTION");

    try {
      // 删除用户的健康记录
      await db.execute("DELETE FROM health_records WHERE user_id = ?", [
        userId,
      ]);

      // 删除用户的饮食记录
      await db.execute("DELETE FROM diet_records WHERE user_id = ?", [userId]);

      // 删除用户的目标
      await db.execute("DELETE FROM user_goals WHERE user_id = ?", [userId]);

      // 删除用户的系统日志
      await db.execute("DELETE FROM system_logs WHERE user_id = ?", [userId]);

      // 最后删除用户
      await db.execute("DELETE FROM users WHERE id = ?", [userId]);

      // 提交事务
      await db.execute("COMMIT");

      res.json({
        success: true,
        message: "用户删除成功",
      });
    } catch (error) {
      // 回滚事务
      await db.execute("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("删除用户错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error)?.message
          : undefined,
    });
  }
};

/**
 * 获取用户统计 - GET /api/admin/stats/users
 */
export const getUserStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // 总用户数和活跃用户数
    const [userStats] = await db.execute(
      "SELECT COUNT(*) as total, SUM(is_active) as active FROM users"
    );

    // 管理员用户数
    const [adminStats] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
    );

    // 今日新增用户数
    const [newUsersStats] = await db.execute(
      `SELECT COUNT(*) as count FROM users 
       WHERE DATE(created_at) = CURDATE()`
    );

    const userData = (userStats as any[])[0];
    const adminData = (adminStats as any[])[0];
    const newUsersData = (newUsersStats as any[])[0];

    res.json({
      success: true,
      data: {
        totalUsers: userData.total || 0,
        activeUsers: userData.active || 0,
        adminUsers: adminData.count || 0,
        newUsersToday: newUsersData.count || 0,
      },
    });
  } catch (error) {
    console.error("获取用户统计错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * 获取用户健康统计 - GET /api/admin/users/:id/health-stats
 */
export const getUserHealthStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    // 检查用户是否存在
    const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if ((userCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "用户不存在",
      });
      return;
    }

    // 健康记录总数
    const [healthRecords] = await db.execute(
      "SELECT COUNT(*) as count FROM health_records WHERE user_id = ?",
      [userId]
    );

    // 饮食记录总数
    const [dietRecords] = await db.execute(
      "SELECT COUNT(*) as count FROM diet_records WHERE user_id = ?",
      [userId]
    );

    // 活跃目标数
    const [activeGoals] = await db.execute(
      'SELECT COUNT(*) as count FROM user_goals WHERE user_id = ? AND status = "active"',
      [userId]
    );

    // 活跃天数(30天内有记录的天数)
    const [activeDays] = await db.execute(
      `SELECT COUNT(DISTINCT DATE(record_date)) as count 
       FROM health_records 
       WHERE user_id = ? AND record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      [userId]
    );

    const healthData = (healthRecords as any[])[0];
    const dietData = (dietRecords as any[])[0];
    const goalsData = (activeGoals as any[])[0];
    const daysData = (activeDays as any[])[0];

    res.json({
      success: true,
      data: {
        totalRecords: healthData.count || 0,
        dietRecords: dietData.count || 0,
        activeGoals: goalsData.count || 0,
        activeDays: daysData.count || 0,
      },
    });
  } catch (error) {
    console.error("获取用户健康统计错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * 获取用户健康记录 - GET /api/admin/users/:id/health-records
 */
export const getUserHealthRecords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    // 检查用户是否存在
    const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if ((userCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "用户不存在",
      });
      return;
    }

    let query = "SELECT * FROM health_records WHERE user_id = ?";
    let countQuery =
      "SELECT COUNT(*) as total FROM health_records WHERE user_id = ?";
    const params: any[] = [userId];
    const countParams: any[] = [userId];

    // 日期筛选
    if (startDate) {
      query += " AND record_date >= ?";
      countQuery += " AND record_date >= ?";
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      query += " AND record_date <= ?";
      countQuery += " AND record_date <= ?";
      params.push(endDate);
      countParams.push(endDate);
    }

    query += " ORDER BY record_date DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    const [records] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        records,
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("获取用户健康记录错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

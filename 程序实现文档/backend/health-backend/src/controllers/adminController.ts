import { Response } from "express";
import { db } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: 创建用户
 *     tags: [Admin]
 *     description: 创建新用户(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
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
 *               role_id:
 *                 type: integer
 *                 description: 角色ID (1:普通用户, 2:管理员, 3:超级管理员)
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
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       409:
 *         description: 用户名或邮箱已存在
 *       500:
 *         description: 服务器内部错误
 */
export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      password,
      nickname,
      email,
      phone,
      role_id,
      gender,
      birth_date,
      height,
      target_weight
    } = req.body;

    const currentUserRole = req.user?.role;

    // 验证必填字段
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "用户名和密码为必填项"
      });
      return;
    }

    // 检查用户名是否已存在
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE username = ? OR (email IS NOT NULL AND email = ?)",
      [username, email || null]
    );

    if ((existingUsers as any[]).length > 0) {
      res.status(409).json({
        success: false,
        message: "用户名或邮箱已存在"
      });
      return;
    }

    // 处理角色ID,默认为1(普通用户)
    let targetRoleId = role_id || 1;

    // 权限检查:只有超级管理员可以创建超级管理员
    if (targetRoleId === 3 && currentUserRole !== 'super_admin') {
      res.status(403).json({
        success: false,
        message: "只有超级管理员可以创建超级管理员账号"
      });
      return;
    }

    // 验证角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id FROM roles WHERE id = ?",
      [targetRoleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(400).json({
        success: false,
        message: "角色不存在"
      });
      return;
    }

    // 密码加密
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const [result] = await db.execute(
      `INSERT INTO users
       (username, password, nickname, email, phone, role_id, gender, birth_date, height, target_weight)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        nickname || null,
        email || null,
        phone || null,
        targetRoleId,
        gender || null,
        birth_date || null,
        height || null,
        target_weight || null
      ]
    );

    const userId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: "用户创建成功",
      data: { userId }
    });
  } catch (error) {
    console.error("创建用户错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error)?.message
          : undefined
    });
  }
};

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
    const username = req.query.username as string;
    const nickname = req.query.nickname as string;
    const role = req.query.role as string;
    const is_active = req.query.is_active as string;
    const createdStartDate = req.query.createdStartDate as string;
    const createdEndDate = req.query.createdEndDate as string;
    const loginStartDate = req.query.loginStartDate as string;
    const loginEndDate = req.query.loginEndDate as string;

    // 构建WHERE条件
    let whereConditions = "";
    const conditions: string[] = [];

    if (search) {
      conditions.push(
        `(u.username LIKE '%${search}%' OR u.nickname LIKE '%${search}%' OR u.email LIKE '%${search}%')`
      );
    }

    if (username) {
      conditions.push(`u.username LIKE '%${username}%'`);
    }

    if (nickname) {
      conditions.push(`u.nickname LIKE '%${nickname}%'`);
    }

    if (role) {
      conditions.push(`r.code = '${role}'`);
    }

    if (is_active !== undefined && is_active !== null && is_active !== '') {
      // 处理布尔值：'true', 'false', true, false, 1, 0
      const activeValue = is_active === 'true' || is_active === '1' || (is_active as any) === true;
      conditions.push(`u.is_active = ${activeValue ? 1 : 0}`);
    }

    // 创建时间筛选
    if (createdStartDate) {
      conditions.push(`DATE(u.created_at) >= '${createdStartDate}'`);
    }

    if (createdEndDate) {
      conditions.push(`DATE(u.created_at) <= '${createdEndDate}'`);
    }

    // 最后登录时间筛选 (last_login_at 可能为 NULL，需要处理)
    if (loginStartDate) {
      conditions.push(`(u.last_login_at IS NOT NULL AND DATE(u.last_login_at) >= '${loginStartDate}')`);
    }

    if (loginEndDate) {
      conditions.push(`(u.last_login_at IS NOT NULL AND DATE(u.last_login_at) <= '${loginEndDate}')`);
    }

    if (conditions.length > 0) {
      whereConditions = " WHERE " + conditions.join(" AND ");
    }

    // 添加调试日志
    console.log('查询条件:', {
      search,
      username,
      nickname,
      role,
      is_active,
      createdStartDate,
      createdEndDate,
      loginStartDate,
      loginEndDate,
      whereConditions
    });

    const [users] = await db.execute(
      `SELECT u.id, u.username, u.nickname, u.email, u.phone, u.gender, u.is_active, u.created_at, u.last_login_at,
              r.code as role, r.id as role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       ${whereConditions}
       ORDER BY u.last_login_at DESC, u.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       ${whereConditions}`
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
      `SELECT u.id, u.username, u.nickname, u.email, u.phone, u.gender, u.birth_date,
              u.height, u.target_weight, u.avatar, u.is_active, u.created_at, u.last_login_at,
              r.code as role, r.id as role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
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

        // 处理日期格式：将ISO 8601格式转换为MySQL DATE格式 (YYYY-MM-DD)
        if (key === 'birth_date' && req.body[key]) {
          const date = new Date(req.body[key]);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          updateValues.push(`${year}-${month}-${day}`);
        } else {
          updateValues.push(req.body[key]);
        }
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

    // 获取连接以进行事务操作
    const connection = await db.getConnection();

    try {
      // 开始事务
      await connection.beginTransaction();

      // 删除用户的健康记录
      await connection.execute("DELETE FROM health_records WHERE user_id = ?", [
        userId,
      ]);

      // 删除用户的饮食记录
      await connection.execute("DELETE FROM diet_records WHERE user_id = ?", [userId]);

      // 删除用户的目标
      await connection.execute("DELETE FROM user_goals WHERE user_id = ?", [userId]);

      // 删除用户的系统日志
      await connection.execute("DELETE FROM system_logs WHERE user_id = ?", [userId]);

      // 最后删除用户
      await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

      // 提交事务
      await connection.commit();

      res.json({
        success: true,
        message: "用户删除成功",
      });
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      throw error;
    } finally {
      // 释放连接
      connection.release();
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
 * @swagger
 * /api/admin/stats/users:
 *   get:
 *     summary: 获取用户统计
 *     tags: [Admin]
 *     description: 获取用户统计数据(需要管理员权限)
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
 *                     totalUsers:
 *                       type: integer
 *                       description: 总用户数
 *                     activeUsers:
 *                       type: integer
 *                       description: 活跃用户数
 *                     adminUsers:
 *                       type: integer
 *                       description: 管理员用户数
 *                     newUsersToday:
 *                       type: integer
 *                       description: 今日新增用户数
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       500:
 *         description: 服务器内部错误
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
 * @swagger
 * /api/admin/users/{id}/health-stats:
 *   get:
 *     summary: 获取用户健康统计
 *     tags: [Admin]
 *     description: 获取指定用户的健康统计数据(需要管理员权限)
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
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                       description: 健康记录总数
 *                     dietRecords:
 *                       type: integer
 *                       description: 饮食记录总数
 *                     activeGoals:
 *                       type: integer
 *                       description: 活跃目标数
 *                     activeDays:
 *                       type: integer
 *                       description: 活跃天数(30天内)
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
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
 * @swagger
 * /api/admin/users/{id}/health-records:
 *   get:
 *     summary: 获取用户健康记录
 *     tags: [Admin]
 *     description: 获取指定用户的健康记录列表(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
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
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期(YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期(YYYY-MM-DD)
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
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HealthRecord'
 *                     total:
 *                       type: integer
 *                       description: 总记录数
 *                     page:
 *                       type: integer
 *                       description: 当前页码
 *                     pageSize:
 *                       type: integer
 *                       description: 每页数量
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
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

    query += ` ORDER BY record_date DESC LIMIT ${pageSize} OFFSET ${offset}`;

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

/**
 * @swagger
 * /api/admin/stats/user-registration-trend:
 *   get:
 *     summary: 获取用户注册趋势
 *     tags: [Admin]
 *     description: 获取用户注册数量趋势(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: day
 *         description: 时间维度
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getUserRegistrationTrend = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const period = (req.query.period as string) || "day";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    let dateFormat = "%Y-%m-%d";
    if (period === "week") {
      dateFormat = "%Y-%u";
    } else if (period === "month") {
      dateFormat = "%Y-%m";
    } else if (period === "quarter") {
      dateFormat = "%Y-Q%q";
    } else if (period === "year") {
      dateFormat = "%Y";
    }

    const [rows] = await db.execute(
      `SELECT
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as count
       FROM users
       WHERE DATE(created_at) >= ?
       GROUP BY period
       ORDER BY period ASC`,
      [dateFormat, startDateStr]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("获取用户注册趋势错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/stats/user-active-trend:
 *   get:
 *     summary: 获取用户活跃趋势
 *     tags: [Admin]
 *     description: 获取用户活跃数量趋势(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: day
 *         description: 时间维度
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getUserActiveTrend = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const period = (req.query.period as string) || "day";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    let dateFormat = "%Y-%m-%d";
    if (period === "week") {
      dateFormat = "%Y-%u";
    } else if (period === "month") {
      dateFormat = "%Y-%m";
    } else if (period === "quarter") {
      dateFormat = "%Y-Q%q";
    } else if (period === "year") {
      dateFormat = "%Y";
    }

    // 根据最后登录时间统计活跃用户
    const [rows] = await db.execute(
      `SELECT
        DATE_FORMAT(last_login_at, ?) as period,
        COUNT(DISTINCT id) as count
       FROM users
       WHERE DATE(last_login_at) >= ?
       GROUP BY period
       ORDER BY period ASC`,
      [dateFormat, startDateStr]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("获取用户活跃趋势错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/stats/health-checkin-rate:
 *   get:
 *     summary: 获取健康打卡率
 *     tags: [Admin]
 *     description: 获取所有用户健康打卡率趋势(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: day
 *         description: 时间维度
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getHealthCheckinRate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const period = (req.query.period as string) || "day";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    let dateFormat = "%Y-%m-%d";
    if (period === "week") {
      dateFormat = "%Y-%u";
    } else if (period === "month") {
      dateFormat = "%Y-%m";
    } else if (period === "quarter") {
      dateFormat = "%Y-Q%q";
    } else if (period === "year") {
      dateFormat = "%Y";
    }

    // 获取活跃用户总数
    const [activeUsers] = await db.execute(
      `SELECT COUNT(DISTINCT id) as total FROM users WHERE is_active = 1`
    );
    const totalUsers = (activeUsers as any[])[0].total;

    // 获取每个时间段打卡的用户数
    const [rows] = await db.execute(
      `SELECT
        DATE_FORMAT(record_date, ?) as period,
        COUNT(DISTINCT user_id) as checkin_users,
        ? as total_users,
        ROUND(COUNT(DISTINCT user_id) * 100.0 / ?, 2) as checkin_rate
       FROM health_records
       WHERE DATE(record_date) >= ?
       GROUP BY period
       ORDER BY period ASC`,
      [dateFormat, totalUsers, totalUsers, startDateStr]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("获取健康打卡率错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/stats/diet-checkin-rate:
 *   get:
 *     summary: 获取饮食打卡率
 *     tags: [Admin]
 *     description: 获取所有用户饮食打卡率趋势(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: day
 *         description: 时间维度
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getDietCheckinRate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const period = (req.query.period as string) || "day";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    let dateFormat = "%Y-%m-%d";
    if (period === "week") {
      dateFormat = "%Y-%u";
    } else if (period === "month") {
      dateFormat = "%Y-%m";
    } else if (period === "quarter") {
      dateFormat = "%Y-Q%q";
    } else if (period === "year") {
      dateFormat = "%Y";
    }

    // 获取活跃用户总数
    const [activeUsers] = await db.execute(
      `SELECT COUNT(DISTINCT id) as total FROM users WHERE is_active = 1`
    );
    const totalUsers = (activeUsers as any[])[0].total;

    // 获取每个时间段打卡的用户数
    const [rows] = await db.execute(
      `SELECT
        DATE_FORMAT(record_date, ?) as period,
        COUNT(DISTINCT user_id) as checkin_users,
        ? as total_users,
        ROUND(COUNT(DISTINCT user_id) * 100.0 / ?, 2) as checkin_rate
       FROM diet_records
       WHERE DATE(record_date) >= ?
       GROUP BY period
       ORDER BY period ASC`,
      [dateFormat, totalUsers, totalUsers, startDateStr]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("获取饮食打卡率错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

// ==================== 食物管理相关接口 ====================

/**
 * @swagger
 * /api/admin/foods:
 *   get:
 *     summary: 获取食物列表(后台管理端)
 *     tags: [Admin]
 *     description: 获取食物列表，返回所有字段包括中英文字段，用于后台管理端编辑
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
 *         description: 搜索关键词
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 分类筛选
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 */
export const getAdminFoods = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const category = req.query.category as string;

    // 构建查询 - 返回所有字段
    let query = `SELECT * FROM foods WHERE is_active = true`;
    let countQuery = "SELECT COUNT(*) as total FROM foods WHERE is_active = true";

    const params: any[] = [];
    const countParams: any[] = [];

    // 搜索条件
    if (search) {
      query += " AND (name LIKE ? OR name_en LIKE ?)";
      countQuery += " AND (name LIKE ? OR name_en LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    if (category) {
      query += " AND category = ?";
      countQuery += " AND category = ?";
      params.push(category);
      countParams.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        foods: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取食物列表错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/foods/categories:
 *   get:
 *     summary: 获取食物分类列表(后台管理端)
 *     tags: [Admin]
 *     description: 获取所有食物分类
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要管理员权限
 */
export const getAdminFoodCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [categories] = await db.execute(
      `SELECT category, COUNT(*) as count
       FROM foods
       WHERE is_active = true
       GROUP BY category
       ORDER BY category`
    );

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("获取食物分类错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/foods/{id}:
 *   get:
 *     summary: 获取食物详情(后台管理端)
 *     tags: [Admin]
 *     description: 获取食物详情，返回所有字段
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 获取成功
 *       404:
 *         description: 食物不存在
 */
export const getAdminFoodById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const foodId = req.params.id;

    const [rows] = await db.execute(
      "SELECT * FROM foods WHERE id = ?",
      [foodId]
    );

    const foods = rows as any[];
    if (foods.length === 0) {
      res.status(404).json({
        success: false,
        message: "食物不存在",
      });
      return;
    }

    res.json({
      success: true,
      data: foods[0],
    });
  } catch (error) {
    console.error("获取食物详情错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/foods:
 *   post:
 *     summary: 创建食物(后台管理端)
 *     tags: [Admin]
 *     description: 创建新食物
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFoodRequest'
 *     responses:
 *       201:
 *         description: 创建成功
 */
export const createAdminFood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      name_en,
      category,
      brand,
      calories_per_100g,
      protein_per_100g,
      fat_per_100g,
      carbs_per_100g,
      fiber_per_100g,
      sodium_per_100g,
      sugar_per_100g,
      image_url,
      barcode,
      is_active
    } = req.body;

    const createdBy = req.user?.userId;

    const [result] = await db.execute(
      `INSERT INTO foods
       (name, name_en, category, brand, calories_per_100g, protein_per_100g, fat_per_100g,
        carbs_per_100g, fiber_per_100g, sodium_per_100g, sugar_per_100g, image_url, barcode, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        name_en || null,
        category,
        brand || null,
        calories_per_100g,
        protein_per_100g || 0,
        fat_per_100g || 0,
        carbs_per_100g || 0,
        fiber_per_100g || 0,
        sodium_per_100g || 0,
        sugar_per_100g || 0,
        image_url || null,
        barcode || null,
        is_active !== false,
        createdBy,
      ]
    );

    res.status(201).json({
      success: true,
      message: "食物创建成功",
      data: { foodId: (result as any).insertId },
    });
  } catch (error) {
    console.error("创建食物错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/foods/{id}:
 *   put:
 *     summary: 更新食物(后台管理端)
 *     tags: [Admin]
 *     description: 更新食物信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFoodRequest'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateAdminFood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const foodId = req.params.id;
    const {
      name,
      name_en,
      category,
      brand,
      calories_per_100g,
      protein_per_100g,
      fat_per_100g,
      carbs_per_100g,
      fiber_per_100g,
      sodium_per_100g,
      sugar_per_100g,
      image_url,
      barcode,
      is_active
    } = req.body;

    // 检查食物是否存在
    const [existing] = await db.execute("SELECT id FROM foods WHERE id = ?", [
      foodId,
    ]);
    if ((existing as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "食物不存在",
      });
      return;
    }

    await db.execute(
      `UPDATE foods SET
       name = ?, name_en = ?, category = ?, brand = ?,
       calories_per_100g = ?, protein_per_100g = ?, fat_per_100g = ?,
       carbs_per_100g = ?, fiber_per_100g = ?, sodium_per_100g = ?,
       sugar_per_100g = ?, image_url = ?, barcode = ?, is_active = ?
       WHERE id = ?`,
      [
        name,
        name_en || null,
        category,
        brand || null,
        calories_per_100g,
        protein_per_100g || 0,
        fat_per_100g || 0,
        carbs_per_100g || 0,
        fiber_per_100g || 0,
        sodium_per_100g || 0,
        sugar_per_100g || 0,
        image_url || null,
        barcode || null,
        is_active !== false,
        foodId,
      ]
    );

    res.json({
      success: true,
      message: "食物信息更新成功",
    });
  } catch (error) {
    console.error("更新食物信息错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/foods/{id}:
 *   delete:
 *     summary: 删除食物(后台管理端)
 *     tags: [Admin]
 *     description: 软删除食物
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteAdminFood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const foodId = req.params.id;

    const [existing] = await db.execute("SELECT id FROM foods WHERE id = ?", [
      foodId,
    ]);
    if ((existing as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "食物不存在",
      });
      return;
    }

    // 软删除
    await db.execute("UPDATE foods SET is_active = false WHERE id = ?", [
      foodId,
    ]);

    res.json({
      success: true,
      message: "食物删除成功",
    });
  } catch (error) {
    console.error("删除食物错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

// ==================== 角色管理相关接口 ====================

/**
 * @swagger
 * /api/admin/roles:
 *   get:
 *     summary: 获取角色列表
 *     tags: [Admin]
 *     description: 获取所有角色列表(需要超级管理员权限)
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
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 角色名称搜索
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: 角色标识搜索
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: 状态筛选 1:启用 0:禁用
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 需要超级管理员权限
 */
export const getRoles = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const name = req.query.name as string;
    const code = req.query.code as string;
    const status = req.query.status as string;

    // 构建WHERE条件
    let whereConditions = "";
    const conditions: string[] = [];

    if (name) {
      conditions.push(`name LIKE '%${name}%'`);
    }

    if (code) {
      conditions.push(`code LIKE '%${code}%'`);
    }

    if (status !== undefined && status !== null && status !== '') {
      conditions.push(`status = ${status}`);
    }

    if (conditions.length > 0) {
      whereConditions = " WHERE " + conditions.join(" AND ");
    }

    const [roles] = await db.execute(
      `SELECT id, name, code, status, remark, created_at, updated_at
       FROM roles${whereConditions}
       ORDER BY id ASC
       LIMIT ${limit} OFFSET ${offset}`
    );

    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM roles${whereConditions}`
    );
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        roles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取角色列表错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles:
 *   post:
 *     summary: 创建角色
 *     tags: [Admin]
 *     description: 创建新角色(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 description: 角色名称
 *               code:
 *                 type: string
 *                 description: 角色标识
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       201:
 *         description: 创建成功
 */
export const createRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, code, remark } = req.body;

    if (!name || !code) {
      res.status(400).json({
        success: false,
        message: "角色名称和角色标识为必填项",
      });
      return;
    }

    // 检查角色标识是否已存在
    const [existing] = await db.execute(
      "SELECT id FROM roles WHERE code = ?",
      [code]
    );

    if ((existing as any[]).length > 0) {
      res.status(400).json({
        success: false,
        message: "角色标识已存在",
      });
      return;
    }

    const [result] = await db.execute(
      "INSERT INTO roles (name, code, remark, status) VALUES (?, ?, ?, 1)",
      [name, code, remark || null]
    );

    res.status(201).json({
      success: true,
      message: "角色创建成功",
      data: { roleId: (result as any).insertId },
    });
  } catch (error) {
    console.error("创建角色错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles/{id}:
 *   put:
 *     summary: 更新角色
 *     tags: [Admin]
 *     description: 更新角色信息(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               remark:
 *                 type: string
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleId = req.params.id;
    const { name, code, remark, status } = req.body;

    // 检查角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id FROM roles WHERE id = ?",
      [roleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "角色不存在",
      });
      return;
    }

    // 如果修改了code，检查是否与其他角色重复
    if (code) {
      const [existing] = await db.execute(
        "SELECT id FROM roles WHERE code = ? AND id != ?",
        [code, roleId]
      );

      if ((existing as any[]).length > 0) {
        res.status(400).json({
          success: false,
          message: "角色标识已被其他角色使用",
        });
        return;
      }
    }

    // 构建更新字段
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (code !== undefined) {
      updateFields.push("code = ?");
      updateValues.push(code);
    }

    if (remark !== undefined) {
      updateFields.push("remark = ?");
      updateValues.push(remark);
    }

    if (status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        message: "没有有效的更新字段",
      });
      return;
    }

    updateValues.push(roleId);

    await db.execute(
      `UPDATE roles SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: "角色信息更新成功",
    });
  } catch (error) {
    console.error("更新角色错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles/{id}:
 *   delete:
 *     summary: 删除角色
 *     tags: [Admin]
 *     description: 删除角色(需要超级管理员权限)，不能删除系统内置角色
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleId = req.params.id;

    // 不能删除内置角色 (id 1, 2, 3)
    if (['1', '2', '3'].includes(roleId)) {
      res.status(403).json({
        success: false,
        message: "不能删除系统内置角色",
      });
      return;
    }

    // 检查角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id FROM roles WHERE id = ?",
      [roleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "角色不存在",
      });
      return;
    }

    // 检查是否有用户使用该角色
    const [usersWithRole] = await db.execute(
      "SELECT COUNT(*) as count FROM users WHERE role_id = ?",
      [roleId]
    );

    if ((usersWithRole as any[])[0].count > 0) {
      res.status(400).json({
        success: false,
        message: "该角色下还有用户，无法删除",
      });
      return;
    }

    // 删除角色及其关联的菜单权限（通过外键自动级联删除）
    await db.execute("DELETE FROM roles WHERE id = ?", [roleId]);

    res.json({
      success: true,
      message: "角色删除成功",
    });
  } catch (error) {
    console.error("删除角色错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles/{id}/status:
 *   patch:
 *     summary: 切换角色状态
 *     tags: [Admin]
 *     description: 启用或禁用角色(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 操作成功
 */
export const toggleRoleStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleId = req.params.id;

    // 检查角色是否存在
    const [rows] = await db.execute(
      "SELECT id, status FROM roles WHERE id = ?",
      [roleId]
    );

    const roles = rows as any[];
    if (roles.length === 0) {
      res.status(404).json({
        success: false,
        message: "角色不存在",
      });
      return;
    }

    const newStatus = roles[0].status === 1 ? 0 : 1;

    await db.execute("UPDATE roles SET status = ? WHERE id = ?", [
      newStatus,
      roleId,
    ]);

    res.json({
      success: true,
      message: `角色已${newStatus === 1 ? "启用" : "禁用"}`,
      data: { status: newStatus },
    });
  } catch (error) {
    console.error("切换角色状态错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

// ==================== 菜单管理相关接口 ====================

/**
 * @swagger
 * /api/admin/menus:
 *   get:
 *     summary: 获取所有菜单
 *     tags: [Admin]
 *     description: 获取所有菜单列表（树形结构）(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getMenus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role || 'user';

    // 获取用户角色对应的 role_id
    const [roleResult] = await db.execute(
      "SELECT id FROM roles WHERE code = ?",
      [userRole]
    );

    const roleId = (roleResult as any[])[0]?.id;

    if (!roleId) {
      res.status(400).json({
        success: false,
        message: "用户角色不存在",
      });
      return;
    }

    // 获取该角色授权的菜单ID列表
    const [roleMenus] = await db.execute(
      "SELECT menu_id FROM role_menus WHERE role_id = ?",
      [roleId]
    );

    const authorizedMenuIds = (roleMenus as any[]).map((rm) => rm.menu_id);

    if (authorizedMenuIds.length === 0) {
      // 如果没有授权菜单，返回空数组
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    // 获取授权的菜单 (返回所有25个字段)
    const [menus] = await db.execute(
      `SELECT id, parent_id, menu_type, title, name, path, component, \`rank\`, redirect,
              icon, extra_icon, enter_transition, leave_transition, active_path,
              auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
              show_link, show_parent, status, created_at, updated_at
       FROM menus
       WHERE status = 1 AND id IN (${authorizedMenuIds.join(',')})
       ORDER BY \`rank\` ASC, id ASC`
    );

    const menuList = menus as any[];

    // 递归获取父级菜单(即使父菜单不在授权列表中，也要显示以保持树形结构)
    const parentIds = new Set<number>();
    menuList.forEach(menu => {
      if (menu.parent_id && menu.parent_id !== 0) {
        parentIds.add(menu.parent_id);
      }
    });

    // 获取父级菜单
    if (parentIds.size > 0) {
      const [parentMenus] = await db.execute(
        `SELECT id, parent_id, menu_type, title, name, path, component, \`rank\`, redirect,
                icon, extra_icon, enter_transition, leave_transition, active_path,
                auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
                show_link, show_parent, status, created_at, updated_at
         FROM menus
         WHERE status = 1 AND id IN (${Array.from(parentIds).join(',')})
         ORDER BY \`rank\` ASC, id ASC`
      );

      // 合并菜单列表，去重
      const allMenuIds = new Set(menuList.map(m => m.id));
      (parentMenus as any[]).forEach(pm => {
        if (!allMenuIds.has(pm.id)) {
          menuList.push(pm);
        }
      });
    }

    // 构建树形结构
    const buildTree = (parentId: number = 0): any[] => {
      return menuList
        .filter((menu) => menu.parent_id === parentId)
        .map((menu) => ({
          ...menu,
          children: buildTree(menu.id),
        }))
        .filter(menu => {
          // 过滤掉没有子节点且不在授权列表中的父菜单
          if (menu.children && menu.children.length > 0) {
            return true;
          }
          return authorizedMenuIds.includes(menu.id);
        });
    };

    const menuTree = buildTree(0);

    res.json({
      success: true,
      data: menuTree,
    });
  } catch (error) {
    console.error("获取菜单列表错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/get-async-routes:
 *   get:
 *     summary: 获取异步路由（动态路由）
 *     tags: [Route]
 *     description: 根据用户角色获取动态路由配置
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
export const getAsyncRoutes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role || 'user';

    // 获取用户角色对应的 role_id
    const [roleResult] = await db.execute(
      "SELECT id FROM roles WHERE code = ?",
      [userRole]
    );

    const roleId = (roleResult as any[])[0]?.id;

    if (!roleId) {
      res.status(400).json({
        success: false,
        message: "用户角色不存在",
      });
      return;
    }

    // 获取该角色授权的菜单ID列表
    const [roleMenus] = await db.execute(
      "SELECT menu_id FROM role_menus WHERE role_id = ?",
      [roleId]
    );

    const authorizedMenuIds = (roleMenus as any[]).map((rm) => rm.menu_id);

    if (authorizedMenuIds.length === 0) {
      // 如果没有授权菜单，返回空数组
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    // 获取授权的菜单（只获取menu_type=0的菜单，排除按钮）
    const [menus] = await db.execute(
      `SELECT id, parent_id, menu_type, title, name, path, component, \`rank\`, redirect,
              icon, extra_icon, enter_transition, leave_transition, active_path,
              auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
              show_link, show_parent, status
       FROM menus
       WHERE status = 1 AND menu_type = 0 AND id IN (${authorizedMenuIds.join(',')})
       ORDER BY \`rank\` ASC, id ASC`
    );

    const menuList = menus as any[];

    // 递归获取父级菜单
    const parentIds = new Set<number>();
    menuList.forEach(menu => {
      if (menu.parent_id && menu.parent_id !== 0) {
        parentIds.add(menu.parent_id);
      }
    });

    // 获取父级菜单
    if (parentIds.size > 0) {
      const [parentMenus] = await db.execute(
        `SELECT id, parent_id, menu_type, title, name, path, component, \`rank\`, redirect,
                icon, extra_icon, enter_transition, leave_transition, active_path,
                auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
                show_link, show_parent, status
         FROM menus
         WHERE status = 1 AND menu_type = 0 AND id IN (${Array.from(parentIds).join(',')})
         ORDER BY \`rank\` ASC, id ASC`
      );

      // 合并菜单列表，去重
      const allMenuIds = new Set(menuList.map(m => m.id));
      (parentMenus as any[]).forEach(pm => {
        if (!allMenuIds.has(pm.id)) {
          menuList.push(pm);
        }
      });
    }

    // 转换菜单为路由格式 (支持所有vue-pure-admin字段)
    const convertMenuToRoute = (menu: any) => {
      const route: any = {
        path: menu.path,
        name: menu.name || menu.title, // 优先使用name字段
        meta: {
          icon: menu.icon || 'ep:menu',
          title: menu.title,
          rank: menu.rank || 0,
          showLink: menu.show_link === 1,
          keepAlive: menu.keep_alive === 1
        }
      };

      // 如果有component，添加到路由配置中
      if (menu.component) {
        route.component = menu.component;
      }

      // 添加redirect
      if (menu.redirect) {
        route.redirect = menu.redirect;
      }

      // 添加其他meta字段
      if (menu.extra_icon) route.meta.extraIcon = menu.extra_icon;
      if (menu.enter_transition) route.meta.enterTransition = menu.enter_transition;
      if (menu.leave_transition) route.meta.leaveTransition = menu.leave_transition;
      if (menu.active_path) route.meta.activePath = menu.active_path;
      if (menu.auths) route.meta.auths = menu.auths;
      if (menu.frame_src) route.meta.frameSrc = menu.frame_src;
      if (menu.frame_loading !== undefined) route.meta.frameLoading = menu.frame_loading === 1;
      if (menu.hidden_tag) route.meta.hiddenTag = menu.hidden_tag === 1;
      if (menu.fixed_tag) route.meta.fixedTag = menu.fixed_tag === 1;
      if (menu.show_parent) route.meta.showParent = menu.show_parent === 1;

      return route;
    };

    // 构建路由树形结构
    const buildRouteTree = (parentId: number = 0): any[] => {
      return menuList
        .filter((menu) => menu.parent_id === parentId)
        .map((menu) => {
          const route = convertMenuToRoute(menu);
          const children = buildRouteTree(menu.id);

          if (children && children.length > 0) {
            route.children = children;
          }

          return route;
        })
        .filter(route => {
          // 过滤掉没有子节点且不在授权列表中的父菜单
          if (route.children && route.children.length > 0) {
            return true;
          }
          // 通过path找到原始菜单，检查是否在授权列表中
          const originalMenu = menuList.find(m => m.path === route.path);
          return originalMenu && authorizedMenuIds.includes(originalMenu.id);
        });
    };

    const routeTree = buildRouteTree(0);

    res.json({
      success: true,
      data: routeTree,
    });
  } catch (error) {
    console.error("获取异步路由错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles/{id}/menus:
 *   get:
 *     summary: 获取角色已授权的菜单ID列表
 *     tags: [Admin]
 *     description: 获取指定角色已授权的菜单ID列表(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getRoleMenus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleId = req.params.id;

    // 检查角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id FROM roles WHERE id = ?",
      [roleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "角色不存在",
      });
      return;
    }

    // 获取角色的菜单ID列表
    const [menuIds] = await db.execute(
      "SELECT menu_id FROM role_menus WHERE role_id = ?",
      [roleId]
    );

    const ids = (menuIds as any[]).map((item) => item.menu_id);

    res.json({
      success: true,
      data: {
        menuIds: ids,
      },
    });
  } catch (error) {
    console.error("获取角色菜单错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/roles/{id}/menus:
 *   put:
 *     summary: 更新角色菜单权限
 *     tags: [Admin]
 *     description: 保存角色的菜单权限(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuIds
 *             properties:
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 菜单ID数组
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateRoleMenus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleId = req.params.id;
    const { menuIds } = req.body;

    if (!Array.isArray(menuIds)) {
      res.status(400).json({
        success: false,
        message: "menuIds 必须是数组",
      });
      return;
    }

    // 不能修改内置角色的权限
    if (['1', '2', '3'].includes(roleId)) {
      res.status(403).json({
        success: false,
        message: "不能修改系统内置角色的权限",
      });
      return;
    }

    // 检查角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id FROM roles WHERE id = ?",
      [roleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "角色不存在",
      });
      return;
    }

    // 使用事务
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 删除旧的关联
      await connection.execute("DELETE FROM role_menus WHERE role_id = ?", [
        roleId,
      ]);

      // 插入新的关联
      if (menuIds.length > 0) {
        const values = menuIds.map((menuId) => `(${roleId}, ${menuId})`).join(", ");
        await connection.execute(
          `INSERT INTO role_menus (role_id, menu_id) VALUES ${values}`
        );
      }

      await connection.commit();

      res.json({
        success: true,
        message: "角色菜单权限更新成功",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("更新角色菜单错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/menus:
 *   post:
 *     summary: 创建菜单
 *     tags: [Admin]
 *     description: 创建新菜单(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - sort
 *               - status
 *             properties:
 *               parent_id:
 *                 type: integer
 *                 description: 上级菜单ID
 *               title:
 *                 type: string
 *                 description: 菜单名称
 *               type:
 *                 type: string
 *                 enum: [menu, button]
 *                 description: 菜单类型
 *               path:
 *                 type: string
 *                 description: 路径
 *               component:
 *                 type: string
 *                 description: 组件路径
 *               icon:
 *                 type: string
 *                 description: 图标
 *               permission:
 *                 type: string
 *                 description: 权限标识
 *               sort:
 *                 type: integer
 *                 description: 排序
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 状态
 *     responses:
 *       201:
 *         description: 创建成功
 */
export const createMenu = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      parent_id = 0,
      menu_type = 0,
      title,
      name,
      path,
      component,
      rank = 99,
      redirect,
      icon,
      extra_icon,
      enter_transition,
      leave_transition,
      active_path,
      auths,
      frame_src,
      frame_loading = 1,
      keep_alive = 0,
      hidden_tag = 0,
      fixed_tag = 0,
      show_link = 1,
      show_parent = 0,
      status = 1
    } = req.body;

    // 验证必填字段 (只有title是必填)
    if (!title) {
      res.status(400).json({
        success: false,
        message: "缺少必填字段: title",
      });
      return;
    }

    // 插入菜单 (支持所有25个字段)
    const [result] = await db.execute(
      `INSERT INTO menus (
        parent_id, menu_type, title, name, path, component, \`rank\`, redirect,
        icon, extra_icon, enter_transition, leave_transition, active_path,
        auths, frame_src, frame_loading, keep_alive, hidden_tag, fixed_tag,
        show_link, show_parent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id, menu_type, title, name || null, path || null, component || null,
        rank, redirect || null, icon || null, extra_icon || null,
        enter_transition || null, leave_transition || null, active_path || null,
        auths || null, frame_src || null, frame_loading, keep_alive, hidden_tag,
        fixed_tag, show_link, show_parent, status
      ]
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: "菜单创建成功",
      data: {
        id: insertId
      }
    });
  } catch (error) {
    console.error("创建菜单错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/menus/{id}:
 *   put:
 *     summary: 更新菜单
 *     tags: [Admin]
 *     description: 更新菜单信息(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parent_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [menu, button]
 *               path:
 *                 type: string
 *               component:
 *                 type: string
 *               icon:
 *                 type: string
 *               permission:
 *                 type: string
 *               sort:
 *                 type: integer
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateMenu = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const menuId = req.params.id;
    const {
      parent_id,
      menu_type,
      title,
      name,
      path,
      component,
      rank,
      redirect,
      icon,
      extra_icon,
      enter_transition,
      leave_transition,
      active_path,
      auths,
      frame_src,
      frame_loading,
      keep_alive,
      hidden_tag,
      fixed_tag,
      show_link,
      show_parent,
      status
    } = req.body;

    // 检查菜单是否存在
    const [menuCheck] = await db.execute(
      "SELECT id FROM menus WHERE id = ?",
      [menuId]
    );

    if ((menuCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "菜单不存在",
      });
      return;
    }

    // 构建更新语句 (支持所有25个字段)
    const updates: string[] = [];
    const values: any[] = [];

    if (parent_id !== undefined) {
      updates.push("parent_id = ?");
      values.push(parent_id);
    }
    if (menu_type !== undefined) {
      updates.push("menu_type = ?");
      values.push(menu_type);
    }
    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (path !== undefined) {
      updates.push("path = ?");
      values.push(path);
    }
    if (component !== undefined) {
      updates.push("component = ?");
      values.push(component);
    }
    if (rank !== undefined) {
      updates.push("`rank` = ?");
      values.push(rank);
    }
    if (redirect !== undefined) {
      updates.push("redirect = ?");
      values.push(redirect);
    }
    if (icon !== undefined) {
      updates.push("icon = ?");
      values.push(icon);
    }
    if (extra_icon !== undefined) {
      updates.push("extra_icon = ?");
      values.push(extra_icon);
    }
    if (enter_transition !== undefined) {
      updates.push("enter_transition = ?");
      values.push(enter_transition);
    }
    if (leave_transition !== undefined) {
      updates.push("leave_transition = ?");
      values.push(leave_transition);
    }
    if (active_path !== undefined) {
      updates.push("active_path = ?");
      values.push(active_path);
    }
    if (auths !== undefined) {
      updates.push("auths = ?");
      values.push(auths);
    }
    if (frame_src !== undefined) {
      updates.push("frame_src = ?");
      values.push(frame_src);
    }
    if (frame_loading !== undefined) {
      updates.push("frame_loading = ?");
      values.push(frame_loading);
    }
    if (keep_alive !== undefined) {
      updates.push("keep_alive = ?");
      values.push(keep_alive);
    }
    if (hidden_tag !== undefined) {
      updates.push("hidden_tag = ?");
      values.push(hidden_tag);
    }
    if (fixed_tag !== undefined) {
      updates.push("fixed_tag = ?");
      values.push(fixed_tag);
    }
    if (show_link !== undefined) {
      updates.push("show_link = ?");
      values.push(show_link);
    }
    if (show_parent !== undefined) {
      updates.push("show_parent = ?");
      values.push(show_parent);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: "没有需要更新的字段",
      });
      return;
    }

    values.push(menuId);

    await db.execute(
      `UPDATE menus SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: "菜单更新成功",
    });
  } catch (error) {
    console.error("更新菜单错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

/**
 * @swagger
 * /api/admin/menus/{id}:
 *   delete:
 *     summary: 删除菜单
 *     tags: [Admin]
 *     description: 删除菜单(需要超级管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteMenu = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const menuId = req.params.id;

    // 检查菜单是否存在
    const [menuCheck] = await db.execute(
      "SELECT id FROM menus WHERE id = ?",
      [menuId]
    );

    if ((menuCheck as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: "菜单不存在",
      });
      return;
    }

    // 检查是否有子菜单
    const [childrenCheck] = await db.execute(
      "SELECT id FROM menus WHERE parent_id = ?",
      [menuId]
    );

    if ((childrenCheck as any[]).length > 0) {
      res.status(400).json({
        success: false,
        message: "该菜单下有子菜单，无法删除",
      });
      return;
    }

    // 使用事务删除菜单和相关权限
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 删除角色菜单关联
      await connection.execute("DELETE FROM role_menus WHERE menu_id = ?", [
        menuId,
      ]);

      // 删除菜单
      await connection.execute("DELETE FROM menus WHERE id = ?", [menuId]);

      await connection.commit();

      res.json({
        success: true,
        message: "菜单删除成功",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("删除菜单错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

// ==================== 用户角色管理相关接口 ====================

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: 修改用户角色
 *     tags: [Admin]
 *     description: 修改用户的角色(管理员可以修改为普通用户或管理员，超级管理员可以修改为任何角色)
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
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: 角色ID (1:普通用户, 2:管理员, 3:超级管理员)
 *     responses:
 *       200:
 *         description: 修改成功
 */
export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;
    const currentUserRole = req.user?.role;

    if (!roleId) {
      res.status(400).json({
        success: false,
        message: "roleId 为必填项",
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

    // 检查目标角色是否存在
    const [roleCheck] = await db.execute(
      "SELECT id, code FROM roles WHERE id = ?",
      [roleId]
    );

    if ((roleCheck as any[]).length === 0) {
      res.status(400).json({
        success: false,
        message: "目标角色不存在",
      });
      return;
    }

    const targetRoleCode = (roleCheck as any[])[0].code;

    // 权限检查：只有超级管理员可以设置为超级管理员
    if (targetRoleCode === 'super_admin' && currentUserRole !== 'super_admin') {
      res.status(403).json({
        success: false,
        message: "只有超级管理员可以将用户设置为超级管理员",
      });
      return;
    }

    // 防止管理员修改自己的角色
    if (parseInt(userId) === req.user?.userId) {
      res.status(403).json({
        success: false,
        message: "不能修改自己的角色",
      });
      return;
    }

    // 更新用户角色
    await db.execute(
      "UPDATE users SET role_id = ? WHERE id = ?",
      [roleId, userId]
    );

    res.json({
      success: true,
      message: "用户角色修改成功",
    });
  } catch (error) {
    console.error("修改用户角色错误:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
};

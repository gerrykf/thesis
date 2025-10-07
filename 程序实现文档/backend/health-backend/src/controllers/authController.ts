import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
 *         nickname:
 *           type: string
 *           description: 昵称
 *         email:
 *           type: string
 *           description: 邮箱
 *         phone:
 *           type: string
 *           description: 手机号
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: 性别
 *         birth_date:
 *           type: string
 *           format: date
 *           description: 出生日期
 *         height:
 *           type: number
 *           description: 身高(cm)
 *         target_weight:
 *           type: number
 *           description: 目标体重(kg)
 *         avatar:
 *           type: string
 *           description: 头像URL
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: 用户角色
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         last_login_at:
 *           type: string
 *           format: date-time
 *           description: 最后登录时间
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - nickname
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: 用户名(3-50字符,只能包含字母、数字和下划线)
 *           example: testuser
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 50
 *           description: 密码(6-50字符)
 *           example: "123456"
 *         nickname:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: 昵称(1-50字符)
 *           example: 测试用户
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: test@example.com
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *           example: testuser
 *         password:
 *           type: string
 *           description: 密码
 *           example: "123456"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: 登录成功
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT访问令牌
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             user:
 *               $ref: '#/components/schemas/User'
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           description: 昵称
 *           example: 新昵称
 *         email:
 *           type: string
 *           format: email
 *           description: 邮箱
 *           example: newemail@example.com
 *         phone:
 *           type: string
 *           description: 手机号
 *           example: "13800138000"
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: 性别
 *           example: male
 *         birth_date:
 *           type: string
 *           format: date
 *           description: 出生日期
 *           example: "1990-01-01"
 *         height:
 *           type: number
 *           description: 身高(cm)
 *           example: 175
 *         target_weight:
 *           type: number
 *           description: 目标体重(kg)
 *           example: 70
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [Auth]
 *     description: 注册新用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: 注册成功
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
 *                   example: 注册成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 参数验证失败
 *       409:
 *         description: 用户名或邮箱已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 用户名或邮箱已存在
 *       500:
 *         description: 服务器内部错误
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
      return;
    }

    const { username, password, nickname, email } = req.body;

    // 检查用户名是否已存在
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if ((existingUsers as any[]).length > 0) {
      res.status(409).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
      return;
    }

    // 密码加密
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const [result] = await db.execute(
      'INSERT INTO users (username, password, nickname, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nickname ?? null, email ?? null]
    );

    const userId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { userId }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Auth]
 *     description: 用户登录获取访问令牌
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: 用户名或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 用户名或密码错误
 *       401:
 *         description: 账号已被禁用
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 账号已被禁用,请联系管理员
 *       500:
 *         description: 服务器内部错误
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
      return;
    }

    const { username, password } = req.body;

    // 查找用户
    const [rows] = await db.execute(
      'SELECT id, username, password, nickname, email, role, is_active FROM users WHERE username = ?',
      [username]
    );

    const users = rows as any[];
    if (users.length === 0) {
      res.status(400).json({
        success: false,
        message: '用户名或密码错误'
      });
      return;
    }

    const user = users[0];

    // 检查账号是否被禁用
    if (!user.is_active) {
      res.status(401).json({
        success: false,
        message: '账号已被禁用，请联系管理员'
      });
      return;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: '用户名或密码错误'
      });
      return;
    }

    // 更新最后登录时间
    await db.execute(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // 生成JWT令牌
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [Auth]
 *     description: 获取当前登录用户的详细信息
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权或令牌无效
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute(
      `SELECT id, username, nickname, email, phone, gender, birth_date,
       height, target_weight, avatar, role, created_at, last_login_at
       FROM users WHERE id = ?`,
      [req.user?.userId]
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
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: 更新用户信息
 *     tags: [Auth]
 *     description: 更新当前登录用户的个人信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
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
 *                   example: 个人信息更新成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权或令牌无效
 *       500:
 *         description: 服务器内部错误
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedFields = ['nickname', 'email', 'phone', 'gender', 'birth_date', 'height', 'target_weight'];
    const updates: string[] = [];
    const values: any[] = [];

    // 构建动态更新SQL
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);

        // 处理日期格式：将ISO 8601格式转换为MySQL DATE格式 (YYYY-MM-DD)
        if (field === 'birth_date' && req.body[field]) {
          const date = new Date(req.body[field]);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          values.push(`${year}-${month}-${day}`);
        } else {
          values.push(req.body[field]);
        }
      }
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: '没有需要更新的字段'
      });
      return;
    }

    values.push(req.user?.userId);

    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: '个人信息更新成功'
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

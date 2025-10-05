import { Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserGoal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 目标ID
 *         user_id:
 *           type: integer
 *           description: 用户ID
 *         goal_type:
 *           type: string
 *           enum: [weight, exercise, calories, custom]
 *           description: 目标类型
 *         goal_name:
 *           type: string
 *           description: 目标名称
 *         target_value:
 *           type: number
 *           description: 目标值
 *         current_value:
 *           type: number
 *           description: 当前值
 *         unit:
 *           type: string
 *           description: 单位
 *         start_date:
 *           type: string
 *           format: date
 *           description: 开始日期
 *         target_date:
 *           type: string
 *           format: date
 *           description: 目标日期
 *         status:
 *           type: string
 *           enum: [active, completed, paused, cancelled]
 *           description: 状态
 *         description:
 *           type: string
 *           description: 目标描述
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */

interface UserGoal extends RowDataPacket {
  id: number;
  user_id: number;
  goal_type: 'weight' | 'exercise' | 'calories' | 'custom';
  goal_name: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: Date;
  target_date: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  description: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: 获取用户所有目标
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取目标列表
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
 *                     $ref: '#/components/schemas/UserGoal'
 *       401:
 *         description: 未授权
 */
export const getUserGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用户未授权'
      });
      return;
    }

    const [rows] = await db.query<UserGoal[]>(
      `SELECT * FROM user_goals
       WHERE user_id = ?
       ORDER BY
         CASE status
           WHEN 'active' THEN 1
           WHEN 'paused' THEN 2
           WHEN 'completed' THEN 3
           WHEN 'cancelled' THEN 4
           ELSE 5
         END,
         created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取目标失败:', error);
    res.status(500).json({
      success: false,
      message: '获取目标失败'
    });
  }
};

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: 创建用户目标
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal_type
 *               - goal_name
 *               - target_value
 *               - start_date
 *             properties:
 *               goal_type:
 *                 type: string
 *                 enum: [weight, exercise, calories, custom]
 *               goal_name:
 *                 type: string
 *               target_value:
 *                 type: number
 *               current_value:
 *                 type: number
 *               unit:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               target_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功创建目标
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 */
export const createUserGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '请求参数错误',
        errors: errors.array()
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用户未授权'
      });
      return;
    }

    const {
      goal_type,
      goal_name,
      target_value,
      current_value = 0,
      unit,
      start_date,
      target_date,
      description
    } = req.body;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO user_goals (
        user_id, goal_type, goal_name, target_value, current_value,
        unit, start_date, target_date, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        userId,
        goal_type,
        goal_name,
        target_value,
        current_value,
        unit,
        start_date,
        target_date || null,
        description || null
      ]
    );

    res.status(201).json({
      success: true,
      message: '目标创建成功',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('创建目标失败:', error);
    res.status(500).json({
      success: false,
      message: '创建目标失败'
    });
  }
};

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: 更新用户目标
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 目标ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal_name:
 *                 type: string
 *               target_value:
 *                 type: number
 *               current_value:
 *                 type: number
 *               unit:
 *                 type: string
 *               target_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused, cancelled]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新目标
 *       400:
 *         description: 请求参数错误
 *       404:
 *         description: 未找到目标
 *       401:
 *         description: 未授权
 */
export const updateUserGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: '请求参数错误',
        errors: errors.array()
      });
      return;
    }

    const userId = req.user?.userId;
    const goalId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用户未授权'
      });
      return;
    }

    const {
      goal_name,
      target_value,
      current_value,
      unit,
      target_date,
      status,
      description
    } = req.body;

    // 构建更新字段
    const updates: string[] = [];
    const values: any[] = [];

    if (goal_name !== undefined) {
      updates.push('goal_name = ?');
      values.push(goal_name);
    }
    if (target_value !== undefined) {
      updates.push('target_value = ?');
      values.push(target_value);
    }
    if (current_value !== undefined) {
      updates.push('current_value = ?');
      values.push(current_value);
    }
    if (unit !== undefined) {
      updates.push('unit = ?');
      values.push(unit);
    }
    if (target_date !== undefined) {
      updates.push('target_date = ?');
      values.push(target_date);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: '没有需要更新的字段'
      });
      return;
    }

    values.push(goalId, userId);

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE user_goals SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: '未找到目标或无权限修改'
      });
      return;
    }

    res.json({
      success: true,
      message: '目标更新成功'
    });
  } catch (error) {
    console.error('更新目标失败:', error);
    res.status(500).json({
      success: false,
      message: '更新目标失败'
    });
  }
};

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: 删除用户目标
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 目标ID
 *     responses:
 *       200:
 *         description: 成功删除目标
 *       404:
 *         description: 未找到目标
 *       401:
 *         description: 未授权
 */
export const deleteUserGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const goalId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用户未授权'
      });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM user_goals WHERE id = ? AND user_id = ?',
      [goalId, userId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: '未找到目标或无权限删除'
      });
      return;
    }

    res.json({
      success: true,
      message: '目标删除成功'
    });
  } catch (error) {
    console.error('删除目标失败:', error);
    res.status(500).json({
      success: false,
      message: '删除目标失败'
    });
  }
};

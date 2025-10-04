import { Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     DietRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 记录ID
 *         user_id:
 *           type: integer
 *           description: 用户ID
 *         food_id:
 *           type: integer
 *           description: 食物ID
 *         record_date:
 *           type: string
 *           format: date
 *           description: 记录日期
 *         meal_type:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: 餐次类型
 *         quantity:
 *           type: number
 *           description: 食用量(g)
 *         calories:
 *           type: number
 *           description: 热量(kcal)
 *         protein:
 *           type: number
 *           description: 蛋白质(g)
 *         fat:
 *           type: number
 *           description: 脂肪(g)
 *         carbs:
 *           type: number
 *           description: 碳水化合物(g)
 *         notes:
 *           type: string
 *           description: 备注
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *     CreateDietRecordRequest:
 *       type: object
 *       required:
 *         - food_id
 *         - record_date
 *         - meal_type
 *         - quantity
 *       properties:
 *         food_id:
 *           type: integer
 *           description: 食物ID
 *           example: 1
 *         record_date:
 *           type: string
 *           format: date
 *           description: 记录日期
 *           example: "2025-10-05"
 *         meal_type:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: 餐次类型
 *           example: breakfast
 *         quantity:
 *           type: number
 *           description: 食用量(g)
 *           example: 150
 *         notes:
 *           type: string
 *           description: 备注
 *           example: 早餐
 */

/**
 * @swagger
 * /api/diet/records:
 *   post:
 *     summary: 创建饮食记录
 *     tags: [Diet]
 *     description: 创建新的饮食记录
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDietRecordRequest'
 *     responses:
 *       201:
 *         description: 记录创建成功
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
 *                   example: 饮食记录创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     recordId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 食物不存在
 *       500:
 *         description: 服务器内部错误
 */
export const createDietRecord = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { food_id, record_date, meal_type, quantity, notes } = req.body;
    const userId = req.user?.userId;

    // 获取食物营养信息
    const [foodRows] = await db.execute('SELECT * FROM foods WHERE id = ?', [food_id]);
    const foods = foodRows as any[];

    if (foods.length === 0) {
      res.status(404).json({
        success: false,
        message: '食物不存在'
      });
      return;
    }

    const food = foods[0];

    // 根据食用量计算营养成分
    const factor = quantity / 100;
    const calories = (food.calories_per_100g * factor).toFixed(2);
    const protein = (food.protein_per_100g * factor).toFixed(2);
    const fat = (food.fat_per_100g * factor).toFixed(2);
    const carbs = (food.carbs_per_100g * factor).toFixed(2);

    const [result] = await db.execute(
      `INSERT INTO diet_records
       (user_id, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, food_id, record_date, meal_type, quantity, calories, protein, fat, carbs, notes]
    );

    res.status(201).json({
      success: true,
      message: '饮食记录创建成功',
      data: {
        recordId: (result as any).insertId,
        nutrition: { calories, protein, fat, carbs }
      }
    });
  } catch (error) {
    console.error('创建饮食记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/diet/records:
 *   get:
 *     summary: 获取饮食记录列表
 *     tags: [Diet]
 *     description: 获取当前用户的饮食记录列表,支持分页和日期筛选
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
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: 指定日期
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期
 *       - in: query
 *         name: meal_type
 *         schema:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *         description: 餐次类型
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
 *                         $ref: '#/components/schemas/DietRecord'
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
 *       500:
 *         description: 服务器内部错误
 */
export const getDietRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const date = req.query.date as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;
    const mealType = req.query.meal_type as string;

    let query = `
      SELECT dr.*, f.name as food_name, f.category as food_category
      FROM diet_records dr
      LEFT JOIN foods f ON dr.food_id = f.id
      WHERE dr.user_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM diet_records WHERE user_id = ?';
    const params: any[] = [userId];
    const countParams: any[] = [userId];

    if (date) {
      query += ' AND dr.record_date = ?';
      countQuery += ' AND record_date = ?';
      params.push(date);
      countParams.push(date);
    } else {
      if (startDate) {
        query += ' AND dr.record_date >= ?';
        countQuery += ' AND record_date >= ?';
        params.push(startDate);
        countParams.push(startDate);
      }

      if (endDate) {
        query += ' AND dr.record_date <= ?';
        countQuery += ' AND record_date <= ?';
        params.push(endDate);
        countParams.push(endDate);
      }
    }

    if (mealType) {
      query += ' AND dr.meal_type = ?';
      countQuery += ' AND meal_type = ?';
      params.push(mealType);
      countParams.push(mealType);
    }

    query += ' ORDER BY dr.record_date DESC, dr.meal_type LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [records] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取饮食记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/diet/records/{id}:
 *   delete:
 *     summary: 删除饮食记录
 *     tags: [Diet]
 *     description: 删除指定的饮食记录
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 记录ID
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
 *                   example: 饮食记录删除成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 无权删除
 *       404:
 *         description: 记录不存在
 *       500:
 *         description: 服务器内部错误
 */
export const deleteDietRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const recordId = req.params.id;

    const [rows] = await db.execute(
      'SELECT id FROM diet_records WHERE id = ? AND user_id = ?',
      [recordId, userId]
    );

    if ((rows as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: '记录不存在或无权删除'
      });
      return;
    }

    await db.execute('DELETE FROM diet_records WHERE id = ? AND user_id = ?', [recordId, userId]);

    res.json({
      success: true,
      message: '饮食记录删除成功'
    });
  } catch (error) {
    console.error('删除饮食记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/diet/summary:
 *   get:
 *     summary: 获取饮食摘要
 *     tags: [Diet]
 *     description: 获取指定日期或日期范围的饮食营养摘要
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: 指定日期
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期
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
 *                     total_calories:
 *                       type: number
 *                       description: 总热量(kcal)
 *                     total_protein:
 *                       type: number
 *                       description: 总蛋白质(g)
 *                     total_fat:
 *                       type: number
 *                       description: 总脂肪(g)
 *                     total_carbs:
 *                       type: number
 *                       description: 总碳水化合物(g)
 *                     meal_breakdown:
 *                       type: object
 *                       description: 各餐次营养分布
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getDietSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const date = req.query.date as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;

    let query = `
      SELECT
        SUM(calories) as total_calories,
        SUM(protein) as total_protein,
        SUM(fat) as total_fat,
        SUM(carbs) as total_carbs
      FROM diet_records
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (date) {
      query += ' AND record_date = ?';
      params.push(date);
    } else {
      if (startDate) {
        query += ' AND record_date >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND record_date <= ?';
        params.push(endDate);
      }
    }

    const [summaryRows] = await db.execute(query, params);
    const summary = (summaryRows as any[])[0];

    // 获取各餐次分布
    let mealQuery = `
      SELECT
        meal_type,
        SUM(calories) as calories,
        SUM(protein) as protein,
        SUM(fat) as fat,
        SUM(carbs) as carbs
      FROM diet_records
      WHERE user_id = ?
    `;
    const mealParams: any[] = [userId];

    if (date) {
      mealQuery += ' AND record_date = ?';
      mealParams.push(date);
    } else {
      if (startDate) {
        mealQuery += ' AND record_date >= ?';
        mealParams.push(startDate);
      }
      if (endDate) {
        mealQuery += ' AND record_date <= ?';
        mealParams.push(endDate);
      }
    }

    mealQuery += ' GROUP BY meal_type';

    const [mealRows] = await db.execute(mealQuery, mealParams);

    // 转换为对象格式
    const mealBreakdown: any = {};
    (mealRows as any[]).forEach(row => {
      mealBreakdown[row.meal_type] = {
        calories: parseFloat(row.calories) || 0,
        protein: parseFloat(row.protein) || 0,
        fat: parseFloat(row.fat) || 0,
        carbs: parseFloat(row.carbs) || 0
      };
    });

    res.json({
      success: true,
      data: {
        total_calories: parseFloat(summary.total_calories) || 0,
        total_protein: parseFloat(summary.total_protein) || 0,
        total_fat: parseFloat(summary.total_fat) || 0,
        total_carbs: parseFloat(summary.total_carbs) || 0,
        meal_breakdown: mealBreakdown
      }
    });
  } catch (error) {
    console.error('获取饮食摘要错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

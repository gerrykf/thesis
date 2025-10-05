import { Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 食物ID
 *         name:
 *           type: string
 *           description: 食物名称
 *         name_en:
 *           type: string
 *           description: 英文名称
 *         category:
 *           type: string
 *           description: 食物分类
 *         brand:
 *           type: string
 *           description: 品牌
 *         calories_per_100g:
 *           type: number
 *           description: 每100g热量(kcal)
 *         protein_per_100g:
 *           type: number
 *           description: 每100g蛋白质(g)
 *         fat_per_100g:
 *           type: number
 *           description: 每100g脂肪(g)
 *         carbs_per_100g:
 *           type: number
 *           description: 每100g碳水化合物(g)
 *         fiber_per_100g:
 *           type: number
 *           description: 每100g纤维(g)
 *         sodium_per_100g:
 *           type: number
 *           description: 每100g钠(mg)
 *         sugar_per_100g:
 *           type: number
 *           description: 每100g糖(g)
 *         image_url:
 *           type: string
 *           description: 食物图片URL
 *         barcode:
 *           type: string
 *           description: 条形码
 *         is_active:
 *           type: boolean
 *           description: 是否启用
 *         created_by:
 *           type: integer
 *           description: 创建者ID
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *     CreateFoodRequest:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - calories_per_100g
 *       properties:
 *         name:
 *           type: string
 *           description: 食物名称
 *           example: 苹果
 *         name_en:
 *           type: string
 *           description: 英文名称
 *           example: Apple
 *         category:
 *           type: string
 *           description: 食物分类
 *           example: 水果
 *         brand:
 *           type: string
 *           description: 品牌
 *           example: ""
 *         calories_per_100g:
 *           type: number
 *           description: 每100g热量(kcal)
 *           example: 52
 *         protein_per_100g:
 *           type: number
 *           description: 每100g蛋白质(g)
 *           example: 0.3
 *         fat_per_100g:
 *           type: number
 *           description: 每100g脂肪(g)
 *           example: 0.2
 *         carbs_per_100g:
 *           type: number
 *           description: 每100g碳水化合物(g)
 *           example: 14
 *         fiber_per_100g:
 *           type: number
 *           description: 每100g纤维(g)
 *           example: 2.4
 *         sodium_per_100g:
 *           type: number
 *           description: 每100g钠(mg)
 *           example: 1
 *         sugar_per_100g:
 *           type: number
 *           description: 每100g糖(g)
 *           example: 10.4
 *         barcode:
 *           type: string
 *           description: 条形码
 *           example: ""
 */

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: 创建食物
 *     tags: [Food]
 *     description: 创建新的食物条目(需要管理员权限)
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
 *         description: 食物创建成功
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
 *                   example: 食物创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const createFood = async (req: AuthRequest, res: Response): Promise<void> => {
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
      barcode
    } = req.body;

    const createdBy = req.user?.userId;

    const [result] = await db.execute(
      `INSERT INTO foods
       (name, name_en, category, brand, calories_per_100g, protein_per_100g, fat_per_100g,
        carbs_per_100g, fiber_per_100g, sodium_per_100g, sugar_per_100g, barcode, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        name_en,
        category,
        brand,
        calories_per_100g,
        protein_per_100g || 0,
        fat_per_100g || 0,
        carbs_per_100g || 0,
        fiber_per_100g || 0,
        sodium_per_100g || 0,
        sugar_per_100g || 0,
        barcode,
        createdBy
      ]
    );

    res.status(201).json({
      success: true,
      message: '食物创建成功',
      data: { foodId: (result as any).insertId }
    });
  } catch (error) {
    console.error('创建食物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: 获取食物列表
 *     tags: [Food]
 *     description: 获取食物列表,支持分页、搜索和分类筛选
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
 *         description: 搜索关键词(食物名称)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 食物分类
 *       - in: query
 *         name: barcode
 *         schema:
 *           type: string
 *         description: 条形码查询
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
 *                     foods:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Food'
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
export const getFoods = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const barcode = req.query.barcode as string;

    let query = 'SELECT * FROM foods WHERE is_active = true';
    let countQuery = 'SELECT COUNT(*) as total FROM foods WHERE is_active = true';
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR name_en LIKE ?)';
      countQuery += ' AND (name LIKE ? OR name_en LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    if (barcode) {
      query += ' AND barcode = ?';
      countQuery += ' AND barcode = ?';
      params.push(barcode);
      countParams.push(barcode);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [foods] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      success: true,
      data: {
        foods,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取食物列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: 获取单个食物详情
 *     tags: [Food]
 *     description: 根据ID获取指定食物的详细信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 食物ID
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
 *                   $ref: '#/components/schemas/Food'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 食物不存在
 *       500:
 *         description: 服务器内部错误
 */
export const getFoodById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const foodId = req.params.id;

    const [rows] = await db.execute(
      'SELECT * FROM foods WHERE id = ? AND is_active = true',
      [foodId]
    );

    const foods = rows as any[];
    if (foods.length === 0) {
      res.status(404).json({
        success: false,
        message: '食物不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: foods[0]
    });
  } catch (error) {
    console.error('获取食物详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: 更新食物信息
 *     tags: [Food]
 *     description: 更新指定食物的信息(需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 食物ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFoodRequest'
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
 *                   example: 食物信息更新成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 食物不存在
 *       500:
 *         description: 服务器内部错误
 */
export const updateFood = async (req: AuthRequest, res: Response): Promise<void> => {
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
      barcode
    } = req.body;

    // 检查食物是否存在
    const [existing] = await db.execute('SELECT id FROM foods WHERE id = ?', [foodId]);
    if ((existing as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: '食物不存在'
      });
      return;
    }

    await db.execute(
      `UPDATE foods SET
       name = ?, name_en = ?, category = ?, brand = ?,
       calories_per_100g = ?, protein_per_100g = ?, fat_per_100g = ?,
       carbs_per_100g = ?, fiber_per_100g = ?, sodium_per_100g = ?,
       sugar_per_100g = ?, barcode = ?
       WHERE id = ?`,
      [
        name,
        name_en ?? null,
        category,
        brand ?? null,
        calories_per_100g,
        protein_per_100g ?? null,
        fat_per_100g ?? null,
        carbs_per_100g ?? null,
        fiber_per_100g ?? null,
        sodium_per_100g ?? null,
        sugar_per_100g ?? null,
        barcode ?? null,
        foodId
      ]
    );

    res.json({
      success: true,
      message: '食物信息更新成功'
    });
  } catch (error) {
    console.error('更新食物信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: 删除食物
 *     tags: [Food]
 *     description: 删除指定食物(软删除,需要管理员权限)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 食物ID
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
 *                   example: 食物删除成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 食物不存在
 *       500:
 *         description: 服务器内部错误
 */
export const deleteFood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const foodId = req.params.id;

    const [existing] = await db.execute('SELECT id FROM foods WHERE id = ?', [foodId]);
    if ((existing as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: '食物不存在'
      });
      return;
    }

    // 软删除
    await db.execute('UPDATE foods SET is_active = false WHERE id = ?', [foodId]);

    res.json({
      success: true,
      message: '食物删除成功'
    });
  } catch (error) {
    console.error('删除食物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/foods/categories:
 *   get:
 *     summary: 获取食物分类列表
 *     tags: [Food]
 *     description: 获取所有食物分类
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getFoodCategories = async (req: AuthRequest, res: Response): Promise<void> => {
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
      data: categories
    });
  } catch (error) {
    console.error('获取食物分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

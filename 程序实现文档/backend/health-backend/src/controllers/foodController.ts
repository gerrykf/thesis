import { Response } from "express";
import { validationResult } from "express-validator";
import { db } from "../config/database";
import { AuthRequest } from "../middleware/auth";

// 根据语言选择字段值
function getLocalizedField(
  zhValue: string,
  enValue: string | null,
  lang: string
): string {
  if (lang.startsWith("en")) {
    // 英文环境：优先返回英文，如果没有则返回中文
    return enValue || zhValue;
  }
  // 中文环境：直接返回中文
  return zhValue;
}

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
export const createFood = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "参数验证失败",
        errors: errors.array(),
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
      barcode,
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
 * /api/foods:
 *   get:
 *     summary: 获取食物列表
 *     tags: [Food]
 *     description: 获取食物列表，支持分页、搜索和分类筛选。支持多语言，通过请求头的 Accept-Language 指定语言（zh-CN 或 en-US）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [zh-CN, en-US]
 *           default: zh-CN
 *         description: 语言设置，支持 zh-CN（中文）或 en-US（英文）
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码（从1开始）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每页显示数量
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词（用于匹配食物名称）
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 食物类别筛选
 *       - in: query
 *         name: barcode
 *         schema:
 *           type: string
 *         description: 根据条形码筛选
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
export const getFoods = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const barcode = req.query.barcode as string;

    // 获取请求头中的语言设置
    const lang = (req.headers["accept-language"] as string) || "zh-CN";
    console.log("Accept-Language:", lang);
    const isEnglish = lang.startsWith("en");

    // 构建主查询语句
    let query = `SELECT
                id,
                name, name_en,
                category,
                brand,
                calories_per_100g, protein_per_100g, fat_per_100g,
                carbs_per_100g, fiber_per_100g, sodium_per_100g, sugar_per_100g,
                image_url, barcode, is_active,
                created_by, created_at, updated_at
              FROM foods
              WHERE is_active = true`;

    // 构建统计总数查询
    let countQuery =
      "SELECT COUNT(*) as total FROM foods WHERE is_active = true";

    const params: any[] = [];
    const countParams: any[] = [];

    // 添加搜索条件
    if (search) {
      query += " AND (name LIKE ? OR name_en LIKE ?)";
      countQuery += " AND (name LIKE ? OR name_en LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    if (category) {
      query += " AND (category = ? OR category_en = ?)";
      countQuery += " AND (category = ? OR category_en = ?)";
      params.push(category, category);
      countParams.push(category, category);
    }

    if (barcode) {
      query += " AND barcode = ?";
      countQuery += " AND barcode = ?";
      params.push(barcode);
      countParams.push(barcode);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // 执行查询
    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    console.log("Executed Query:", query);
    console.log("With Parameters:", params);
    console.log("rows:", rows);

    // 根据语言处理结果，把多语言字段填充到普通字段
    const foods = (rows as any[]).map((food: any) => {
      if (isEnglish) {
        // 用英文对应字段值填充，没有则用原中文字段值
        food.name = food.name_en || food.name;
        food.category = food.category_en || food.category;
        food.sub_category = food.sub_category_en || food.sub_category;
        food.description = food.description_en || food.description;
      }

      // 删除多余的英文字段
      delete food.name_en;
      delete food.category_en;
      delete food.sub_category_en;
      delete food.description_en;

      console.log("Processed Food Item:", food);

      // 返回预定义字段
      return {
        id: food.id,
        name: food.name,
        category: food.category,
        sub_category: food.sub_category,
        brand: food.brand,
        description: food.description,
        calories_per_100g: food.calories_per_100g,
        protein_per_100g: food.protein_per_100g,
        fat_per_100g: food.fat_per_100g,
        carbs_per_100g: food.carbs_per_100g,
        fiber_per_100g: food.fiber_per_100g,
        sodium_per_100g: food.sodium_per_100g,
        sugar_per_100g: food.sugar_per_100g,
        cholesterol_per_100g: food.cholesterol_per_100g,
        vitamin_c_per_100g: food.vitamin_c_per_100g,
        calcium_per_100g: food.calcium_per_100g,
        iron_per_100g: food.iron_per_100g,
        image_url: food.image_url,
        barcode: food.barcode,
        serving_size: food.serving_size,
        is_active: food.is_active,
        is_verified: food.is_verified,
        created_by: food.created_by,
        verified_by: food.verified_by,
        created_at: food.created_at,
        updated_at: food.updated_at,
      };
    });
    res.json({
      success: true,
      data: {
        foods,
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
export const getFoodById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const foodId = req.params.id;
    // 从请求头获取语言设置
    const lang = (req.headers["accept-language"] as string) || "zh-CN";

    // 根据语言决定使用哪个字段作为显示名称
    const nameField = lang.startsWith("en")
      ? "COALESCE(name_en, name)"
      : "name";
    const categoryField = lang.startsWith("en")
      ? "COALESCE(category_en, category)"
      : "category";
    const subCategoryField = lang.startsWith("en")
      ? "COALESCE(sub_category_en, sub_category)"
      : "sub_category";
    const descriptionField = lang.startsWith("en")
      ? "COALESCE(description_en, description)"
      : "description";

    const [rows] = await db.execute(
      `SELECT id,
       ${nameField} as name,
       ${categoryField} as category,
       ${subCategoryField} as sub_category,
       brand,
       ${descriptionField} as description,
       calories_per_100g, protein_per_100g, fat_per_100g,
       carbs_per_100g, fiber_per_100g, sodium_per_100g, sugar_per_100g,
       cholesterol_per_100g, vitamin_c_per_100g, calcium_per_100g, iron_per_100g,
       image_url, barcode, serving_size, is_active, is_verified,
       created_by, verified_by, created_at, updated_at
       FROM foods WHERE id = ? AND is_active = true`,
      [foodId]
    );

    const rawFoods = rows as any[];
    if (rawFoods.length === 0) {
      res.status(404).json({
        success: false,
        message: "食物不存在",
      });
      return;
    }

    // 确保只返回需要的字段,不包含 name_en, category_en 等原始字段
    const food = rawFoods[0];
    const result = {
      id: food.id,
      name: food.name,
      category: food.category,
      sub_category: food.sub_category,
      brand: food.brand,
      description: food.description,
      calories_per_100g: food.calories_per_100g,
      protein_per_100g: food.protein_per_100g,
      fat_per_100g: food.fat_per_100g,
      carbs_per_100g: food.carbs_per_100g,
      fiber_per_100g: food.fiber_per_100g,
      sodium_per_100g: food.sodium_per_100g,
      sugar_per_100g: food.sugar_per_100g,
      cholesterol_per_100g: food.cholesterol_per_100g,
      vitamin_c_per_100g: food.vitamin_c_per_100g,
      calcium_per_100g: food.calcium_per_100g,
      iron_per_100g: food.iron_per_100g,
      image_url: food.image_url,
      barcode: food.barcode,
      serving_size: food.serving_size,
      is_active: food.is_active,
      is_verified: food.is_verified,
      created_by: food.created_by,
      verified_by: food.verified_by,
      created_at: food.created_at,
      updated_at: food.updated_at,
    };

    res.json({
      success: true,
      data: result,
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
export const updateFood = async (
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
      barcode,
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
export const deleteFood = async (
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
export const getFoodCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // 从请求头获取语言设置
    const lang = (req.headers["accept-language"] as string) || "zh-CN";

    // 根据语言决定使用哪个字段
    const categoryField = lang.startsWith("en")
      ? "COALESCE(category_en, category)"
      : "category";

    const [categories] = await db.execute(
      `SELECT ${categoryField} as category, COUNT(*) as count
       FROM foods
       WHERE is_active = true
       GROUP BY category, category_en
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

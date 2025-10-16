import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * 获取目标用户ID（支持管理员查看其他用户数据）
 */
const getTargetUserId = (req: AuthRequest, res: Response): number | null => {
  const queryUserId = req.query.userId ? parseInt(req.query.userId as string) : null;
  const currentUserId = req.user?.userId;
  const userRole = req.user?.role;

  if (queryUserId) {
    // 只有管理员或超级管理员可以查看其他用户的数据
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      res.status(403).json({
        success: false,
        message: '权限不足，无法查看其他用户数据'
      });
      return null;
    }
    return queryUserId;
  }
  return currentUserId!;
};

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: 获取统计概览
 *     tags: [Stats]
 *     description: 获取用户健康数据的统计概览，管理员可以通过userId参数查看其他用户数据
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: 统计天数
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 用户ID（仅管理员可用）
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
 *                     health_records_count:
 *                       type: integer
 *                       description: 健康记录数
 *                     diet_records_count:
 *                       type: integer
 *                       description: 饮食记录数
 *                     avg_weight:
 *                       type: number
 *                       description: 平均体重
 *                     avg_exercise_duration:
 *                       type: number
 *                       description: 平均运动时长
 *                     avg_sleep_hours:
 *                       type: number
 *                       description: 平均睡眠时长
 *                     total_calories:
 *                       type: number
 *                       description: 总热量摄入
 *                     avg_daily_calories:
 *                       type: number
 *                       description: 平均每日热量
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       500:
 *         description: 服务器内部错误
 */
export const getStatsOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;

    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // 健康记录统计
    const [healthStats] = await db.execute(
      `SELECT
        COUNT(*) as count,
        AVG(weight) as avg_weight,
        AVG(exercise_duration) as avg_exercise_duration,
        AVG(sleep_hours) as avg_sleep_hours
      FROM health_records
      WHERE user_id = ? AND record_date >= ?`,
      [targetUserId, startDateStr]
    );

    // 饮食记录统计
    const [dietStats] = await db.execute(
      `SELECT
        COUNT(*) as count,
        SUM(calories) as total_calories
      FROM diet_records
      WHERE user_id = ? AND record_date >= ?`,
      [targetUserId, startDateStr]
    );

    const healthData = (healthStats as any[])[0];
    const dietData = (dietStats as any[])[0];

    res.json({
      success: true,
      data: {
        period_days: days,
        health_records_count: healthData.count || 0,
        diet_records_count: dietData.count || 0,
        avg_weight: parseFloat(healthData.avg_weight) || null,
        avg_exercise_duration: parseFloat(healthData.avg_exercise_duration) || null,
        avg_sleep_hours: parseFloat(healthData.avg_sleep_hours) || null,
        total_calories: parseFloat(dietData.total_calories) || 0,
        avg_daily_calories: dietData.count > 0 ? (parseFloat(dietData.total_calories) / days).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('获取统计概览错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/stats/weight-trend:
 *   get:
 *     summary: 获取体重趋势
 *     tags: [Stats]
 *     description: 获取用户体重变化趋势数据
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
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
 *                       record_date:
 *                         type: string
 *                         format: date
 *                       weight:
 *                         type: number
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getWeightTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;

    let startDateStr: string;
    let endDateStr: string;

    // 优先使用 startDate 和 endDate，否则使用 days
    if (req.query.startDate && req.query.endDate) {
      startDateStr = req.query.startDate as string;
      endDateStr = req.query.endDate as string;
    } else {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDateStr = startDate.toISOString().split('T')[0];
      endDateStr = new Date().toISOString().split('T')[0];
    }

    const [rows] = await db.execute(
      `SELECT record_date, weight
       FROM health_records
       WHERE user_id = ? AND record_date >= ? AND record_date <= ? AND weight IS NOT NULL
       ORDER BY record_date ASC`,
      [targetUserId, startDateStr, endDateStr]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取体重趋势错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/stats/calories-trend:
 *   get:
 *     summary: 获取热量摄入趋势
 *     tags: [Stats]
 *     description: 获取用户每日热量摄入趋势数据
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
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
 *                       record_date:
 *                         type: string
 *                         format: date
 *                       total_calories:
 *                         type: number
 *                       total_protein:
 *                         type: number
 *                       total_fat:
 *                         type: number
 *                       total_carbs:
 *                         type: number
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getCaloriesTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const [rows] = await db.execute(
      `SELECT
        record_date,
        SUM(calories) as total_calories,
        SUM(protein) as total_protein,
        SUM(fat) as total_fat,
        SUM(carbs) as total_carbs
       FROM diet_records
       WHERE user_id = ? AND record_date >= ?
       GROUP BY record_date
       ORDER BY record_date ASC`,
      [targetUserId, startDateStr]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取热量趋势错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/stats/exercise-trend:
 *   get:
 *     summary: 获取运动趋势
 *     tags: [Stats]
 *     description: 获取用户运动时长趋势数据
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
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
 *                       record_date:
 *                         type: string
 *                         format: date
 *                       exercise_duration:
 *                         type: integer
 *                       exercise_type:
 *                         type: string
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getExerciseTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;

    let startDateStr: string;
    let endDateStr: string;

    // 优先使用 startDate 和 endDate，否则使用 days
    if (req.query.startDate && req.query.endDate) {
      startDateStr = req.query.startDate as string;
      endDateStr = req.query.endDate as string;
    } else {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDateStr = startDate.toISOString().split('T')[0];
      endDateStr = new Date().toISOString().split('T')[0];
    }

    const [rows] = await db.execute(
      `SELECT record_date, exercise_duration, exercise_type
       FROM health_records
       WHERE user_id = ? AND record_date >= ? AND record_date <= ? AND exercise_duration IS NOT NULL
       ORDER BY record_date ASC`,
      [targetUserId, startDateStr, endDateStr]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取运动趋势错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/stats/sleep-quality:
 *   get:
 *     summary: 获取睡眠质量统计
 *     tags: [Stats]
 *     description: 获取用户睡眠质量分布统计
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 统计天数
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
 *                     sleep_trend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           record_date:
 *                             type: string
 *                             format: date
 *                           sleep_hours:
 *                             type: number
 *                           sleep_quality:
 *                             type: string
 *                     quality_distribution:
 *                       type: object
 *                       description: 睡眠质量分布
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getSleepQuality = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;

    let startDateStr: string;
    let endDateStr: string;

    // 优先使用 startDate 和 endDate，否则使用 days
    if (req.query.startDate && req.query.endDate) {
      startDateStr = req.query.startDate as string;
      endDateStr = req.query.endDate as string;
    } else {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDateStr = startDate.toISOString().split('T')[0];
      endDateStr = new Date().toISOString().split('T')[0];
    }

    // 获取睡眠趋势
    const [sleepTrend] = await db.execute(
      `SELECT record_date, sleep_hours, sleep_quality
       FROM health_records
       WHERE user_id = ? AND record_date >= ? AND record_date <= ? AND sleep_hours IS NOT NULL
       ORDER BY record_date ASC`,
      [targetUserId, startDateStr, endDateStr]
    );

    // 获取睡眠质量分布
    const [qualityDist] = await db.execute(
      `SELECT sleep_quality, COUNT(*) as count
       FROM health_records
       WHERE user_id = ? AND record_date >= ? AND record_date <= ? AND sleep_quality IS NOT NULL
       GROUP BY sleep_quality`,
      [targetUserId, startDateStr, endDateStr]
    );

    // 转换为对象格式
    const qualityDistribution: any = {};
    (qualityDist as any[]).forEach(row => {
      qualityDistribution[row.sleep_quality] = row.count;
    });

    res.json({
      success: true,
      data: {
        sleep_trend: sleepTrend,
        quality_distribution: qualityDistribution
      }
    });
  } catch (error) {
    console.error('获取睡眠质量统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/stats/nutrition-analysis:
 *   get:
 *     summary: 获取营养分析
 *     tags: [Stats]
 *     description: 获取用户营养摄入分析和三大营养素比例
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: 统计天数
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
 *                       description: 总热量
 *                     total_protein:
 *                       type: number
 *                       description: 总蛋白质(g)
 *                     total_fat:
 *                       type: number
 *                       description: 总脂肪(g)
 *                     total_carbs:
 *                       type: number
 *                       description: 总碳水化合物(g)
 *                     protein_percentage:
 *                       type: number
 *                       description: 蛋白质热量占比
 *                     fat_percentage:
 *                       type: number
 *                       description: 脂肪热量占比
 *                     carbs_percentage:
 *                       type: number
 *                       description: 碳水化合物热量占比
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器内部错误
 */
export const getNutritionAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req, res);
    if (targetUserId === null) return;

    let startDateStr: string;
    let endDateStr: string;
    let days: number;

    // 优先使用 startDate 和 endDate，否则使用 days
    if (req.query.startDate && req.query.endDate) {
      startDateStr = req.query.startDate as string;
      endDateStr = req.query.endDate as string;
      // 计算天数差
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } else {
      days = parseInt(req.query.days as string) || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDateStr = startDate.toISOString().split('T')[0];
      endDateStr = new Date().toISOString().split('T')[0];
    }

    const [rows] = await db.execute(
      `SELECT
        SUM(calories) as total_calories,
        SUM(protein) as total_protein,
        SUM(fat) as total_fat,
        SUM(carbs) as total_carbs
       FROM diet_records
       WHERE user_id = ? AND record_date >= ? AND record_date <= ?`,
      [targetUserId, startDateStr, endDateStr]
    );

    const data = (rows as any[])[0];
    const totalProtein = parseFloat(data.total_protein) || 0;
    const totalFat = parseFloat(data.total_fat) || 0;
    const totalCarbs = parseFloat(data.total_carbs) || 0;

    // 计算热量 (蛋白质和碳水: 4kcal/g, 脂肪: 9kcal/g)
    const proteinCalories = totalProtein * 4;
    const fatCalories = totalFat * 9;
    const carbsCalories = totalCarbs * 4;
    const totalCaloriesFromMacros = proteinCalories + fatCalories + carbsCalories;

    res.json({
      success: true,
      data: {
        period_days: days,
        total_calories: parseFloat(data.total_calories) || 0,
        total_protein: totalProtein,
        total_fat: totalFat,
        total_carbs: totalCarbs,
        protein_percentage: totalCaloriesFromMacros > 0 ? ((proteinCalories / totalCaloriesFromMacros) * 100).toFixed(1) : 0,
        fat_percentage: totalCaloriesFromMacros > 0 ? ((fatCalories / totalCaloriesFromMacros) * 100).toFixed(1) : 0,
        carbs_percentage: totalCaloriesFromMacros > 0 ? ((carbsCalories / totalCaloriesFromMacros) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('获取营养分析错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

import { Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 记录ID
 *         user_id:
 *           type: integer
 *           description: 用户ID
 *         record_date:
 *           type: string
 *           format: date
 *           description: 记录日期
 *         weight:
 *           type: number
 *           description: 体重(kg)
 *         exercise_duration:
 *           type: integer
 *           description: 运动时长(分钟)
 *         exercise_type:
 *           type: string
 *           description: 运动类型
 *         sleep_hours:
 *           type: number
 *           description: 睡眠时长(小时)
 *         sleep_quality:
 *           type: string
 *           enum: [excellent, good, fair, poor]
 *           description: 睡眠质量
 *         mood:
 *           type: string
 *           enum: [excellent, good, fair, poor]
 *           description: 心情状态
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
 *     CreateHealthRecordRequest:
 *       type: object
 *       required:
 *         - record_date
 *       properties:
 *         record_date:
 *           type: string
 *           format: date
 *           description: 记录日期
 *           example: "2025-10-05"
 *         weight:
 *           type: number
 *           description: 体重(kg)
 *           example: 65.5
 *         exercise_duration:
 *           type: integer
 *           description: 运动时长(分钟)
 *           example: 30
 *         exercise_type:
 *           type: string
 *           description: 运动类型
 *           example: 跑步
 *         sleep_hours:
 *           type: number
 *           description: 睡眠时长(小时)
 *           example: 7.5
 *         sleep_quality:
 *           type: string
 *           enum: [excellent, good, fair, poor]
 *           description: 睡眠质量
 *           example: good
 *         mood:
 *           type: string
 *           enum: [excellent, good, fair, poor]
 *           description: 心情状态
 *           example: excellent
 *         notes:
 *           type: string
 *           description: 备注
 *           example: 今天状态不错
 */

/**
 * @swagger
 * /api/health/records:
 *   post:
 *     summary: 创建健康记录
 *     tags: [Health]
 *     description: 创建或更新指定日期的健康记录
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHealthRecordRequest'
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
 *                   example: 健康记录创建成功
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
 *       500:
 *         description: 服务器内部错误
 */
export const createHealthRecord = async (req: AuthRequest, res: Response): Promise<void> => {
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
      record_date,
      weight,
      exercise_duration,
      exercise_type,
      sleep_hours,
      sleep_quality,
      mood,
      notes
    } = req.body;

    const userId = req.user?.userId;

    // 将前端传来的时间（ISO 8601格式，包含用户时区）转换为 UTC 时间存储
    // 例如：用户在柬埔寨 2025-12-27T11:46:12+07:00 -> UTC 2025-12-27T04:46:12.000Z
    const userDateTime = new Date(record_date);

    // 转换为 MySQL DATETIME 格式 (YYYY-MM-DD HH:MM:SS)
    // toISOString() 返回 UTC 时间，然后去掉 'T' 和 'Z'，保留到秒
    const isoString = userDateTime.toISOString(); // "2025-12-27T04:46:12.000Z"
    const mysqlDateTime = isoString.replace('T', ' ').replace(/\.\d{3}Z$/, ''); // "2025-12-27 04:46:12"

    // 检查该时间点是否已有记录（精确到秒）
    const [existing] = await db.execute(
      'SELECT id FROM health_records WHERE user_id = ? AND record_date = ?',
      [userId, mysqlDateTime]
    );

    let recordId: number;
    let isNew = false;

    if ((existing as any[]).length > 0) {
      // 更新现有记录
      recordId = (existing as any[])[0].id;
      await db.execute(
        `UPDATE health_records SET
         weight = ?, exercise_duration = ?, exercise_type = ?,
         sleep_hours = ?, sleep_quality = ?, mood = ?, notes = ?, record_date = ?
         WHERE user_id = ? AND id = ?`,
        [
          weight,
          exercise_duration ?? null,
          exercise_type ?? null,
          sleep_hours ?? null,
          sleep_quality ?? null,
          mood ?? null,
          notes ?? null,
          mysqlDateTime,
          userId,
          recordId
        ]
      );
    } else {
      // 创建新记录
      const [result] = await db.execute(
        `INSERT INTO health_records
         (user_id, record_date, weight, exercise_duration, exercise_type, sleep_hours, sleep_quality, mood, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          mysqlDateTime,
          weight,
          exercise_duration ?? null,
          exercise_type ?? null,
          sleep_hours ?? null,
          sleep_quality ?? null,
          mood ?? null,
          notes ?? null
        ]
      );
      recordId = (result as any).insertId;
      isNew = true;
    }

    // 查询并返回完整的记录数据
    const [recordRows] = await db.execute(
      'SELECT * FROM health_records WHERE id = ?',
      [recordId]
    );
    const record = (recordRows as any[])[0];

    // 返回完整的时间戳（ISO 8601格式），前端会根据用户时区转换
    const formattedRecord = {
      ...record,
      record_date: record.record_date instanceof Date
        ? record.record_date.toISOString()
        : new Date(record.record_date).toISOString()
    };

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? '健康记录创建成功' : '健康记录更新成功',
      data: formattedRecord
    });
  } catch (error) {
    console.error('创建健康记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/health/records:
 *   get:
 *     summary: 获取健康记录列表
 *     tags: [Health]
 *     description: 获取当前用户的健康记录列表,支持分页和日期筛选
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
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HealthRecord'
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
export const getHealthRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: '未授权'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;

    let query = 'SELECT * FROM health_records WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM health_records WHERE user_id = ?';
    const params: (number | string)[] = [userId];
    const countParams: (number | string)[] = [userId];

    if (startDate) {
      // 如果是纯日期格式（YYYY-MM-DD），转换为当天的开始时间 00:00:00
      const startDateTime = startDate.includes('T') ? startDate : `${startDate} 00:00:00`;
      query += ' AND record_date >= ?';
      countQuery += ' AND record_date >= ?';
      params.push(startDateTime);
      countParams.push(startDateTime);
    }

    if (endDate) {
      // 如果是纯日期格式（YYYY-MM-DD），转换为当天的结束时间 23:59:59
      const endDateTime = endDate.includes('T') ? endDate : `${endDate} 23:59:59`;
      query += ' AND record_date <= ?';
      countQuery += ' AND record_date <= ?';
      params.push(endDateTime);
      countParams.push(endDateTime);
    }

    query += ` ORDER BY record_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const [records] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    // 返回完整的时间戳（ISO 8601格式），前端会根据用户时区转换
    const formattedRecords = (records as any[]).map(record => ({
      ...record,
      record_date: record.record_date instanceof Date
        ? record.record_date.toISOString()
        : new Date(record.record_date).toISOString()
    }));

    res.json({
      success: true,
      data: {
        records: formattedRecords,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取健康记录错误:', error);
    console.error('错误详情:', JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * @swagger
 * /api/health/records/{id}:
 *   get:
 *     summary: 获取单条健康记录
 *     tags: [Health]
 *     description: 根据ID获取指定健康记录详情
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
 *                   $ref: '#/components/schemas/HealthRecord'
 *       401:
 *         description: 未授权
 *       403:
 *         description: 无权访问
 *       404:
 *         description: 记录不存在
 *       500:
 *         description: 服务器内部错误
 */
export const getHealthRecordById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const recordId = req.params.id;

    const [rows] = await db.execute(
      'SELECT * FROM health_records WHERE id = ? AND user_id = ?',
      [recordId, userId]
    );

    const records = rows as any[];
    if (records.length === 0) {
      res.status(404).json({
        success: false,
        message: '记录不存在或无权访问'
      });
      return;
    }

    // 返回完整的时间戳（ISO 8601格式），前端会根据用户时区转换
    const record = records[0];
    const formattedRecord = {
      ...record,
      record_date: record.record_date instanceof Date
        ? record.record_date.toISOString()
        : new Date(record.record_date).toISOString()
    };

    res.json({
      success: true,
      data: formattedRecord
    });
  } catch (error) {
    console.error('获取健康记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * @swagger
 * /api/health/records/{id}:
 *   delete:
 *     summary: 删除健康记录
 *     tags: [Health]
 *     description: 删除指定的健康记录
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
 *                   example: 健康记录删除成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 无权删除
 *       404:
 *         description: 记录不存在
 *       500:
 *         description: 服务器内部错误
 */
export const deleteHealthRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const recordId = req.params.id;

    // 先检查记录是否存在且属于当前用户
    const [rows] = await db.execute(
      'SELECT id FROM health_records WHERE id = ? AND user_id = ?',
      [recordId, userId]
    );

    if ((rows as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: '记录不存在或无权删除'
      });
      return;
    }

    await db.execute('DELETE FROM health_records WHERE id = ? AND user_id = ?', [recordId, userId]);

    res.json({
      success: true,
      message: '健康记录删除成功'
    });
  } catch (error) {
    console.error('删除健康记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

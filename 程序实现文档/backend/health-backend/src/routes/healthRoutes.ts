import { Router, type Router as RouterType } from 'express';
import { body } from 'express-validator';
import {
  createHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  deleteHealthRecord
} from '../controllers/healthController';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 创建健康记录验证规则
const createHealthRecordValidation = [
  body('record_date')
    .isDate()
    .withMessage('记录日期格式不正确'),
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 500 })
    .withMessage('体重必须在0-500之间'),
  body('exercise_duration')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('运动时长必须在0-1440分钟之间'),
  body('sleep_hours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('睡眠时长必须在0-24小时之间'),
  body('sleep_quality')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('睡眠质量值无效'),
  body('mood')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('心情状态值无效')
];

// 路由定义
router.post('/records', createHealthRecordValidation, createHealthRecord);
router.get('/records', getHealthRecords);
router.get('/records/:id', getHealthRecordById);
router.delete('/records/:id', deleteHealthRecord);

export default router;

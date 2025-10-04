import { Router, type Router as RouterType } from 'express';
import { body } from 'express-validator';
import {
  createDietRecord,
  getDietRecords,
  deleteDietRecord,
  getDietSummary
} from '../controllers/dietController';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 创建饮食记录验证规则
const createDietRecordValidation = [
  body('food_id')
    .notEmpty()
    .withMessage('食物ID不能为空')
    .isInt()
    .withMessage('食物ID必须是整数'),
  body('record_date')
    .isDate()
    .withMessage('记录日期格式不正确'),
  body('meal_type')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('餐次类型无效'),
  body('quantity')
    .notEmpty()
    .withMessage('食用量不能为空')
    .isFloat({ min: 0 })
    .withMessage('食用量必须大于0')
];

// 路由定义
router.post('/records', createDietRecordValidation, createDietRecord);
router.get('/records', getDietRecords);
router.delete('/records/:id', deleteDietRecord);
router.get('/summary', getDietSummary);

export default router;

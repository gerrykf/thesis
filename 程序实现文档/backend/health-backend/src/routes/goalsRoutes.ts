import { Router, type Router as RouterType } from 'express';
import { body } from 'express-validator';
import {
  getUserGoals,
  createUserGoal,
  updateUserGoal,
  deleteUserGoal
} from '../controllers/goalsController';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 创建目标验证规则
const createGoalValidation = [
  body('goal_type')
    .isIn(['weight', 'exercise', 'calories', 'custom'])
    .withMessage('目标类型必须为weight、exercise、calories或custom'),
  body('goal_name')
    .isLength({ min: 1, max: 100 })
    .withMessage('目标名称长度必须在1-100字符之间'),
  body('target_value')
    .isFloat({ min: 0 })
    .withMessage('目标值必须大于等于0'),
  body('current_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('当前值必须大于等于0'),
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('单位长度不能超过20字符'),
  body('start_date')
    .isISO8601()
    .withMessage('开始日期格式不正确'),
  body('target_date')
    .optional()
    .isISO8601()
    .withMessage('目标日期格式不正确')
];

// 更新目标验证规则
const updateGoalValidation = [
  body('goal_name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('目标名称长度必须在1-100字符之间'),
  body('target_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('目标值必须大于等于0'),
  body('current_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('当前值必须大于等于0'),
  body('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('单位长度不能超过20字符'),
  body('target_date')
    .optional()
    .isISO8601()
    .withMessage('目标日期格式不正确'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('状态必须为active、completed、paused或cancelled')
];

// 路由定义
router.get('/', getUserGoals);
router.post('/', createGoalValidation, createUserGoal);
router.put('/:id', updateGoalValidation, updateUserGoal);
router.delete('/:id', deleteUserGoal);

export default router;

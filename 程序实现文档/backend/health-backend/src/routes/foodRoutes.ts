import { Router, type Router as RouterType } from 'express';
import { body } from 'express-validator';
import {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodCategories
} from '../controllers/foodController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 创建/更新食物验证规则
const foodValidation = [
  body('name')
    .notEmpty()
    .withMessage('食物名称不能为空')
    .isLength({ max: 100 })
    .withMessage('食物名称不能超过100字符'),
  body('category')
    .notEmpty()
    .withMessage('食物分类不能为空'),
  body('calories_per_100g')
    .notEmpty()
    .withMessage('热量不能为空')
    .isFloat({ min: 0 })
    .withMessage('热量必须大于等于0'),
  body('protein_per_100g')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('蛋白质必须大于等于0'),
  body('fat_per_100g')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('脂肪必须大于等于0'),
  body('carbs_per_100g')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('碳水化合物必须大于等于0')
];

// 路由定义
router.post('/', requireAdmin, foodValidation, createFood);
router.get('/', getFoods);
router.get('/categories', getFoodCategories);
router.get('/:id', getFoodById);
router.put('/:id', requireAdmin, foodValidation, updateFood);
router.delete('/:id', requireAdmin, deleteFood);

export default router;

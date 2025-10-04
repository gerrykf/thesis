import { Router, type Router as RouterType } from 'express';
import {
  getStatsOverview,
  getWeightTrend,
  getCaloriesTrend,
  getExerciseTrend,
  getSleepQuality,
  getNutritionAnalysis
} from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 路由定义
router.get('/overview', getStatsOverview);
router.get('/weight-trend', getWeightTrend);
router.get('/calories-trend', getCaloriesTrend);
router.get('/exercise-trend', getExerciseTrend);
router.get('/sleep-quality', getSleepQuality);
router.get('/nutrition-analysis', getNutritionAnalysis);

export default router;

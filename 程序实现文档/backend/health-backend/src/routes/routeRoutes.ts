import { Router, type Router as RouterType } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAsyncRoutes } from '../controllers/adminController';

const router: RouterType = Router();

// 所有路由都需要认证
router.use(authenticateToken);

/**
 * GET /api/get-async-routes
 * 获取异步路由（动态路由）
 * 根据用户角色返回该用户有权限的路由配置
 */
router.get('/get-async-routes', getAsyncRoutes);

export default router;
